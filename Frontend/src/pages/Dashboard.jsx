import { useState, useEffect } from "react";
import "../css/Dashboard.css";
import Navbar from "../pages/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../api.js";

const CATEGORIES = ["All", "Food & Drink", "Fitness", "Beauty", "Technology", "Lifestyle", "Fashion", "Travel"];

/* ── Sub-components ── */

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

/* ── Dashboard ── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery]       = useState("");

  useEffect(() => {
    async function fetchReels() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/reels`, {
          withCredentials: true,
        });
        // Sort by newest first explicitly
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReels(sorted);
      } catch (err) {
        console.error("Error fetching reels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReels();
  }, []);

  const getCategoryCount = (cat) => {
    if (cat === "All") return reels.length;
    return reels.filter(r => r.category === cat).length;
  };

  const filteredReels = reels.filter(r => {
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      (r.caption && r.caption.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (r.uploaderName && r.uploaderName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUploadClick = () => {
    if (user) {
      navigate("/upload");
    } else {
      navigate("/login", {
        state: {
          from: "/upload",
          message: "Please login first to upload reels."
        }
      });
    }
  };

  return (
    <div>
      <Navbar />
  
      <div className="db">
        {/* ── Header ── */}
        <header className="db__header">
          <div className="db__header-left">
            <h1 className="db__title">Reelify</h1>
            <p className="db__subtitle">Boost your business</p>
          </div>
          <div className="db__header-right">
            <div className="db__search">
              <span className="db__search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search reels, businesses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="db__search-input"
              />
            </div>
            <button className="db__upload-btn" onClick={handleUploadClick}>
              <span>+</span> Upload Reel
            </button>
          </div>
        </header>

        {/* ── Reels Section ── */}
        <section className="db__section">
          <div className="db__section-head">
            <h2 className="db__section-title">🎬 Reels Feed</h2>
          </div>

          {/* Category Filter */}
          <div className="db__cats">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`db__cat ${activeCategory === cat ? "db__cat--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat} ({getCategoryCount(cat)})
              </button>
            ))}
          </div>

          {/* Grouped / List Reels */}
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
              <span>Fetching reels...</span>
            </div>
          ) : reels.length === 0 ? (
            <div className="db__empty">
              <p>No reels uploaded yet.</p>
            </div>
          ) : filteredReels.length === 0 ? (
            <div className="db__empty">
              <p>No reels found matching your criteria.</p>
            </div>
          ) : activeCategory === "All" ? (
            CATEGORIES.filter(cat => cat !== "All").map(cat => {
              const catReels = filteredReels.filter(r => r.category === cat);
              if (catReels.length === 0) return null;
              return (
                <div key={cat} className="db__category-group" style={{ marginBottom: "30px" }}>
                  <h3 style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.9)",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    paddingBottom: "6px"
                  }}>
                    <span>📁</span> {cat} ({catReels.length})
                  </h3>
                  <div className="db__reels-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {catReels.map((r, i) => (
                      <ReelRow key={r._id} reel={r} index={i} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="db__category-group">
              <h3 style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                paddingBottom: "6px"
              }}>
                <span>📁</span> {activeCategory} ({filteredReels.length})
              </h3>
              <div className="db__reels-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredReels.map((r, i) => (
                  <ReelRow key={r._id} reel={r} index={i} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
