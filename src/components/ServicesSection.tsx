import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Monitor, 
  HardDrive, 
  Wifi, 
  Shield, 
  Download, 
  Settings,
  Trash2,
  Lock,
  RefreshCw 
} from "lucide-react";

const services = [
  {
    icon: Monitor,
    title: "System Diagnostics",
    description: "Complete computer health check and performance analysis",
    features: ["Hardware diagnostics", "Software conflicts", "Performance optimization"]
  },
  {
    icon: HardDrive,
    title: "Data Recovery",
    description: "Recover lost files and restore corrupted data safely",
    features: ["File recovery", "Data backup", "Drive repair"]
  },
  {
    icon: Wifi,
    title: "Network Issues",
    description: "Fix internet connectivity and network configuration problems",
    features: ["Connection setup", "Speed optimization", "Security config"]
  },
  {
    icon: Shield,
    title: "Virus Removal",
    description: "Complete malware scanning and system security restoration",
    features: ["Virus scanning", "Malware removal", "Security setup"]
  },
  {
    icon: Download,
    title: "Software Installation",
    description: "Install, update, and configure software applications",
    features: ["App installation", "Updates", "Configuration"]
  },
  {
    icon: Settings,
    title: "System Optimization",
    description: "Speed up your computer and optimize system performance",
    features: ["Startup optimization", "Registry cleanup", "Memory management"]
  },
  {
    icon: Trash2,
    title: "System Cleanup",
    description: "Remove junk files and free up valuable storage space",
    features: ["Disk cleanup", "Temp file removal", "Cache clearing"]
  },
  {
    icon: Lock,
    title: "Security Setup",
    description: "Configure firewalls, antivirus, and security settings",
    features: ["Firewall config", "Antivirus setup", "Privacy settings"]
  },
  {
    icon: RefreshCw,
    title: "System Restore",
    description: "Restore your system to a previous working state",
    features: ["System restore", "Backup creation", "Recovery options"]
  }
];

const ServicesSection = () => {
  const navigate = useNavigate();
  const handleContact = () => {  
      navigate("/contact");
  };

  return (
    <section id="services" className="py-24 bg-surface">
      <div className="container max-w-screen-2xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Complete Remote
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Computer Solutions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From simple fixes to complex system repairs, our certified technicians provide 
            comprehensive remote support for all your computer needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} variant="feature" className="group">
              <CardHeader>
                <div className="bg-gradient-hero p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="tech" className="w-full group-hover:scale-105 transition-transform duration-300">
                  Get Help Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Card variant="glass" className="inline-block p-8">
            <h3 className="text-2xl font-bold mb-4">Need Custom Support?</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Can't find what you're looking for? Our experts can handle any computer issue.
            </p>
            <Button variant="hero" size="lg" onClick={handleContact}>
              Contact Our Experts
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;