import Navbar from "../pages/Navbar.jsx";
import { Link } from "react-router-dom";
import "../css/Dashboard.css"; // Reuse dashboard styling

export default function MyUploads() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0910" }}>
      <Navbar />
      <div className="db" style={{ flex: 1 }}>
        {/* Header */}
        <header className="db__header">
          <div className="db__header-left">
            <h1 className="db__title">My Uploads</h1>
            <p className="db__subtitle">View and manage your published reels</p>
          </div>
          <div className="db__header-right">
            <Link to="/upload" className="db__upload-btn" style={{ textDecoration: "none" }}>
              <span>+</span> Upload New Reel
            </Link>
          </div>
        </header>

        {/* Placeholder Message */}
        <section className="db__section" style={{
          background: "var(--db-surface)",
          border: "1px solid var(--db-border)",
          borderRadius: "var(--db-radius)",
          padding: "80px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "24px"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(96, 69, 226, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px"
          }}>
            🎬
          </div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#fff", marginBottom: "10px" }}>
              Reel upload functionality coming soon!
            </h2>
            <p style={{ color: "var(--db-text-soft)", fontSize: "14px", maxWidth: "450px", margin: "0 auto" }}>
              You will soon be able to view, manage, and edit your custom business reels right from this dashboard. Keep creating!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
