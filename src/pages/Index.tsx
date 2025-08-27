import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ContactSection from "@/components/ContactSection";

const Index = () => (
  <div className="min-h-screen">
    <main>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <ContactSection />
    </main>
  </div>
);

export default Index;