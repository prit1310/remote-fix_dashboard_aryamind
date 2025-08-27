import { useState } from "react";
import { Monitor, Phone, Mail, User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user?: { name: string; email: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Services", href: "/service" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Header = ({ user, onLoginClick, onLogout }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (href: string) => {
    setMenuOpen(false);
    navigate(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <Monitor className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            RemoteFix Pro
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Phone className="h-4 w-4 mr-2" />
            Call Now
          </Button>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground/80 hidden sm:inline">
                Welcome, {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <User className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="hero" size="sm" onClick={onLoginClick}>
              <Mail className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b z-50 shadow">
          <nav className="flex flex-col gap-2 p-4">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-left text-foreground/80 hover:text-foreground py-2 px-2 rounded transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            {user ? (
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={onLogout}>
                <User className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button variant="hero" size="sm" className="w-full justify-start" onClick={onLoginClick}>
                <Mail className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;