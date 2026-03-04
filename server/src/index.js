const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const errorHandler = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes')
const courseRoute = require('./routes/courseRoutes');
const sessionRoute = require('./routes/sessionRoutes');
const attendanceRoute = require('./routes/attendanceRoutes');
const subjectRoute = require('./routes/subjectRoutes')

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoute);
app.use('/api/sessions', sessionRoute);
app.use('/api/attendance', attendanceRoute);
app.use('/api/subjects', subjectRoute)

app.get('/', (req, res) => {
    res.send("QR Attendance Backend Running")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})