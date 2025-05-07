const express = require('express');
const router = express.Router();

const grades = [
    { paper: 'COMPX101', assignment: 'Lab 1', weight: 10, grade: 75 },
    { paper: 'COMPX101', assignment: 'Lab 2', weight: 15, grade: 80 },
  ];
  
  app.get('/api/grades', (req, res) => {
    res.json(grades);
  });

module.exports = router;