import userModel from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} from "../services/emailService.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// Generate a random 6-digit OTP
// const generateOTP = () =>{
//     return Math.floor(100000 + Math.random() * 900000).toString();
// }
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Verify Email OTP
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate inputs
    if (!email || !validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please provide a valid email",
      });
    }
    if (!otp || otp.length !== 6) {
      return res.json({
        success: false,
        message: "Please provide a valid 6-digit OTP",
      });
    }

    // Find user with matching email and OTP
    const user = await userModel.findOne({
      email,
      emailVerificationOTP: otp,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Update user as verified and clear OTP
    await userModel.findByIdAndUpdate(user._id, {
      isEmailVerified: true,
      emailVerificationOTP: undefined,
      emailVerificationExpires: undefined,
    });

    // Generate JWT token for the verified user
    const token = createToken(user._id);
    res.json({
      success: true,
      message: "Email verified successfully!",
      token,
    });
  } catch (error) {
    console.error("Error in email verification:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Resend Verification OTP
const resendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please provide a valid email",
      });
    }

    // Find unverified user
    const user = await userModel.findOne({ email, isEmailVerified: false });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found or already verified",
      });
    }

    // Generate new OTP
    const verificationOTP = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await userModel.findByIdAndUpdate(user._id, {
      emailVerificationOTP: verificationOTP,
      emailVerificationExpires: otpExpires,
    });

    // Send new verification email
    const emailResult = await sendVerificationEmail(
      email,
      user.name,
      verificationOTP
    );

    if (emailResult.success) {
      res.json({
        success: true,
        message: "New verification code sent to your email",
      });
    } else {
      res.json({
        success: false,
        message: "Failed to send verification email",
      });
    }
  } catch (error) {
    console.error("Error in resending verification OTP:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please provide a valid email",
      });
    }

    // For existing users, don't require email verification for password reset
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP and expiry in user model
    await userModel.findByIdAndUpdate(user._id, {
      resetOTP: otp,
      resetOTPExpires: expires,
    });

    // Send OTP to email via sendGrid
    const emailResult = await sendForgotPasswordEmail(email, user.name, otp);
    if (emailResult.success) {
      return res.json({
        success: true,
        message: "Password reset OTP sent to your email",
      });
    } else {
      return res.json({ success: false, message: "Failed to send OTP email" });
    }
  } catch (err) {
    console.error("Error in sending forgot password email:", err);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Reset Password with OTP
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate inputs
    if (!email || !otp || !newPassword) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Find user with OTP
    const user = await userModel.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP
    await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetOTP: undefined,
      resetOTPExpires: undefined,
    });

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Route for user login - Allow login for both old and new users
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if this is a new user who needs email verification
    if (user.hasOwnProperty("isEmailVerified") && !user.isEmailVerified) {
      return res.json({
        success: false,
        message: "Please verify your email before logging in",
        requiresVerification: true,
        email: email,
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration - Only new users need email verification
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      if (
        existingUser.hasOwnProperty("isEmailVerified") &&
        !existingUser.isEmailVerified
      ) {
        // User exists but email not verified - resend verification
        const verificationOTP = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await userModel.findByIdAndUpdate(existingUser._id, {
          emailVerificationOTP: verificationOTP,
          emailVerificationExpires: otpExpires,
        });

        const emailResult = await sendVerificationEmail(
          email,
          existingUser.name,
          verificationOTP
        );

        if (emailResult.success) {
          return res.json({
            success: true,
            message: "Verification code resent to your email",
            requiresVerification: true,
          });
        } else {
          return res.json({
            success: false,
            message: "Failed to send verification email",
          });
        }
      } else {
        return res.json({ success: false, message: "User already exists" });
      }
    }

    // Validate email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP for email verification
    const verificationOTP = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user (unverified) - New users need email verification
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationOTP: verificationOTP,
      emailVerificationExpires: otpExpires,
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      name,
      verificationOTP
    );

    if (emailResult.success) {
      res.json({
        success: true,
        message:
          "Account created! Please check your email for verification code.",
        requiresVerification: true,
      });
    } else {
      // If email sending fails, delete the user
      await userModel.findByIdAndDelete(newUser._id);
      res.json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error in user registration:", error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if admin credentials are correct
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate JWT token for admin
      // const token = jwt.sign(email+password,process.env.JWT_SECRET);
      const token = createToken(email + password);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  verifyEmail,
  resendVerificationOTP,
  forgotPassword,
  resetPassword,
};
