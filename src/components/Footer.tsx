import { Monitor, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-tech-dark text-tech-light mt-auto">
      <div className="container max-w-screen-2xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Monitor className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                RemoteFix Pro
              </span>
            </Link>
            <p className="text-tech-light/80 mb-6">
              Professional remote computer repair services.<br /> Fast, secure, and reliable
              solutions for <br /> all your technical problems.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+916356137551"
                className="flex items-center gap-3 text-sm"
              >
                <Phone className="h-4 w-4 text-accent" />
                <span>+91 63561 37551</span>
              </a>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-accent" />
                <a
                  href="mailto:contact@shwetatech.com"
                  className="hover:underline text-sm"
                >
                  contact@shwetatech.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Remote Service</span>
              </div>
            </div>
          </div>

          {/* Right: Support + Service Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Support */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Support</h3>
              <ul className="space-y-3 text-sm text-tech-light/80">
                <li><a href="/how-it-works" className="hover:text-accent transition-colors">How It Works</a></li>
                <li><a href="/service" className="hover:text-accent transition-colors">Services</a></li>
                <li><a href="/about" className="hover:text-accent transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-accent transition-colors">Contact Us</a></li>
              </ul>
            </div>
            {/* Service Hours */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Service Hours</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-accent mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">24/7 Emergency Support</p>
                    <p className="text-tech-light/80">Critical issues anytime</p>
                  </div>
                </div>
                <div className="text-sm text-tech-light/80">
                  <p className="font-medium mb-2">Regular Support:</p>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-tech-light/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-tech-light/60 text-center md:text-left">
              © 2024 RemoteFix Pro. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-tech-light/80 justify-center md:justify-end">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms</a>
              <a href="#" className="hover:text-accent transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;