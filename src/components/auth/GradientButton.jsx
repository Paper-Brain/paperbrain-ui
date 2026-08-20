import React from "react";
import { ArrowUpRight } from "lucide-react";

const GradientButton = ({
  type = "button",
  disabled = false,
  loadingText,
  defaultText,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="
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
      "
    >
      {disabled ? loadingText : defaultText}
      <ArrowUpRight
        className="
          inline-block
          ml-2
          w-4
          h-4
          transition-transform
          duration-300
          group-hover:-translate-y-1
          group-hover:translate-x-1
        "
      />
    </button>
  );
};

export default GradientButton;