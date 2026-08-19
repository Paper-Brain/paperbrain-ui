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

/**
 * VerifyAccount component – refactored for maintainability.
 * Extracted pure functions and a dedicated OTPInput component.
 * All handlers are memoized with useCallback to reduce re‑renders.
 * Accessibility, security, and performance best‑practices are preserved.
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  forwardRef,
} from "react";
import { ArrowUpRight, Mail } from "lucide-react";

const OTP_LENGTH = 6;

/* ---------- UI Helper Classes ---------- */
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
  "transition-all",
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
  "disabled:cursor-not-allowed",
].join(" ");

/* ---------- Notification Hook ---------- */
const useNotification = () => {
  const [notification, setNotification] = useState({ type: "", message: "" });

  const show = useCallback((type, message) => {
    setNotification({ type, message });
    // Auto‑clear after 5 seconds – safe, no sensitive data logged.
    const timer = setTimeout(() => setNotification({ type: "", message: "" }), 5000);
    return () => clearTimeout(timer);
  }, []);

  return { notification, show };
};

/* ---------- OTP Input Component ---------- */
const OTPInput = memo(
  forwardRef(({ index, value, onChange, onKeyDown, onPaste }, ref) => (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(e.target, index)}
      onKeyDown={(e) => onKeyDown(e, index)}
      onPaste={onPaste}
      className={inputClassName}
      aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
    />
  ))
);

/* ---------- Pure Helper Functions ---------- */
const isNumeric = (str) => /^\d$/.test(str);

const extractDigits = (input) => input.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");

/* ---------- Main Component ---------- */
const VerifyAccount = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const { notification, show } = useNotification();
  const inputRefs = useRef([]);

  /* Focus first input on mount */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* ----- Handlers (memoized) ----- */
  const handleChange = useCallback(
    (element, index) => {
      const val = element.value;
      if (!isNumeric(val)) return;

      setOtp((prev) => {
        const updated = [...prev];
        updated[index] = val;
        return updated;
      });

      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (e, index) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        setOtp((prev) => {
          const updated = [...prev];
          updated[index - 1] = "";
          return updated;
        });
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      const digits = extractDigits(pasted);
      if (digits.length === 0) return;

      setOtp((prev) => {
        const updated = [...prev];
        digits.forEach((d, i) => {
          updated[i] = d;
          if (inputRefs.current[i]) {
            inputRefs.current[i].value = d; // keep uncontrolled value in sync
          }
        });
        return updated;
      });

      const focusIdx = Math.min(digits.length, OTP_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
    },
    []
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      // Simulate async verification – replace with real API call.
      setTimeout(() => {
        setLoading(false);
        show("success", "Verification successful!");
      }, 2000);
    },
    [show]
  );

  const handleResend = useCallback(() => {
    setLoading(true);
    // Simulate async resend – replace with real API call.
    setTimeout(() => {
      setLoading(false);
      show("success", "New verification code sent successfully.");
    }, 1000);
  }, [show]);

  const isComplete = otp.every(isNumeric);

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
          We&apos;ve sent a verification code to your email address. Please enter it
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

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <OTPInput
                key={idx}
                index={idx}
                value={digit}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                ref={(el) => (inputRefs.current[idx] = el)}
              />
            ))}
          </div>

          <button
            type="submit"
            className={buttonClassName}
            disabled={loading || !isComplete}
          >
            {loading ? "VERIFYING..." : "VERIFY EMAIL"}
            <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 font-extralight">
            Didn&apos;t receive the code?{" "}
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
