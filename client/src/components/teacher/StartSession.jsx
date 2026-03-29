import { useState } from "react";
import api from "../../services/api";

export default function StartSession({ setSessionId }) {

    const [subjectId, setSubjectId] = useState("");
    const [loading, setLoading] = useState(false);

    const startSession = async () => {

        if (!subjectId) {
            alert("Please enter Subject ID");
            return;
        }

        try {
            setLoading(true);

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

            alert("Session started successfully");

            setSubjectId("");

        } catch (err) {
            alert(err.response?.data?.message || "Failed to start session");
        } finally {
            setLoading(false);
        }

    };

    return (

        <div className="h-full flex flex-col justify-between">

            <h3 className="text-lg font-semibold mb-4">
                Start Class Session
            </h3>

            <input
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                placeholder="Enter Subject ID"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
            />

            <button
                onClick={startSession}
                disabled={loading}
                className="mt-5 w-full py-3 rounded-lg bg-linear-to-r from-green-500 to-emerald-500 text-white font-medium hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
            >
                {loading ? "Starting..." : "Start Session"}
            </button>

        </div>

    );

}