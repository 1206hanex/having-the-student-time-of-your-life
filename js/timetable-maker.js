const timetable = document.getElementById("timetable");

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const startHour = 8;
const endHour = 20;

//create top header row
timetable.innerHTML += `<div class="time-label"></div>`;
days.forEach(day => {
  timetable.innerHTML += `<div class="day-label">${day}</div>`;
});

//create each hour row
for (let hour = startHour; hour < endHour; hour++) {
  const hourLabel = hour < 12 ? `${hour} AM`
                  : hour === 12 ? `12 PM`
                  : `${hour - 12} PM`;

  timetable.innerHTML += `<div class="time-label">${hourLabel}</div>`;

  days.forEach(day => {
    timetable.innerHTML += `<div class="cell" data-day="${day}" data-time="${hour}"></div>`;
  });
}



fetch("http://localhost:3000/api/timetable", {
  method: "GET",
  credentials: "include" 
})
  .then(res => res.json())
  .then(data => {
    data.forEach(entry => {
      const start = parseInt(entry.start_time.split(":")[0]);
      const end = parseInt(entry.end_time.split(":")[0]);
      const day = entry.day;

      const classData = { name: entry.name, day, start, end };

      
      if (!entry.is_active) {
        addToRemovedList(classData);
      } else {
        addClassToTimetable(classData);
      }
    });
  })
  .catch(err => {
    console.error('Failed to load timetable:', err);
  });


function addClassToTimetable({ name, day, start, end }) {
  const createBlock = (isMain = false) => {
    const block = document.createElement("div");
    block.classList.add("class-block");

    const label = document.createElement("span");
    label.textContent = name;
    block.appendChild(label);

    if (isMain) {
      const close = document.createElement("div");
      close.classList.add("close-btn");
      close.textContent = "×";
      close.onclick = () => {
        for (let hour = start; hour < end; hour++) {
          const linkedCell = document.querySelector(`.cell[data-day="${day}"][data-time="${hour}"]`);
          const linkedBlock = linkedCell?.querySelector(".class-block");
          if (linkedBlock) linkedBlock.remove();
        }
        addToRemovedList({ name, day, start, end });

        fetch("http://localhost:3000/api/timetable/update-active", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, day, time: start, is_active: 0 })
        }).catch(err => console.error("Failed to deactivate class", err));
      };
      block.appendChild(close);
    }

    return block;
  };

  for (let hour = start; hour < end; hour++) {
    const cell = document.querySelector(`.cell[data-day="${day}"][data-time="${hour}"]`);
    if (!cell) continue;
    const block = createBlock(hour === start);
    cell.appendChild(block);
  }
}


function addToRemovedList(classData) {
  const container = document.getElementById("removed-classes");

  const block = document.createElement("div");
  block.classList.add("class-block", "removed-block");
  block.textContent = classData.name;

  block.onclick = () => {
    block.remove();
    addClassToTimetable(classData);



    fetch("http://localhost:3000/api/timetable/update-active", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...classData, is_active: 1 })
  }).catch(err => console.error("Failed to reactivate class", err));
  };

  container.appendChild(block);
}




function handleAddCustomClass() {
  const name = document.getElementById("custom-name").value.trim();
  const day = document.getElementById("custom-day").value;
  const start = parseInt(document.getElementById("custom-start-time").value);
  const end = parseInt(document.getElementById("custom-end-time").value);

  if (!name || !day || isNaN(start) || isNaN(end) || end <= start) {
    alert("Please fill out all fields correctly. End time must be after start time.");
    return;
  }

  addClassToTimetable({ name, day, start, end });

  fetch("http://localhost:3000/api/timetable/add", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, day, start_time: start, end_time: end })
  }).catch(err => console.error("Add failed", err));

  //clear form
  document.getElementById("custom-name").value = "";
  document.getElementById("custom-day").value = "";
  document.getElementById("custom-start-time").value = "";
  document.getElementById("custom-end-time").value = "";
}
