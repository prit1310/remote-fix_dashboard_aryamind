import { Monitor, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-tech-dark text-tech-light px-4">
      <div className="flex items-center gap-3 mb-6">
        <Monitor className="h-10 w-10 text-primary" />
        <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          RemoteFix Pro
        </span>
      </div>
      <h1 className="text-5xl font-extrabold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-tech-light/80 mb-8 text-center max-w-md">
        Oops! The page you are looking for doesn’t exist or has been moved.<br />
        If you think this is a mistake, please contact our support.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;