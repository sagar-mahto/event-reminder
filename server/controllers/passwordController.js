import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import transporter from "../config/mailer.js";

/* ================= SEND RESET OTP ================= */
// authController.js
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If user exists, OTP sent" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP: ${otp}</h2><p>Valid for 5 minutes</p>`
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= VERIFY RESET OTP ================= */
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP verified, allow reset
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
