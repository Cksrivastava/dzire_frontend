import React from "react";

const CheckoutContactShippingForm = ({ formData = {}, onChange }) => {
  return (
    <div className="checkout-left">
      <div className="checkout-section">
        <h2>Contact Details</h2>
        <div className="form-group">
          <label>Email Address or Phone Number</label>
          <input
            type="text"
            name="contact"
            placeholder="Enter email or phone"
            value={formData.contact || ""}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="checkout-section">
        <h2>Shipping Address</h2>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName || ""}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Street Address</label>
          <input
            type="text"
            name="street"
            placeholder="123 Main St, Apt 4B"
            value={formData.street || ""}
            onChange={onChange}
          />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Pune"
              value={formData.city || ""}
              onChange={onChange}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="Maharashtra"
              value={formData.state || ""}
              onChange={onChange}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              placeholder="411001"
              value={formData.pincode || ""}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      <div className="checkout-section">
        <h2>Delivery Method</h2>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="delivery"
              value="home"
              checked={formData.deliveryMethod !== "pickup"}
              onChange={() => onChange && onChange({ target: { name: "deliveryMethod", value: "home" } })}
            />
            Standard Home Delivery (3-5 Days) - ₹50
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="delivery"
              value="pickup"
              checked={formData.deliveryMethod === "pickup"}
              onChange={() => onChange && onChange({ target: { name: "deliveryMethod", value: "pickup" } })}
            />
            Store Pickup (Pune Hub) - Free
          </label>
        </div>
      </div>

      <div className="checkout-section">
        <h2>GST Details (Optional)</h2>
        <p style={{ fontSize: '13px', color: '#667085', marginTop: '-8px', marginBottom: '12px' }}>
          Claim GST Input Tax Credit on your business purchase
        </p>
        <div className="form-group">
          <label>15-Digit GSTIN Number</label>
          <input
            type="text"
            name="gstin"
            placeholder="e.g. 27AAAAA0000A1Z5"
            maxLength={15}
            value={formData.gstin || ""}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Registered Business / Company Name</label>
          <input
            type="text"
            name="businessName"
            placeholder="Enter business name"
            value={formData.businessName || ""}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="checkout-section">
        <h2>Order Notes (Optional)</h2>
        <div className="form-group">
          <textarea
            name="notes"
            rows="3"
            placeholder="Notes about your order, e.g. special notes for delivery."
            value={formData.notes || ""}
            onChange={onChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContactShippingForm;
