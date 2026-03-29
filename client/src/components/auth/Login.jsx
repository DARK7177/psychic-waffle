import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Fireflies from "./FireFlies";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async () => {
        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await api.post("/api/auth/login", {
                email,
                password,
                role
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", role);

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user || {})
            );

            navigate(role === "teacher" ? "/teacher" : "/student");

        } catch (err) {
            setError(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-black via-gray-950 to-black">

            <Fireflies />

            <div className="relative z-10 w-96 p-8 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.08)]">

                <h2 className="text-2xl font-semibold text-white text-center mb-6">
                    QR Attendance Login
                </h2>

                <div className="flex mb-5 bg-white/5 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => setRole("student")}
                        className={`flex-1 py-2 rounded-md text-sm transition ${role === "student"
                            ? "bg-white text-black"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Student
                    </button>

                    <button
                        onClick={() => setRole("teacher")}
                        className={`flex-1 py-2 rounded-md text-sm transition ${role === "teacher"
                            ? "bg-white text-black"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Teacher
                    </button>
                </div>

                {error && (
                    <p className="text-red-400 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-5 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                />

                <button
                    onClick={login}
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-white text-black font-medium hover:scale-105 hover:bg-gray-200 transition-all duration-300"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="mt-6 flex justify-between text-sm text-gray-500">
                    <button
                        onClick={() => navigate("/register/student")}
                        className="hover:text-white transition"
                    >
                        Register Student
                    </button>

                    <button
                        onClick={() => navigate("/register/teacher")}
                        className="hover:text-white transition"
                    >
                        Register Teacher
                    </button>
                </div>
            </div>
        </div>
    );
}