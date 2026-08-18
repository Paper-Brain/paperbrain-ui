import React, { useState, useCallback } from "react";
import { ArrowUpRight, Lock, Eye, EyeOff } from "lucide-react";
import { PasswordInput } from "./PasswordInput";
import { useToast } from "../../hooks/useToast";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate password reset API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    showToast("Password reset successful", "success");
  }, [showToast]);

  const isFormValid = formData.password.length >= 8 && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="w-full max-w-md px-4 py-12 mt-20 border border-white/10 backdrop-blur-md">
        <ResetPasswordHeader />
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <PasswordInput
            name="password"
            label="New Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <PasswordInput
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <ResetPasswordButton loading={loading} disabled={!isFormValid} />
        </form>
        <ResetPasswordFooter />
      </div>
    </div>
  );
};

const ResetPasswordHeader = () => (
  <div className="text-center mb-8">
    <Lock className="w-12 h-12 mx-auto mb-4 text-violet-400" />
    <h2 className="text-3xl font-thin tracking-wide">
      Reset Password
      <span className="block mt-2 text-violet-400 text-lg font-light">
        Create a new password
      </span>
    </h2>
  </div>
);

const ResetPasswordButton = ({ loading, disabled }) => (
  <button
    type="submit"
    disabled={loading || disabled}
    className={`
      group w-full relative px-12 py-4
      bg-gradient-to-r from-purple-400 to-yellow-300
      text-blue-800 text-sm tracking-wider
      transition-all duration-300 mt-8
      disabled:opacity-50 disabled:cursor-not-allowed
    `}
  >
    {loading ? "RESETTING PASSWORD..." : "RESET PASSWORD"}
    <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
  </button>
);

const ResetPasswordFooter = () => (
  <div className="mt-8 text-center">
    <p className="text-sm text-gray-400 font-extralight">
      Remember your password?{" "}
      <a
        href="/login"
        className="text-violet-400 hover:underline transition-colors duration-300"
      >
        Back to login
      </a>
    </p>
  </div>
);

export default ResetPassword;
>
