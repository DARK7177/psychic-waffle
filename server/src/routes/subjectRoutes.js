const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createSubject,
    getTeacherSubjects,
    getCourseSubjects
} = require("../controllers/subjectController");

router.post("/", protect, allowRoles("teacher"), createSubject);
router.get("/", protect, allowRoles("teacher"), getTeacherSubjects);
router.get("/:courseCode", protect, getCourseSubjects);


module.exports = router;