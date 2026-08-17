import React from "react";
import { useResetPasswordForm } from "../../hooks/useResetPasswordForm";
import { PasswordInput } from "./PasswordInput";
import { ResetPasswordHeader } from "./ResetPasswordHeader";
import { ResetPasswordFooter } from "./ResetPasswordFooter";
import { ArrowUpRight, Lock } from "lucide-react";

const ResetPassword = () => {
  const {
    formData,
    loading,
    handleChange,
    handleSubmit,
    passwordVisibility,
    togglePasswordVisibility,
  } = useResetPasswordForm();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="w-full max-w-md px-4 py-12 mt-20 border border-white/10 backdrop-blur-md">
        <ResetPasswordHeader />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <PasswordInput
              name="password"
              label="Enter new password"
              value={formData.password}
              onChange={handleChange}
              showPassword={passwordVisibility.password}
              onToggleVisibility={() => togglePasswordVisibility("password")}
            />
            
            <PasswordInput
              name="confirmPassword"
              label="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              showPassword={passwordVisibility.confirmPassword}
              onToggleVisibility={() => togglePasswordVisibility("confirmPassword")}
            />
          </div>

          <button
            type="submit"
            className={
              "group w-full relative px-12 py-4 " +
              "bg-gradient-to-r from-purple-400 to-yellow-300 " +
              "text-blue-800 text-sm tracking-wider " +
              "transition-all duration-300 mt-8"
            }
            disabled={loading}
          >
            {loading ? "RESETTING PASSWORD..." : "RESET PASSWORD"}
            <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </form>

        <ResetPasswordFooter />
      </div>
    </div>
  );
};

export default ResetPassword;
