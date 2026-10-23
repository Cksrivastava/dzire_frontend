import React from "react";
import { Lock, X } from "lucide-react";

const EditProfileModal = ({
  isOpen,
  editFormData,
  onChange,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content profile-edit-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Edit Personal Information</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSave} className="profile-edit-form">
          <div className="modal-notice-banner">
            <Lock size={14} className="notice-icon" />
            <span>
              Full Name, Primary Phone, and Primary Email are verified
              credentials and cannot be edited.
            </span>
          </div>

          <div className="form-grid">
            {/* Full Name (Fixed) */}
            <div className="form-group disabled-group">
              <label>
                Full Name{" "}
                <span className="fixed-badge">
                  <Lock size={12} />
                </span>
              </label>
              <input type="text" value={editFormData.fullName} disabled />
            </div>

            {/* Primary Phone (Fixed) */}
            <div className="form-group disabled-group">
              <label>
                Primary Phone{" "}
                <span className="fixed-badge">
                  <Lock size={12} />
                </span>
              </label>
              <input type="text" value={editFormData.phone} disabled />
            </div>

            {/* Primary Email (Fixed) */}
            <div className="form-group disabled-group col-span-2">
              <label>
                Primary Email{" "}
                <span className="fixed-badge">
                  <Lock size={12} />
                </span>
              </label>
              <input type="text" value={editFormData.email} disabled />
            </div>

            {/* Gender (Editable) */}
            <div className="form-group">
              <label>Gender</label>
              <select
                value={editFormData.gender}
                onChange={(e) => onChange("gender", e.target.value)}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Date of Birth (Editable) */}
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="text"
                value={editFormData.dobFormatted}
                onChange={(e) => onChange("dobFormatted", e.target.value)}
                placeholder="e.g. 15 Mar 1995"
              />
            </div>

            {/* Alternate Phone Number (Editable) */}
            <div className="form-group">
              <label>Alternate Phone Number</label>
              <input
                type="tel"
                value={editFormData.altPhone}
                onChange={(e) => onChange("altPhone", e.target.value)}
                placeholder="+91 98XXX XXXXX"
              />
            </div>

            {/* Alternate Email (Editable) */}
            <div className="form-group">
              <label>Alternate Email Address</label>
              <input
                type="email"
                value={editFormData.altEmail}
                onChange={(e) => onChange("altEmail", e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
