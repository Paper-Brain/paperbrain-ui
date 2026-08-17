import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { solutionsData } from "../../data/solutionsData";
import { SolutionCard } from "./SolutionCard";
import { SectionHeader } from "../../ui/SectionHeader";
import { CTASection } from "../../ui/CTASection";

export default function SolutionsPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="bg-[#0A0A0A] text-white selection:bg-violet-400 selection:text-black">
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="TAILORED FOR YOUR WORKFLOW"
            subtitle="From startups to enterprises, discover how our AI-powered tools adapt to your development needs and enhance your coding workflow."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionsData.map((solution, index) => (
              <SolutionCard
                key={solution.title}
                solution={solution}
                isActive={activeFeature === index}
                onHover={() => setActiveFeature(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <CTASection
        title="Ready to Transform Your Development Process?"
        buttonText="GET STARTED"
        icon={
          <ChevronRight
            className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
          />
        }
      />
    </div>
  );
}