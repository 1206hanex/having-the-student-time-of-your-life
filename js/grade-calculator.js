document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/grades/papers", {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("widget-container");

      data.forEach(paper => {
        const widget = document.createElement("div");
        widget.className = "widget";
        widget.onclick = () => openExpandedView(paper.paper_code, paper.pid);

        widget.innerHTML = `
          <h3>${paper.paper_code}</h3>
          <p>Click for details</p>
        `;

        container.appendChild(widget);
      });
    })
    .catch(err => {
      console.error("Failed to load papers:", err);
    });
});

function openExpandedView(code, pid) {
  //show modal
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("expanded-title").textContent = code;

  //clear previous assignment table if any
  const view = document.getElementById("expanded-view");
  const existingTable = view.querySelector(".calculator-table");
  if (existingTable) existingTable.remove();

  //fetch assignment data
  fetch(`http://localhost:3000/api/grades/assignments/${pid}`, {
    credentials: "include"
  })
    .then(res => res.json())
    .then(assignments => {
      const table = document.createElement("div");
      table.className = "calculator-table";

      if (assignments.length === 0) {
        table.innerHTML = `<div class="calc-row"><div>No assignments available.</div></div>`;
      } else {
        //header
        const header = document.createElement("div");
        header.className = "calc-row calc-header";
        header.innerHTML = `<div>Assessment</div><div>Weight (%)</div><div>Mark (%)</div><div>Letter Grade</div>`;
        table.appendChild(header);

        //assignment rows
        assignments.forEach(a => {
          const row = document.createElement("div");
          row.className = "calc-row";

          //create input for grade
          const input = document.createElement("input");
          input.type = "number";
          input.value = a.grade;
          input.min = 0;
          input.max = 100;
          input.style.width = "60px";

          const letterGrade = document.createElement("div");
          letterGrade.textContent = getLetterGrade(a.grade);

          input.addEventListener("input", () => {
            letterGrade.textContent = getLetterGrade(parseFloat(input.value));
          });

          //save grade on blur or Enter
          input.addEventListener("blur", () => saveGrade(a.id, input.value));
          input.addEventListener("keydown", e => {
            if (e.key === "Enter") {
              input.blur(); // triggers save
            }
          });

          

          //add cells to row
          row.innerHTML = `<div>${a.name}</div><div>${a.weight}</div>`;
          const gradeCell = document.createElement("div");
          gradeCell.appendChild(input);
          row.appendChild(gradeCell);
          row.appendChild(letterGrade);

          table.appendChild(row);

        });

      }
      //calculate summaries
      const summary = calculateSummary(assignments);

      //current grade
      const currentRow = document.createElement("div");
      currentRow.className = "calc-row calc-total";
      currentRow.innerHTML = `
        <div><strong>Current Grade</strong></div>
        <div>${summary.currentWeight}%</div>
        <div>${summary.currentAvg}%</div>
        <div>${summary.currentLetter}</div>
      `;
       

      //projected grade 
      const projectedRow = document.createElement("div");
      projectedRow.className = "calc-row calc-total";
      projectedRow.innerHTML = `
        <div><strong>Projected Grade</strong></div>
        <div>100%</div>
        <div>${summary.projectedAvg}%</div>
        <div>${summary.projectedLetter}</div>
      `;
          
      table.appendChild(currentRow);
      table.appendChild(projectedRow);


      view.appendChild(table);
    })
    .catch(err => {
      console.error("Failed to load assignments:", err);
    });
}



function closeExpandedView() {
  document.getElementById("overlay").style.display = "none";
}

function handleOverlayClick(event) {
  if (event.target.id === "overlay") {
    closeExpandedView();
  }
}


function saveGrade(assignmentId, newGrade) {
  fetch(`http://localhost:3000/api/grades/assignments/${assignmentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ grade: parseFloat(newGrade) })
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to update grade");
      console.log(`Grade updated for assignment ${assignmentId}`);
    })
    .catch(err => {
      console.error("Error updating grade:", err);
      alert("Failed to save grade.");
    });
}



function getLetterGrade(grade) {
  if (grade >= 90) return "A+";
  if (grade >= 85) return "A";
  if (grade >= 80) return "A-";
  if (grade >= 75) return "B+";
  if (grade >= 70) return "B";
  if (grade >= 65) return "B-";
  if (grade >= 60) return "C+";
  if (grade >= 55) return "C";
  if (grade >= 50) return "C-";
  if (grade >= 40) return "D";
  return "E";
}

function calculateSummary(assignments) {
  let totalWeight = 0;
  let weightedSum = 0;

  assignments.forEach(a => {
    const grade = parseFloat(a.grade);
    const weight = parseFloat(a.weight);
    if (!isNaN(grade) && !isNaN(weight)) {
      totalWeight += weight;
      weightedSum += (grade * weight);
    }
  });

  const currentGrade = (weightedSum / 100);  // <-- change is here
  const projectedAvg = totalWeight > 0 ? (weightedSum / totalWeight) : 0;

  return {
    currentWeight: totalWeight,
    currentAvg: currentGrade.toFixed(2),
    currentLetter: getLetterGrade(currentGrade),
    projectedAvg: projectedAvg.toFixed(2),
    projectedLetter: getLetterGrade(projectedAvg)
  };
}
