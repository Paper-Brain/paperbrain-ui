import React from "react";
import { Download } from "lucide-react";

const testResults = [
  { id: "1", file: "src/components/App.test.js", passed: 5, failed: 0 },
  { id: "2", file: "src/utils/helpers.test.js", passed: 3, failed: 1 },
  { id: "3", file: "src/hooks/useData.test.js", passed: 2, failed: 2 },
];

/** Renders a single test result row */
function TestResultRow({ result }) {
  return (
    <tr key={result.id}>
      <td className="py-3 px-4 text-xs sm:text-sm text-gray-300 font-extralight break-all sm:break-normal">
        {result.file}
      </td>
      <td className="py-3 px-4 text-xs sm:text-sm text-emerald-400 font-extralight whitespace-nowrap">
        {result.passed}
      </td>
      <td className="py-3 px-4 text-xs sm:text-sm text-red-400 font-extralight whitespace-nowrap">
        {result.failed}
      </td>
    </tr>
  );
}

/** Renders the test results table */
function TestResultsTable() {
  return (
    <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-white/10">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs sm:text-sm font-normal text-gray-400 whitespace-nowrap">
                  File
                </th>
                <th className="text-left py-3 px-4 text-xs sm:text-sm font-normal text-gray-400 whitespace-nowrap">
                  Passed
                </th>
                <th className="text-left py-3 px-4 text-xs sm:text-sm font-normal text-gray-400 whitespace-nowrap">
                  Failed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {testResults.map((result) => (
                <TestResultRow key={result.id} result={result} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** Download button with handler */
function DownloadButton() {
  const handleDownload = async () => {
    try {
      // Serialize test results to JSON; this data is not sensitive and safe to expose to the user.
      const data = JSON.stringify(testResults, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download.
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "unit-test-results.json";
      // Security: prevent the new page from accessing the opener.
      anchor.rel = "noopener noreferrer";

      // Append, click, and clean up.
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      // Log the error without leaking sensitive information.
      console.error("Error downloading test results:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-6 w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-md text-xs sm:text-sm font-extralight transition-colors duration-300"
    >
      <Download size={16} className="text-violet-400" />
      Download Test Results
    </button>
  );
}

export default function UnitTestSummary() {
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
          <TestResultsTable />
          <DownloadButton />
        </div>
      </div>
    </div>
  );
}
