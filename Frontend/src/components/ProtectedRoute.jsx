import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

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
        <div className="reels-loading-spinner" style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(255,255,255,0.1)",
          borderTop: "4px solid #6045e2",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "16px"
        }} />
        <p style={{ marginLeft: "12px", fontSize: "16px", color: "rgba(255,255,255,0.7)" }}>Loading details...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and store the original path they tried to visit
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
