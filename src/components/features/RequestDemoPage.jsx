import React from "react";
import { ArrowUpRight } from "lucide-react";

const INPUT_BASE_CLASSES =
  "w-full px-6 py-4 bg-transparent border border-white/10 rounded-none " +
  "focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm";

const BUTTON_CLASSES = [
  "group w-full relative px-12 py-4",
  "bg-gradient-to-r from-purple-400 to-yellow-300",
  "text-blue-800 text-sm tracking-wider",
  "transition-all duration-300",
].join(" ");

const ARROW_CLASSES =
  "inline-block ml-2 w-4 h-4 transition-transform duration-300 " +
  "group-hover:-translate-y-1 group-hover:translate-x-1";

const FormField = ({ type = "text", name, placeholder, required = true, children }) => (
  <div className="relative">
    {type === "textarea" ? (
      <textarea
        name={name}
        placeholder={placeholder}
        rows={4}
        className={INPUT_BASE_CLASSES}
        required={required}
      />
    ) : (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={INPUT_BASE_CLASSES}
        required={required}
      />
    )}
    {children}
  </div>
);

const SubmitButton = () => (
  <button type="submit" className={BUTTON_CLASSES}>
    REQUEST DEMO
    <ArrowUpRight className={ARROW_CLASSES} />
  </button>
);

const RequestDemo = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="w-full max-w-md px-4 py-12 md:mt-40 mt-20 border border-white/10 backdrop-blur-md rounded-lg">
        <h2 className="text-3xl font-thin tracking-wide mb-8 text-center">
          Experience
          <span className="block mt-2 text-violet-400 text-lg font-light">
            NOVA
          </span>
        </h2>

        <form className="space-y-6">
          <FormField name="name" placeholder="Full Name" />
          <FormField type="email" name="email" placeholder="Email Address" />
          <FormField name="company" placeholder="Company Name" />
          <FormField type="textarea" name="message" placeholder="Message" />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
};

export default RequestDemo;
