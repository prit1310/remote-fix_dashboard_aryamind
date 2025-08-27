import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Download, Monitor, CheckCircle, ArrowRight } from "lucide-react";

interface HowitsworkProps {
  user: { name: string; email: string; role: string } | null;
  onLoginClick: () => void;
}

const steps = [
  {
    icon: Phone,
    step: "01",
    title: "Contact Us",
    description: "Call, email, or use our online form to describe your computer problem",
    details: "Our support team is available 24/7 to take your call and understand your issue"
  },
  {
    icon: Download,
    step: "02",
    title: "Download Software",
    description: "We'll send you a secure remote access link to download our connection software",
    details: "Safe, one-time download that creates a secure tunnel between our technician and your computer"
  },
  {
    icon: Monitor,
    step: "03",
    title: "Remote Connection",
    description: "Our certified technician connects to your computer with your permission",
    details: "You remain in control and can see everything we do on your screen in real-time"
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Problem Solved",
    description: "We diagnose and fix the issue while you watch, then provide prevention tips",
    details: "Complete solution with documentation and recommendations for future maintenance"
  }
];

const HowItWorksSection = ({ user, onLoginClick }: HowitsworkProps) => {
  const navigate = useNavigate();
  const handleStartSession = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      onLoginClick();
    }
  };
  return (
    <section id="how-it-works" className="py-24">
      <div className="container max-w-screen-2xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            How Our
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Remote Service Works
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get your computer fixed in 4 simple steps. Fast, secure, and convenient
            remote support from certified technicians.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card variant="tech" className="text-center group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <div className="bg-gradient-hero p-6 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {step.details}
                  </p>
                </CardContent>
              </Card>

              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Security Assurance */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Card variant="glass" className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="bg-gradient-hero p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              Your Security is Our Priority
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold">Encrypted Connection</h4>
                  <p className="text-muted-foreground text-sm">256-bit SSL encryption protects all data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold">Permission Required</h4>
                  <p className="text-muted-foreground text-sm">We can only access what you allow</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold">No Data Storage</h4>
                  <p className="text-muted-foreground text-sm">We don't store any personal information</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center lg:text-left">
            <h3 className="text-3xl font-bold mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of satisfied customers who trust us with their computer problems.
              Fast, reliable, and secure remote support is just one click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" onClick={handleStartSession}>
                Start Remote Session
              </Button>
              <Button variant="ghost" size="lg">
                Call: (555) 123-4567
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;