import { useEffect, useState } from "react";
import api from "../../services/api";

import Navbar from "../shared/Navbar";
import Loader from "../shared/Loader";
import StudentProfile from "./StudentProfile";
import StudentQR from "./StudentQR";

export default function StudentDashboard() {
    const [student, setStudent] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [activeSession, setActiveSession] = useState(null); // ✅ NEW

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await api.get("/api/student/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setStudent(res.data);

                const stats = await api.get(
                    `/api/attendance/student/${res.data.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setAttendance(stats.data);

                // ✅ NEW → Fetch active session
                if (res.data.courseCode) {
                    const sessionRes = await api.get(
                        `/api/sessions/active/${res.data.courseCode}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    setActiveSession(sessionRes.data);
                }

            } catch (err) {
                setError("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) return <Loader />;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-black text-white">

            <Navbar />

            <div className="p-6 max-w-6xl mx-auto">

                <h2 className="text-3xl font-semibold mb-8">
                    Welcome, {student?.name} 👋
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                        <StudentProfile student={student} />
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                        <StudentQR qr={student?.qrCode} />
                    </div>

                </div>

                {/* ✅ UPDATED COURSE SECTION */}
                <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.05)]">

                    <h3 className="text-lg font-semibold mb-4">
                        Your Course
                    </h3>

                    {student?.course ? (
                        <div className="p-4 rounded-lg bg-white/10">

                            <p className="font-semibold text-lg">
                                {student.course.name}
                            </p>

                            <p className="text-sm text-gray-400">
                                Code: {student.course.code}
                            </p>

                            {/* ✅ ACTIVE SESSION */}
                            {activeSession ? (
                                <div className="mt-3 text-green-400 text-sm font-medium">
                                    🟢 Live Session Active ({activeSession.subject.name})
                                </div>
                            ) : (
                                <div className="mt-3 text-gray-500 text-sm">
                                    No active session
                                </div>
                            )}

                        </div>
                    ) : (
                        <p className="text-gray-400">
                            No course joined yet
                        </p>
                    )}

                </div>

                {/* ATTENDANCE */}
                {attendance && (
                    <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.05)]">

                        <h3 className="text-lg font-semibold mb-4">
                            Attendance Summary
                        </h3>

                        <div className="grid grid-cols-3 gap-4 text-center">

                            <div className="bg-indigo-500/10 p-4 rounded-lg">
                                <p className="text-xl font-bold">{attendance.present}</p>
                                <p className="text-gray-400 text-sm">Present</p>
                            </div>

                            <div className="bg-indigo-500/10 p-4 rounded-lg">
                                <p className="text-xl font-bold">{attendance.totalSessions}</p>
                                <p className="text-gray-400 text-sm">Total</p>
                            </div>

                            <div className="bg-indigo-500/10 p-4 rounded-lg">
                                <p className="text-xl font-bold">{attendance.percentage}%</p>
                                <p className="text-gray-400 text-sm">Attendance</p>
                            </div>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}