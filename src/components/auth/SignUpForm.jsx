import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

const SignUpForm = ({
  signUpData,
  setSignUpData,
  onSubmit,
  onSwitchToSignIn,
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
        <label className="auth-label">Enter your full name</label>
        <div className="auth-input-box">
          <User size={18} style={{ color: "#64748b", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Full name"
            required
            autoComplete="name"
            value={signUpData.name}
            onChange={(e) =>
              setSignUpData({ ...signUpData, name: e.target.value })
            }
          />
        </div>

        <label className="auth-label">Enter your email address</label>
        <div className="auth-input-box">
          <Mail size={18} style={{ color: "#64748b", flexShrink: 0 }} />
          <input
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            value={signUpData.email}
            onChange={(e) =>
              setSignUpData({ ...signUpData, email: e.target.value })
            }
          />
        </div>

        <label className="auth-label">Create password</label>
        <div className="auth-input-box">
          <Lock size={18} style={{ color: "#64748b", flexShrink: 0 }} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (minimum 6 characters)"
            required
            minLength={6}
            autoComplete="new-password"
            value={signUpData.password}
            onChange={(e) =>
              setSignUpData({
                ...signUpData,
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
              <span className="auth-btn-spinner" /> Creating Account...
            </>
          ) : (
            "CREATE ACCOUNT"
          )}
        </button>
      </form>

      {onSwitchToSignIn && (
        <div className="auth-section-text" style={{ marginTop: "24px" }}>
          <p className="bold-text">Already have an account?</p>
          <button
            className="text-link-btn"
            onClick={onSwitchToSignIn}
            type="button"
          >
            Sign in with your DZIRE SPORT account
          </button>
        </div>
      )}
    </>
  );
};

export default SignUpForm;
