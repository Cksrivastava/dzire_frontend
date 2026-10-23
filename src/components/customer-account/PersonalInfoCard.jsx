import React from "react";
import {
  Edit3,
  User,
  Lock,
  Phone,
  Mail,
  Calendar,
  PhoneCall,
  Plus,
} from "lucide-react";

const PersonalInfoCard = ({
  profileData,
  onOpenEdit,
  onVerifyPhone,
}) => {
  return (
    <div className="profile-card personal-info-card">
      <div className="card-header">
        <h3>Personal Information</h3>
        <button
          type="button"
          className="header-action-link btn-link"
          onClick={onOpenEdit}
        >
          <Edit3 size={13} style={{ marginRight: "4px" }} /> Edit Profile
        </button>
      </div>

      <div className="personal-info-grid">
        {/* Full Name (Fixed) */}
        <div className="info-item fixed-field">
          <div className="info-icon-wrapper">
            <User size={16} />
          </div>
          <div className="info-details">
            <div className="info-label-row">
              <span className="info-label">Full Name</span>
              <span
                className="fixed-field-tag"
                title="Primary credential cannot be changed"
              >
                <Lock size={12} />
              </span>
            </div>
            <span className="info-value">{profileData.fullName}</span>
          </div>
        </div>

        {/* Primary Phone (Fixed & Verified) */}
        <div className="info-item fixed-field">
          <div
            className={`info-icon-wrapper ${
              profileData.phone ? "green" : "orange"
            }`}
          >
            <Phone size={16} />
          </div>
          <div className="info-details">
            <div className="info-label-row">
              <span className="info-label">Phone Number</span>
              {profileData.phone ? (
                <span
                  className="fixed-field-tag verified"
                  title="Verified mobile number"
                >
                  <Lock size={12} />
                </span>
              ) : (
                <button
                  type="button"
                  className="stat-edit-link"
                  style={{ fontSize: "11px", fontWeight: "600" }}
                  onClick={onVerifyPhone}
                >
                  Verify Now
                </button>
              )}
            </div>
            <span className="info-value">
              {profileData.phone || "Not linked"}
            </span>
          </div>
        </div>

        {/* Primary Email (Fixed & Verified) */}
        <div className="info-item fixed-field">
          <div className="info-icon-wrapper blue">
            <Mail size={16} />
          </div>
          <div className="info-details">
            <div className="info-label-row">
              <span className="info-label">Email Address</span>
              <span
                className="fixed-field-tag verified"
                title="Verified email address cannot be changed"
              >
                <Lock size={12} />
              </span>
            </div>
            <span className="info-value">{profileData.email}</span>
          </div>
        </div>

        {/* Gender (Editable) */}
        <div className="info-item">
          <div className="info-icon-wrapper pink">
            <User size={16} />
          </div>
          <div className="info-details">
            <span className="info-label">Gender</span>
            <span className="info-value">{profileData.gender}</span>
          </div>
        </div>

        {/* Date of Birth (Editable) */}
        <div className="info-item">
          <div className="info-icon-wrapper purple">
            <Calendar size={16} />
          </div>
          <div className="info-details">
            <span className="info-label">Date of Birth</span>
            <span className="info-value">{profileData.dobFormatted}</span>
          </div>
        </div>

        {/* Alternate Phone Number (Editable / Addable) */}
        <div className="info-item highlight-alt">
          <div className="info-icon-wrapper teal">
            <PhoneCall size={16} />
          </div>
          <div className="info-details">
            <span className="info-label">Alternate Phone</span>
            <span className="info-value">
              {profileData.altPhone ? (
                profileData.altPhone
              ) : (
                <button
                  type="button"
                  className="add-alt-btn"
                  onClick={onOpenEdit}
                >
                  <Plus size={12} /> Add Alternate Phone
                </button>
              )}
            </span>
          </div>
        </div>

        {/* Alternate Email (Editable) */}
        <div className="info-item">
          <div className="info-icon-wrapper orange">
            <Mail size={16} />
          </div>
          <div className="info-details">
            <span className="info-label">Alternate Email</span>
            <span className="info-value">
              {profileData.altEmail || "Not added"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
