import { useState, useEffect } from "react";
import api from "../../services/api";

import Navbar from "../shared/Navbar";
import SubjectList from "./SubjectList";
import QRScanner from "./QRScanner";
import CreateCourse from "./CreateCourses";
import CreateSubject from "./CreateSubject";

export default function TeacherDashboard() {

    const [sessionId, setSessionId] = useState("");
    const [showScanner, setShowScanner] = useState(false); // 🔥 NEW

    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        fetchCourses();
        fetchSubjects();
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

    const fetchSubjects = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get("/api/subjects", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSubjects(res.data);

        } catch (err) {
            console.error("Failed to fetch subjects");
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
            setShowScanner(true);

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

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <CreateCourse setCourses={setCourses} />
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <CreateSubject
                            courses={courses}
                            setSubjects={setSubjects}
                        />
                    </div>

                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">

                    <h3 className="text-lg font-semibold mb-4">
                        Your Subjects
                    </h3>

                    <SubjectList
                        subjects={subjects}
                        onStartSession={startSession}
                    />

                </div>

                {sessionId && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">

                        <h3 className="text-lg font-semibold mb-4">
                            Active Session
                        </h3>

                        <p className="text-gray-400 mb-4">
                            Session ID: {sessionId}
                        </p>

                        <div className="flex gap-3 mb-4">

                            <button
                                onClick={() => setShowScanner(true)}
                                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition"
                            >
                                Open Scanner
                            </button>

                            <button
                                onClick={() => setShowScanner(false)}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
                            >
                                Close Scanner
                            </button>

                        </div>


                        {showScanner && (
                            <QRScanner sessionId={sessionId} />
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}