import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enterpriseFeatures } from "../../constants/enterpriseFeatures";
import { FeatureCard } from "./FeatureCard";
import { EnterpriseCTA } from "./EnterpriseCTA";

export default function EnterprisePage() {
  const { activeFeature, setActiveFeature } = useFeatureState();
  const navigate = useNavigate();

  const handleContactSales = useHandleContactSales(navigate);

  return (
    <div className="bg-[#0A0A0A] text-white selection:bg-violet-400 selection:text-black">
      <FeaturesSection
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
        features={enterpriseFeatures}
      />
      <EnterpriseCTA onContactSales={handleContactSales} />
    </div>
  );
}

function FeaturesSection({ activeFeature, setActiveFeature, features }) {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <HeaderSection />
        <FeaturesGrid
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
          features={features}
        />
      </div>
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="text-center mb-24">
      <h2 className="text-3xl font-thin tracking-wider mb-4">
        ENTERPRISE SOLUTIONS
      </h2>
      <div className="w-44 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent mx-auto" />

      <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed mt-6 mb-12 max-w-3xl mx-auto">
        Scale your development capabilities with our enterprise-grade documentation 
        and testing platform designed for large organizations.
      </p>
    </div>
  );
}

function FeaturesGrid({ activeFeature, setActiveFeature, features }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          feature={feature}
          isActive={activeFeature === index}
          onHover={() => setActiveFeature(index)}
        />
      ))}
    </div>
  );
}