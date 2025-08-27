import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Monitor, User } from "lucide-react";

const AdminHeader = ({ onLogout }: { onLogout: () => void }) => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
        <Monitor className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          RemoteFix Pro
        </span>
      </Link>
      <div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <User className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  </header>
);

export default AdminHeader;