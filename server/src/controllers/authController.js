const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const QRCode = require("qrcode");

const prisma = new PrismaClient();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

exports.registerStudent = asyncHandler(async (req, res) => {

    const { name, email, password, courseCode, photoUrl } = req.body;

    const existingStudent = await prisma.student.findUnique({
        where: { email }
    });

    const existingTeacher = await prisma.teacher.findUnique({
        where: { email }
    });

    if (existingStudent || existingTeacher) {
        return res.status(400).json({
            message: "Email already registered as a student or teacher"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.student.create({
        data: {
            name,
            email,
            password: hashedPassword,
            courseCode,
            photoUrl
        }
    });

    const qrData = JSON.stringify({
        studentId: student.id
    });

    const qrCode = await QRCode.toDataURL(qrData);

    const updatedStudent = await prisma.student.update({
        where: { id: student.id },
        data: { qrCode }
    });

    res.status(201).json({
        message: "Student registered successfully",
        student: updatedStudent
    });

});

exports.registerTeacher = asyncHandler(async (req, res) => {

    const { name, password, photoUrl } = req.body;

    const email = req.body.email.trim().toLowerCase();

    const existingStudent = await prisma.student.findFirst({
        where: { email }
    });

    const existingTeacher = await prisma.teacher.findFirst({
        where: { email }
    });

    if (existingStudent || existingTeacher) {
        return res.status(400).json({
            message: "Email already registered as a student or teacher"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await prisma.teacher.create({
        data: {
            name,
            email,
            password: hashedPassword,
            photoUrl: photoUrl || ""
        }
    });

    res.status(201).json({
        message: "Teacher registered successfully",
        teacher
    });

});

exports.login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    let user = await prisma.student.findUnique({ where: { email } });
    let role = "student";

    if (!user) {
        user = await prisma.teacher.findUnique({ where: { email } });
        role = "teacher";
    }

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id, role);

    const { password: _, ...safeUser } = user;

    res.json({
        message: "Login successful",
        token,
        role,
        user: safeUser
    });

});