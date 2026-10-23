import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

const SignInForm = ({
  signInData,
  setSignInData,
  onSubmit,
  onSwitchToSignUp,
  loading = false,
  error = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {error && (
        <div className="auth-alert-error" role="alert">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form className="auth-form" onSubmit={onSubmit}>
        <label className="auth-label">Enter an email address</label>

        <div className="auth-input-box">
          <Mail size={18} style={{ color: "#64748b", flexShrink: 0 }} />
          <input
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            value={signInData.email}
            onChange={(e) =>
              setSignInData({
                ...signInData,
                email: e.target.value,
              })
            }
          />
        </div>

        <label className="auth-label">Enter your password</label>
        <div className="auth-input-box">
          <Lock size={18} style={{ color: "#64748b", flexShrink: 0 }} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            autoComplete="current-password"
            value={signInData.password}
            onChange={(e) =>
              setSignInData({
                ...signInData,
                password: e.target.value,
              })
            }
          />
          <button
            type="button"
            className="auth-input-eye-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button type="submit" className="auth-primary-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="auth-btn-spinner" /> Signing In...
            </>
          ) : (
            "SIGN IN"
          )}
        </button>
      </form>

      <div className="auth-divider-space" />

      <button className="social-btn google-btn" type="button">
        <span className="social-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.66-.35-1.36-.35-2.09z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        </span>
        Continue with Google
      </button>

      <button className="social-btn facebook-btn" type="button">
        <span className="social-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </span>
        Continue with Facebook
      </button>

      <button className="social-btn apple-btn" type="button">
        <span className="social-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.05 20.28c-.98.95-2.05 1.88-3.08 1.88-1.02 0-1.4-.61-2.53-.61-1.12 0-1.55.59-2.51.61-.98.02-2.12-1-3.13-1.96-2.07-1.97-3.66-5.56-3.66-8.91 0-5.32 3.46-8.13 6.87-8.13 1.08 0 2.1.67 2.76.67.67 0 1.91-.8 3.23-.8 1.38 0 2.63.5 3.44 1.56-2.82 1.7-2.36 5.53.81 6.81-1.19 3.01-2.67 5.93-3.73 6.98zM12.03 4.32c.57-.69.95-1.66.85-2.62-.83.03-1.84.55-2.44 1.26-.51.59-.96 1.57-.84 2.51.93.07 1.87-.46 2.43-1.15z"/>
          </svg>
        </span>
        Continue with Apple
      </button>

      <div className="auth-section-text">
        <p className="bold-text">No account? Create one!</p>
        <button
          className="text-link-btn"
          onClick={onSwitchToSignUp}
          type="button"
        >
          Create your DZIRE SPORT account
        </button>
      </div>
    </>
  );
};

export default SignInForm;
