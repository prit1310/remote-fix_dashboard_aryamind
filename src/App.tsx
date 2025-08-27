import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserDashboard from "@/components/UserDashboard";
import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import AdminDashboard from "@/components/AdminDashboard";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // NEW
  const navigate = useNavigate();

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:4000/api/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            if (
              (data.user.role === "admin" || data.user.role === "superadmin") &&
              window.location.pathname === "/"
            ) {
              navigate("/admin", { replace: true });
            }
          }
          setCheckingAuth(false);
        })
        .catch(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  // Called after successful login/signup
  const handleAuthSuccess = (user: { name: string; email: string; role: string }, token: string) => {
    setUser(user);
    localStorage.setItem("token", token);
    setShowAuthModal(false);
    if (user.role === "admin" || user.role === "superadmin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  if (checkingAuth) {
    // You can show a spinner or loading indicator here
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/admin"
          element={
            user && (user.role === "admin" || user.role === "superadmin")
              ? <AdminDashboard />
              : <div className="container mx-auto px-4 py-8 max-w-6xl text-center text-xl font-semibold">You are not admin</div>
          }
        />
        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/" replace />
            ) : user.role === "admin" || user.role === "superadmin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <UserDashboard user={user} />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;