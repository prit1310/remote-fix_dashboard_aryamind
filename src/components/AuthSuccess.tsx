import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccess = ({ onAuthSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    localStorage.setItem("token", token);

    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          onAuthSuccess?.(data.user, token);
          if (data.user.role === "admin" || data.user.role === "superadmin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } else {
          throw new Error("User data missing");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      });
  }, [searchParams, navigate, onAuthSuccess]);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;