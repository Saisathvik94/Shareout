import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Send from './pages/Send.jsx'
import Receive from './pages/Receive.jsx'
import { Toaster } from "react-hot-toast";
import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react';
import Galaxy from './components/GalaxyBackground.jsx';


export default function App(){
  return (
  <>
  <div className="fixed inset-0 pointer-events-none bg-black">
    <Galaxy 
      mouseInteraction
      mouseRepulsion
      density={1.4}
      glowIntensity={0.45}
      saturation={0.75}
      hueShift={230}
    />
  </div>

  <Toaster position="top-right" />
  <div className="relative z-10">
    <Navbar />

    <div className="pt-20">
      <Routes>
        <Route path="/" element={<Send />} />
        <Route path="/receive" element={<Receive />} />
      </Routes>
    </div>
  </div>
  <Analytics />
  
  </>
  )
}

