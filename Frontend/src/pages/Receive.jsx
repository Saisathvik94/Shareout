import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { getWithTTL } from '../utils/localStorageTTl';
import { setWithTTL } from '../utils/localStorageTTl';
export default function Receive(){
    const [Otp, setOtp] = useState("")
    const [isOtpVerifying, setisOtpVerifying ] = useState(false)
    const [ReceivedText, setReceivedText] = useState("")
    const [IsVerified, setIsVerified] = useState(false)
    const [copied, setCopied] = useState(false);

    const API = import.meta.env.VITE_API_URL;

    // handle Copy to clipboard
    const handleCopy = async () => {
        if (!ReceivedText) return;
        await navigator.clipboard.writeText(ReceivedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    // Verify OTP
    const verifyOtp = async () => {
        setisOtpVerifying(true);

        try {
            const res = await fetch(`${API}/api/receive`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp: Otp })
            });

            const data = await res.json();
            setisOtpVerifying(false);

            if (data.success) {
                setReceivedText(data.data);
                setIsVerified(true);
            } else {
                toast.error(data.message || "Invalid or expired OTP", {duration: 3000});
            }

        } catch (error) {
            toast.error(`Error:${error.message}`, {duration: 3000});
            setisOtpVerifying(false);
        }
    };
    return(
        <div>
            {!IsVerified ? (
            <div className="flex items-center justify-center w-full mt-10">
                {/* Popup Box */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-[90%] sm:w-[400px] text-[#F5F5DC] backdrop-blur-xl bg-[#000B58]/20 border border-white/20  rounded-2xl p-6 shadow-xl animate-scaleIn"
                >
                {/* Header */}
                <div className="flex items-center mb-2">
                    <svg
                    className="mr-2 h-6 w-6 text-[#000B58]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 25 25"
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
                    className="w-full mt-1 p-3 text-center text-lg tracking-widest border rounded-lg outline-none"
                />

                {/* Buttons */}
                <div className="flex gap-3 mt-5">
                    <button
                    onClick={verifyOtp}
                    disabled={Otp.length !== 4 || isOtpVerifying}
                    className={`flex-1 py-2 rounded-lg text-white transition
                    ${Otp.length === 4 ? "bg-[#4A70A9] hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-800/20 transition duration-300 ease-in-out cursor-pointer" : "bg-[#4A70A9]/50 cursor-not-allowed"}`}
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
                </motion.div>
                </div>
            ): (
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center w-full mt-10 gap-6 animate-scaleIn"
                >
                    {/* Copy Button */}
                    <button
                        disabled={copied}
                        onClick={handleCopy}
                        className={`px-5 py-2.5 rounded-xl shadow-md transition-all text-white
                            ${copied 
                                ? "bg-green-600 cursor-default" 
                                : "shadow-sm bg-[#4A70A9] cursor-pointer hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-[#8FABD4] transition duration-300 ease-in-out"
                            }
                        `}
                    >
                        {copied ? "Copied Successfully ✨" : "Copy to Clipboard"}
                    </button>

                    {/* Output Box */}
                    <div
                    className={`w-full sm:w-[500px] p-5 rounded-2xl
                        border border-white/20 text-[#F5F5DC] backdrop-blur-xl
                        shadow-lg transition-all
                        ${ReceivedText ? "opacity-100" : "opacity-60"}
                    `}
                    >
                        <p
                        contentEditable
                        suppressContentEditableWarning
                        className="text-[#F5F5DC] tracking-wide leading-relaxed whitespace-pre-wrap outline-none cursor-text"
                        onInput={(e) => {
                            ReceivedTextRef.current = e.currentTarget.innerText;
                        }}
                        >
                        {ReceivedText}
                        </p>
                    </div>
                </motion.div>

            )}
        </div>
        
    )
}