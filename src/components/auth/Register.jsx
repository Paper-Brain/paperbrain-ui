import React from "react";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { InputField } from "./InputField";
import { PasswordField } from "./PasswordField";
import { SubmitButton } from "./SubmitButton";
import { LoginLink } from "./LoginLink";

const Register = () => {
  const {
    formData,
    loading,
    handleChange,
    handleSubmit,
    passwordVisibility,
    togglePasswordVisibility,
    confirmPasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useRegisterForm();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="w-full max-w-md px-4 py-12 mt-20 mb-12 border border-white/10 backdrop-blur-md rounded-lg">
        <h2 className="text-3xl font-thin tracking-wide mb-8 text-center">
          Create Account
          <span className="block mt-2 text-violet-400 text-lg font-light">
            Register for a new account
          </span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            name="fullName"
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <InputField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <PasswordField
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            showPassword={passwordVisibility.showPassword}
            onToggleVisibility={togglePasswordVisibility}
            required
          />
          <PasswordField
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            showPassword={confirmPasswordVisibility.showConfirmPassword}
            onToggleVisibility={toggleConfirmPasswordVisibility}
            required
          />

          <SubmitButton loading={loading} />
        </form>

        <LoginLink />
      </div>
    </div>
  );
};

export default Register;
