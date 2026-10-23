import React from "react";
import {
  Star,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Zap,
  Heart,
  RefreshCw,
  Shield,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import visaImg from "../../assets/visa.png";
import masterImg from "../../assets/master.png";
import upiImg from "../../assets/upi.png";
import appleImg from "../../assets/apple.png";

const RentalRightPanel = ({
  product,
  colors,
  sizes,
  selectedColor,
  selectedSize,
  quantity,
  rentalDays,
  fromDate,
  toDate,
  todayStr,
  actionsRef,
  fromDateInputRef,
  toDateInputRef,
  isWishlisted,
  isCompared,
  onColorChange,
  onSizeChange,
  onQuantityChange,
  onFromDateChange,
  onToDateChange,
  onEnquire,
  onToggleWishlist,
  onToggleCompare,
  formatDateForDisplay,
}) => {
  return (
    <aside className="product-right-sticky">
      <div className="product-right-panel wildcraft-panel">
        <div className="product-right-content-scroll">
          <p className="brand-name">{product.brand}</p>

          <h1 className="wildcraft-product-title">{product.name}</h1>

          {/* Rating */}
          <div
            className="top-rating-line wildcraft-rating"
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <span
              className="rating-num"
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#111",
                lineHeight: "1",
              }}
            >
              {product.rating || "4.4"}
            </span>
            <div
              className="stars-container"
              style={{ display: "flex", gap: "2px", alignItems: "center" }}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < 4 ? "#ffa41c" : "transparent"}
                  color={i < 4 ? "#ffa41c" : "#d1d5db"}
                />
              ))}
            </div>
            <span
              className="review-link"
              style={{
                fontSize: "13px",
                color: "#888",
                textDecoration: "none",
                cursor: "pointer",
                lineHeight: "1",
              }}
            >
              ({product.reviewsCount || 110})
            </span>
          </div>

          {/* Price & Security Deposit block */}
          <div className="adidas-price-block wildcraft-price-block">
            <div
              className="security-deposit-line"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                padding: "4px 10px",
                borderRadius: "6px",
                marginBottom: "6px",
              }}
            >
              <ShieldCheck size={15} color="#16a34a" />
              <span
                style={{
                  fontSize: "13px",
                  color: "#475569",
                  fontWeight: "600",
                }}
              >
                Security Deposit:
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#0f172a",
                  fontWeight: "700",
                }}
              >
                ₹{product.deposit || "1,000"}
              </span>
            </div>
            <div className="price-row">
              <span className="sale-line">
                ₹{product.price}
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#555",
                    marginLeft: "2px",
                  }}
                >
                  /day
                </span>
              </span>
            </div>
          </div>

          {/* DZIRE+ Credit Points Card */}
          <div className="dzire-credit-card">
            <div className="dzire-credit-left">
              <div className="dzire-credit-coin">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="#ffa41c"
                    stroke="#ffa41c"
                    strokeWidth="1"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="13"
                    fill="#ffa41c"
                    stroke="#ffffff"
                    strokeOpacity="0.75"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                  />
                  <text
                    x="18"
                    y="23.5"
                    fontSize="16"
                    fontWeight="900"
                    fill="#000000"
                    textAnchor="middle"
                    fontFamily="'Inter', -apple-system, sans-serif"
                  >
                    ₹
                  </text>
                </svg>
              </div>
              <div className="dzire-credit-info">
                <div className="dzire-credit-title">
                  <span className="dzire-brand-text">DZIRE+</span>
                  <span className="dzire-credit-main-text">CREDIT POINTS</span>
                </div>
                <div className="dzire-credit-subtitle">
                  ₹1000 = 50 Credit Points
                </div>
              </div>
            </div>
            <div className="dzire-credit-right">
              <div className="dzire-earn-header">
                <span className="dzire-info-icon" title="Dzire Credit Points Info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </span>
                <span className="dzire-earn-label">You earn</span>
              </div>
              <span className="dzire-earn-points">
                {Math.round(product.price * 0.1)} Points
              </span>
            </div>
          </div>

          {/* Colors selector */}
          <div className="selector-block wildcraft-selector">
            <h4 className="selector-title">
              COLOR: {selectedColor?.toUpperCase()}
            </h4>
            <div className="color-swatches-row">
              {colors.map((item) => (
                <button
                  key={item.name}
                  className={`color-dot-btn ${
                    selectedColor === item.name ? "active" : ""
                  }`}
                  style={{ "--swatch-color": item.color }}
                  onClick={() => onColorChange(item.name)}
                  title={item.name}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="selector-block wildcraft-selector">
            <h4 className="selector-title">SIZE: (CAPACITY)</h4>
            <div className="size-buttons-row">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  className={`size-pill-btn ${
                    selectedSize === sz ? "active" : ""
                  }`}
                  onClick={() => onSizeChange(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Sticky Actions Wrapper */}
          <div className="product-right-sticky-actions">
            {/* Quantity selector */}
            <div className="selector-block wildcraft-selector">
              <h4 className="selector-title">QTY</h4>
              <div className="qty-picker">
                <button onClick={() => onQuantityChange(Math.max(1, quantity - 1))}>
                  −
                </button>
                <span>{quantity}</span>
                <button onClick={() => onQuantityChange(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Rental Dates Selector */}
            <div
              className="selector-block wildcraft-selector rental-dates-selector-block"
              style={{ marginBottom: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <h4
                  className="selector-title"
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Calendar size={16} color="#ff6600" />
                  <span>SELECT RENTAL DATES</span>
                </h4>
                {rentalDays > 0 && (
                  <span
                    style={{
                      fontSize: "11.5px",
                      background: "#ff6600",
                      color: "#ffffff",
                      padding: "2px 10px",
                      borderRadius: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {rentalDays} {rentalDays === 1 ? "Day" : "Days"}
                  </span>
                )}
              </div>

              <div
                className="rental-dates-inputs"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  padding: "8px 12px",
                }}
              >
                <div
                  className="date-input-group"
                  style={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      color: "#64748b",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      marginBottom: "3px",
                    }}
                  >
                    From Date
                  </span>
                  <div
                    className="custom-date-picker-wrap"
                    onClick={() => {
                      try {
                        fromDateInputRef.current?.showPicker();
                      } catch {
                        fromDateInputRef.current?.focus();
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      position: "relative",
                      width: "fit-content",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#0f172a",
                      }}
                    >
                      {formatDateForDisplay(fromDate)}
                    </span>
                    <Calendar
                      size={15}
                      color="#0f172a"
                      strokeWidth={2}
                      style={{ flexShrink: 0 }}
                    />
                    <input
                      ref={fromDateInputRef}
                      type="date"
                      value={fromDate}
                      min={todayStr}
                      onChange={(e) => onFromDateChange(e.target.value)}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>

                <span
                  style={{
                    color: "#94a3b8",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  →
                </span>

                <div
                  className="date-input-group"
                  style={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      color: "#64748b",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      marginBottom: "3px",
                    }}
                  >
                    To Date
                  </span>
                  <div
                    className="custom-date-picker-wrap"
                    onClick={() => {
                      try {
                        toDateInputRef.current?.showPicker();
                      } catch {
                        toDateInputRef.current?.focus();
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      position: "relative",
                      width: "fit-content",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#0f172a",
                      }}
                    >
                      {formatDateForDisplay(toDate)}
                    </span>
                    <Calendar
                      size={15}
                      color="#0f172a"
                      strokeWidth={2}
                      style={{ flexShrink: 0 }}
                    />
                    <input
                      ref={toDateInputRef}
                      type="date"
                      value={toDate}
                      min={fromDate || todayStr}
                      onChange={(e) => onToDateChange(e.target.value)}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div ref={actionsRef} className="action-buttons-stack">
              <button
                className="wildcraft-add-to-cart"
                onClick={onEnquire}
              >
                <MessageSquare size={18} />
                <span>Enquire Product</span>
              </button>

              <div className="secondary-buttons-row">
                <button className="sec-btn" onClick={onEnquire}>
                  <Zap size={18} fill="none" />
                  <span>Book Now</span>
                </button>
                <button
                  className={`sec-btn ${isWishlisted ? "active" : ""}`}
                  onClick={onToggleWishlist}
                >
                  <Heart
                    size={18}
                    fill={isWishlisted ? "#ff3333" : "none"}
                    color={isWishlisted ? "#ff3333" : "currentColor"}
                  />
                  <span>Wishlist</span>
                </button>
                <button
                  className={`sec-btn ${isCompared ? "active" : ""}`}
                  onClick={onToggleCompare}
                >
                  <RefreshCw
                    size={18}
                    color={isCompared ? "#ff6600" : "currentColor"}
                  />
                  <span>Compare</span>
                </button>
              </div>
            </div>

            {/* Delivery, Security, Payment & Share Card */}
            <div className="delivery-security-card-box">
              {/* 2. Secure Checkout Row */}
              <div
                className="dzire-delivery-row dzire-secure-checkout"
                style={{
                  border: "none",
                  background: "none",
                  padding: "0",
                  margin: "12px 0",
                }}
              >
                <Shield size={22} color="#111" />
                <div className="dzire-delivery-info">
                  <div className="dzire-delivery-title">Secure Checkout</div>
                  <div className="dzire-delivery-sub">Safe & encrypted payments</div>
                </div>
              </div>

              {/* Divider Line 2 */}
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e5e7eb",
                  margin: "12px 0",
                  width: "100%",
                  display: "block",
                }}
              />

              {/* 3. Payment Partners (We Accept) */}
              <div
                className="payment-partners"
                style={{
                  borderTop: "none",
                  padding: "0",
                  margin: "12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "nowrap",
                }}
              >
                <span
                  className="accept-label"
                  style={{
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#444",
                  }}
                >
                  We Accept:
                </span>
                <div
                  className="payment-badges"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <img
                    src={visaImg}
                    alt="Visa"
                    className="payment-badge-img"
                    style={{ height: "24px" }}
                  />
                  <img
                    src={masterImg}
                    alt="Mastercard"
                    className="payment-badge-img"
                    style={{ height: "24px" }}
                  />
                  <img
                    src={upiImg}
                    alt="UPI"
                    className="payment-badge-img"
                    style={{ height: "24px" }}
                  />
                  <img
                    src={appleImg}
                    alt="Apple Pay"
                    className="payment-badge-img"
                    style={{ height: "24px" }}
                  />
                </div>
              </div>

              {/* Divider Line 3 */}
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e5e7eb",
                  margin: "12px 0",
                  width: "100%",
                  display: "block",
                }}
              />

              {/* 4. Share This Product */}
              <div className="share-section-flat" style={{ margin: "12px 0" }}>
                <div
                  className="share-title"
                  style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    color: "#111",
                    marginBottom: "8px",
                  }}
                >
                  Share this product
                </div>
                <div
                  className="share-buttons-row"
                  style={{ display: "flex", gap: "10px" }}
                >
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied!");
                    }}
                    className="share-round-btn copy-link"
                    title="Copy Product Link"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      window.location.href
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-round-btn whatsapp"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp size={19} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-round-btn facebook"
                    title="Share on Facebook"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RentalRightPanel;
