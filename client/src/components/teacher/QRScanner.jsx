import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";
import api from "../../services/api";

export default function QRScanner({ sessionId }) {

    const scannerRef = useRef(null);

    useEffect(() => {

        let isMounted = true;
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const startScanner = async () => {
            try {
                // 🔍 Get all cameras
                const devices = await Html5Qrcode.getCameras();

                if (!devices || devices.length === 0) {
                    console.error("No camera found");
                    return;
                }

                let cameraId;

                // 📱 Prefer back camera on mobile
                const backCamera = devices.find(device =>
                    device.label.toLowerCase().includes("back") ||
                    device.label.toLowerCase().includes("rear") ||
                    device.label.toLowerCase().includes("environment")
                );

                if (backCamera) {
                    cameraId = backCamera.id;
                } else {
                    cameraId = devices[0].id;
                }

                await html5QrCode.start(
                    cameraId,
                    {
                        fps: 10,
                        qrbox: 250,
                        aspectRatio: 1.777
                    },
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

                            await html5QrCode.stop();
                        } catch (err) {
                            alert("Invalid QR or already marked");
                        }
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
            isMounted = false;
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

        </div>
    );
}