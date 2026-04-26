import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import api from "../../services/api";

export default function QRScanner({ sessionId }) {

    const scannerRef = useRef(null);
    const lastScannedRef = useRef(null);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const startScanner = async () => {
            try {
                const devices = await Html5Qrcode.getCameras();

                if (!devices || devices.length === 0) {
                    console.error("No camera found");
                    return;
                }

                const backCamera = devices.find(device =>
                    device.label.toLowerCase().includes("back") ||
                    device.label.toLowerCase().includes("rear") ||
                    device.label.toLowerCase().includes("environment")
                );

                const cameraId = backCamera ? backCamera.id : devices[0].id;

                await html5QrCode.start(
                    cameraId,
                    {
                        fps: 10,
                        qrbox: 250,
                        aspectRatio: 1.777
                    },
                    async (decodedText) => {

                        if (decodedText === lastScannedRef.current) return;
                        lastScannedRef.current = decodedText;

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

                            setMessage("✅ Attendance marked");

                        } catch (err) {
                            setMessage("❌ Already marked / invalid QR");
                        }

                        setTimeout(() => {
                            lastScannedRef.current = null;
                            setMessage("");
                        }, 2000);
                    },
                    () => {

                    }
                );

            } catch (err) {
                console.error("Camera start error:", err);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { });
            }
        };

    }, [sessionId]);

    return (
        <div className="flex flex-col items-center">

            <h3 className="text-lg font-semibold mb-4">
                Scan QR for Attendance
            </h3>

            <div className="bg-white p-4 rounded-xl shadow-inner">
                <div id="reader" className="w-75" />
            </div>
            {message && (
                <p className="mt-4 text-sm text-white">
                    {message}
                </p>
            )}

        </div>
    );
}