import { useState } from "react";
import api from "../../services/api";

export default function CreateSubject({ courses, setSubjects }) {

    const [name, setName] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [loading, setLoading] = useState(false);

    const createSubject = async () => {

        if (!name || !courseCode) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            await api.post(
                "/api/subjects",
                { name, courseCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const res = await api.get("/api/subjects", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSubjects(res.data);

            alert("Subject created");

            setName("");
            setCourseCode("");

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col justify-between">

            <h3 className="text-lg font-semibold mb-4">
                Create Subject
            </h3>

            <div className="space-y-3">

                <input
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    placeholder="Subject Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <select
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                >
                    <option value="" className="text-black">
                        Select Course
                    </option>

                    {courses.map(course => (
                        <option
                            key={course.code}
                            value={course.code}
                            className="text-black"
                        >
                            {course.name} ({course.code})
                        </option>
                    ))}

                </select>

            </div>

            <button
                onClick={createSubject}
                disabled={loading}
                className="mt-5 w-full py-3 rounded-lg bg-white text-black"
            >
                {loading ? "Creating..." : "Create Subject"}
            </button>

        </div>
    );
}