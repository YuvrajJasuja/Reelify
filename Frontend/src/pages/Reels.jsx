import { useState, useEffect, useRef } from "react";
import Navbar from "../pages/Navbar.jsx";
import axios from "axios";
import { API_BASE_URL } from "../api.js";
import "../css/Reels.css";

const CATEGORIES = ["All", "Food & Drink", "Fitness", "Beauty", "Technology", "Lifestyle", "Travel"];

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
    navigator.clipboard.writeText(reel.reel);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  // Get first letter of business name for avatar placeholder if no user avatar exists
  const getAvatarUrl = () => {
    const index = Math.abs(reel.businessName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 70;
    return `https://i.pravatar.cc/100?img=${index}`;
  };

  return (
    <div className="reel-card" ref={cardRef}>
      {/* Video element */}
      <video
        ref={videoRef}
        src={reel.reel}
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
          <img src={getAvatarUrl()} alt="Business Avatar" className="reel-avatar" />
          <span className="reel-biz-name">
            {reel.businessName}
            <span className="reel-verified">✓</span>
          </span>
          <span className="reel-category">{reel.category}</span>
        </div>
        <p className="reel-description">{reel.description}</p>
        
        {reel.bussinessUrl && (
          <a
            href={reel.bussinessUrl.startsWith("http") ? reel.bussinessUrl : `https://${reel.bussinessUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="reel-link-btn"
          >
            🌐 Visit Website
          </a>
        )}
      </div>
    </div>
  );
}

function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

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

  const filteredReels = reels.filter(
    (reel) => activeCategory === "All" || reel.category === activeCategory
  );

  return (
    <>
      <Navbar />
      <div className="reels-page">
        {/* Glow Effects */}
        <div className="reels-bg-orb reels-bg-orb-1" />
        <div className="reels-bg-orb reels-bg-orb-2" />

        {/* Category filters */}
        <div className="reels-filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`reels-filter-btn ${activeCategory === cat ? "reels-filter-btn--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feed container */}
        {loading ? (
          <div className="reels-loading">
            <div className="reels-loading-spinner" />
            <p>Curating your feed...</p>
          </div>
        ) : filteredReels.length > 0 ? (
          <div className="reels-feed">
            {filteredReels.map((reel) => (
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
            <h2>No Reels Found</h2>
            <p>Be the first to upload a reel in this category!</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Reels;