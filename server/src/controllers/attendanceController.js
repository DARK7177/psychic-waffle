const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../utils/asyncHandler");

const prisma = new PrismaClient();

exports.markAttendance = asyncHandler(async (req, res) => {

    const { studentId, sessionId } = req.body;

    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
            subject: true
        }
    });

    if (!session)
        return res.status(404).json({ message: "Session not found" });

    const student = await prisma.student.findUnique({
        where: { id: studentId }
    });

    if (!student)
        return res.status(404).json({ message: "Student not found" });

    if (student.courseCode !== session.subject.courseCode)
        return res.status(403).json({ message: "Student not part of this course" });

    const existing = await prisma.attendance.findFirst({
        where: {
            studentId,
            sessionId
        }
    });

    if (existing)
        return res.status(400).json({ message: "Attendance already marked" });

    const attendance = await prisma.attendance.create({
        data: {
            studentId,
            sessionId
        }
    });

    res.status(201).json({
        message: "Attendance marked successfully",
        attendance
    });

});

exports.getStudentAttendance = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const present = await prisma.attendance.count({
        where: { studentId: id }
    });

    const totalSessions = await prisma.session.count({
        where: {
            subject: {
                courseCode: (
                    await prisma.student.findUnique({
                        where: { id },
                        select: { courseCode: true }
                    })
                ).courseCode
            }
        }
    });

    res.json({
        present,
        totalSessions,
        percentage: totalSessions
            ? ((present / totalSessions) * 100).toFixed(2)
            : 0
    });

});