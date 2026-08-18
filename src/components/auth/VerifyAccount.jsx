import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { ToastProvider, useToast } from "./Toast";

const OTPInput = React.memo(({ otp, onChange, onKeyDown, inputRefs, disabled }) => (
  <div className="flex justify-between gap-2">
    {otp.map((digit, index) => (
      <input
        key={index}
        ref={(ref) => (inputRefs.current[index] = ref)}
        type="text"
        maxLength={1}
        value={digit}
        onChange={(e) => onChange(e.target, index)}
        onKeyDown={(e) => onKeyDown(e, index)}
        disabled={disabled}
        className={[
          "w-12 h-12 text-center bg-transparent",
          "border border-white/10",
          "focus:border-violet-400 focus:ring-1 focus:ring-violet-400",
          "text-lg font-light outline-none transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        ].join(" ")}
      />
    ))}
  </div>
));

const VerifyButton = React.memo(({ loading, disabled, onClick }) => (
  <button
    type="submit"
    onClick={onClick}
    disabled={disabled}
    className={[
      "group w-full relative px-12 py-4",
      "bg-gradient-to-r from-purple-400 to-yellow-300",
      "text-blue-800 text-sm tracking-wider",
      "transition-all duration-300",
      "disabled:opacity-50 disabled:cursor-not-allowed",
    ].join(" ")}
  >
    {loading ? "VERIFYING..." : "VERIFY EMAIL"}
    <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
  </button>
));

const ResendButton = React.memo(({ loading, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="text-violet-400 hover:underline transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Resend code
  </button>
));

const VerifyAccountContent = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const { showToast } = useToast();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = useCallback((element, index) => {
    if (isNaN(element.value)) return;

    setOtp((prev) => prev.map((d, idx) => (idx === index ? element.value : d)));

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast("Verification successful", "success");
    } catch {
      showToast("Verification failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleResend = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate resending code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("New verification code sent", "info");
    } catch {
      showToast("Failed to resend code. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const isFormComplete = otp.join("").length === 6;

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

        <form onSubmit={handleSubmit} className="space-y-8">
          <OTPInput
            otp={otp}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            inputRefs={inputRefs}
            disabled={loading}
          />

          <VerifyButton
            loading={loading}
            disabled={loading || !isFormComplete}
            onClick={handleSubmit}
          />
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 font-extralight">
            Didn't receive the code?{" "}
            <ResendButton loading={loading} onClick={handleResend} />
          </p>
        </div>
      </div>
    </div>
  );
};

const VerifyAccount = () => (
  <ToastProvider>
    <VerifyAccountContent />
  </ToastProvider>
);

export default VerifyAccount;
>
