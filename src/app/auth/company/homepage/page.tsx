"use client";

import React, { useEffect } from "react";
import HeroSection from "@/components/company-login/HeroSection";
import BenefitsSection from "@/components/company-login/BenefitsSection";

const CompanyHomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <HeroSection />
      <BenefitsSection />
    </div>
  );
};

export default CompanyHomePage;
