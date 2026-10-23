import React from "react";

const LoggedInCard = ({ user, onGoHome, onLogout }) => {
  return (
    <div className="auth-card logged-in-card">
      <h1 className="auth-title">You are logged in</h1>

      <div className="logged-user-box">
        <p>
          <strong>Name:</strong> {user.name || "User"}
        </p>
        <p>
          <strong>Email:</strong> {user.email || "Not available"}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone || "Not available"}
        </p>
      </div>

      <button className="auth-primary-btn" onClick={onGoHome}>
        GO TO HOME
      </button>

      <button className="auth-logout-btn" onClick={onLogout}>
        LOGOUT
      </button>
    </div>
  );
};

export default LoggedInCard;
