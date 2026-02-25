const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandle');

const prisma = new PrismaClient();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })
}

exports.registerStudent = asyncHandler(async (req, res) => {
    const { name, email, password, courseId, photoUrl } = req.body;

    const existingStudent = await prisma.student.findUnique({ where: { email } })
    if (existingStudent)
        return res.status(400).json({ message: "Student Already Exists" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.student.create({
        data: { name, email, password: hashedPassword, courseId, photoUrl }
    });

    req.status(201).json({
        message: "Student Registered Succesfully",
        student,
    })
})

exports.registerTeacher = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingTeacher = await prisma.teacher.findUnique({ where: { email } })
    if (existingTeacher)
        return res.status(400).json({ message: "Teacher ALready Exists" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await prisma.teacher.create({
        data: { name, email, password: hashedPassword }
    });

    res.status(201).json({
        message: "Teacher Registered Succesfully",
        teacher
    })
})

exports.login = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    let user;

    if (role === "student") user = await prisma.student.findUnique({ where: { email } });
    else if (role === 'teacher') user = await prisma, teacher.findUnique({ where: { email } });
    else return res.status(400).json({ message: "Invalid Role" });

    if (!user) return res.status(400).json({ message: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" })

    const token = generateToken(user.id, role);

    req.json({
        message: "Login Successful",
        token,
        role,
        user,
    })
})