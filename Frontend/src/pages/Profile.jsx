import { useState, useEffect } from "react";
import Navbar from "../pages/Navbar.jsx";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../api.js";
import "../css/Dashboard.css"; // Reuse general dashboard layout
import "../css/Profile.css"; // Include custom profile styling

export default function Profile() {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  
  // Profile state
  const [profileData, setProfileData] = useState({
    bio: "",
    aboutBusiness: "",
    contactEmail: "",
    phoneNumber: "",
    website: "",
    location: ""
  });

  // Edit states for sections
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Form inputs temporary state while editing
  const [bioInput, setBioInput] = useState("");
  const [businessInput, setBusinessInput] = useState("");
  const [contactInputs, setContactInputs] = useState({
    contactEmail: "",
    phoneNumber: "",
    website: "",
    location: ""
  });

  // Fetch Profile data from MongoDB
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/profile`, {
          withCredentials: true
        });
        if (response.data) {
          setProfileData(response.data);
          setBioInput(response.data.bio || "");
          setBusinessInput(response.data.aboutBusiness || "");
          setContactInputs({
            contactEmail: response.data.contactEmail || user?.email || "",
            phoneNumber: response.data.phoneNumber || "",
            website: response.data.website || "",
            location: response.data.location || ""
          });
        }
      } catch (error) {
        console.error("Error fetching profile from MongoDB:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Show temporary toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Save changes helper
  const handleSaveProfile = async (updatedFields, successMsg, closeEditFn) => {
    try {
      const mergedData = { ...profileData, ...updatedFields };
      const response = await axios.put(`${API_BASE_URL}/api/profile`, mergedData, {
        withCredentials: true
      });
      if (response.data && response.data.profile) {
        setProfileData(response.data.profile);
        triggerToast(successMsg);
        closeEditFn();
      }
    } catch (error) {
      console.error("Error saving profile details:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Bio saves
  const handleBioSave = () => {
    handleSaveProfile({ bio: bioInput }, "Bio updated successfully!", () => setIsEditingBio(false));
  };

  // Business info saves
  const handleBusinessSave = () => {
    handleSaveProfile({ aboutBusiness: businessInput }, "Business information updated successfully!", () => setIsEditingBusiness(false));
  };

  // Contact info saves
  const handleContactSave = () => {
    handleSaveProfile(contactInputs, "Contact information updated successfully!", () => setIsEditingContact(false));
  };

  // Cancel helpers
  const handleBioCancel = () => {
    setBioInput(profileData.bio || "");
    setIsEditingBio(false);
  };

  const handleBusinessCancel = () => {
    setBusinessInput(profileData.aboutBusiness || "");
    setIsEditingBusiness(false);
  };

  const handleContactCancel = () => {
    setContactInputs({
      contactEmail: profileData.contactEmail || user?.email || "",
      phoneNumber: profileData.phoneNumber || "",
      website: profileData.website || "",
      location: profileData.location || ""
    });
    setIsEditingContact(false);
  };

  // Determine if contact information is completely empty
  const isContactEmpty = !profileData.contactEmail && !profileData.phoneNumber && !profileData.website && !profileData.location;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0910" }}>
      <Navbar />
      
      {/* Success Toast */}
      {toastMessage && (
        <div className="pf-toast">
          <span>✅</span> {toastMessage}
        </div>
      )}

      <div className="db">
        {/* Header */}
        <header className="db__header">
          <div className="db__header-left">
            <h1 className="db__title">My Profile</h1>
            <p className="db__subtitle">Manage your creator brand and contact info</p>
          </div>
        </header>

        {loading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            color: "rgba(255, 255, 255, 0.6)",
            gap: "10px",
            fontFamily: "'Outfit', sans-serif"
          }}>
            <div className="reels-loading-spinner" style={{
              width: "30px",
              height: "30px",
              border: "3px solid rgba(255,255,255,0.1)",
              borderTop: "3px solid #6045e2",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <p>Retrieving your profile from database...</p>
          </div>
        ) : (
          <>
            {/* Profile Banner / Details */}
            <section className="pf-header-banner">
              <div style={{
                position: "absolute",
                width: "300px",
                height: "300px",
                background: "radial-gradient(circle, rgba(96,69,226,0.12) 0%, transparent 70%)",
                top: "-100px",
                left: "-100px",
                pointerEvents: "none"
              }} />

              {/* Avatar */}
              <div style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--db-accent), var(--db-accent-2))",
                padding: "3px",
                boxShadow: "0 8px 25px rgba(96,69,226,0.25)"
              }}>
                <img
                  src={user?.profilePicture || "https://i.pravatar.cc/100?img=12"}
                  alt="Profile Avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #111018"
                  }}
                />
              </div>

              {/* Basic Info */}
              <div className="pf-header-info">
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#fff", marginBottom: "4px" }}>
                  {user?.fullName || "Valued User"}
                </h2>
                <div style={{
                  display: "inline-block",
                  background: "rgba(96, 69, 226, 0.15)",
                  color: "#a855f7",
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  marginBottom: "10px",
                  border: "1px solid rgba(168, 85, 247, 0.15)"
                }}>
                  Creator Account
                </div>
                <p style={{ color: "var(--db-text-soft)", fontSize: "13.5px" }}>
                  Registered Email: {user?.email}
                </p>
              </div>
            </section>

            {/* Profile Management Sections */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
              
              {/* 1. Bio Section */}
              <div className="pf-card">
                <div className="pf-card__header">
                  <h3 className="pf-card__title">📝 Bio</h3>
                  {!isEditingBio ? (
                    <button className="pf-card__btn" onClick={() => setIsEditingBio(true)}>✏️ Edit Bio</button>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="pf-card__btn pf-card__btn--save" onClick={handleBioSave}>💾 Save</button>
                      <button className="pf-card__btn pf-card__btn--cancel" onClick={handleBioCancel}>❌ Cancel</button>
                    </div>
                  )}
                </div>

                {!isEditingBio ? (
                  profileData.bio ? (
                    <p className="pf-content">{profileData.bio}</p>
                  ) : (
                    <p className="pf-empty">No bio added yet.</p>
                  )
                ) : (
                  <textarea
                    className="pf-textarea"
                    placeholder="Tell your audience a little bit about yourself or your business..."
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    maxLength={250}
                  />
                )}
              </div>

              {/* 2. About Business Section */}
              <div className="pf-card">
                <div className="pf-card__header">
                  <h3 className="pf-card__title">💼 About Business</h3>
                  {!isEditingBusiness ? (
                    <button className="pf-card__btn" onClick={() => setIsEditingBusiness(true)}>✏️ Edit About</button>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="pf-card__btn pf-card__btn--save" onClick={handleBusinessSave}>💾 Save</button>
                      <button className="pf-card__btn pf-card__btn--cancel" onClick={handleBusinessCancel}>❌ Cancel</button>
                    </div>
                  )}
                </div>

                {!isEditingBusiness ? (
                  profileData.aboutBusiness ? (
                    <p className="pf-content">{profileData.aboutBusiness}</p>
                  ) : (
                    <p className="pf-empty">No business information added yet.</p>
                  )
                ) : (
                  <textarea
                    className="pf-textarea"
                    placeholder="Describe your brand, services, target audience, or content niches..."
                    value={businessInput}
                    onChange={(e) => setBusinessInput(e.target.value)}
                    maxLength={1000}
                    style={{ minHeight: "140px" }}
                  />
                )}
              </div>

              {/* 3. Contact Information Section */}
              <div className="pf-card">
                <div className="pf-card__header">
                  <h3 className="pf-card__title">📞 Contact Information</h3>
                  {!isEditingContact ? (
                    <button className="pf-card__btn" onClick={() => setIsEditingContact(true)}>✏️ Edit Contact</button>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="pf-card__btn pf-card__btn--save" onClick={handleContactSave}>💾 Save</button>
                      <button className="pf-card__btn pf-card__btn--cancel" onClick={handleContactCancel}>❌ Cancel</button>
                    </div>
                  )}
                </div>

                {!isEditingContact ? (
                  isContactEmpty ? (
                    <p className="pf-empty">No contact information added yet.</p>
                  ) : (
                    <ul className="pf-contact-list">
                      {profileData.contactEmail && (
                        <li className="pf-contact-item">
                          <span className="pf-contact-label">📧 Email:</span>
                          <span className="pf-contact-val">
                            <a href={`mailto:${profileData.contactEmail}`}>{profileData.contactEmail}</a>
                          </span>
                        </li>
                      )}
                      {profileData.phoneNumber && (
                        <li className="pf-contact-item">
                          <span className="pf-contact-label">📞 Phone:</span>
                          <span className="pf-contact-val">{profileData.phoneNumber}</span>
                        </li>
                      )}
                      {profileData.website && (
                        <li className="pf-contact-item">
                          <span className="pf-contact-label">🌐 Website:</span>
                          <span className="pf-contact-val">
                            <a href={profileData.website.startsWith("http") ? profileData.website : `https://${profileData.website}`} target="_blank" rel="noopener noreferrer">
                              {profileData.website}
                            </a>
                          </span>
                        </li>
                      )}
                      {profileData.location && (
                        <li className="pf-contact-item">
                          <span className="pf-contact-label">📍 Location:</span>
                          <span className="pf-contact-val">{profileData.location}</span>
                        </li>
                      )}
                    </ul>
                  )
                ) : (
                  <div className="pf-input-group">
                    <div className="pf-input-field">
                      <label>Contact Email</label>
                      <input
                        type="email"
                        className="pf-input"
                        placeholder="business@example.com"
                        value={contactInputs.contactEmail}
                        onChange={(e) => setContactInputs({ ...contactInputs, contactEmail: e.target.value })}
                      />
                    </div>
                    <div className="pf-input-field">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        className="pf-input"
                        placeholder="+1 (555) 019-2834"
                        value={contactInputs.phoneNumber}
                        onChange={(e) => setContactInputs({ ...contactInputs, phoneNumber: e.target.value })}
                      />
                    </div>
                    <div className="pf-input-field">
                      <label>Website</label>
                      <input
                        type="text"
                        className="pf-input"
                        placeholder="https://mybusiness.com"
                        value={contactInputs.website}
                        onChange={(e) => setContactInputs({ ...contactInputs, website: e.target.value })}
                      />
                    </div>
                    <div className="pf-input-field">
                      <label>Location</label>
                      <input
                        type="text"
                        className="pf-input"
                        placeholder="New York, NY"
                        value={contactInputs.location}
                        onChange={(e) => setContactInputs({ ...contactInputs, location: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
