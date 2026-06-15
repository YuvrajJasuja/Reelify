import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/Navbar.css";


/* ── Icons ── */
const HomeIcon = ({ filled }) => filled ? (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/><path d="M3 12v9h18v-9"/>
  </svg>
);

const ReelsIcon = ({ filled }) => filled ? (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm6 6l6 4-6 4V8z"/></svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="3"/><polygon points="10,8 16,12 10,16"/>
  </svg>
);

const LoginIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SignUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="17" y1="11" x2="23" y2="11"/>
  </svg>
);

const MyUploadsIcon = ({ filled }) => filled ? (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 6H2v14a2 2 0 0 0 2 2h14v-2H4V6zm16-4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="12" height="14" rx="2" ry="2"/>
    <path d="M4 6v14a2 2 0 0 0 2 2h12"/>
    <polygon points="12 7 17 10 12 13"/>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const ExploreIcon = ({ filled }) => filled ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const MessageIcon = ({ filled }) => filled ? (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const NotifIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const UploadIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3"  y="3"  width="7" height="7" rx="1"/>
    <rect x="14" y="3"  width="7" height="7" rx="1"/>
    <rect x="3"  y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const LogoIcon = () => (
  <svg viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="url(#lg)"/>
    <polygon points="12,9 23,16 12,23" fill="white"/>
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
        <stop offset="0%" stopColor="#6045e2"/>
        <stop offset="100%" stopColor="#a855f7"/>
      </linearGradient>
    </defs>
  </svg>
);

/* ── Nav Data ── */
const NAV_ITEMS = [
  { id: "home",          label: "Home",          icon: HomeIcon,    badge: null ,path:"/"},
  { id: "reels",         label: "Reels",         icon: ReelsIcon,   badge: null ,path:"/Reels"},
];

/* ── Main Component ── */
export default function Navbar({ onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <>
      <nav className={`nb${expanded ? " nb--open" : ""}`}>

      {/* Logo */}
      <div className="nb__logo" onClick={() => setExpanded(!expanded)}>
        <span className="nb__logo-icon"><LogoIcon /></span>
        <span className="nb__logo-text">BoostReel</span>
      </div>

      {/* Main links */}
      <ul className="nb__list">
        {NAV_ITEMS.map((item, i) => {
          const Icon = item.icon;

          return (
            <li key={item.id} style={{ "--i": i }}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nb__item ${isActive ? "nb__item--active" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="nb__icon-wrap">
                      <Icon filled={isActive} />
                      {item.badge && (
                        <span className="nb__badge">{item.badge}</span>
                      )}
                      {item.dot && !item.badge && (
                        <span className="nb__dot" />
                      )}
                    </span>

                    <span className="nb__label">{item.label}</span>
                    {isActive && <span className="nb__active-bar" />}
                  </>
                )}
              </NavLink>
            </li>
          );
        })}

        {/* Dynamic My Uploads link (only if logged in) */}
        {!loading && user && (
          <li style={{ "--i": NAV_ITEMS.length }}>
            <NavLink
              to="/my-uploads"
              className={({ isActive }) =>
                `nb__item ${isActive ? "nb__item--active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="nb__icon-wrap">
                    <MyUploadsIcon filled={isActive} />
                  </span>
                  <span className="nb__label">My Uploads</span>
                  {isActive && <span className="nb__active-bar" />}
                </>
              )}
            </NavLink>
          </li>
        )}

        {/* Dynamic footer links based on authentication state */}
        {!loading && !user ? (
          <>
            {/* Login */}
            <li style={{ "--i": NAV_ITEMS.length + 1 }} className="nb__profile">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nb__item ${isActive ? "nb__item--active" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="nb__icon-wrap">
                      <LoginIcon />
                    </span>
                    <span className="nb__label">Login</span>
                    {isActive && <span className="nb__active-bar" />}
                  </>
                )}
              </NavLink>
            </li>
          </>
        ) : !loading && user ? (
          <>
            {/* Profile */}
            <li style={{ "--i": NAV_ITEMS.length + 1 }} className="nb__profile">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nb__item ${isActive ? "nb__item--active" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="nb__icon-wrap nb__avatar-wrap">
                      <img
                        src={user?.profilePicture || "https://i.pravatar.cc/40?img=12"}
                        alt="Profile"
                        className={`nb__avatar ${
                          isActive ? "nb__avatar--active" : ""
                        }`}
                      />
                    </span>

                    <span className="nb__label">Profile</span>
                    {isActive && <span className="nb__active-bar" />}
                  </>
                )}
              </NavLink>
            </li>

            {/* Logout */}
            <li style={{ "--i": NAV_ITEMS.length + 2 }}>
              <div
                className="nb__item"
                onClick={() => setShowLogoutModal(true)}
                style={{ cursor: "pointer" }}
              >
                <span className="nb__icon-wrap">
                  <LogoutIcon />
                </span>
                <span className="nb__label">Logout</span>
              </div>
            </li>
          </>
        ) : null}
      </ul>
    </nav>

    {/* Logout Confirmation Modal */}
    {showLogoutModal && (
      <div className="nb-logout-modal-overlay">
        <div className="nb-logout-modal">
          <h3 className="nb-logout-modal__title">
            Are you sure you want to logout?
          </h3>
          <p className="nb-logout-modal__text">
            You will need to sign back in to access your uploads and profile features.
          </p>
          <div className="nb-logout-modal__actions">
            <button 
              className="nb-logout-modal__btn nb-logout-modal__btn--yes"
              onClick={handleConfirmLogout}
            >
              Yes
            </button>
            <button 
              className="nb-logout-modal__btn nb-logout-modal__btn--no"
              onClick={() => setShowLogoutModal(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
      {/* Bottom links */}
      {/* <div className="nb__bottom">
        <div className="nb__divider" />
        <ul className="nb__list">
          <li className="nb__item" onClick={() => setExpanded(!expanded)}>
            <span className="nb__icon-wrap"><MoreIcon /></span>
            <span className="nb__label">More</span>
          </li>
          <li className="nb__item" onClick={() => handleClick("settings")}>
            <span className="nb__icon-wrap"><GridIcon /></span>
            <span className="nb__label">Settings</span>
          </li>
        </ul>
      </div> */}
