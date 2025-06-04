document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("select-widget-container");

  const widget = document.createElement("div");
  widget.className = "widget";
  widget.textContent = "Select Papers";

  const modal = document.createElement("div");
  modal.className = "modal hidden";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2>Select your papers for this semester</h2>
      <p>Don't know what papers you are taking?</p>      
      <a href="degree-planner.html">Go to Degree Planner</a><br>
      <div id="paper-list"></div>

    </div>
  `;

  container.appendChild(widget);
  document.body.appendChild(modal);

  widget.onclick = () => {
  modal.classList.remove("hidden");

  const paperList = document.getElementById("paper-list");
  paperList.innerHTML = "Loading...";

  fetch("http://localhost:3000/api/papers", { credentials: "include" })
    .then(res => res.json())
    .then(papers => {
      paperList.innerHTML = "";

      papers.forEach(paper => {
        const item = document.createElement("div");
        item.className = "paper-item";
        item.textContent = `${paper.paper_code} - ${paper.paper_name}`;

        item.onclick = () => {
          item.classList.toggle("selected");
        };

        paperList.appendChild(item);
      });
    })
    .catch(err => {
      console.error("Failed to fetch papers:", err);
      paperList.innerHTML = "<p style='color:red;'>Failed to load papers.</p>";
    });
};


  modal.querySelector(".close-btn").onclick = () =>
    modal.classList.add("hidden");

  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  };
});
