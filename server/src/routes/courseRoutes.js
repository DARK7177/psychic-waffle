const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const {
    createCourse,
    getCourses,
    getCoursesStudents,
} = require("../controllers/courseController");

router.post("/", protect, allowRoles("teacher"), createCourse);
router.get("/", protect, getCourses);
router.get("/:id/students", protect, allowRoles('teacher'), getCoursesStudents);

module.exports = router;