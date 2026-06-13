import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Upload.css";
import Navbar from "../pages/Navbar";
import axios from "axios";
import { API_BASE_URL } from "../api.js";

export default function Upload() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [validationError, setValidationError] = useState("");

  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const processFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("video/")) {
      alert("Please upload a video file.");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setUploaded(false);
    setUploadProgress(0);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;

    if (!category) {
      setValidationError("Please select a category for your reel.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("video", file);
      formData.append("caption", caption);
      formData.append("category", category);

      const res = await axios.post(
        `${API_BASE_URL}/api/reel/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      console.log("Upload success:", res.data);
      setUploading(false);
      setUploaded(true);
      
      // Instantly show reel in feed by navigating to /Reels page (react router client-side navigation)
      navigate("/Reels");
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Upload failed");
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setUploading(false);
    setUploadProgress(0);
    setUploaded(false);
    setCaption("");
    setCategory("");
    setValidationError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes) =>
    bytes >= 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(1)} KB`;

  return (
    <div style={{ display: "flex" }}>
      <Navbar />
      <div className="upload-page" style={{ flex: 1 }}>
        <div className="upload-bg">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
        </div>

        <div className="upload-wrapper">
          <div className="upload-card">
            <div className="card-eyebrow">UPLOAD REEL</div>
            <h1 className="card-heading">
              Share your<br />reel with us
            </h1>
            <p className="card-sub">Write a caption and select your video file to publish.</p>

            <div className="field">
              <label className="field-label">CAPTION</label>
              <textarea
                className="field-input field-textarea"
                name="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's this reel about? Add tags #fun #creative"
                rows={4}
                maxLength={300}
              />
            </div>

            <div className="field">
              <label className="field-label">CATEGORY</label>
              <div className="category-select-pills">
                {[
                  "Food & Drink",
                  "Fitness",
                  "Beauty",
                  "Technology",
                  "Lifestyle",
                  "Fashion",
                  "Travel"
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-pill-btn ${category === cat ? "active" : ""}`}
                    onClick={() => {
                      setCategory(cat);
                      setValidationError("");
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {validationError && (
                <span className="field-error" style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", fontWeight: "500" }}>
                  {validationError}
                </span>
              )}
            </div>

            <div className="field">
              <label className="field-label">VIDEO FILE</label>
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {!file ? (
                <div
                  className={`drop-zone ${dragActive ? "drag-active" : ""}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  <div className="drop-icon">⬆️</div>
                  <p className="drop-main">
                    {dragActive ? "Drop it here!" : "Drag & drop your video"}
                  </p>
                  <p className="drop-hint">or <span>click to browse</span></p>
                </div>
              ) : (
                <div className="file-preview">
                  <video src={preview} className="video-thumb" controls />
                  <p>{file.name} ({formatSize(file.size)})</p>

                  <div className="progress-wrap">
                    <div className="progress-track">
                      <div
                        className="progress-bar"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span>{uploadProgress}%</span>
                  </div>

                  <button onClick={handleReset}>Remove</button>
                </div>
              )}
            </div>

            <button
              className="btn-upload"
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? "Uploading..." : "Upload Reel →"}
            </button>
          </div>

          <div className="upload-panel">
            <div className="panel-inner">
              <h2>Reach your audience instantly</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}