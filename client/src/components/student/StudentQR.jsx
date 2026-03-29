export default function StudentQR({ qr }) {
    return (
        <div className="flex justify-center items-center mt-8 px-4">

            <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 w-full max-w-sm text-center">

                <h3 className="text-xl font-semibold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Your QR Code
                </h3>

                <div className="bg-white p-4 rounded-xl shadow-inner flex justify-center items-center">
                    <img
                        src={qr}
                        alt="Student QR Code"
                        className="w-48 h-48 object-contain"
                    />
                </div>

                <p className="text-sm text-gray-300 mt-4">
                    Scan this QR for attendance
                </p>

            </div>

        </div>
    );
}