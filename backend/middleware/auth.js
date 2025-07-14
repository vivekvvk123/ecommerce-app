import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists and handle email verification for new users only
    const user = await userModel.findById(token_decode.id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Only check email verification for users who have this field (new users)
    if (user.hasOwnProperty("isEmailVerified") && !user.isEmailVerified) {
      return res.json({
        success: false,
        message: "Email not verified. Please verify your email.",
        requiresVerification: true,
      });
    }

    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
