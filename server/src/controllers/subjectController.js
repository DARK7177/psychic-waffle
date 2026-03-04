const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../utils/asyncHandler");

const prisma = new PrismaClient();

exports.createSubject = asyncHandler(async (req, res) => {

    const { name, courseCode } = req.body;

    const course = await prisma.course.findUnique({
        where: { code: courseCode }
    });

    if (!course)
        return res.status(404).json({ message: "Course not found" });

    const subject = await prisma.subject.create({
        data: {
            name,
            courseCode,
            teacherId: req.user.id
        }
    });

    res.status(201).json(subject);
});

exports.getCourseSubjects = asyncHandler(async (req, res) => {

    const { courseCode } = req.params;

    const subjects = await prisma.subject.findMany({
        where: { courseCode },
        include: {
            teacher: true
        }
    });

    res.json(subjects);
});