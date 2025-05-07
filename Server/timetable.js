const express = require('express');
const router = express.Router();

const timetable = [
  { subject: 'COMPX101', type: 'Lecture', day: 'Monday', time: '10:00AM', room: 'MSB.1.03' },
  { subject: 'ENGEN180', type: 'Lab', day: 'Wednesday', time: '1:00PM', room: 'E.G.15' },
  { subject: 'MATHS102', type: 'Tutorial', day: 'Friday', time: '11:00AM', room: 'S.1.02' }
];

router.get('/', (req, res) => {
  res.json(timetable);
});

module.exports = router;