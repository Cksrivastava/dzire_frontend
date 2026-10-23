import React from "react";
import { FileText } from "lucide-react";

const OrderRightCol = ({
  address,
  itemsCount,
  subtotal,
  shippingFee,
  discountAmount,
  grandTotal,
  onChangeAddress,
}) => {
  return (
    <div className="dz-order-right-col">
      {/* SHIPPING ADDRESS CARD */}
      <div className="dz-address-card">
        <div className="address-card-header">
          <h2 className="card-heading inline-heading">
            <span className="pin-icon">📍</span> Shipping Address
          </h2>
          <button
            type="button"
            className="link-change"
            onClick={onChangeAddress}
          >
            Change
          </button>
        </div>
        <div className="address-content">
          <p className="addr-name">{address.name}</p>
          <p className="addr-lines">{address.address}</p>
          <p className="addr-phone">{address.phone}</p>
        </div>
      </div>

      {/* ORDER SUMMARY CARD */}
      <div className="dz-summary-card">
        <h2 className="card-heading">Order Summary</h2>

        <div className="summary-rows">
          <div className="summary-line">
            <span>Subtotal ({itemsCount} items)</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-line">
            <span>Estimated GST (18% Incl.)</span>
            <span style={{ color: "#3b82f6", fontWeight: "700" }}>
              ₹{Math.round((subtotal * 18) / 118).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <span className="free-tag">
              {shippingFee === 0 ? "₹0 Free" : `₹${shippingFee}`}
            </span>
          </div>
          <div className="summary-line">
            <span>Discount</span>
            <span className="discount-tag">
              - ₹{discountAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-line total-line">
            <div>
              <span className="total-label">Total Paid</span>
              <p className="taxes-note">(Inclusive of all taxes)</p>
            </div>
            <span className="total-val">₹{grandTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* CREDITS EARNED HIGHLIGHT BOX */}
        <div className="credits-earned-box">
          <div className="coin-icon">🪙</div>
          <div className="credits-text">
            <p className="main-credit-line">
              You earned <strong>99 Dzire Credits</strong>
            </p>
            <p className="sub-credit-line">(Will be added after delivery)</p>
          </div>
        </div>

        {/* GST INVOICE INFO BOX */}
        <div
          className="gst-details-card"
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#f8fafc",
            border: "1px dashed #cbd5e1",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <FileText size={16} color="#ff6600" />
            <strong style={{ fontSize: "13px", color: "#0f172a" }}>
              GST Tax Invoice
            </strong>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#64748b",
              lineHeight: "1.4",
            }}
          >
            Tax Invoice with 18% GST (₹
            {Math.round((subtotal * 18) / 118).toLocaleString("en-IN")}) will be
            sent to your email upon order dispatch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderRightCol;
