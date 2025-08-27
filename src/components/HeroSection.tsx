import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Monitor, Shield, Clock, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-remote-repair.jpeg";

interface HeroSectionProps {
  user: { name: string; email: string; role: string } | null;
  onLoginClick: () => void;
}

const HeroSection = ({ user, onLoginClick }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleStartSession = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      onLoginClick();
    }
  };

  const handleLearnMore = () => {
    navigate("/how-it-works");
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Remote computer repair service"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-screen-2xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-hero px-4 py-2 rounded-full text-primary-foreground mb-6">
              <Monitor className="h-4 w-4" />
              <span className="text-sm font-medium">Remote Computer Repair Experts</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Fix Your Computer
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                From Anywhere
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Professional computer and laptop repair services through secure remote desktop access.
              Fast, reliable, and safe solutions for all your tech problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                variant="hero"
                size="xl"
                className="flex-1 sm:flex-none"
                onClick={handleStartSession}
              >
                <Monitor className="h-5 w-5 mr-2" />
                Start Remote Session
              </Button>
              <Button
                variant="glass"
                size="xl"
                className="flex-1 sm:flex-none"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Certified Technicians</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="grid gap-6">
            <Card variant="glass" className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-hero p-3 rounded-lg">
                  <Monitor className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Remote Access Repair</h3>
                  <p className="text-muted-foreground">
                    Direct access to your computer for instant problem diagnosis and resolution.
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-hero p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Secure & Safe</h3>
                  <p className="text-muted-foreground">
                    Enterprise-grade security with encrypted connections and permission-based access.
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-hero p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Fast Solutions</h3>
                  <p className="text-muted-foreground">
                    Most issues resolved within 30 minutes. No waiting, no travel time.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;