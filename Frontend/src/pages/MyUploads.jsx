import { useState, useEffect } from "react";
import Navbar from "../pages/Navbar.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../api.js";
import { Trash2, UploadCloud } from "lucide-react";
import "../css/Dashboard.css"; // Reuse dashboard styling

function ReelRow({ reel, index, onDelete }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(reel);
  };

  return (
    <div className="db-reel" style={{ "--i": index, cursor: "default" }}>
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

      {/* Delete button positioned far right */}
      <button 
        className="db-reel__delete-btn" 
        onClick={handleDeleteClick} 
        title="Delete Reel"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function MyUploads() {
  const { user } = useAuth();
  const [userReels, setUserReels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deletion States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reelToDelete, setReelToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Toast States
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); // "success" or "error"

  const triggerToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
      setToastType("");
    }, 3000);
  };

  useEffect(() => {
    async function fetchUserReels() {
      if (!user) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/reels`, {
          withCredentials: true,
        });
        const filtered = res.data.filter(
          (r) => r.uploadedBy === user._id || r.uploadedBy?._id === user._id
        );
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

  const handleDeleteRequest = (reel) => {
    setReelToDelete(reel);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!reelToDelete) return;
    try {
      setDeleting(true);
      await axios.delete(`${API_BASE_URL}/api/reel/${reelToDelete._id}`, {
        withCredentials: true,
      });

      // Update state instantly without page reload
      setUserReels((prev) => prev.filter((r) => r._id !== reelToDelete._id));
      triggerToast("Reel deleted successfully", "success");
      setShowDeleteModal(false);
      setReelToDelete(null);
    } catch (err) {
      console.error("Error deleting reel:", err);
      const msg = err.response?.data?.message || "Failed to delete reel";
      triggerToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0910" }}>
      <Navbar />
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`pf-toast ${toastType === "error" ? "pf-toast--error" : ""}`} style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: toastType === "error" ? "#7f1d1d" : "#111018",
          border: toastType === "error" ? "1px solid #ef4444" : "1px solid var(--db-border)",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 1000,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}>
          <span>{toastType === "error" ? "❌" : "✅"}</span> {toastMessage}
        </div>
      )}

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
                <ReelRow key={r._id} reel={r} index={i} onDelete={handleDeleteRequest} />
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
                color: "#a855f7"
              }}>
                <UploadCloud size={32} />
              </div>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>
                  No reels uploaded yet
                </h2>
                <p style={{ color: "var(--db-text-soft)", fontSize: "13.5px", maxWidth: "400px", margin: "0 auto 16px" }}>
                  Upload your first reel to get started
                </p>
                <Link to="/upload" className="db__upload-btn" style={{ textDecoration: "none", display: "inline-flex" }}>
                  Upload New Reel
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3 className="confirm-modal__title">Confirm Deletion</h3>
            <p className="confirm-modal__text">
              Are you sure you want to delete this reel? This action cannot be undone.
            </p>
            <div className="confirm-modal__actions">
              <button 
                className="confirm-modal__btn confirm-modal__btn--cancel"
                onClick={() => { setShowDeleteModal(false); setReelToDelete(null); }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className="confirm-modal__btn confirm-modal__btn--delete"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Reel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
