import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, backendUrl } = useContext(ShopContext);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from navigation state or redirect to login
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      toast.error("Please provide email for verification");
      navigate("/login");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/user/verify-email`, {email,otp,});
      if (response.data.success) {
        toast.success(response.data.message);
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/resend-verification`,
        { email }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setCountdown(60); // 60 seconds countdown
        setOtp(""); // Clear current OTP
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to resend verification code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Verify Email</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <div className="text-center mb-4">
        <p className="text-gray-600 mb-2">
          We've sent a 6-digit verification code to:
        </p>
        <p className="font-medium text-black">{email}</p>
      </div>

      <form onSubmit={handleVerifyOTP} className="w-full">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800 rounded-3xl text-center text-lg tracking-widest"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          maxLength="6"
          required
        />
        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className={`w-full mt-4 py-2 px-4 rounded-3xl text-white font-light transition-colors ${
            loading || otp.length !== 6
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          } flex items-center justify-center gap-3`}
        >
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-white border-b-2"></div>
          )}
          Verify Email
        </button>
      </form>

      <div className="w-full flex justify-between items-center text-sm mt-4">
        <button
          onClick={() => navigate("/login")}
          className="text-gray-600 hover:text-black cursor-pointer"
        >
          ← Back to Login
        </button>

        <button
          onClick={handleResendOTP}
          disabled={resendLoading || countdown > 0}
          className={`cursor-pointer ${
            countdown > 0 || resendLoading
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          {resendLoading
            ? "Sending..."
            : countdown > 0
            ? `Resend in ${countdown}s`
            : "Resend Code"}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p className="font-medium mb-1">Didn't receive the code?</p>
        <ul className="text-xs space-y-1">
          <li>• Check your spam/junk folder</li>
          <li>• Make sure the email address is correct</li>
          <li>• Wait a few minutes and try resending</li>
        </ul>
      </div>
    </div>
  );
}

export default VerifyEmail;
