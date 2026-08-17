import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FeaturesData } from "./featuresData";
import { FeatureCard } from "./FeatureCard";
import { FeaturesHeader } from "./FeaturesHeader";
import { FeaturesGrid } from "./FeaturesGrid";
import { FeaturesCTA } from "./FeaturesCTA";

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  const handleContactSales = () => {
    navigate("/request-demo");
  };

  return (
    <div
      className="bg-[#0A0A0A] text-white selection:bg-violet-400 selection:text-black py-32 relative"
      id="features"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(167,139,250,0.1),transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-6">
        <FeaturesHeader />
        <FeaturesGrid
          features={FeaturesData}
          activeFeature={activeFeature}
          onSetActiveFeature={setActiveFeature}
        />
      </div>
      <FeaturesCTA onContactSales={handleContactSales} />
    </div>
  );
}