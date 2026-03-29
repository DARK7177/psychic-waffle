const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require("cors");

const errorHandler = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const courseRoute = require('./routes/courseRoutes');
const sessionRoute = require('./routes/sessionRoutes');
const attendanceRoute = require('./routes/attendanceRoutes');
const subjectRoute = require('./routes/subjectRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();

console.log(process.env.DATABASE_URL);

const allowedOrigins = [
    "http://localhost:5173",
    "https://bhupeshkumar.me",
    "https://www.bhupeshkumar.me"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoute);
app.use('/api/sessions', sessionRoute);
app.use('/api/attendance', attendanceRoute);
app.use('/api/subjects', subjectRoute);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);

app.get('/', (req, res) => {
    res.send("QR Attendance Backend Running");
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});