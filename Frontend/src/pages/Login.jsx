import { useState } from "react";
import "../css/Login.css";
import Navbar from "../pages/Navbar";

/* ── SVG Icons ── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

/* ── Sign In Form ── */
function SignInForm() {
  return (
    <div className="form-inner">
      <p className="form-eyebrow">Welcome back</p>
      <h2 className="form-title">Sign in to<br/>your account</h2>
      <p className="form-subtitle">Good to see you again. Enter your details below.</p>

      <div className="field">
        <label>Email</label>
        <input type="email" placeholder="you@example.com" />
      </div>

      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" />
      </div>

      <div className="field-row">
        <label className="remember">
          <input type="checkbox" /> Remember me
        </label>
        <a href="#" className="forgot-link">Forgot password?</a>
      </div>

      <button className="btn-primary">Sign In</button>

      <div className="or-divider"><span>or continue with</span></div>

      <div className="social-row">
        <button className="btn-social"><GoogleIcon /> Google</button>
        {/* <button className="btn-social"><FacebookIcon /> Facebook</button> */}
      </div>
    </div>
  );
}

/* ── Sign Up Form ── */
function SignUpForm() {
  return (
    <div className="form-inner">
      <p className="form-eyebrow">Get started</p>
      <h2 className="form-title">Create your<br/>account</h2>
      <p className="form-subtitle">Join thousands of users. Free forever.</p>

      <div className="field">
        <label>Full Name</label>
        <input type="text" placeholder="John Doe" />
      </div>

      <div className="field">
        <label>Email</label>
        <input type="email" placeholder="you@example.com" />
      </div>

      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="Create a strong password" />
      </div>

      <button className="btn-primary" style={{ marginTop: "8px" }}>Create Account</button>

      <div className="or-divider"><span>or sign up with</span></div>

      <div className="social-row">
        <button className="btn-social"><GoogleIcon /> Google</button>
        {/* <button className="btn-social"><FacebookIcon /> Facebook</button> */}
      </div>
    </div>
  );
}

/* ── Main Login Component ── */
export default function Login() {
  
  const [isActive, setIsActive] = useState(false);

  return (
    <div style={{ display: "flex" }}>
   <Navbar/>
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className={`auth-container${isActive ? " active" : ""}`}>

          {/* Sign In Panel */}
          <div className="form-panel sign-in-panel">
            <SignInForm />
          </div>

          {/* Sign Up Panel */}
          <div className="form-panel sign-up-panel">
            <SignUpForm />
          </div>

          {/* Sliding Overlay */}
          <div className="overlay-panel">
            <div className="overlay-content">

              {/* Left half — shown by default → prompts to Sign Up */}
              <div className="overlay-half left">
                <div className="overlay-ring"><UserIcon /></div>
                <p className="overlay-eyebrow">New here?</p>
                <h3 className="overlay-title">Start your journey with us</h3>
                <p className="overlay-text">
                  Create a free account and unlock everything in under a minute.
                </p>
                <button className="btn-ghost" onClick={() => setIsActive(true)}>
                  Create Account →
                </button>
              </div>

              {/* Right half — shown when active → prompts to Sign In */}
              <div className="overlay-half right">
                <div className="overlay-ring"><SparkleIcon /></div>
                <p className="overlay-eyebrow">Already a member?</p>
                <h3 className="overlay-title">Welcome back, friend</h3>
                <p className="overlay-text">
                  Sign in to pick up right where you left off.
                </p>
                <button className="btn-ghost" onClick={() => setIsActive(false)}>
                  ← Sign In
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}
