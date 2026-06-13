import { useState, useEffect, useRef } from "react";
import Navbar from "../pages/Navbar.jsx";
import axios from "axios";
import { API_BASE_URL } from "../api.js";
import "../css/Reels.css";

function ReelCard({ reel, isMuted, toggleMute }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [playState, setPlayState] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 500) + 120);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch((e) => {
              console.log("Playback failed/blocked: ", e);
            });
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(e => console.log(e));
      setPlayState("▶");
    } else {
      videoRef.current.pause();
      setPlayState("❚❚");
    }
    setAnimKey((prev) => prev + 1);
  };

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(reel.videoUrl);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const getAvatarUrl = () => {
    if (reel.uploadedBy && reel.uploadedBy.profilePicture) {
      return reel.uploadedBy.profilePicture;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(reel.uploaderName)}&background=6045e2&color=fff`;
  };

  return (
    <div className="reel-card" ref={cardRef}>
      {/* Video element */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="reel-video"
        loop
        playsInline
        muted={isMuted}
        onClick={handleVideoClick}
      />

      {/* Play/Pause Overlay Animation */}
      {playState && (
        <div key={animKey} className="reel-play-overlay">
          {playState}
        </div>
      )}

      {/* Mute/Unmute Toggle */}
      <button className="reel-mute-btn" onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* Sidebar Action Icons */}
      <div className="reel-actions">
        {/* Like */}
        <button
          className={`reel-action-btn ${liked ? "reel-action-btn--liked" : ""}`}
          onClick={handleLike}
        >
          {liked ? "❤️" : "🤍"}
        </button>
        <span className="reel-action-count">{likeCount}</span>

        {/* Save */}
        <button
          className="reel-action-btn"
          onClick={() => setSaved(!saved)}
          style={{ color: saved ? "#fbbf24" : "#fff" }}
        >
          {saved ? "🔖" : "🏷"}
        </button>
        <span className="reel-action-count">{saved ? "Saved" : "Save"}</span>

        {/* Share */}
        <button className="reel-action-btn" onClick={handleShare}>
          {shared ? "✅" : "🔗"}
        </button>
        <span className="reel-action-count">{shared ? "Copied" : "Share"}</span>
      </div>

      {/* Bottom Info Overlay */}
      <div className="reel-info-overlay">
        <div className="reel-info-header">
          <img src={getAvatarUrl()} alt="Uploader Avatar" className="reel-avatar" />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span className="reel-biz-name">
              {reel.uploaderName}
              <span className="reel-verified">✓</span>
            </span>
            <span className="reel-meta-row" style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="reel-cat-badge-feed" style={{
                background: "rgba(96, 69, 226, 0.25)",
                color: "#c084fc",
                padding: "1px 6px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "600"
              }}>
                {reel.category}
              </span>
              •
              <span>
                {new Date(reel.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </span>
          </div>
        </div>
        <p className="reel-description">{reel.caption}</p>
      </div>
    </div>
  );
}

function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    async function fetchReels() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/reels`, {
          withCredentials: true,
        });
        setReels(res.data);
      } catch (err) {
        console.error("Error fetching reels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReels();
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <>
      <Navbar />
      <div className="reels-page">
        {/* Glow Effects */}
        <div className="reels-bg-orb reels-bg-orb-1" />
        <div className="reels-bg-orb reels-bg-orb-2" />

        {/* Feed container */}
        {loading ? (
          <div className="reels-loading">
            <div className="reels-loading-spinner" />
            <p>Curating your feed...</p>
          </div>
        ) : reels.length > 0 ? (
          <div className="reels-feed">
            {reels.map((reel) => (
              <ReelCard
                key={reel._id}
                reel={reel}
                isMuted={isMuted}
                toggleMute={toggleMute}
              />
            ))}
          </div>
        ) : (
          <div className="reels-empty">
            <span className="reels-empty-icon">🎬</span>
            <h2>No reels uploaded yet.</h2>
            <p>Be the first to upload a reel!</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Reels;