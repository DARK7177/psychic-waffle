import { useState } from "react";
import api from "../../services/api";

export default function CreateCourse({ setCourses }) {

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const createCourse = async () => {

        if (!code || !name) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await api.post(
                "/api/courses",
                { code, name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Course created");

            // 🔥 update instantly (NO REFRESH)
            setCourses(prev => [...prev, res.data]);

            setCode("");
            setName("");

        } catch (err) {
            alert(err.response?.data?.message || "Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col justify-between">

            <h3 className="text-lg font-semibold mb-4">
                Create Course
            </h3>

            <div className="space-y-3">

                <input
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    placeholder="Course Code (BCA)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <input
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
                    placeholder="Course Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

            </div>

            <button
                onClick={createCourse}
                disabled={loading}
                className="mt-5 w-full py-3 rounded-lg bg-white text-black"
            >
                {loading ? "Creating..." : "Create Course"}
            </button>

        </div>
    );
}