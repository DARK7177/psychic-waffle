import { useState, useEffect } from "react";
import api from "../../services/api";

import Navbar from "../shared/Navbar";
import SubjectList from "./SubjectList";
import QRScanner from "./QRScanner";
import CreateCourse from "./CreateCourses";
import CreateSubject from "./CreateSubject";

export default function TeacherDashboard() {

    const [sessionId, setSessionId] = useState(null);
    const [showScanner, setShowScanner] = useState(false);

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

            console.log("Session response:", res.data); // debug


            const newSessionId = res.data.id || res.data.session?.id;

            if (!newSessionId) {
                throw new Error("Session ID not returned");
            }

            setSessionId(newSessionId);
            setShowScanner(true);

        } catch (err) {
            console.error(err);
            alert("Failed to start session");
        }
    };

    const closeSession = async () => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/api/sessions/${sessionId}/close`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Session closed successfully");

            setSessionId(null);
            setShowScanner(false);

            await fetchSubjects();

        } catch (err) {
            console.error(err);
            alert("Failed to close session");
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

                        <div className="flex gap-3 mb-4 flex-wrap">

                            <button
                                onClick={() => setShowScanner(true)}
                                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition"
                            >
                                Open Scanner
                            </button>

                            <button
                                onClick={() => setShowScanner(false)}
                                className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition"
                            >
                                Close Scanner
                            </button>


                            <button
                                onClick={closeSession}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
                            >
                                Close Session
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