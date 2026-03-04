const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createSession,
    getSubjectSessions,
} = require("../controllers/sessionController");

router.post("/", protect, allowRoles("teacher"), createSession);

router.get("/subject/:subjectId", protect, getSubjectSessions);


module.exports = router;