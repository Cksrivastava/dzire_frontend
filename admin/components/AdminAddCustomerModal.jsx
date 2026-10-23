import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../pages/AdminCustomers.css";

const AdminAddCustomerModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "Regular",
    channel: "Online",
    address: "",
    notes: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          phone: initialData.phone || "",
          email: initialData.email || "",
          type: initialData.type || "Regular",
          channel: initialData.channel || "Online",
          address: initialData.address || (initialData.addresses && initialData.addresses[0]?.address) || "",
          notes: initialData.notes || ""
        });
      } else {
        setFormData({
          name: "",
          phone: "",
          email: "",
          type: "Regular",
          channel: "Online",
          address: "",
          notes: ""
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please provide customer name and phone number");
      return;
    }

    const initials = formData.name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "CU";

    const customerObj = {
      id: initialData?.id || `CUST${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      initials,
      phone: formData.phone.trim(),
      email: formData.email.trim() || `${formData.name.trim().toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      type: formData.type,
      channel: formData.channel,
      address: formData.address.trim(),
      notes: formData.notes.trim(),
      addresses: formData.address.trim()
        ? [
            {
              type: "Home",
              isDefault: true,
              recipient: formData.name.trim(),
              address: formData.address.trim(),
              phone: formData.phone.trim()
            }
          ]
        : []
    };

    if (onSave) {
      onSave(customerObj);
    }
    onClose();
  };

  return (
    <div className="cust-modal-overlay" onClick={onClose}>
      <div className="cust-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #edf2f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
            Add New Customer
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "grid", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kulkarni"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                Customer Type
              </label>
              <select
                className="cust-filter-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  height: "38px"
                }}
              >
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                Preferred Channel
              </label>
              <select
                className="cust-filter-select"
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  height: "38px"
                }}
              >
                <option value="Online">Online</option>
                <option value="Store">Store</option>
                <option value="POS">POS</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
              Primary Address (City / Street)
            </label>
            <input
              type="text"
              placeholder="e.g. Baner, Pune - 411045"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
              Customer Notes
            </label>
            <textarea
              rows={2}
              placeholder="Preferences, interests, tags..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "13px",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              className="cust-btn cust-btn-secondary"
              onClick={onClose}
              style={{ minWidth: "90px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cust-btn cust-btn-primary"
              style={{ minWidth: "130px" }}
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddCustomerModal;
