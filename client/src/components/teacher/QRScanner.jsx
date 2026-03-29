import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import api from "../../services/api";

export default function QRScanner({ sessionId }) {

    useEffect(() => {

        let scanner;

        const startScanner = () => {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: 250 },
                false
            );

            scanner.render(
                async (decodedText) => {
                    try {
                        const data = JSON.parse(decodedText);

                        const token = localStorage.getItem("token");

                        await api.post(
                            "/api/attendance/scan",
                            {
                                studentId: data.studentId,
                                sessionId
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        alert("Attendance marked ✅");

                        scanner.clear();

                    } catch (err) {
                        alert("Invalid QR or already marked");
                    }
                },
                (error) => {
                }
            );
        };

        startScanner();

        return () => {
            if (scanner) {
                scanner.clear().catch(() => { });
            }
        };

    }, [sessionId]);

    return (

        <div className="flex flex-col items-center">

            <h3 className="text-lg font-semibold mb-4">
                Scan QR for Attendance
            </h3>

            <div className="bg-white p-4 rounded-xl shadow-inner">
                <div id="reader" className="w-62.5" />
            </div>

        </div>

    );

}