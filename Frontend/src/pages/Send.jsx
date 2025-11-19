import React, { useState } from 'react';
import { motion } from 'framer-motion'
export default function Send(){
    const [mode, setmode] = useState("text")
    const [file, setFile] = useState(null)
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false); // Demo
    const [progress, setProgress] = useState(0); // Demo percentage


    const handleDrop = (e) => {
        e.preventDefault()
        const uploaded = e.dataTransfer.files[0]
        if(uploaded){
            setFile(uploaded)
            setText("")
        }
    }
    const handleDragOver = (e) => {e.preventDefault()}

    // Sending Text to backend
    const Sendtext = async() => {
        try{
            const res = await fetch("http://localhost:3000/api/send", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({ text })
            })
            if(!res.ok) throw new Error("Failed to send the data")
        } catch(error){
            console.error("Error:", error.message)
        }
    }
    
    

    return(
        <div className="flex items-center justify-center w-full mt-10">
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-3xl w-full backdrop-blur-xl bg-white/60 rounded-2xl border border-white/30 shadow-lg shadow-black/10 p-6"
            >

                <h2 className="text-xl font-semibold text-black mb-4">
                    Share your text, files & images instantly
                </h2>

                <div className="bg-[#F5F4EF] h-[45vh] rounded-xl border border-[#4A70A9]/40 p-5 shadow-inner">
                    <div className="w-full h-45 mb-4">
                        {mode === "text" && (
                            <textarea
                                className="w-full h-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#4A70A9] bg-white/70 shadow-sm resize-none overflow-y-scroll scrollbar-hide"
                                placeholder="Type your message..."
                                onChange={(e)=>{setText(e.target.value)}}
                            ></textarea>
                        )}

                        {(mode === "file" || mode === "image") && (
                            <div className="w-full h-full">
                                <input 
                                type="file"
                                accept={mode === "image" ? "image/*" : "*"}
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                                id="fileInput"
                                />
                                {/* DRAG & DROP */}
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="w-full h-full border-2 border-dashed rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center cursor-pointer"
                                    onClick={() => document.getElementById("fileInput").click()}
                                >
                                    {file ? (
                                    <p className="text-xl text-green-600 text-center">Selected: {file.name}</p>
                                    ) : (
                                    <p className="text-xl text-gray-500 text-center">
                                        Drag & Drop your {mode === "image" ? "image" : "file"} here
                                    </p>
                                    )}
                                </div>
                            </div>
                            
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                        onClick={() => setmode("file")}
                        className={`px-5 py-2 rounded-xl shadow-sm hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-[#8FABD4] transition duration-300 ease-in-out" 
                                ${mode === "file" ? "bg-[#4A70A9] text-white" : "bg-white text-gray-700"}`}
                        >
                        Files
                        </button>

                        <button
                        onClick={() => setmode("text")}
                        className={`px-5 py-2 rounded-xl shadow-sm hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-[#8FABD4] transition duration-300 ease-in-out
                                ${mode === "text" ? "bg-[#4A70A9] text-white" : "bg-white text-gray-700"}`}
                        >
                        Text
                        </button>

                        <button
                        onClick={() => setmode("image")}
                        className={`px-5 py-2 rounded-xl shadow-sm hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-[#8FABD4] transition duration-300 ease-in-out" 
                                ${mode === "image" ? "bg-[#4A70A9] text-white" : "bg-white text-gray-700"}`}
                        >
                        Images
                        </button>
                    </div>

                </div>

                <div className="flex justify-end mt-5">
                    <button
                    type="submit"
                    onClick={Sendtext}
                    className="px-6 py-3 bg-[#4A70A9] text-white font-medium rounded-xl shadow-md hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-800/20 transition duration-300 ease-in-out"
                    >
                   Send
                    </button>
                </div>

            </motion.div>

        </div>

    )
}