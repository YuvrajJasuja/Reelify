import Navbar from "../pages/Navbar.jsx";
import { useAuth } from "../context/AuthContext";
import "../css/Dashboard.css"; // Reuse dashboard styling

export default function Profile() {
  const { user } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0910" }}>
      <Navbar />
      <div className="db" style={{ flex: 1 }}>
        {/* Header */}
        <header className="db__header">
          <div className="db__header-left">
            <h1 className="db__title">My Profile</h1>
            <p className="db__subtitle">Manage your brand and see performance</p>
          </div>
        </header>

        {/* Profile Card Section */}
        <section className="db__section" style={{
          background: "var(--db-surface)",
          border: "1px solid var(--db-border)",
          borderRadius: "var(--db-radius)",
          padding: "40px",
          marginBottom: "40px",
          display: "flex",
          gap: "30px",
          alignItems: "center",
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(96,69,226,0.15) 0%, transparent 70%)",
            top: "-100px",
            left: "-100px",
            pointerEvents: "none"
          }} />

          {/* Avatar */}
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--db-accent), var(--db-accent-2))",
            padding: "4px",
            boxShadow: "0 10px 30px rgba(96,69,226,0.3)"
          }}>
            <img
              src="https://i.pravatar.cc/120?img=12"
              alt="Profile Avatar"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #111018"
              }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>
              {user?.fullName || "Valued User"}
            </h2>
            <div style={{
              display: "inline-block",
              background: "rgba(96, 69, 226, 0.15)",
              color: "#a855f7",
              fontSize: "12px",
              fontWeight: "600",
              padding: "4px 12px",
              borderRadius: "20px",
              marginBottom: "16px",
              border: "1px solid rgba(168, 85, 247, 0.2)"
            }}>
              Creator Account
            </div>
            <p style={{ color: "var(--db-text-soft)", fontSize: "14px" }}>
              <strong>Email:</strong> {user?.email || "user@example.com"}
            </p>
          </div>
        </section>

        {/* Analytics Highlights */}
        <section className="db__section">
          <h2 className="db__section-title" style={{ marginBottom: "20px" }}>📊 Channel Statistics</h2>
          <div className="db__stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div className="db-stat" style={{ "--i": 0, opacity: 1, transform: "none" }}>
              <div className="db-stat__top">
                <span className="db-stat__icon">👁</span>
                <span className="db-stat__change db-stat__change--up">↑ 12.5%</span>
              </div>
              <div className="db-stat__value">150.2K</div>
              <div className="db-stat__label">Total Reel Views</div>
              <div className="db-stat__bar">
                <div className="db-stat__bar-fill" style={{ "--w": "65%", transform: "scaleX(1)" }} />
              </div>
            </div>

            <div className="db-stat" style={{ "--i": 1, opacity: 1, transform: "none" }}>
              <div className="db-stat__top">
                <span className="db-stat__icon">❤️</span>
                <span className="db-stat__change db-stat__change--up">↑ 8.3%</span>
              </div>
              <div className="db-stat__value">12.4K</div>
              <div className="db-stat__label">Reel Likes</div>
              <div className="db-stat__bar">
                <div className="db-stat__bar-fill" style={{ "--w": "48%", transform: "scaleX(1)" }} />
              </div>
            </div>

            <div className="db-stat" style={{ "--i": 2, opacity: 1, transform: "none" }}>
              <div className="db-stat__top">
                <span className="db-stat__icon">👥</span>
                <span className="db-stat__change db-stat__change--up">↑ 24.1%</span>
              </div>
              <div className="db-stat__value">4,120</div>
              <div className="db-stat__label">Subscribed Businesses</div>
              <div className="db-stat__bar">
                <div className="db-stat__bar-fill" style={{ "--w": "80%", transform: "scaleX(1)" }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
