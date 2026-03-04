const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../utils/asyncHandler");

const prisma = new PrismaClient();

exports.createSession = asyncHandler(async (req, res) => {

    const { subjectId } = req.body;

    const subject = await prisma.subject.findUnique({
        where: { id: subjectId }
    });

    if (!subject)
        return res.status(404).json({ message: "Subject not found" });

    const session = await prisma.session.create({
        data: {
            subjectId,
            teacherId: req.user.id
        }
    });

    res.status(201).json(session);
});

exports.getSubjectSessions = asyncHandler(async (req, res) => {

    const { subjectId } = req.params;

    const sessions = await prisma.session.findMany({
        where: { subjectId },
        include: {
            subject: true
        },
        orderBy: {
            date: "desc"
        }
    });

    res.json(sessions);
});