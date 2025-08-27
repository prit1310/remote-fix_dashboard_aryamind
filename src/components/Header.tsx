import { Button } from "@/components/ui/button";
import { Monitor, Phone, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
    user?: { name: string; email: string } | null;
    onLoginClick?: () => void;
    onLogout?: () => void;
}

const Header = ({ user, onLoginClick, onLogout }: HeaderProps) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                    <Monitor className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                        RemoteFix Pro
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <a href="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                        Dashboard
                    </a>
                    <a href="/service" className="text-foreground/80 hover:text-foreground transition-colors">
                        Services
                    </a>
                    <a href="/how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
                        How It Works
                    </a>
                    <a href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
                        About
                    </a>
                    <a href="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
                        Contact
                    </a>
                </nav>

                <div className="flex items-center gap-3">
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
        </header>
    );
};

export default Header;