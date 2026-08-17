import React from "react";
import { ChevronRight } from "lucide-react";

export function FeaturesCTA({ onContactSales }) {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-thin tracking-wider mb-8">
          Transform Your Development Process
        </h2>
        <button
          onClick={onContactSales}
          className="px-12 py-4 bg-gradient-to-r from-purple-400 to-yellow-300 text-blue-800 text-sm tracking-wider transition-colors duration-300 flex items-center justify-center mx-auto group"
        >
          START FREE TRIAL
          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}