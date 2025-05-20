//lets try again
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch({ headless: true});
	const page = await browser.newPage();

	try {
		//load the page
		const usersPaperCode = 'COMPX241-25A%20(HAM)'; //change this to getting this info from the serevr (plus formating)
		const url = `https://paperoutlines.waikato.ac.nz/outline/${usersPaperCode}`;
		await page.goto(url, {waitUntil: 'domcontentloaded'});
		await page.waitForFunction(() =>
			document.body.innerText.includes('Timetable')
		);
		console.log('Page loaded successfully.');
		
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
		console.log('Timetable extracted');
		
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
		console.log('Assessment table extracted');
		
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
		
		//file naming
		const cleanedPaperCode = paperCode
			.replace(/\s+/g, '-')// replace spaces with dashes
			.replace(/[\\/:*?"<>|]/g, '');// remove other invalid characters just in case
		//get the date and time
		const now = new Date();
		const day = String(now.getDate()).padStart(2, '0');
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const year = String(now.getFullYear()).slice(2);
		const nowDate = `${day}-${month}-${year}`;
		const nowTime = now.toTimeString().slice(0, 5).replace(/:/g, '-');
		const timestamp = `${nowDate}_${nowTime}`;
		const fileNameTime = `Timetable_${cleanedPaperCode}_${timestamp}.json`;
		const fileNameGrade = `Assessments_${cleanedPaperCode}_${timestamp}.json`;
		
		//save timetable to JSON file
		fs.writeFileSync(fileNameTime, JSON.stringify(timetableData, null, 2));
		console.log(`Saved full timetable data as ${fileNameTime}`);
		
		//save grade to JSON file
		fs.writeFileSync(fileNameGrade, JSON.stringify(assessmentData, null, 2));
		console.log(`Saved full assessment data as ${fileNameGrade}`);
		
	} catch (error) {
		console.error('Failed to load the page:', error);
	}
  await browser.close();
})();
//aaint this fun
//its actully fun lol, i like the progress of figuring stuff out
