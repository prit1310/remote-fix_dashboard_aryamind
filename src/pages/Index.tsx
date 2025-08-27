import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ContactSection from "@/components/ContactSection";

const Index = ({ user, onLoginClick }: { user: any, onLoginClick: () => void }) => (
  <div className="min-h-screen">
    <main>
      <HeroSection user={user} onLoginClick={onLoginClick} />
      <ServicesSection />
      <HowItWorksSection user={user} onLoginClick={onLoginClick} />
      <ContactSection />
    </main>
  </div>
);

export default Index;