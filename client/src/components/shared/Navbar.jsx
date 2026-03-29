import { useState } from "react";

export default function Navbar() {
    const [isHover, setIsHover] = useState(false);
    const [open, setOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const goToProfile = () => {
        if (role === "teacher") {
            window.location.href = "/teacher/profile";
        } else {
            window.location.href = "/student/profile";
        }
    };

    return (
        <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg">
            <div className="flex justify-between items-center px-6 py-3">

                <h1 onClick={() => {
                    const role = localStorage.getItem("role");

                    if (role === "teacher") {
                        window.location.href = "/teacher";
                    } else {
                        window.location.href = "/student";
                    }
                }} className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wide cursor-pointer">
                    QR Attendance
                </h1>

                <div className="flex items-center gap-4 relative">

                    <div
                        onClick={() => setOpen(!open)}
                        className="w-9 h-9 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md cursor-pointer"
                    >
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>

                    {open && (
                        <div className="absolute right-0 top-12 w-40 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">

                            <button
                                onClick={goToProfile}
                                className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                            >
                                Profile
                            </button>

                        </div>
                    )}

                    <button
                        onClick={logout}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        className="relative px-4 py-2 rounded-lg font-medium overflow-hidden transition-all duration-300"
                    >
                        <span className={`absolute inset-0 bg-linear-to-r from-red-500 to-pink-500 transition-transform duration-300 ${isHover ? "scale-100" : "scale-0"} rounded-lg`} />

                        <span className="relative z-10 text-white">
                            Logout
                        </span>
                    </button>

                </div>

            </div>
        </div>
    );
}