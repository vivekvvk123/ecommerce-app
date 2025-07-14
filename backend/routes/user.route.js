import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  verifyEmail,
  resendVerificationOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend-verification", resendVerificationOTP);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
