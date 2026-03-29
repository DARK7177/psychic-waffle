const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../utils/asyncHandler");

const prisma = new PrismaClient();

exports.getTeacherProfile = asyncHandler(async (req, res) => {

    const teacher = await prisma.teacher.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            photoUrl: true
        }
    });

    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
});