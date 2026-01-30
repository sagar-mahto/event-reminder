import express from "express";
import {
  sendOtp,
  verifyOtp,
  login,
  logout,
  me,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  forgotPassword,verifyResetOtp,
  resetPassword,
} from "../controllers/passwordController.js";

const router = express.Router();

// ================= AUTH =================
router.post("/send-otp", sendOtp);       // ✅ FIXED
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

// ================= USER =================
router.get("/me", authMiddleware, me);

// ================= PASSWORD RESET =================
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password/:token", resetPassword);
export default router;
