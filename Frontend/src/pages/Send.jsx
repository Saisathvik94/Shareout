import React, { useState } from 'react';
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react';
import { setWithTTL } from '../utils/localStorageTTl';
import { getWithTTL } from '../utils/localStorageTTl';
export default function Send(){
    const [mode, setmode] = useState("text")
    const [file, setFile] = useState(null)
    const [text, setText] = useState("")
    const [Otp, setOtp] = useState("")
    const [retryAfter, setRetryAfter] = useState(0)
    const [loading, setLoading] = useState(false); // Demo
    const [progress, setProgress] = useState(0); // Demo percentage

    // Handle Ratelimit timer effect
    useEffect(()=>{
      if(retryAfter <=0) return;

      const timer = setInterval(() => {
        setRetryAfter(prev => prev - 1)
      }, 1000);
      return ()=> clearInterval(timer);
    }, [retryAfter])

    // Load important useStates In Local Storage with a Time period of 2 minutes after Send
    useEffect(() => {
        const savedOtp = getWithTTL("lastotp");
        const savedtext = getWithTTL("lastText")

        if (savedOtp) setOtp(savedOtp);
        if (savedtext) setText(savedtext)
    }, []);

    // Handle Drop drop for files
    const handleDrop = (e) => {
        e.preventDefault()
        const uploaded = e.dataTransfer.files[0]
        if(uploaded){
            setFile(uploaded)
            setText("")
        }
    }
    const handleDragOver = (e) => {e.preventDefault()}

    // Sending data to backend
    const SendData = async() => {
      try{
        if(mode === "text"){
          if (!text || text.trim() === "") {
            toast("Please enter a message before sending.");
            return;
          }
        }
        else if(mode==="file" || mode === "image"){
          if(!file){
            toast("Please upload a file to send")
            return
          }
        }
        let res;
        if(mode === "text"){
          res = await fetch("http://localhost:3000/api/send", {
              method: "POST",
              headers: {"Content-type": "application/json"},
              body: JSON.stringify({ type:"text", text })
          })
        }
        else{
          const formdata = new FormData()
          formdata.append("type", mode)
          formdata.append("file", file)
          res = await fetch("http://localhost:3000/api/send", {
              method: "POST",
              body: formdata,
          })

        }
        // If rate limited
        if (res.status === 429) {
            const data = await res.json();
            const retryAfter = data.retryAfter;
            setRetryAfter(retryAfter);
            toast.error(`Rate Limit! Try again in ${retryAfter}s`);
            return;
        }
        const data = await res.json();
        if (!data.success) {
          toast.error("Failed to send the data");
        } 
        else{
          setOtp(data.otp);
          toast.success("Sent Successfully ")
          // Load important useStates In Local Storage with a Time period of 2 minutes after Send
          setWithTTL("lastotp", data.otp, 120);
          setWithTTL("lastText", text, 120)
        }           

      } catch (error){
        console.error("Error:", error.message);
      }
    }
    
    

    return(
        <div className="flex items-center justify-center w-full mt-10 px-3 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="
              w-full 
              max-w-lg sm:max-w-2xl lg:max-w-3xl
              backdrop-blur-xl bg-white/60 
              rounded-2xl border border-white/30 
              shadow-lg shadow-black/10 
              p-4 sm:p-6 
              relative
            "
          >
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4 text-center sm:text-left">
              Share your text, files & images instantly
            </h2>

            {/* Main input container */}
            <div className="
              bg-[#F5F4EF] 
              h-[50vh] sm:h-[45vh] 
              rounded-xl 
              border border-[#4A70A9]/40 
              p-4 sm:p-5 
              shadow-inner
              flex flex-col
            ">
              {/* Content Box */}
              <div className="flex-1 mb-4">
                {mode === "text" && (
                  <textarea
                    className="
                      w-full h-full p-3 sm:p-4 
                      rounded-xl border border-gray-300 
                      outline-none focus:ring-2 focus:ring-[#4A70A9] 
                      bg-white/70 shadow-sm 
                      resize-none overflow-y-scroll scrollbar-hide
                    "
                    placeholder="Type your message..."
                    onChange={(e) => setText(e.target.value)}
                    value={text}
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

                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => document.getElementById("fileInput").click()}
                      className="
                        w-full h-full 
                        border-2 border-dashed 
                        rounded-xl p-4 sm:p-6 
                        text-center 
                        bg-gray-50 hover:bg-gray-100 
                        transition 
                        flex items-center justify-center 
                        cursor-pointer
                      "
                    >
                      {file ? (
                        <p className="text-lg sm:text-xl text-green-600 text-center">
                          Selected: {file.name}
                        </p>
                      ) : (
                        <p className="text-lg sm:text-xl text-gray-500 text-center">
                          Drag & Drop your {mode === "image" ? "image" : "file"} here
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mode Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => setmode("file")}
                  className={`px-5 py-2 rounded-xl shadow-sm hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-[#8FABD4] transition duration-300 ease-in-out
                    ${mode === "file" ? "bg-[#4A70A9] text-white" : "bg-white text-gray-700"}
                  `}
                >
                  Files
                </button>

                <button
                  onClick={() => setmode("text")}
                  className={`px-5 py-2 rounded-xl shadow-sm hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-[#8FABD4] transition duration-300 ease-in-out
                    ${mode === "text" ? "bg-[#4A70A9] text-white" : "bg-white text-gray-700"}
                  `}
                >
                  Text
                </button>

                <button
                  onClick={() => setmode("image")}
                  className={`px-5 py-2 rounded-xl shadow-sm hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-[#8FABD4] transition duration-300 ease-in-out
                    ${mode === "image" ? "bg-[#4A70A9] text-white" : "bg-white text-gray-700"}
                  `}
                >
                  Images
                </button>
              </div>
            </div>

            {/* Send button */}
            <div className="flex justify-center sm:justify-end mt-5">
              <button
              disabled={retryAfter > 0}
              onClick={SendData}
              className={`px-5 sm:px-6 py-3 bg-[#4A70A9] text-white font-medium rounded-xl shadow-md
                  hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-800/20 
                  transition duration-300 ease-in-out
                  w-full sm:w-auto
              ${retryAfter > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#4A70A9]"}
              `}
              >
              {retryAfter > 0 ? `Wait ${retryAfter}s` : "Send"}
              </button>
              
            </div>
            {/* OTP popup (mobile friendly) */}
            {Otp && (
              <div className="
                absolute 
                top-3 right-3 
                bg-green-100 border border-green-300 
                rounded-lg text-green-800 
                px-3 py-2 
                text-sm sm:text-base
                shadow-lg animate-fadeIn
              ">
                <strong>OTP:</strong> {Otp}
              </div>
            )}
          </motion.div>
        </div>

    )
}