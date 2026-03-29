const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../utils/asyncHandler");

const prisma = new PrismaClient();

exports.getStudentProfile = asyncHandler(async (req, res) => {

    const student = await prisma.student.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            qrCode: true,
            photoUrl: true,
            courseCode: true,

            course: {
                select: {
                    code: true,
                    name: true
                }
            }
        }
    });

    if (!student)
        return res.status(404).json({ message: "Student not found" });

    res.json(student);

});