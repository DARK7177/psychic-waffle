export default function StudentProfile({ student }) {
    return (
        <div className="flex justify-center items-center mt-8 px-4">

            <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 w-full max-w-sm text-center">

                <h3 className="text-xl font-semibold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Student Profile
                </h3>

                <div className="bg-white p-4 rounded-xl shadow-inner flex justify-center items-center">
                    <img
                        src={student?.photoUrl || "https://via.placeholder.com/150"}
                        alt="Student"
                        className="w-48 h-48 object-cover rounded-lg"
                    />
                </div>
                <h2 className="text-lg font-semibold mt-4">
                    {student?.name}
                </h2>

                <div className="mt-3 text-sm text-gray-300 space-y-1">

                    <p>{student?.email}</p>

                    {student?.course && (
                        <p>
                            Course: {student.course.name} ({student.course.code})
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}