import { useState } from "react";

export default function SubjectList({ subjects, onStartSession }) {

    const [loadingId, setLoadingId] = useState(null);

    return (

        <div className="space-y-4">

            {(!subjects || subjects.length === 0) && (
                <p className="text-gray-400">
                    No subjects created yet
                </p>
            )}

            {subjects?.map((subject) => {


                const latestSession = subject.sessions?.[subject.sessions.length - 1];

                const isClosed = latestSession?.status === "closed";
                const isActive = latestSession?.status === "active";

                return (
                    <div
                        key={subject.id}
                        className={`flex justify-between items-center p-4 rounded-xl transition backdrop-blur-md border border-white/10
                        ${isClosed ? "bg-white/5 opacity-60" : "bg-white/10 hover:bg-white/20"}`}
                    >

                        <div>
                            <p className={`font-semibold text-lg ${isClosed ? "line-through text-gray-500" : ""}`}>
                                {subject.name}
                            </p>

                            <p className="text-sm text-gray-400">
                                {subject.courseCode}
                            </p>

                            {isActive && (
                                <p className="text-green-400 text-xs mt-1">
                                    Active Session
                                </p>
                            )}

                            {isClosed && (
                                <p className="text-red-400 text-xs mt-1">
                                    Session Closed
                                </p>
                            )}
                        </div>

                        {!isClosed && (
                            <button
                                onClick={async () => {
                                    setLoadingId(subject.id);
                                    await onStartSession(subject.id);
                                    setLoadingId(null);
                                }}
                                className="px-4 py-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-500 text-white text-sm font-medium hover:scale-105 transition-all duration-200"
                            >
                                {loadingId === subject.id ? "Starting..." : "Start Session"}
                            </button>
                        )}

                    </div>
                );
            })}

        </div>

    );
}