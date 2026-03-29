const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getTeacherProfile
} = require("../controllers/teacherController");

router.get("/profile", protect, getTeacherProfile);

module.exports = router;