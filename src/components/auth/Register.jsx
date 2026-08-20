import React, { useState } from "react";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate async registration
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Use a non-blocking toast or modal notification instead of alert
      // For now, we navigate directly; integrate a toast library like react-hot-toast
      navigate("/verify-account");
    } catch (error) {
      safeLogError("Registration failed", error);
    } finally {
      setLoading(false);
    }
  };

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
              className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
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
              className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
import React, { useState, useCallback } from "react";
   import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
   import { useNavigate, Link } from "react-router-dom";

   // Safe logger to prevent PII/secret leakage
   const safeLogError = (message, error) => {
     // In production, integrate with a proper logging service (e.g., Sentry, LogRocket)
     // Sanitize error to avoid leaking sensitive data
     const sanitizedError = error instanceof Error ? error.message : String(error);
     // Route through production-safe logger that respects environment configuration
     if (import.meta.env.DEV) {
       console.warn(`[Auth/Register] ${message}: ${sanitizedError}`);
     }
   };

   const TextInput = ({ name, value, onChange, placeholder, type = "text", required = true }) => (
     <div className="relative">
       <input
         type={type}
         name={name}
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
         required={required}
         autoComplete={name === "email" ? "email" : "name"}
       />
     </div>
   );

   const PasswordInput = ({ name, value, onChange, show, onToggleShow, placeholder }) => (
     <div className="relative">
       <input
         type={show ? "text" : "password"}
         name={name}
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm pr-10"
         required
         autoComplete={name === "password" ? "new-password" : "current-password"}
       />
       <button
         type="button"
         onClick={onToggleShow}
         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
         aria-label={show ? "Hide password" : "Show password"}
       >
         {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
       </button>
     </div>
   );

   const Register = () => {
     const navigate = useNavigate();
     const [formData, setFormData] = useState({
       fullName: "",
       email: "",
       password: "",
       confirmPassword: "",
     });
     const [loading, setLoading] = useState(false);
     const [showPassword, setShowPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
     const [error, setError] = useState("");

     const handleChange = useCallback((e) => {
       const { name, value } = e.target;
       setFormData((prev) => ({ ...prev, [name]: value }));
       // Clear error on change
       if (error) setError("");
     }, [error]);

     const validateForm = () => {
       const { fullName, email, password, confirmPassword } = formData;
       if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
         return "All fields are required.";
       }
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(email)) {
         return "Please enter a valid email address.";
       }
       if (password.length < 8) {
         return "Password must be at least 8 characters long.";
       }
       if (password !== confirmPassword) {
         return "Passwords do not match.";
       }
       return null;
     };

     const handleSubmit = async (e) => {
       e.preventDefault();
       const validationError = validateForm();
       if (validationError) {
         setError(validationError);
         return;
       }

       setLoading(true);
       setError("");
       try {
         // Simulate async registration
         await new Promise((resolve) => setTimeout(resolve, 2000));
         navigate("/verify-account");
       } catch (err) {
         safeLogError("Registration failed", err);
         setError("Registration failed. Please try again.");
       } finally {
         setLoading(false);
       }
     };

     const buttonClasses = [
       "group w-full relative px-12 py-4",
       "bg-gradient-to-r from-purple-400 to-yellow-300",
       "text-blue-800 text-sm tracking-wider",
       "transition-all duration-300",
       "disabled:opacity-50 disabled:cursor-not-allowed"
     ].join(" ");

     return (
       <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
         <div className="w-full max-w-md px-4 py-12 mt-20 mb-12 border border-white/10 backdrop-blur-md rounded-lg">
           <h2 className="text-3xl font-thin tracking-wide mb-8 text-center">
             Create Account
             <span className="block mt-2 text-violet-400 text-lg font-light">
               Register for a new account
             </span>
           </h2>

           <form onSubmit={handleSubmit} className="space-y-6" noValidate>
             {error && (
               <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm text-center">
                 {error}
               </div>
             )}

             <TextInput
               name="fullName"
               value={formData.fullName}
               onChange={handleChange}
               placeholder="Full Name"
             />
             <TextInput
               name="email"
               value={formData.email}
               onChange={handleChange}
               placeholder="Email"
               type="email"
             />
             <PasswordInput
               name="password"
               value={formData.password}
               onChange={handleChange}
               show={showPassword}
               onToggleShow={() => setShowPassword((prev) => !prev)}
               placeholder="Password"
             />
             <PasswordInput
               name="confirmPassword"
               value={formData.confirmPassword}
               onChange={handleChange}
               show={showConfirmPassword}
               onToggleShow={() => setShowConfirmPassword((prev) => !prev)}
               placeholder="Confirm Password"
             />

             <button
               type="submit"
               className={buttonClasses}
               disabled={loading}
             >
               {loading ? "CREATING ACCOUNT..." : "REGISTER"}
               <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
             </button>
           </form>

           <div className="mt-8 text-center">
             <p className="text-sm text-gray-400 font-extralight">
               Already have an account?{" "}
               <Link
                 to="/login"
                 className="text-violet-400 hover:underline transition-colors duration-300"
               >
                 Login now
               </Link>
             </p>
           </div>
         </div>
       </div>
     );
   };

   export default Register;
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
