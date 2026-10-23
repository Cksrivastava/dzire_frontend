import React from "react";
import { NavLink } from "react-router-dom";
import {
  Camera,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Truck,
  FileText,
} from "lucide-react";

const ProfileBannerCard = ({
  avatarUrl,
  profileData,
  user,
  onVerifyPhone,
}) => {
  return (
    <div className="profile-banner-card">
      {/* Top Info Row */}
      <div className="banner-top-row">
        <div className="banner-left">
          <div className="banner-avatar-container">
            <img src={avatarUrl} alt="User Avatar" className="banner-avatar" />
            <button
              type="button"
              className="avatar-edit-btn"
              title="Change Avatar"
            >
              <Camera size={14} />
            </button>
          </div>
          <div className="banner-user-info">
            <div className="banner-name-row">
              <h2>{profileData.fullName || user?.name || "Customer"}</h2>
              <span className="verified-member-badge">
                <CheckCircle2 size={13} fill="#2563eb" color="#ffffff" />{" "}
                Verified Member
              </span>
            </div>
            <p className="member-since">Member since Jan 2023</p>
          </div>
        </div>

        <div className="banner-right-stats">
          {/* Phone Quick Detail */}
          <div className="stat-quick-box">
            <div
              className={`stat-icon-circle ${
                profileData.phone ? "green" : "orange"
              }`}
            >
              <Phone size={16} />
            </div>
            <div className="stat-quick-details">
              <span className="stat-quick-label">Phone Number</span>
              <span className="stat-quick-value">
                {profileData.phone || "Not Linked"}
              </span>
              {profileData.phone ? (
                <span className="stat-quick-status green">Verified</span>
              ) : (
                <button
                  type="button"
                  className="stat-edit-link"
                  onClick={onVerifyPhone}
                >
                  Verify Now
                </button>
              )}
            </div>
          </div>

          {/* Email Quick Detail */}
          <div className="stat-quick-box">
            <div className="stat-icon-circle blue">
              <Mail size={16} />
            </div>
            <div className="stat-quick-details">
              <span className="stat-quick-label">Email Address</span>
              <span className="stat-quick-value">
                {profileData.email || user?.email || "No email"}
              </span>
              <span className="stat-quick-status green">Verified</span>
            </div>
          </div>

          {/* Date of Birth Quick Detail */}
          <div className="stat-quick-box">
            <div className="stat-icon-circle purple">
              <Calendar size={16} />
            </div>
            <div className="stat-quick-details">
              <span className="stat-quick-label">Date of Birth</span>
              <span className="stat-quick-value">15 Mar 1995</span>
              <button type="button" className="stat-edit-link">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Saved Addresses (Shipping & Billing) */}
      <div className="banner-addresses-section">
        <div className="banner-addresses-header">
          <div className="addresses-title-box">
            <MapPin size={16} className="addresses-header-icon" />
            <h3>Saved Addresses</h3>
          </div>
          <NavLink to="/account/addresses" className="header-action-link">
            Manage Addresses
          </NavLink>
        </div>

        <div className="banner-addresses-grid">
          {/* Shipping Address Card */}
          <div className="banner-address-card shipping">
            <div className="address-card-top">
              <div className="address-badge-title">
                <Truck size={15} className="address-type-icon shipping" />
                <span className="address-type-label">Shipping Address</span>
              </div>
              <span className="address-status-tag default">Default</span>
            </div>
            <div className="address-card-body">
              <p className="address-name">Jessica Pearson</p>
              <p>Flat 12, Sai Residency, Baner Road</p>
              <p>Pune, Maharashtra – 411045, India</p>
              <p className="address-phone-line">Phone: +91 98765 43210</p>
            </div>
          </div>

          {/* Billing Address Card */}
          <div className="banner-address-card billing">
            <div className="address-card-top">
              <div className="address-badge-title">
                <FileText size={15} className="address-type-icon billing" />
                <span className="address-type-label">Billing Address</span>
              </div>
              <span className="address-status-tag work">Work / GST</span>
            </div>
            <div className="address-card-body">
              <p className="address-name">Jessica Pearson (Pearson Specter Litt)</p>
              <p>123, Corporate Towers, Sector 44</p>
              <p>Gurgaon, Haryana – 122003, India</p>
              <p className="address-phone-line">GSTIN: 07AAAAA0000A1Z5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBannerCard;
