import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔢 4-digit OTP
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const otpRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    }
  }, [step]);

  /* ================= SEND OTP ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/send-otp", {
        name,
        email,
        password,
      });

      if (res.data?.success) {
        setStep(2);
        setOtp(new Array(4).fill(""));
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message ||
          "Failed to send OTP. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setErrorMsg("Enter complete 4-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/verify-otp", {
        email,
        otp: otpValue,
      });

      if (res.data?.success) {
        navigate("/login");
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP HANDLERS ================= */
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 4);

    if (!/^\d{4}$/.test(pasted)) return;

    const newOtp = pasted.split("");
    setOtp(newOtp);
    otpRefs.current[3]?.focus();
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* LEFT */}
      <div className="md:w-1/2 w-full flex items-center justify-center
        bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[55%]
          bg-white p-8 rounded-2xl shadow-lg border border-indigo-100">

          <h2 className="text-3xl font-bold text-center
            text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h2>

          <p className="text-center text-gray-500 mt-1">
            {step === 1
              ? "Sign up to get started"
              : "Enter the 4-digit OTP sent to your email"}
          </p>

          {errorMsg && (
            <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form className="mt-6 space-y-5" onSubmit={handleSendOtp}>
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border
                  focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border
                  focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border
                  focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <button
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white
                  bg-gradient-to-r from-indigo-500 to-blue-500
                  transition-all duration-300
                  ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:scale-[1.02] hover:shadow-lg"
                  }`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2 – OTP */}
          {step === 2 && (
            <form className="mt-6 space-y-6" onSubmit={handleVerifyOtp}>
              <div
                className="flex justify-center gap-3"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-14 h-14 text-center text-xl font-bold
                      rounded-lg border
                      focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                ))}
              </div>

              <button
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white
                  bg-gradient-to-r from-indigo-500 to-blue-500
                  transition-all duration-300
                  ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:scale-[1.02] hover:shadow-lg"
                  }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Didn&apos;t get OTP?{" "}
                <span
                  onClick={() => !loading && setStep(1)}
                  className="text-indigo-600 font-semibold cursor-pointer hover:underline"
                >
                  Resend
                </span>
              </p>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="md:w-1/2 w-full
        bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700
        flex flex-col items-center justify-center px-8 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold">
          Join Us!
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 mt-4 max-w-md">
          Create your account and manage all your events effortlessly.
        </p>
      </div>
    </div>
  );
};

export default Signup;
