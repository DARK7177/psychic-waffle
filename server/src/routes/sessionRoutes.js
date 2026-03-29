const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createSession,
    getSubjectSessions,
    closeSession,
    getActiveSessionByCourse
} = require("../controllers/sessionController");

router.post("/", protect, allowRoles("teacher"), createSession);
router.get("/subject/:subjectId", protect, getSubjectSessions);
router.get("/active/:courseCode", protect, getActiveSessionByCourse);
router.patch('/:id/close', protect, allowRoles("teacher"), closeSession);


module.exports = router;