import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom"

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#EFECE3] z-50">
      <div className="max-w-6xl md:w-1/2 mx-auto mt-4 h-16 px-6 flex items-center justify-between rounded-2xl bg-[#4A70A9]/20 backdrop-blur-xl border border-white/30 shadow-lg shadow-black/5">
        {/* Logo */}
        <div className="text-2xl font-bold">ShareOut</div>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/send">Send</Link>
          <Link to="/receive">Receive</Link>
          <Link to="/works">How it Works?</Link>
        </ul>

        {/* Mobile button */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col gap-6 p-6 font-medium">
            <Link to="/send">Send</Link>
            <Link to="/receive">Receive</Link>
            <Link to="/works">How it Works?</Link>
          </ul>
        </div>
      )}
    </nav>
  );
}

