const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const {
    createCourse,
    getCourses,
    getCourseStudents,
} = require("../controllers/courseController");

router.post("/", protect, allowRoles("teacher"), createCourse);
router.get("/", protect, getCourses);
router.get("/:id/students", protect, allowRoles('teacher'), getCourseStudents);

module.exports = router;