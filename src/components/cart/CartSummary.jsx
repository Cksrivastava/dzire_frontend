import React from "react";
import { Link } from "react-router-dom";
import {
  Info,
  Truck,
  FileText,
  ChevronUp,
  ChevronDown,
  Tag,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

export const CartSummary = ({
  totalItemCount,
  subtotal,
  gstAmount,
  shippingFee,
  isFreeShipping,
  appliedDiscount,
  appliedCouponName,
  setAppliedCouponName,
  setCouponCode,
  grandTotal,
  amountAwayFromFreeShipping,
  freeShippingProgress,
  showGstForm,
  setShowGstForm,
  gstNumber,
  setGstNumber,
  companyName,
  setCompanyName,
  gstSaved,
  setGstSaved,
  couponCode,
  handleApplyCoupon,
  availableOffers,
  handleProceedCheckout,
}) => {
  return (
    <div className="dz-cart-right-col">
      <div className="dz-order-summary-card">
        <h2 className="dz-summary-title">Order Summary</h2>

        {/* Summary Rows */}
        <div className="dz-summary-breakdown">
          <div className="summary-line-item">
            <span className="summary-label">
              Subtotal ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})
            </span>
            <span className="summary-val">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-line-item gst-line">
            <span className="summary-label info-label">
              Estimated GST (18% Incl.){" "}
              <Info
                size={13}
                className="info-icon"
                title="18% GST is included in product price"
              />
            </span>
            <span className="summary-val gst-val">
              ₹{gstAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="summary-line-item">
            <span className="summary-label info-label">
              Shipping <Info size={14} className="info-icon" />
            </span>
            <span className="summary-val">
              {isFreeShipping ? "FREE" : `₹${shippingFee}`}
            </span>
          </div>

          {appliedDiscount > 0 && (
            <div className="summary-line-item discount-line">
              <span className="summary-label">
                Discount {appliedCouponName && `(${appliedCouponName})`}
                <button
                  type="button"
                  className="remove-coupon-btn"
                  onClick={() => {
                    setAppliedCouponName("");
                    setCouponCode("");
                  }}
                  title="Remove coupon"
                >
                  ✕ Remove
                </button>
              </span>
              <span className="summary-val discount-val">
                -₹{appliedDiscount.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          <div className="summary-total-row">
            <div className="total-title-box">
              <span className="total-label">Total Paid</span>
              <span className="taxes-note">(Inclusive of all taxes)</span>
            </div>
            <span className="total-amount">₹{grandTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Free shipping progress box inside summary */}
        <div className="dz-summary-shipping-box">
          <div className="shipping-text-line">
            <Truck size={16} className="truck-icon" />
            <span>
              {amountAwayFromFreeShipping > 0
                ? `You are ₹${amountAwayFromFreeShipping.toLocaleString(
                    "en-IN"
                  )} away from FREE shipping!`
                : "🎉 You have unlocked FREE shipping!"}
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* GST Invoice Section */}
        <div className="dz-gst-section">
          <div className="gst-header" onClick={() => setShowGstForm(!showGstForm)}>
            <div className="gst-title-box">
              <FileText size={16} className="gst-icon" />
              <span className="gst-title">GSTIN Invoice (Optional)</span>
            </div>
            {showGstForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {showGstForm && (
            <div className="gst-body">
              <p className="gst-subtitle">
                Claim GST input tax credit for business purchase
              </p>
              <div className="gst-input-group">
                <input
                  type="text"
                  placeholder="15-digit GSTIN (e.g. 27AAAAA0000A1Z5)"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  maxLength={15}
                />
                <input
                  type="text"
                  placeholder="Registered Business Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <button
                  type="button"
                  className="gst-save-btn"
                  onClick={() => {
                    if (gstNumber.trim().length === 15) {
                      setGstSaved(true);
                      alert(
                        `GSTIN ${gstNumber} applied for ${companyName || "Business"}!`
                      );
                    } else {
                      alert("Please enter a valid 15-digit GSTIN number");
                    }
                  }}
                >
                  {gstSaved ? "✓ GST Details Saved" : "Save GST Details"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Coupon Application Box */}
        <div className="dz-coupon-section">
          <h3 className="coupon-section-title">Apply Coupon</h3>
          <div className="coupon-input-group">
            <div className="coupon-input-wrapper">
              <Tag size={16} className="coupon-tag-icon" />
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="apply-btn"
              onClick={() => handleApplyCoupon()}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Available Offers Cards */}
        <div className="dz-available-offers-section">
          <h3 className="offers-section-title">Available Offers</h3>

          {availableOffers.map((offer) => {
            const isEligible = subtotal >= offer.minOrder;
            const isSelected = appliedCouponName === offer.code;

            return (
              <div
                key={offer.code}
                className={`offer-card ${isEligible ? "eligible" : "disabled"} ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => {
                  if (!isEligible) {
                    alert(
                      `This offer requires a minimum order of ₹${offer.minOrder.toLocaleString(
                        "en-IN"
                      )}. Add ₹${(offer.minOrder - subtotal).toLocaleString(
                        "en-IN"
                      )} more to unlock!`
                    );
                    return;
                  }
                  if (isSelected) {
                    setAppliedCouponName("");
                    setCouponCode("");
                  } else {
                    handleApplyCoupon(offer.code);
                  }
                }}
              >
                <div className="offer-badge-col">
                  <span
                    className={`offer-code-pill ${
                      isSelected
                        ? "pill-selected"
                        : !isEligible
                        ? "pill-disabled"
                        : ""
                    }`}
                  >
                    {offer.code}
                  </span>
                </div>
                <div className="offer-desc-col">
                  <p className="offer-main-text">{offer.title}</p>
                  <p className="offer-sub-text">
                    {offer.subText}
                    {!isEligible && (
                      <span className="unlock-needed-text">
                        {" "}
                        • Add ₹
                        {(offer.minOrder - subtotal).toLocaleString("en-IN")} more
                      </span>
                    )}
                  </p>
                </div>
                <div className="offer-action-col">
                  {!isEligible ? (
                    <button
                      type="button"
                      className="disabled-btn"
                      disabled
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(
                          `Minimum order of ₹${offer.minOrder.toLocaleString(
                            "en-IN"
                          )} required. Add ₹${(
                            offer.minOrder - subtotal
                          ).toLocaleString("en-IN")} more to unlock!`
                        );
                      }}
                    >
                      Locked
                    </button>
                  ) : isSelected ? (
                    <button
                      type="button"
                      className="offer-applied-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAppliedCouponName("");
                        setCouponCode("");
                      }}
                    >
                      ✓ Applied
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="offer-apply-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyCoupon(offer.code);
                      }}
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Action Buttons */}
        <div className="dz-checkout-actions-box">
          <button
            type="button"
            className="dz-proceed-checkout-btn"
            onClick={handleProceedCheckout}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <div className="dz-or-divider">
            <span>or</span>
          </div>

          <Link to="/shop" className="dz-continue-shopping-outline-btn">
            <ChevronLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
