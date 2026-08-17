import React from "react";
import { Download } from "lucide-react";

const testResults = [
  { id: "1", file: "src/components/App.test.js", passed: 5, failed: 0 },
  { id: "2", file: "src/utils/helpers.test.js", passed: 3, failed: 1 },
  { id: "3", file: "src/hooks/useData.test.js", passed: 2, failed: 2 },
];

import TestResultsTable from "./TestResultsTable";
import DownloadButton from "./DownloadButton";

export default function UnitTestSummary() {
  const handleDownloadResults = () => {
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md px-4 py-10 border border-white/10 backdrop-blur-md rounded-lg mt-20">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/10">
          <h2 className="text-lg sm:text-xl text-white font-thin tracking-wide">
            Unit Test Summary
          </h2>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <TestResultsTable results={testResults} />
          <DownloadButton onClick={handleDownloadResults} />
        </div>
      </div>
    </div>
  );
}
