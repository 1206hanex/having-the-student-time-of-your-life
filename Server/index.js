const express = require('express');
const app = express();
const timetableRoute = require('./routes/timetable');
const gradesRoute = require('./routes/timetable');

//define a port 
const PORT = 3000; 

app.use(express.json());

//example route
app.get('/', (req, res) => {
  res.send('Welcome to the Student Life API!');
});

//use the timetable route 
app.use('/api/timetable', timetableRoute);

//use the grades routes 
app.use('/api/timetable', gradesRoute);
  

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
