const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    markAttendance,
    getStudentAttendance,
} = require("../controllers/attendanceController");

router.post("/scan", protect, allowRoles("teacher"), markAttendance);

router.get("/student/:id", protect, getStudentAttendance);

module.exports = router;