import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

function ForgotPassword() {
  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);

  const [step, setStep] = useState(1); // 1: email, 2: OTP & new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        { email }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setStep(2);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/reset-password`,
        {
          email,
          otp,
          newPassword,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Reset Password</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="w-full">
          <p className="text-gray-600 mb-4 text-center">
            Enter your email address and we'll send you a code to reset your
            password.
          </p>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-800 rounded-3xl"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-2 px-4 rounded-3xl text-white font-light transition-colors ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            } flex items-center justify-center gap-3`}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-white border-b-2"></div>
            )}
            Send Reset Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="w-full">
          <p className="text-gray-600 mb-4 text-center">
            Enter the 6-digit code sent to {email}
          </p>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-800 rounded-3xl text-center tracking-widest mb-3"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength="6"
            required
          />
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-800 rounded-3xl mb-3"
            placeholder="Enter new password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-800 rounded-3xl"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-2 px-4 rounded-3xl text-white font-light transition-colors ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            } flex items-center justify-center gap-3`}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-white border-b-2"></div>
            )}
            Reset Password
          </button>
        </form>
      )}

      <div className="w-full flex justify-between text-sm mt-4">
        <button
          onClick={() => navigate("/login")}
          className="text-gray-600 hover:text-black cursor-pointer"
        >
          ← Back to Login
        </button>
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Change Email
          </button>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
