import React from "react";

export function FeatureCard({ feature, isActive, onMouseEnter }) {
  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={onMouseEnter}
    >
      <div
        className={`p-8 border border-white/5 backdrop-blur-sm transition-all duration-500 relative ${
          isActive ? "bg-white/5" : "hover:bg-white/5"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-violet-400/0 to-violet-400/0 group-hover:to-violet-400/10 transition-all duration-500" />
        <div className="relative">
          <div className="flex items-center justify-center mb-6">
            {feature.icon}
          </div>
          <h3 className="text-lg font-extralight tracking-wider mb-4 text-center">
            {feature.title}
          </h3>
          <p className="text-sm text-gray-400 text-center leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}