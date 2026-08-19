import React, { useState, useRef, useEffect } from "react";
import { ArrowUpRight, Mail } from "lucide-react";

const OTP_LENGTH = 6;

const inputClassName = [
  "w-12",
  "h-12",
  "text-center",
  "bg-transparent",
  "border",
  "border-white/10",
  "focus:border-violet-400",
  "focus:ring-1",
  "focus:ring-violet-400",
  "text-lg",
  "font-light",
  "outline-none",
  "transition-all"
].join(" ");

const buttonClassName = [
  "group",
  "w-full",
  "relative",
  "px-12",
  "py-4",
  "bg-gradient-to-r",
  "from-purple-400",
  "to-yellow-300",
  "text-blue-800",
  "text-sm",
  "tracking-wider",
  "transition-all",
  "duration-300",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed"
].join(" ");

const VerifyAccount = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [notification, setNotification] = useState({ type: "", message: "" });
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 5000);
  };

  const handleChange = (element, index) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    if (val && index < OTP_LENGTH - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, OTP_LENGTH).split("");
    const newOtp = [...otp];
    
    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = digit;
      }
    });
    
    setOtp(newOtp);
    const focusIndex = Math.min(digits.length, OTP_LENGTH - 1);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: "", message: "" });

    setTimeout(() => {
      setLoading(false);
      showNotification("success", "Verification successful!");
    }, 2000);
  };

  const handleResend = () => {
    setLoading(true);
    setNotification({ type: "", message: "" });

    setTimeout(() => {
      setLoading(false);
      showNotification("success", "New verification code sent successfully.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="w-full max-w-md px-4 py-12 mt-20 mb-12 border border-white/10 backdrop-blur-md">
        <div className="text-center mb-8">
          <Mail className="w-12 h-12 mx-auto mb-4 text-violet-400" />
          <h2 className="text-3xl font-thin tracking-wide">
            Email Verification
            <span className="block mt-2 text-violet-400 text-lg font-light">
              Enter the code we sent you
            </span>
          </h2>
        </div>

        <div className="text-center text-sm text-gray-400 mb-8">
          We've sent a verification code to your email address. Please enter it
          below.
        </div>

        {notification.message && (
          <div
            className={`p-3 mb-6 text-sm text-center border ${
              notification.type === "success"
                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                : "bg-rose-950/30 border-rose-500/30 text-rose-400"
            }`}
            role="alert"
          >
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className={inputClassName}
                aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
              />
            ))}
          </div>

          <button
            type="submit"
            className={buttonClassName}
            disabled={loading || otp.join("").length !== OTP_LENGTH}
          >
            {loading ? "VERIFYING..." : "VERIFY EMAIL"}
            <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 font-extralight">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-violet-400 hover:underline transition-colors duration-300"
            >
              Resend code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
