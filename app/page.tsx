import HeroSection from "./components/landing/HeroSection";
import ChatDemoSection from "./components/landing/ChatDemoSection";
import StatsSection from "./components/landing/StatsSection";
import FeaturesSection from "./components/landing/FeaturesSection";
import TreatmentSection from "./components/landing/TreatmentSection";
import PhilosophySection from "./components/landing/PhilosophySection";
import FaqSection from "./components/landing/FaqSection";
import CtaSection from "./components/landing/CtaSection";
import FooterSection from "./components/landing/FooterSection";

export default function Home() {
  return (
    <div className="min-h-screen text-primary overflow-x-hidden relative flex flex-col">
      <HeroSection />
      <ChatDemoSection />
      <StatsSection />
      <FeaturesSection />
      <TreatmentSection />
      <PhilosophySection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
