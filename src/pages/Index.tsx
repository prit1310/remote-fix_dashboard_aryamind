import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ContactSection from "@/components/ContactSection";

const Index = ({ user, onLoginClick }: { user: any, onLoginClick: () => void }) => (
  <>
    <Helmet>
      <title>Remote PC and Laptop Repair Services Near You | 24*7 Help</title>
      <meta
        name="description"
        content="RemoteFix Pro offers remote computer and laptop repair services. Get expert solutions for software, hardware & performance issues anytime, anywhere. Contact us."
      />
      <link rel="canonical" href="https://remotefix.shwetatech.com/" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Remote PC and Laptop Repair Services Near You | 24*7 Help"
      />
      <meta
        property="og:description"
        content="RemoteFix Pro offers remote computer and laptop repair services. Get expert solutions for software, hardware & performance issues anytime, anywhere. Contact us."
      />
      <meta property="og:url" content="https://remotefix.shwetatech.com/" />
      <meta property="og:site_name" content="Remotefix Shwetatech" />
    </Helmet>
    <div className="min-h-screen">
      <main>
        <HeroSection user={user} onLoginClick={onLoginClick} />
        <ServicesSection />
        <HowItWorksSection user={user} onLoginClick={onLoginClick} />
        <ContactSection />
      </main>
    </div>
  </>
);

export default Index;