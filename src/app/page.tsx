import { BenefitsSection } from "@/features/landing-sections/benefits";
import { EmotionalSlapSection } from "@/features/landing-sections/emotional-slap";
import { FAQSection } from "@/features/landing-sections/faq";
import { FeaturesSection } from "@/features/landing-sections/features";
import { FooterSection } from "@/features/landing-sections/footer";
import { HeroSection } from "@/features/landing-sections/hero";
import { HowItWorksSection } from "@/features/landing-sections/how-it-works";
import { Navbar } from "@/features/landing-sections/navbar";
import { TestimonialSection } from "@/features/landing-sections/testimonial";

export default function Home() {
  return (
    <main className={"main"}>
      <Navbar />
      <div className="flex flex-col items-center overflow-x-hidden">
        <HeroSection />
        <EmotionalSlapSection />
        <BenefitsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialSection />
        <FAQSection />
        <FooterSection />
      </div>
    </main>
  );
}
