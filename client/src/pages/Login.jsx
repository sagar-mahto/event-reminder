import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/login", { email, password });
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* LEFT – FORM */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[55%] bg-white p-8 rounded-2xl shadow-lg border border-indigo-100">
          <h2 className="text-3xl font-bold text-center
            text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 mt-1">
            Login to continue
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full mt-1 px-4 py-3 rounded-lg border
                  focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                  outline-none disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full mt-1 px-4 py-3 rounded-lg border
                  focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                  outline-none disabled:opacity-60"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm text-gray-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-indigo-600"
                  disabled={loading}
                />
                Remember me
              </label>
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                Forgot password?
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white
                bg-gradient-to-r from-indigo-500 to-blue-500
                transition-all duration-300
                ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:scale-[1.02] hover:shadow-lg"
                }`}
            >
              {loading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register */}
            <p className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <span
                onClick={() => !loading && navigate("/signup")}
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT – INFO */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700
        flex flex-col items-center justify-center px-8 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold">
          Welcome Back!
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 mt-4 max-w-md">
          Login to manage your events, reminders, and calendar — all in one place.
        </p>
      </div>
    </div>
  );
};

export default Login;
