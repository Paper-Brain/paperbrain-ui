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
import * as authService from '../../services/authService'; // Assuming a service layer for API calls

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

/* ---------- Sub-components for Single Responsibility ---------- */

/**
 * NotificationBanner – displays success/error messages with auto-dismiss.
 */
const NotificationBanner = memo(({ type, message }) => {
  if (!message) return null;

  const isSuccess = type === "success";
  const containerClasses = [
    "p-3",
    "mb-6",
    "text-sm",
    "text-center",
    "border",
    isSuccess
      ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
      : "bg-rose-950/30 border-rose-500/30 text-rose-400",
  ].join(" ");

  return (
    <div className={containerClasses} role="alert" aria-live="polite">
      {message}
    </div>
  );
});

NotificationBanner.displayName = "NotificationBanner";

/**
 * OTPInputGroup – manages the OTP input grid and handles input logic.
 */
const OTPInputGroup = memo(
  ({ otp, onChange, onKeyDown, onPaste, inputRefs }) => {
    useEffect(() => {
      inputRefs.current[0]?.focus();
    }, [inputRefs]);

    return (
      <div className="flex justify-between gap-2">
        {otp.map((digit, idx) => (
          <OTPInput
            key={idx}
            index={idx}
            value={digit}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            ref={(el) => (inputRefs.current[idx] = el)}
          />
        ))}
      </div>
    );
  }
);

OTPInputGroup.displayName = "OTPInputGroup";

/**
 * ResendSection – renders the resend code prompt.
 */
const ResendSection = memo(({ onResend, disabled }) => (
  <div className="mt-8 text-center">
    <p className="text-sm text-gray-400 font-extralight">
      Didn&apos;t receive the code?{" "}
      <button
        type="button"
        onClick={onResend}
        disabled={disabled}
        className="text-violet-400 hover:underline transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Resend code
      </button>
    </p>
  </div>
));

ResendSection.displayName = "ResendSection";

/* ---------- OTP Handlers (extracted for clarity) ---------- */
const useOTPHandlers = (inputRefs, show) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

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
    [inputRefs]
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
    [otp, inputRefs]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text/plain");
      const digits = extractDigits(pasted);
      if (digits.length === 0) return;

      setOtp((prev) => {
        const updated = [...prev];
        digits.forEach((d, i) => {
          updated[i] = d;
          if (inputRefs.current[i]) {
            inputRefs.current[i].value = d;
          }
        });
        return updated;
      });

      const focusIdx = Math.min(digits.length, OTP_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
    },
    [inputRefs]
  );

  return { otp, handleChange, handleKeyDown, handlePaste };
};

/* ---------- Verification Business Logic Hook ---------- */
const useVerifyAccount = (show) => {
  const [loading, setLoading] = useState(false);

  const runWithLoading = useCallback(
    async (asyncFn, onSuccess, onError) => {
      setLoading(true);
      try {
        await asyncFn();
        return onSuccess();
      } catch (error) {
        return onError();
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const createHandler = useCallback((type, message, returnValue) => () => {
    show(type, message);
    return returnValue;
  }, [show]);

  const verify = useCallback(
    async (otpCode) => {
      return await runWithLoading(
        async () => {
          await authService.verifyEmail({ code: otpCode });
        },
        createHandler("success", "Verification successful!", true),
        createHandler("error", "Verification failed. Please try again.", false)
      );
    },
    [show, runWithLoading]
  );

  const resend = useCallback(
    async () => {
      await runWithLoading(
        async () => {
          await authService.resendVerificationCode();
        },
        createHandler("success", "New verification code sent successfully."),
        createHandler("error", "Failed to resend code. Please try again.")
      );
    },
    [show, runWithLoading]
  );

  return { loading, verify, resend };
};

/* ---------- Form Component (Single Responsibility: UI) ---------- */
const VerifyAccountForm = memo(
  ({ otp, isComplete, loading, onSubmit, onResend, handleChange, handleKeyDown, handlePaste, inputRefs }) => (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <OTPInputGroup
        otp={otp}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        inputRefs={inputRefs}
      />

      <button
        type="submit"
        className={buttonClassName}
        disabled={loading || !isComplete}
      >
        {loading ? "VERIFYING..." : "VERIFY EMAIL"}
        <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
      </button>
    </form>
  )
);

VerifyAccountForm.displayName = "VerifyAccountForm";

/* ---------- Main Component (Composition Root) ---------- */
const VerifyAccount = () => {
  const { notification, show } = useNotification();
  const inputRefs = useRef([]);
  const { otp, handleChange, handleKeyDown, handlePaste } = useOTPHandlers(inputRefs, show);
  const { loading, verify, resend } = useVerifyAccount(show);

  const isComplete = otp.every(isNumeric);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const otpCode = otp.join("");
      verify(otpCode);
    },
    [otp, verify]
  );

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

        <NotificationBanner type={notification.type} message={notification.message} />

        <VerifyAccountForm
          otp={otp}
          isComplete={isComplete}
          loading={loading}
          onSubmit={handleSubmit}
          onResend={resend}
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
          handlePaste={handlePaste}
          inputRefs={inputRefs}
        />

        <ResendSection onResend={resend} disabled={loading} />
      </div>
    </div>
  );
};

export default VerifyAccount;
