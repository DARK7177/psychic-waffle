import { useState, useEffect } from "react";
import api from "../../services/api";

import Navbar from "../shared/Navbar";
import SubjectList from "./SubjectList";
import QRScanner from "./QRScanner";
import CreateCourse from "./CreateCourses";
import CreateSubject from "./CreateSubject";

export default function TeacherDashboard() {

    const [sessionId, setSessionId] = useState("");
    const [courses, setCourses] = useState([]);

    // 🔥 Load courses once
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get("/api/courses", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCourses(res.data);

        } catch (err) {
            console.error("Failed to fetch courses");
        }
    };

    const startSession = async (subjectId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.post(
                "/api/sessions",
                { subjectId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSessionId(res.data.id);

        } catch (err) {
            alert("Failed to start session");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-black text-white">

            <Navbar />

            <div className="p-6 max-w-6xl mx-auto space-y-6">

                <h2 className="text-3xl font-semibold mb-2">
                    Teacher Dashboard 👨‍🏫
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* 🔥 pass setCourses */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <CreateCourse setCourses={setCourses} />
                    </div>

                    {/* 🔥 pass courses */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <CreateSubject courses={courses} />
                    </div>

                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">

                    <h3 className="text-lg font-semibold mb-4">
                        Your Subjects
                    </h3>

                    <SubjectList onStartSession={startSession} />

                </div>

                {sessionId && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">

                        <h3 className="text-lg font-semibold mb-4">
                            Active Session
                        </h3>

                        <p className="text-gray-400 mb-4">
                            Session ID: {sessionId}
                        </p>

                        <QRScanner sessionId={sessionId} />

                    </div>
                )}

            </div>

        </div>
    );
}