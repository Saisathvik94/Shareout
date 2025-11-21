import React, { useState } from 'react';

export default function Receive(){
    const [Otp, setOtp] = useState("")
    const [isOtpVerifying, setisOtpVerifying ] = useState(false)

    const verifyOtp = async () => {
        setisOtpVerifying(true);

        try {
            const res = await fetch("http://localhost:3000/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp: Otp })
            });

            const data = await res.json();
            setisOtpVerifying(false);

            if (data.success) {
                alert("OTP Verified Successfully!\nData: " + JSON.stringify(data.data));
            } else {
                alert(data.message || "Invalid or expired OTP");
            }

        } catch (error) {
            console.error("Error:", error.message);
            setisOtpVerifying(false);
        }
    };

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    
            {/* Popup Box */}
            <div className="w-[90%] sm:w-[400px] bg-white rounded-2xl p-6 shadow-xl animate-scaleIn">
            
            {/* Header */}
            <div className="flex items-center mb-2">
                <svg
                className="mr-2 h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                >
                <path d="M12 2L3 7v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7l-9-5z" />
                </svg>
                <h2 className="text-xl font-semibold">OTP Verification</h2>
            </div>

            {/* OTP Input */}
            <label className="text-sm font-medium">Enter OTP</label>
            <input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={Otp}
                maxLength={4}
                onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                setOtp(value);
                }}
                className="w-full mt-1 p-3 text-center text-lg tracking-widest border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Buttons */}
            <div className="flex gap-3 mt-5">
                <button
                onClick={verifyOtp}
                disabled={Otp.length !== 4 || isOtpVerifying}
                className={`flex-1 py-2 rounded-lg text-white transition 
                ${Otp.length === 4 ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
                >
                {isOtpVerifying ? (
                    <div className="flex items-center justify-center gap-2">
                    <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    Verifying...
                    </div>
                ) : (
                    "Verify OTP"
                )}
                </button>
            </div>

            {/* Demo OTP */}
            <p className="text-center text-xs text-gray-500 mt-3">
                Demo OTP: <strong>123456</strong>
            </p>
            </div>
    </div>
        
    )
}