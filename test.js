//====================================================================================================
app.post('/api/papers/activate', (req, res) => {
  const uid = req.session.userId;
  const selected = req.body.selected; // Array of paper codes

  if (!uid || !Array.isArray(selected)) {
    return res.status(400).json({ error: "Bad request" });
  }

  const placeholders = selected.map(() => '?').join(',');
  const sql = `UPDATE user_papers SET is_active = 1 WHERE uid = ? AND paper_code IN (${placeholders})`;
  db.query(sql, [uid, ...selected], (err) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json({ message: "Updated successfully" });
  });
});

//====================================================================================================


modal.querySelector("#submit-papers-btn").onclick = () => {
    fetch("http://localhost:3000/api/papers/activate", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected: Array.from(selectedPapers) }),
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to activate papers");
      alert("Papers activated!");
      modal.classList.add("hidden");
    })
    .catch(err => {
      console.error("Activation error:", err);
      alert("Failed to activate selected papers.");
    });
  };




  <button id="submit-papers-btn">Confirm Selection</button> 




  //===========================================
const selectedPapers = new Set();  // track selected paper codes

//modify existing paperBox.onclick:
paperBox.onclick = () => {
  const code = paper.paper_code;
  if (selectedPapers.has(code)) {
    selectedPapers.delete(code);
    paperBox.classList.remove("selected");
  } else {
    selectedPapers.add(code);
    paperBox.classList.add("selected");
  }
};
//===========================================