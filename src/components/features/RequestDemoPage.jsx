import React, { useState, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";

/* Shared styling for all form fields */
const INPUT_CLASS =
  "w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm";

/* Base field component – renders either an <input> or <textarea> */
const BaseField = ({ as: Component = "input", ...props }) => (
  <div className="relative">
    <Component className={INPUT_CLASS} {...props} />
  </div>
);

/* Input field wrapper */
const InputField = ({
  type = "text",
  name,
  placeholder,
  required = false,
}) => (
  <BaseField
    type={type}
    name={name}
    placeholder={placeholder}
    required={required}
    aria-label={placeholder}
  />
);

/* Textarea field wrapper */
const TextAreaField = ({
  name,
  placeholder,
  rows = 4,
  required = false,
}) => (
  <BaseField
    as="textarea"
    name={name}
    placeholder={placeholder}
    rows={rows}
    required={required}
    aria-label={placeholder}
  />
);

/* Validation utilities */
const validateFormData = (data) => {
  const errors = {};
  if (!data.name) errors.name = "Full Name is required";
  if (!data.email) errors.email = "Email Address is required";
  if (!data.company) errors.company = "Company Name is required";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }
  return errors;
};

const hasErrors = (errors) => Object.keys(errors).length > 0;

/* API submission logic */
const submitDemoRequest = async (data) => {
  const response = await fetch("/api/request-demo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Server error");
    throw new Error(errorText);
  }

  return response.json();
};

/* Status message component */
const StatusMessage = ({ status }) => {
  if (status.error) {
    return (
      <p className="text-red-500 text-sm" role="alert">
        {status.error}
      </p>
    );
  }
  if (status.success) {
    return (
      <p className="text-green-500 text-sm" role="status">
        Demo request sent successfully!
      </p>
    );
  }
  return null;
};

/* Submit button component */
const SubmitButton = ({ loading, children }) => (
  <button
    type="submit"
    disabled={loading}
    className={`
      group 
      w-full 
      relative 
      px-12 
      py-4 
      bg-gradient-to-r 
      from-purple-400 
      to-yellow-300 
      text-blue-800 
      text-sm 
      tracking-wider 
      transition-all 
      duration-300
      ${loading ? "opacity-50 cursor-not-allowed" : ""}
    `}
  >
    {children}
    <ArrowUpRight
      className={`
        inline-block 
        ml-2 
        w-4 
        h-4 
        transition-transform 
        duration-300 
        group-hover:-translate-y-1 
        group-hover:translate-x-1
      `}
      aria-hidden="true"
    />
  </button>
);

/* Form fields component */
const DemoFormFields = () => (
  <>
    <InputField name="name" placeholder="Full Name" required />
    <InputField type="email" name="email" placeholder="Email Address" required />
    <InputField name="company" placeholder="Company Name" required />
    <TextAreaField name="message" placeholder="Message" required />
  </>
);

/* Main component – split into small, testable pieces */
const RequestDemo = () => {
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name")?.trim() ?? "",
      email: formData.get("email")?.trim() ?? "",
      company: formData.get("company")?.trim() ?? "",
      message: formData.get("message")?.trim() ?? "",
    };

    // Client-side validation
    const validationErrors = validateFormData(data);
    if (hasErrors(validationErrors)) {
      setStatus({
        loading: false,
        error: Object.values(validationErrors)[0],
        success: false,
      });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    try {
      await submitDemoRequest(data);
      setStatus({ loading: false, error: null, success: true });
      form.reset();
    } catch (err) {
      // Safe logging - no PII or stack traces exposed to client
      logger.error("Demo request submission failed", { error: err.message });
      setStatus({
        loading: false,
        error: "Failed to submit. Please try again later.",
        success: false,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="w-full max-w-md px-4 py-12 md:mt-40 mt-20 border border-white/10 backdrop-blur-md rounded-lg">
        <h2 className="text-3xl font-thin tracking-wide mb-8 text-center">
          Experience
          <span className="block mt-2 text-violet-400 text-lg font-light">
            NOVA
          </span>
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <DemoFormFields />
          <StatusMessage status={status} />
          <SubmitButton loading={status.loading}>
            {status.loading ? "Sending…" : "REQUEST DEMO"}
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default RequestDemo;