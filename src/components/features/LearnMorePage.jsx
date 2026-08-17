import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resources } from "../../constants/learnMoreResources";
import { HeroSection } from "./HeroSection";
import { ResourcesGrid } from "./ResourcesGrid";
import { CTASection } from "./CTASection";

export default function LearnMorePage() {
  const navigate = useNavigate();
  const handleContactSupport = useHandleContactSupport(navigate);

  return (
    <LearnMorePageContent onContactSupport={handleContactSupport} />
  );
}

function useHandleContactSupport(navigate) {
  return () => {
    navigate("/request-demo");
  };
}

function LearnMorePageContent({ onContactSupport }) {
  return (
    <div className="bg-[#0A0A0A] text-white selection:bg-violet-400 selection:text-black">
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <ResourcesGrid resources={resources} />
          <CTASection onAction={onContactSupport} />
        </div>
      </div>
    </div>
  );
}