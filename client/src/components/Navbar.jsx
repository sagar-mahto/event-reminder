import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-extrabold cursor-pointer
              text-transparent bg-clip-text
              bg-gradient-to-r from-indigo-600 to-blue-500"
          >
            EventReminder
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <NavItem label="Home" onClick={() => navigate("/")} />
            <NavItem label="Features" />
            <NavItem label="Contact" />

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg font-semibold
                text-indigo-600 border border-indigo-300
                hover:bg-indigo-50 transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2 rounded-lg font-semibold text-white
                bg-gradient-to-r from-indigo-500 to-blue-500
                hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-indigo-50 transition"
          >
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-indigo-100">
          <div className="px-6 py-5 flex flex-col gap-4">
            <MobileItem label="Home" onClick={() => navigate("/")} />
            <MobileItem label="Features" />
            <MobileItem label="Contact" />

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-lg font-semibold
                text-indigo-600 border border-indigo-300"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="w-full py-3 rounded-lg font-semibold text-white
                bg-gradient-to-r from-indigo-500 to-blue-500"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ---------- COMPONENTS ---------- */

const NavItem = ({ label, onClick }) => (
  <span
    onClick={onClick}
    className="relative cursor-pointer font-medium text-gray-600
      hover:text-indigo-600 transition
      after:absolute after:left-0 after:-bottom-1
      after:w-0 after:h-[2px] after:bg-indigo-500
      after:transition-all hover:after:w-full"
  >
    {label}
  </span>
);

const MobileItem = ({ label, onClick }) => (
  <span
    onClick={onClick}
    className="font-medium text-gray-700 hover:text-indigo-600 transition cursor-pointer"
  >
    {label}
  </span>
);

export default Navbar;
