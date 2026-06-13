import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../pages/Navbar.jsx";
import { API_BASE_URL } from "../api.js";
import "../css/UserProfile.css";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfileAndReels() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch public profile and user's reels concurrently
        const [profileRes, reelsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/profile/${userId}`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/api/reels/user/${userId}`, { withCredentials: true })
        ]);
        
        setProfileInfo(profileRes.data);
        setReels(reelsRes.data);
      } catch (err) {
        console.error("Error fetching user profile and reels:", err);
        setError(err.response?.data?.message || "Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    }
    
    if (userId) {
      fetchProfileAndReels();
    }
  }, [userId]);

  const getAvatarUrl = () => {
    if (!profileInfo?.user) return "";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profileInfo.user.fullName)}&background=6045e2&color=fff&size=128`;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0910" }}>
      <Navbar />
      <div className="db" style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", color: "var(--db-text-soft)", flexDirection: "column", gap: "15px" }}>
            <div className="reels-loading-spinner" style={{
              width: "30px",
              height: "30px",
              border: "3px solid rgba(255,255,255,0.1)",
              borderTop: "3px solid #6045e2",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <p>Loading creator profile...</p>
          </div>
        ) : error ? (
          <div style={{
            background: "var(--db-surface)",
            border: "1px solid var(--db-border)",
            borderRadius: "var(--db-radius)",
            padding: "80px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "20px",
            marginTop: "40px"
          }}>
            <span style={{ fontSize: "40px" }}>⚠️</span>
            <h2 style={{ color: "#fff", fontSize: "20px" }}>Error Loading Profile</h2>
            <p style={{ color: "var(--db-text-soft)", fontSize: "14px" }}>{error}</p>
            <button className="db__upload-btn" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        ) : profileInfo ? (
          <>
            {/* Profile Header */}
            <section className="profile-header-card">
              <div className="profile-header-orb" />
              
              <div className="profile-avatar-container">
                <img
                  src={getAvatarUrl()}
                  alt={profileInfo.user.fullName}
                  className="profile-avatar-image"
                />
              </div>

              <div className="profile-meta-info">
                <h2 className="profile-fullname">
                  {profileInfo.user.fullName}
                  <span className="profile-verified-badge">✓</span>
                </h2>
                <div className="profile-tag">Creator Account</div>
                
                {profileInfo.profile.bio ? (
                  <p className="profile-bio-text">{profileInfo.profile.bio}</p>
                ) : (
                  <p className="profile-bio-text empty">No bio provided by creator.</p>
                )}

                <div className="profile-stats-row">
                  <div className="profile-stat-box">
                    <span className="profile-stat-val">{reels.length}</span>
                    <span className="profile-stat-lbl">Reels Uploaded</span>
                  </div>
                </div>

                {/* Optional Contact details if available */}
                {(profileInfo.profile.location || profileInfo.profile.website) && (
                  <div className="profile-extra-details">
                    {profileInfo.profile.location && (
                      <span className="profile-detail-item">
                        📍 {profileInfo.profile.location}
                      </span>
                    )}
                    {profileInfo.profile.website && (
                      <span className="profile-detail-item">
                        🌐 <a href={profileInfo.profile.website.startsWith("http") ? profileInfo.profile.website : `https://${profileInfo.profile.website}`} target="_blank" rel="noopener noreferrer">
                          {profileInfo.profile.website}
                        </a>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Creator Reels Grid */}
            <section className="db__section" style={{ marginTop: "40px" }}>
              <h3 className="profile-reels-title">🎬 Creator's Reels ({reels.length})</h3>
              
              {reels.length > 0 ? (
                <div className="profile-reels-grid">
                  {reels.map((reel) => (
                    <div
                      key={reel._id}
                      className="profile-reel-card"
                      onClick={() => navigate(`/reel/${reel._id}`)}
                    >
                      <div className="profile-reel-thumb-wrap">
                        <video src={reel.videoUrl} className="profile-reel-video" muted playsInline />
                        <div className="profile-reel-overlay">
                          <span className="profile-reel-play-icon">▶</span>
                          <span className="profile-reel-cat-tag">{reel.category}</span>
                        </div>
                      </div>
                      <div className="profile-reel-meta">
                        <p className="profile-reel-caption">{reel.caption || "No caption"}</p>
                        <span className="profile-reel-date">
                          {new Date(reel.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="profile-reels-empty">
                  <span className="empty-icon">🎬</span>
                  <p>This creator has not uploaded any reels yet.</p>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
