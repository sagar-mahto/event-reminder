import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-gray-800 flex flex-col overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative flex-1 flex items-center justify-center px-4 sm:px-6 py-20">
        {/* soft animated blobs */}
        <div className="absolute w-72 h-72 bg-indigo-300/40 rounded-full blur-3xl top-10 left-10 animate-pulse" />
        <div className="absolute w-72 h-72 bg-blue-300/40 rounded-full blur-3xl bottom-10 right-10 animate-pulse delay-200" />

        <div className="relative z-10 text-center max-w-4xl animate-fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Never Miss <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              An Important Event
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Plan smarter, stay organized, and get reminded at the perfect time.
            Your daily life — simplified.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-10 py-4 rounded-xl font-semibold text-white
                bg-gradient-to-r from-indigo-500 to-blue-500
                transition-all duration-300
                hover:scale-105
                hover:shadow-xl"
            >
              🚀 Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 rounded-xl font-semibold
                border border-indigo-300
                text-indigo-600
                bg-white
                transition-all duration-300
                hover:bg-indigo-50
                hover:scale-105"
            >
              🔐 Login
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 sm:px-6 lg:px-10 py-20">
        <h3 className="text-3xl font-bold text-center mb-14">
          Why You’ll Love It 💙
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Feature
            title="📅 Easy Event Planning"
            desc="Create events in seconds with a clean, simple interface."
          />
          <Feature
            title="⏰ Smart Reminders"
            desc="Get notified exactly when you need — no stress, no misses."
          />
          <Feature
            title="⚡ Full Control"
            desc="Edit, delete, and manage events anytime, anywhere."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">
          Ready to stay organized?
        </h3>
        <p className="mb-8 text-indigo-100">
          Join thousands who never miss an event again.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="px-10 py-4 rounded-xl font-semibold bg-white text-indigo-600
            transition-all duration-300
            hover:scale-105 hover:shadow-lg"
        >
          Start Free Today
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} EventReminder — Built with MERN by Sagar Mahto⚡
      </footer>
    </div>
  );
};

const Feature = ({ title, desc }) => (
  <div className="group relative rounded-2xl bg-white/70 backdrop-blur-xl border border-indigo-100
    p-8 transition-all duration-300
    hover:-translate-y-3 hover:shadow-2xl">

    <h4 className="text-xl font-bold mb-3 text-indigo-600">
      {title}
    </h4>

    <p className="text-gray-600">
      {desc}
    </p>
  </div>
);

export default Home;
