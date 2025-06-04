const plannerContainer = document.getElementById("planner-container");

//color mapping
const typeClass = {
  COMPULSORY: "compulsory",
  STREAM: "stream",
  PLACEMENT: "placement",
  ELECTIVE_1: "elective",
  ELECTIVE_MATHS: "elective",
  ELECTIVE_COMPUTING: "elective",
  ELECTIVE_3: "elective",
  ELECTIVE_4: "elective",
  STREAM_ELECTIVE: "stream",
};

const grouped = { 1: [], 2: [], 3: [], 4: [] };

//fetch and group papers
fetch("http://localhost:3000/api/papers")
  .then(res => res.json())
  .then(papers => {
    papers.forEach(p => {
      if (grouped[p.year]) grouped[p.year].push(p);
    });
    renderPlanner();
  })
  .catch(err => console.error("Failed to load papers:", err));

function renderPlanner() {
  plannerContainer.innerHTML = "";

  for (let year = 1; year <= 4; year++) {
    const row = document.createElement("div");
    row.className = "planner-row";

    const heading = document.createElement("h3");
    heading.textContent = `Year ${year}`;
    row.appendChild(heading);

    const paperRow = document.createElement("div");
    paperRow.className = "paper-row";

    grouped[year].forEach(paper => {
      const paperBox = document.createElement("div");
      paperBox.className = `paper-box ${typeClass[paper.paper_type] || "default"}`;
      paperBox.textContent = paper.paper_code;
      paperBox.onclick = () => openModal(paper);
      paperRow.appendChild(paperBox);
    });

    row.appendChild(paperRow);
    plannerContainer.appendChild(row);
  }

  injectModal();
}

//modal popup
function openModal(paper) {
  const modal = document.getElementById("paper-modal");
  const modalContent = document.getElementById("modal-content");

  modalContent.innerHTML = `
    <h2>${paper.paper_code} - ${paper.paper_name}</h2>
    <p><strong>Type:</strong> ${paper.paper_type}</p>
    <p>${paper.description || "No description available."}</p>
    <button onclick="closeModal()">Close</button>
  `;

  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("paper-modal").style.display = "none";
}

//inject modal HTML only once
function injectModal() {
  if (document.getElementById("paper-modal")) return;

  const modal = document.createElement("div");
  modal.id = "paper-modal";
  modal.style = `
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const content = document.createElement("div");
  content.id = "modal-content";
  content.style = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);
}
