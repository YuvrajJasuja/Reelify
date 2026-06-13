import { useState, useEffect } from "react";
import Navbar from "../pages/Navbar.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../api.js";
import "../css/Dashboard.css"; // Reuse dashboard styling

function ReelRow({ reel, index }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="db-reel" style={{ "--i": index }}>
      <div className="db-reel__thumb-wrap">
        <video src={reel.videoUrl} className="db-reel__thumb" muted playsInline />
        <div className="db-reel__play">▶</div>
      </div>
      <div className="db-reel__body">
        <p className="db-reel__title">{reel.caption || "No caption"}</p>
        <p className="db-reel__biz">{reel.uploaderName}</p>
        <div className="db-reel__stats">
          <span>📅 {new Date(reel.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="db-reel__cat-badge" style={{
            background: "rgba(96, 69, 226, 0.15)",
            color: "#a855f7",
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: "10px",
            fontWeight: "600",
            border: "1px solid rgba(168, 85, 247, 0.15)",
            marginLeft: "8px"
          }}>
            {reel.category}
          </span>
        </div>
      </div>
      <button className={`db-reel__save ${saved ? "db-reel__save--active" : ""}`} onClick={() => setSaved(!saved)}>
        {saved ? "🔖" : "🏷"}
      </button>
    </div>
  );
}

export default function MyUploads() {
  const { user } = useAuth();
  const [userReels, setUserReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserReels() {
      if (!user) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/reels`, {
          withCredentials: true,
        });
        // Filter reels uploaded by current logged in user
        const filtered = res.data.filter(
          (r) => r.uploadedBy === user._id || r.uploadedBy?._id === user._id
        );
        // Sort by newest first
        const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUserReels(sorted);
      } catch (err) {
        console.error("Error fetching user reels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserReels();
  }, [user]);

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

        {/* Dynamic User Reels List */}
        <section className="db__section">
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "var(--db-text-soft)" }}>
              <div className="reels-loading-spinner" style={{
                width: "24px",
                height: "24px",
                border: "2px solid rgba(255,255,255,0.1)",
                borderTop: "2px solid #6045e2",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginRight: "10px"
              }} />
              <span>Fetching your uploads...</span>
            </div>
          ) : userReels.length > 0 ? (
            <div className="db__reels-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {userReels.map((r, i) => (
                <ReelRow key={r._id} reel={r} index={i} />
              ))}
            </div>
          ) : (
            <div className="db__empty" style={{
              background: "var(--db-surface)",
              border: "1px solid var(--db-border)",
              borderRadius: "var(--db-radius)",
              padding: "80px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "20px"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(96, 69, 226, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px"
              }}>
                🎬
              </div>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>
                  No reels uploaded yet.
                </h2>
                <p style={{ color: "var(--db-text-soft)", fontSize: "13.5px", maxWidth: "400px", margin: "0 auto 16px" }}>
                  You haven't uploaded any reels to Reelify yet. Start sharing your business brand with your audience!
                </p>
                <Link to="/upload" className="db__upload-btn" style={{ textDecoration: "none", display: "inline-flex" }}>
                  <span>+</span> Upload Your First Reel
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
