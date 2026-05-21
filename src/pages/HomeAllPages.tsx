import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HumanoidSection from "@/components/HumanoidSection";
import SpecsSection from "@/components/SpecsSection";
import DetailsSection from "@/components/DetailsSection";
import ImageShowcaseSection from "@/components/ImageShowcaseSection";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import MadeByHumans from "@/components/MadeByHumans";
import Footer from "@/components/Footer";
import Pricing from "./Pricing";
import ContactUs from "@/components/ContactUs";

const Index = () => {
  // Set up smooth anchor link scrolling
  useEffect(() => {
    // ✅ Single named handler — referenced by both add & remove for clean teardown
    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== "A") return;

      const anchor = target as HTMLAnchorElement;
      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#")) return;

      e.preventDefault();

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const offset = window.innerWidth < 768 ? 100 : 80;
      const top = targetElement.offsetTop - offset;

      window.scrollTo({ top, behavior: "smooth" });
    };

    document.addEventListener("click", onDocumentClick);

    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        {/* <HumanoidSection /> */}
        <Features />
        <DetailsSection />
        <ImageShowcaseSection />
        <SpecsSection />
        {/* <Testimonials /> */}
        {/* <Pricing /> */}
        <ContactUs />
        {/* <Newsletter /> */}
        {/* <MadeByHumans /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;