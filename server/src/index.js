const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorMiddleware');
const courseRoute = require('./routes/courseRoutes')

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use("/api/courses", courseRoute);

app.get('/', (req, res) => {
    res.send("QR Attendance Backend Running")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})