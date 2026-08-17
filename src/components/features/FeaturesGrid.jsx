import React from "react";
import { FeatureCard } from "./FeatureCard";

export function FeaturesGrid({ features, activeFeature, onSetActiveFeature }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          feature={feature}
          isActive={activeFeature === index}
          onMouseEnter={() => onSetActiveFeature(index)}
        />
      ))}
    </div>
  );
}