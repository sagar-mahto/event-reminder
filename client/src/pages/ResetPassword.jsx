import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/auth/reset-password/${token}`, { password });

      // ✅ SUCCESS
      alert("Password reset successful 🎉");
      navigate("/"); // 👈 redirect to HOME
    } catch (err) {
      setError("Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-indigo-50 via-blue-50 to-white px-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md
        border border-indigo-100">

        <h2 className="text-3xl font-bold text-center
          text-transparent bg-clip-text
          bg-gradient-to-r from-indigo-600 to-blue-500">
          Reset Password
        </h2>

        {error && (
          <p className="text-center text-sm mt-4 text-red-500">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border
                focus:ring-2 focus:ring-indigo-400 outline-none
                disabled:opacity-60"
            />
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
