import React from "react";
import {
  Header,
  EmailSwitchDirectory,
  MainTitle,
  TermsText,
  CheckboxSection,
  ContinueButton,
} from "./AquisitionComponents";

const Aquisition = () => {
  const renderContainer = () => (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md px-4 py-10 border border-white/10 backdrop-blur-md rounded-lg mt-20">
        {renderContent()}
      </div>
    </div>
  );

  const renderContent = () => (
    <>
      <Header />
      <EmailSwitchDirectory />
      <MainTitle />
      <TermsText />
      <CheckboxSection />
      <ContinueButton />
    </>
  );

  return renderContainer();
};

export default Aquisition;
