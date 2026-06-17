import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      loginWithToken(token)
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.error("Token authentication failed:", err);
          navigate("/login?error=auth_failed", { replace: true });
        });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#0a0910",
      color: "#fff",
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "4px solid rgba(255,255,255,0.1)",
        borderTop: "4px solid #6045e2",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "16px"
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)" }}>Completing authentication...</p>
    </div>
  );
}
