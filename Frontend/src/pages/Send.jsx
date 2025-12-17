import React, { useState } from 'react';
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react';
import { setWithTTL } from '../utils/localStorageTTl';
import { getWithTTL } from '../utils/localStorageTTl';
export default function Send(){
    const [mode, setmode] = useState("text")
    const [file, setFile] = useState(null)
    const [mediafile, setMediaFile] = useState(null)
    const [text, setText] = useState("")
    const [Otp, setOtp] = useState("")
    const [retryAfter, setRetryAfter] = useState(0)
    const [loading, setLoading] = useState(false); // Demo
    const [progress, setProgress] = useState(0); // Demo percentage

    const API = import.meta.env.VITE_API_URL;

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
            toast("Please enter a message before sending.", {duration: 3000});
            return;
          }
        }
        else if(mode==="file"){
          if(!file){
            toast("Please upload a file to send", {duration: 3000})
            return
          }
        }
        else if(mode=="media"){
          if(!mediafile){
            toast("Please upload a media file to send", {duration:3000})
            return
          }
        }
        let res;
        if(mode === "text"){
          res = await fetch(`${API}/api/send`, {
              method: "POST",
              headers: {"Content-type": "application/json"},
              body: JSON.stringify({ type:"text", text })
          })
        }
        else if(mode=="file"){
          const formdata = new FormData()
          formdata.append("type", mode)
          formdata.append("file", file)
          res = await fetch(`${API}/api/send`, {
              method: "POST",
              body: formdata,
          })

        }
        else if(mode=="media"){
          const formdata = new FormData()
          formdata.append("type", mode)
          formdata.append("file", mediafile)
          res = await fetch(`${API}/api/send`, {
              method: "POST",
              body: formdata,
          })

        }
        // If rate limited
        if (res.status === 429) {
            const data = await res.json();
            const retryAfter = data.retryAfter;
            setRetryAfter(retryAfter);
            toast.error(`Rate Limit! Try again in ${retryAfter}s`, {duration: 3000});
            return;
        }
        const data = await res.json();
        if (!data.success) {
          toast.error("Failed to send the data", {duration: 3000});
        } 
        
        else{
          setOtp(data.otp);
          toast.success("Sent Successfully ")
          // Store important useStates In Local Storage with a Time period of 2 minutes after Send
          setWithTTL("lastotp", data.otp, 120);
          setWithTTL("lastText", text, 120)
        }           

      } catch (error){  
        toast.error(`Error: ${error.message}`, {duration: 3000});
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
              backdrop-blur-xl bg-[#000B58]/20
              rounded-2xl border border-white/20 
              shadow-lg shadow-black/10 
              p-4 sm:p-6 
              relative
            "
          >
            <h2 className="text-xl sm:text-xl font-semibold text-[#F5F5DC] mb-3 sm:mb-4 text-left">
              Share your text, files & images instantly
            </h2>

            {/* Main input container */}
            <div className="
              bg-[#003161]/10
              h-[50vh] sm:h-[45vh] 
              rounded-xl 
              border border-white/30 
              p-4 sm:p-5 
              shadow-inner
              flex flex-col
            ">
              
              <div className="flex-1 mb-4">
                {mode === "text" && (
                  <textarea
                    className="
                      w-full h-full p-3 sm:p-4 
                      rounded-xl border border-gray-300 
                      outline-none text-[#F5F5DC]
                      shadow-sm 
                      resize-none overflow-y-scroll scrollbar-hide
                      text-lg
                    "
                    placeholder="Type your message..."
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                  ></textarea>
                )}

                {(mode === "file") && (
                  <div className="w-full h-full">
                    <input
                      type="file"
                      accept={".pdf,.doc,.docx,.xls,.xlsx,.csv,.zip"}
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
                        bg-gray-50 hover:bg-gray-300 
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
                          Drag & Drop your Files here
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {(mode === "media") && (
                  <div className="w-full h-full">
                    <input
                      type="file"
                      accept={"image/*,video/*"}
                      onChange={(e) => setMediaFile(e.target.files[0])}
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
                        bg-gray-50 hover:bg-gray-300 
                        transition 
                        flex items-center justify-center 
                        cursor-pointer
                      "
                    >
                      {mediafile ? (
                        <p className="text-lg sm:text-xl text-green-600 text-center">
                          Selected: {mediafile.name}
                        </p>
                      ) : (
                        <p className="text-lg sm:text-xl text-gray-500 text-center">
                          Drag & Drop your Media files here
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
                   className={`
                    px-4 py-2 rounded-xl font-medium
                    border border-white/20 backdrop-blur-xl
                    shadow-md shadow-black/20
                    transition-all duration-300 ease-in-out
                    ${mode === "file" 
                      ? "bg-[#4A70A9] text-[#F5F5DC] shadow-lg shadow-blue-500/30" 
                      : "bg-white/30 text-[#F5F5DC] hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/20"}
                  `}
                >
                  Files
                </button>

                <button
                  onClick={() => setmode("text")}
                  className={`px-4 py-2 rounded-xl font-medium
                    border border-white/20 backdrop-blur-xl
                    shadow-md shadow-black/20
                    transition-all duration-300 ease-in-out
                    ${mode === "text" 
                      ? "bg-[#4A70A9] text-[#F5F5DC] shadow-lg shadow-blue-500/30" 
                      : "bg-white/30 text-[#F5F5DC] hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/20"}
                  `}
                >
                  Text
                </button>

                <button
                  onClick={() => setmode("media")}
                  className={`px-4 py-2 rounded-xl font-medium
                    border border-white/20 backdrop-blur-xl
                    shadow-md shadow-black/20
                    transition-all duration-300 ease-in-out
                    ${mode === "media" 
                      ? "bg-[#4A70A9] text-[#F5F5DC] shadow-lg shadow-blue-500/30" 
                      : "bg-white/30 text-[#F5F5DC] hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/20"}
                  `}
                >
                  Media
                </button>
              </div>
            </div>

            {/* Send button */}
            <div className="flex items-center justify-between mt-5">
              <div className='flex items-center'>
                <button
                  type="button"
                  onClick={() => window.open("https://github.com/Saisathvik94/Shareout", "_blank", "noopener,noreferrer")}
                  className="
                    group
                    w-12 h-12 mr-2
                    flex items-center justify-center
                    rounded-full
                    bg-[#0d1117]
                    hover:bg-[#161b22]
                    shadow-md hover:shadow-lg
                    transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  "
                >
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="
                    w-5 h-5 sm:w-6 sm:h-6
                    text-white
                    transition-transform duration-200
                    group-hover:scale-110
                  "
                  role="img"
                  aria-hidden="true"
                >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483
                      0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608
                      1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832
                      .091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951
                      0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65
                      0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004
                      1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025
                      .546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688
                      0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852
                      0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481
                      C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"
                    />
                  </svg>
                </button>
                {/* OTP popup*/}
                {Otp && (
                  <div 
                  className="
                    bg-green-100 border border-green-300 
                    rounded-lg text-green-800 
                    px-3 py-2 font-sans
                    text-sm sm:text-base
                    shadow-lg animate-fadeIn
                  ">
                    <strong>OTP:</strong> {Otp}
                  </div>
                )}
              </div>
              
              <button
              disabled={retryAfter > 0}
              onClick={SendData}
              className={`px-5 sm:px-6 py-3
              text-white font-medium rounded-xl
              transition duration-300 ease-in-out
              sm:w-auto
              ${retryAfter > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#4A70A9] hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-800/20 cursor-pointer"}
              `}
              >
              {retryAfter > 0 ? `Wait ${retryAfter}s` : "Send"}
              </button>
              
            </div>
            
          </motion.div>
        </div>

    )
}