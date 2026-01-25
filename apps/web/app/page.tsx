import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Features } from "@/components/marketing/Features";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { ComingSoon } from "@/components/marketing/ComingSoon";
import { Pricing } from "@/components/marketing/Pricing";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CallToAction } from "@/components/marketing/CallToAction";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <ComingSoon />
      <ComparisonTable />
      <Pricing />
      <Testimonials />
      <CallToAction />
    </>
  );
}
