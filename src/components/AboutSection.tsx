import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Clock, Shield } from "lucide-react";

const AboutSection = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Clock, value: "24/7", label: "Support Available" },
    { icon: Shield, value: "100%", label: "Secure Service" },
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About Our Remote Repair Service
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We are a leading remote computer repair company dedicated to providing fast, 
            reliable, and secure solutions for all your technical problems. Our team of 
            certified technicians works around the clock to keep your devices running smoothly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              Why Choose Us?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-medium text-foreground">Expert Technicians</h4>
                  <p className="text-muted-foreground">
                    Our certified professionals have years of experience in computer repair and troubleshooting.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-medium text-foreground">Secure Connection</h4>
                  <p className="text-muted-foreground">
                    We use enterprise-grade encryption to ensure your data remains safe during remote sessions.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-medium text-foreground">Affordable Pricing</h4>
                  <p className="text-muted-foreground">
                    Get professional computer repair services at competitive rates with transparent pricing.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-medium text-foreground">Quick Resolution</h4>
                  <p className="text-muted-foreground">
                    Most issues are resolved within 30 minutes, getting you back to work faster.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-3">Our Mission</h4>
                <p className="text-muted-foreground">
                  To provide accessible, professional computer repair services that help individuals 
                  and businesses stay productive and secure in the digital age.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-3">Our Vision</h4>
                <p className="text-muted-foreground">
                  To be the most trusted name in remote computer repair, known for our expertise, 
                  reliability, and commitment to customer satisfaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-border bg-card hover:bg-muted/50 transition-colors">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;