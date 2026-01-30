import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const otpRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= SEND OTP ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return alert("Email is required");

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "OTP sent to email");
      setStep(2);
    } catch (error) {
      setMessage("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      return setMessage("Enter complete 4-digit OTP");
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/verify-reset-otp", {
        email,
        otp: otpValue,
      });

      // ✅ redirect with token
      navigate(`/reset-password/${res.data.resetToken}`);
    } catch (error) {
      setMessage("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP INPUT ================= */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

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

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-indigo-50 via-blue-50 to-white px-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md
        border border-indigo-100">

        <h2 className="text-3xl font-bold text-center
          text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
          {step === 1 ? "Forgot Password" : "Verify OTP"}
        </h2>

        <p className="text-center text-gray-500 mt-2">
          {step === 1
            ? "Enter your email to receive OTP"
            : "Enter the 4-digit OTP sent to your email"}
        </p>

        {message && (
          <p className="text-center text-sm text-indigo-600 mt-4">
            {message}
          </p>
        )}

        {/* STEP 1 – EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border
                  focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white
                bg-gradient-to-r from-indigo-500 to-blue-500
                transition hover:scale-[1.02]">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 – OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  value={digit}
                  maxLength="1"
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-14 h-14 text-center text-xl font-bold
                    border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>

            <button
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white
                bg-gradient-to-r from-indigo-500 to-blue-500
                transition hover:scale-[1.02]">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
