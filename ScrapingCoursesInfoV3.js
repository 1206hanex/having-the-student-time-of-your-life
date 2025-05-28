//lets try again
const puppeteer = require('puppeteer');
const fs = require('fs');


(async () => {
	const browser = await puppeteer.launch({ headless: true});
	const pages = new Map();

	const mysql = require('mysql2/promise');

	// Connect to the db
	const db = mysql.createPool({host: 'localhost',user: 'root',password: '',database: 'student_tools'});

	const uid = 1; // this needs to get info from the interface? idk, jacob needs to send me what user it is

	//Get pids for the user
	const [pids] = await db.query('SELECT pid FROM user_papers WHERE uid = ?', [uid]);
	const pidList = pids.map(row => row.pid);

	if (pidList.length === 0) {
		console.error('No papers found for this user.');
		process.exit(1);
	}

	//Get paper codes
	const placeholders = pidList.map(() => '?').join(',');
	const [codePairs] = await db.query(`SELECT pid, paper_code FROM papers WHERE pid IN (${placeholders})`, pidList);

	if (codePairs.length === 0) {
		console.error('No course codes to scrape.');
		process.exit(1);
	}

	//const coursesCodes = ['COMPX241-25A%20(HAM)','ENGEN370-25A%20(HAM)']; //this is were the grabing from the db will be
	//remember to format the code so its not 'COMPX241-25A (HAM)', is 'COMPX241-25A%20(HAM)' 

	//load the pages
	for (const { pid, paper_code } of codePairs) {
  		const currCode = encodeURIComponent(paper_code);
		const page = await browser.newPage();
		const url = `https://paperoutlines.waikato.ac.nz/outline/${currCode}`;
		try{
			await page.goto(url, {waitUntil: 'domcontentloaded'});
			console.log(`Opened ${currCode}`);
			pages.set(currCode, { page, pid });
			await new Promise(r => setTimeout(r, 100));
		}
		catch (err){
			console.warn(`Failed to open ${currCode}`, err.message);
		}	
	}

	for (const [currCode, { page, pid }] of pages.entries()) {
		try {
			//check page is loaded
			await page.bringToFront();
			await page.waitForFunction(() =>
				document.body.innerText.includes('Timetable'), { timeout: 60000 }
			);
			console.log(`Page ${currCode} loaded successfully.`);
			
			// scrape the actual timetable table data
			const timetableData = await page.evaluate(() => {
				const allLabels = document.querySelectorAll('label.col-md-2');
				let table = null;
				for (let label of allLabels) {
					if (label.innerText.trim() === 'Timetable') {
						const rowDiv = label.closest('.row');
						if (!rowDiv) break;
						const span = rowDiv.querySelector('span.col-md-10');
						if (!span) break;
						table = span.querySelector('table');
						break;
					}
				}
				if (!table) return [];
				const rows = Array.from(table.querySelectorAll('tr'));
				const data = [];
				for (let i = 1; i < rows.length; i++) { // skip header row
					const cells = rows[i].querySelectorAll('td');
					data.push({
						event: cells[0]?.innerText.trim(),
						day: cells[1]?.innerText.trim(),
						startTime: cells[2]?.innerText.trim(),
						endTime: cells[3]?.innerText.trim(),
						location: cells[4]?.innerText.trim()
					});
				}
				return data;
			});
			console.log(`Timetable of ${currCode} extracted`);
			
			// scrape the actual grade table data
			const assessmentData = await page.evaluate(() => {
				const allLabels = document.querySelectorAll('label.col-md-2');
				let table = null;
				for (let label of allLabels) {
					if (label.innerText.trim() === 'Assessment') {
						const rowDiv = label.closest('.row');
						if (!rowDiv) break;
						const span = rowDiv.querySelector('span.col-md-10');
						if (!span) break;
						table = span.querySelector('table');
						break;
					}
				}
				if (!table) return [];
				const rows = Array.from(table.querySelectorAll('tbody tr'));
				const data = [];
				for (let row of rows) {
					const classList = row.classList;
					//skip any headings (may need to be added onto if there are additioal/different formating)
					if (classList.contains('assessmentCategory') || classList.contains('assessmentBestOf') || classList.contains('assessmentTotal')) continue;
					const cells = row.querySelectorAll('td');
					if (cells.length === 0) continue; // skip empty rows just in case

					//actully getting to the data
					const entry = {};
					if (cells[0]) entry.assessment = cells[0].innerText.trim();
					if (cells[1]) entry.dueDate = cells[1].innerText.trim();
					if (cells[2]) entry.percentage = cells[2].innerText.trim();
					data.push(entry);
				}
				return data;
			});
			console.log(`Assessment table of ${currCode} extracted`);
			
			//getting the course name
			const paperCode = await page.evaluate(() => {
				const labels = document.querySelectorAll('label.col-md-2');
				for (let label of labels) {
					if (label.innerText.trim() === 'Paper Occurrence Code') {
						const rowDiv = label.closest('.row');
						if (!rowDiv) break;
						const span = rowDiv.querySelector('span.col-md-10');
						if (!span) break;
						return span.innerText.trim();
					}
				}
				return 'UnknownPaper';
			});
			
			//save timetable to JSON file X TO THE DB NOW
			//fs.writeFileSync(fileNameTime, JSON.stringify(timetableData, null, 2));
			for (const item of timetableData) {
				await db.query(`INSERT INTO user_timetable (uid, pid, name, day, start_time, end_time, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,[uid, pid, item.event, item.day, item.startTime, item.endTime, item.location, 1]);
			}			
			console.log('Saved timetable to database');
			
			//save grade to JSON file
			//fs.writeFileSync(fileNameGrade, JSON.stringify(assessmentData, null, 2));
			for (const task of assessmentData) {
				const percentageValue = parseFloat(task.percentage.replace('%', '')) || 0;
				await db.query(`INSERT INTO user_assignments (uid, pid, name, weight, grade) VALUES (?, ?, ?, ?, ?)`,[uid, pid, task.assessment, percentageValue, 0]);
			}
			console.log('Saved assessments at database');
			
		} catch (error) {
			console.error('Failed to load the page:', error);
		}
	}
	await browser.close();
	await db.end();
})();
//aaint this fun
//its actully fun lol, i like the progress of figuring stuff out
