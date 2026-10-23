import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const AuthHeader = ({ onBack }) => {
  return (
    <div className="auth-header">
      {/* Center Logo */}
      <div className="auth-logo">
        <Link to="/" title="Go to Dzire Homepage">
          <img src={logo} alt="Dzire Sport" className="auth-logo-img" />
        </Link>
      </div>

      {/* Right Corner Back Button */}
      <button className="auth-back" onClick={onBack} title="Go back">
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>
    </div>
  );
};

export default AuthHeader;
