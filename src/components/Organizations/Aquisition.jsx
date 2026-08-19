import React from "react";
import PropTypes from "prop-types";
import { ArrowUpRight } from "lucide-react";

const SVG_PATH = [
  "M22 18.055v2.458l-11 .587v-4.569l11-2.458V18.055z",
  "m0-12v3.818l-11 2.458V7.505l11-1.45z",
  "m-20.5 3.257L9 8.505V13.3L1.5 11.812v-2.5z",
  "M9 19.55l-7.5-1.5v-2.5L9 17.505V19.55z",
  "m11.5-18.5h-19C.673 1.05 0 1.722 0 2.55v3.818l9 1.188V6.5l11-1.45V2.55",
  "c0-.828-.673-1.5-1.5-1.5z",
].join("");

const BrandHeader = () => (
  <div className="flex items-center gap-3 mb-8">
    <svg
      className="w-8 h-8 text-blue-500"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path fill="currentColor" d={SVG_PATH} />
    </svg>
    <span className="text-xl font-thin">PaperBrain</span>
  </div>
);

const UserDirectorySection = ({ userEmail, onSwitchDirectory }) => (
  <div className="flex justify-between items-center mb-6">
    <span className="text-sm text-gray-400">{userEmail}</span>
    <button
      type="button"
      onClick={onSwitchDirectory}
      className="text-violet-400 hover:underline text-sm focus:outline-none focus:ring-1 focus:ring-violet-400"
    >
      Switch directory
    </button>
  </div>
);

UserDirectorySection.propTypes = {
  userEmail: PropTypes.string.isRequired,
  onSwitchDirectory: PropTypes.func.isRequired,
};

const TermsAgreement = () => (
  <p className="text-sm text-gray-400 mb-8">
    Choosing <span className="text-white">Continue</span> means that you agree
    to our{" "}
    <a
      href="/terms"
      className="text-violet-400 hover:underline"
      rel="noreferrer"
    >
      Terms of Service
    </a>
    ,{" "}
    <a
      href="/privacy"
      className="text-violet-400 hover:underline"
      rel="noreferrer"
    >
      Privacy Statement
    </a>
    , and{" "}
    <a
      href="/conduct"
      className="text-violet-400 hover:underline"
      rel="noreferrer"
    >
      Code of Conduct
    </a>
    .
  </p>
);

const MarketingConsent = () => (
  <div className="mb-8">
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-white/10 bg-transparent"
      />
      <span className="text-sm text-gray-400">
        I would like information, tips, and offers about PaperBrain and other
        PaperBrain products and services.{" "}
        <a
          href="/privacy"
          className="text-violet-400 hover:underline"
          rel="noreferrer"
        >
          Privacy Statement
        </a>
      </span>
    </label>
  </div>
);

const ContinueButton = ({ onClick }) => {
  const buttonStyle = [
    "group w-full relative px-12 py-4",
    "bg-gradient-to-r from-purple-400 to-yellow-300",
    "text-blue-800 text-sm font-medium tracking-wider",
    "transition-all duration-300 hover:opacity-90",
  ].join(" ");

  const iconStyle = [
    "inline-block ml-2 w-4 h-4 transition-transform duration-300",
    "group-hover:-translate-y-1 group-hover:translate-x-1",
  ].join(" ");

  return (
    <button type="button" onClick={onClick} className={buttonStyle}>
      CONTINUE
      <ArrowUpRight className={iconStyle} />
    </button>
  );
};

ContinueButton.propTypes = {
  onClick: PropTypes.func,
};

ContinueButton.defaultProps = {
  onClick: () => {},
};

const Aquisition = ({
  email = "DanishFaiyaz2003@gmail.com",
  onSwitchDirectory = () => {},
  onContinue = () => {},
}) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md px-4 py-10 border border-white/10 backdrop-blur-md rounded-lg mt-20">
        <BrandHeader />
        <UserDirectorySection
          userEmail={email}
          onSwitchDirectory={onSwitchDirectory}
        />
        <h1 className="text-2xl font-thin mb-8">
          Get started with PaperBrain
        </h1>
        <TermsAgreement />
        <MarketingConsent />
        <ContinueButton onClick={onContinue} />
      </div>
    </div>
  );
};

Aquisition.propTypes = {
  email: PropTypes.string,
  onSwitchDirectory: PropTypes.func,
  onContinue: PropTypes.func,
};

export default Aquisition;
