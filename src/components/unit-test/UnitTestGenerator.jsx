import React, { useState } from "react";
import { Play } from "lucide-react";

import React, { useState } from "react";
import { Play } from "lucide-react";
import FrameworkSelect from "./FrameworkSelect";
import GenerateButton from "./GenerateButton";
import OutputConsole from "./OutputConsole";
import Header from "./Header";
import { generateTestCases } from "./testGenerator";
import useUnitTestGenerator from "./useUnitTestGenerator";

export default function UnitTestGenerator() {
  const { framework, isOpen, output, handleGenerateTests, handleFrameworkChange, handleIsOpenChange } = useUnitTestGenerator();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md px-4 py-10 border border-white/10 backdrop-blur-md rounded-lg mt-20">
        <Header />
        <div className="p-4 sm:p-6">
          <FrameworkSelect
            framework={framework}
            isOpen={isOpen}
            setIsOpen={handleIsOpenChange}
            setFramework={handleFrameworkChange}
          />
          <GenerateButton
            framework={framework}
            handleGenerateTests={handleGenerateTests}
          />
          <OutputConsole output={output} />
        </div>
      </div>
    </div>
  );
}
