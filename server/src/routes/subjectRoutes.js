const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createSubject,
    getCourseSubjects
} = require("../controllers/subjectController");

router.post("/", protect, allowRoles("teacher"), createSubject);
router.get("/:courseCode", protect, getCourseSubjects);

module.exports = router;