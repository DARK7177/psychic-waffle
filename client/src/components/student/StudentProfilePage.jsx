import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import Navbar from "../shared/Navbar";
import Loader from "../shared/Loader";

export default function StudentProfilePage() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                console.log("TOKEN:", token);

                if (!token) {
                    setError("No token found. Please login again.");
                    setLoading(false);
                    return;
                }

                const res = await api.get("/api/student/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("STUDENT PROFILE:", res.data);

                setStudent(res.data);

            } catch (err) {
                console.error("PROFILE ERROR:", err);

                setError(
                    err?.response?.data?.message ||
                    "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="p-6 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-black text-white">

            <Navbar />

            <div className="max-w-5xl mx-auto p-6">

                <div className="mb-8 flex items-center justify-between">

                    <h2 className="text-3xl font-semibold">
                        My Profile
                    </h2>

                    <button
                        onClick={() => navigate("/student")}
                        className="text-sm text-gray-400 hover:text-white transition px-3 py-1 rounded-md hover:bg-white/10"
                    >
                        ← Back
                    </button>

                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]">

                    <div className="grid md:grid-cols-2 gap-8 items-center">

                        <div className="flex justify-center">
                            <div className="bg-white p-4 rounded-xl shadow-inner">
                                <img
                                    src={student?.photoUrl || "https://via.placeholder.com/200"}
                                    alt="Student"
                                    className="w-56 h-56 object-cover rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">

                            <h3 className="text-2xl font-semibold">
                                {student?.name || "No Name"}
                            </h3>

                            <p className="text-gray-400">
                                {student?.email || "No Email"}
                            </p>

                            {student?.course && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400">
                                        Course
                                    </p>
                                    <p className="font-medium">
                                        {student.course?.name || "N/A"} ({student.course?.code || "N/A"})
                                    </p>
                                </div>
                            )}

                            <div className="mt-4">
                                <p className="text-sm text-gray-400">
                                    Student ID
                                </p>
                                <p className="font-medium">
                                    {student?.id || "N/A"}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}