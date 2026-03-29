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
            teacherId: req.user.id,
            status: "active"
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

exports.getActiveSessionByCourse = asyncHandler(async (req, res) => {

    const { courseCode } = req.params;

    const session = await prisma.session.findFirst({
        where: {
            status: "active", // ✅ matches your model
            subject: {
                courseCode: courseCode
            }
        },
        include: {
            subject: true
        },
        orderBy: {
            date: "desc"
        }
    });

    res.json(session || null);

});

exports.closeSession = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const session = await prisma.session.findUnique({
        where: { id }
    });

    if (!session)
        return res.status(404).json({ message: "Session not found" });

    if (session.status === "closed")
        return res.status(400).json({ message: "Session already closed" });

    const updatedSession = await prisma.session.update({
        where: { id },
        data: { status: "closed" }
    });

    res.json({
        message: "Session closed successfully",
        session: updatedSession
    });

});