import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Fireflies from "./FireFlies";

export default function RegisterTeacher() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photoUrl, setPhotoUrl] = useState(""); // ✅ NEW

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const registerTeacher = async () => {
        if (!name || !email || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await api.post("/api/auth/teacher/register", {
                name,
                email,
                password,
                photoUrl
            });

            navigate("/");

        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-black via-zinc-900 to-black">

            <Fireflies />

            <div className="relative z-10 w-96 p-8 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]">

                <h2 className="text-2xl font-semibold text-white text-center mb-6">
                    Teacher Registration
                </h2>

                {error && (
                    <p className="text-red-400 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}

                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                />

                <input
                    placeholder="Photo URL (optional)"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full mb-5 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                />

                <button
                    onClick={registerTeacher}
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-white text-black font-medium hover:scale-105 hover:bg-gray-200 transition-all duration-300"
                >
                    {loading ? "Registering..." : "Register Teacher"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/")}
                        className="cursor-pointer hover:text-white transition"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}