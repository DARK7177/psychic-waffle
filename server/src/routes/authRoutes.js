const express = require("express");
const router = express.Router();

const {
    registerStudent,
    registerTeacher,
    login
} = require("../controllers/authController");

router.post("/student/register", registerStudent);
router.post("/teacher/register", registerTeacher);
router.post("/login", login);

module.exports = router;