const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

exports.createCourse = asyncHandler(async (req, res) => {
    const { code, name } = req.body;

    const existing = await prisma.course.findUnique({
        where: { code }
    });

    if (existing)
        return res.status(400).json({ message: "Course already exists" });

    const course = await prisma.course.create({
        data: { code, name }
    });

    res.status(201).json(course);
});

exports.getCourses = asyncHandler(async (req, res) => {
    const courses = await prisma.course.findMany();
    res.json(courses);
});

exports.getCourseStudents = asyncHandler(async (req, res) => {
    const { code } = req.params;

    const students = await prisma.student.findMany({
        where: { courseCode: code }
    });

    res.json(students);
});