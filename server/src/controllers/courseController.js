const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandle');

const prisma = new PrismaClient();

exports.createCourse = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const exitsing = await prisma.course.findUnique({ where: { name } });
    if (exitsing) return res.status(400).json({ message: "Course Already Exists" });

    const course = await prisma.course.create({ data: { name } });

    res.status(201).json(course);
});

exports.getCourses = asyncHandler(async (req, res) => {
    const courses = await prisma.course.findMany();
    res.json(courses);
});

exports.getCoursesStudents = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const students = await prisma.student.findMany({
        where: { courseId: id },
    });

    res.json(students);
})