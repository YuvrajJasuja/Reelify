import { useState, useRef, useCallback } from "react";
import "../css/Upload.css";
import Navbar from "../pages/Navbar";
import axios from "axios"; // ✅ added

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    title: "",
    description: "",
    hashtags: "",
  });

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

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ✅ UPDATED: REAL UPLOAD FUNCTION
  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();

      formData.append("video", file);
      formData.append("businessName", form.businessName);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("hashtags", form.hashtags);

      const res = await axios.post(
        "http://localhost:1000/reel/upload", // 🔥 backend route
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

    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed");
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setUploading(false);
    setUploadProgress(0);
    setUploaded(false);
    setForm({ businessName: "", title: "", description: "", hashtags: "" });
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes) =>
    bytes >= 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(1)} KB`;

  return (
    <div className="upload-page">
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
          <p className="card-sub">Fill in the details and drop your video below.</p>

          <div className="field">
            <label className="field-label">BUSINESS NAME</label>
            <input
              className="field-input"
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleFormChange}
              placeholder="e.g. Horizon Studios"
            />
          </div>

          <div className="field">
            <label className="field-label">TITLE</label>
            <input
              className="field-input"
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Give your reel a title"
              maxLength={80}
            />
          </div>

          <div className="field">
            <label className="field-label">DESCRIPTION</label>
            <textarea
              className="field-input field-textarea"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="What's this reel about?"
              rows={3}
              maxLength={300}
            />
          </div>

          <div className="field">
            <label className="field-label">HASHTAGS</label>
            <input
              className="field-input"
              type="text"
              name="hashtags"
              value={form.hashtags}
              onChange={handleFormChange}
              placeholder="#travel  #cinematic  #brand"
            />
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
  );
}