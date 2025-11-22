import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Send from './pages/Send.jsx'
import Receive from './pages/Receive.jsx'
import { Toaster } from "react-hot-toast";
import { Routes, Route } from 'react-router-dom'

export default function App(){
  return (
  <>
  <Toaster position="top-right" />
  <Navbar/>
  <div className="pt-20">
    <Routes>
      <Route path="/" element={<Send />} />
      <Route path="/receive" element={<Receive />} />
    </Routes>
  </div>
  </>
  )
}

