import React, { useState, useCallback } from "react";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";

const initialFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const inputClassName =
  "w-full px-6 py-4 bg-transparent border border-white/10 rounded-none " +
  "focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm";

const buttonClassName =
  "group w-full relative px-12 py-4 bg-gradient-to-r from-purple-400 " +
  "to-yellow-300 text-blue-800 text-sm tracking-wider transition-all duration-300";

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        // Simulate async registration
        await new Promise((resolve) => setTimeout(resolve, 2000));
        showToast("Registration successful", "success");
        navigate("/verify-account");
      } catch (error) {
        showToast("Registration failed. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    [navigate, showToast]
  );

  const renderPasswordField = ({
    name,
    placeholder,
    show,
    onToggleShow,
  }) => (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClassName}
        required
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

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
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className={inputClassName}
              required
            />
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={inputClassName}
              required
            />
          </div>
          {renderPasswordField({
            name: "password",
            placeholder: "Password",
            show: showPassword,
            onToggleShow: () => setShowPassword((prev) => !prev),
          })}
          {renderPasswordField({
            name: "confirmPassword",
            placeholder: "Confirm Password",
            show: showConfirmPassword,
            onToggleShow: () => setShowConfirmPassword((prev) => !prev),
          })}

          <button className={buttonClassName} disabled={loading}>
            {loading ? "CREATING ACCOUNT..." : "REGISTER"}
            <ArrowUpRight
              className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 font-extralight">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-violet-400 hover:underline transition-colors duration-300"
            >
              Login now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
>
