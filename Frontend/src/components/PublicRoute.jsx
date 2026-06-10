import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#0a0910",
        color: "#fff",
        fontFamily: "'Outfit', sans-serif"
      }}>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)" }}>Loading...</p>
      </div>
    );
  }

  if (user) {
    // If logged in, redirect them to the home page
    return <Navigate to="/" replace />;
  }

  return children;
}
