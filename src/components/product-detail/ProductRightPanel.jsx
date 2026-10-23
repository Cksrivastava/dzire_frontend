import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Zap, Heart, RefreshCw } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { couponAPI } from "../../services/api";
import visaImg from "../../assets/visa.png";
import masterImg from "../../assets/master.png";
import upiImg from "../../assets/upi.png";
import appleImg from "../../assets/apple.png";

export const ProductRightPanel = ({
  product,
  reviewsList = [],
  activeTab,
  setActiveTab,
  colors,
  selectedColor,
  setSelectedColor,
  sizes,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  actionsRef,
  handleAddToCartClick,
  handleBuyNowClick,
  toggleWishlist,
  isWishlisted,
  toggleCompare,
  isCompared,
  setActiveThumb,
  allProductImages = [],
}) => {
  const navigate = useNavigate();
  const [pincode, setPincode] = React.useState("110001");
  const [isEditingPincode, setIsEditingPincode] = React.useState(false);
  const [tempPincode, setTempPincode] = React.useState("110001");

  // Dynamic Coupons & Offers state
  const [couponsList, setCouponsList] = React.useState([]);
  const [copiedCode, setCopiedCode] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    couponAPI
      .getAll()
      .then((res) => {
        if (mounted && res && Array.isArray(res.coupons)) {
          const activeCoupons = res.coupons.filter(
            (c) => !c.status || c.status.toLowerCase() === "active"
          );
          if (activeCoupons.length > 0) {
            setCouponsList(activeCoupons);
          }
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const handleCopyCode = (code) => {
    if (!code) return;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
      }
    } catch (e) {}
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2200);
  };

  // Dynamic Rating and Total Reviews count
  const ratingStats = React.useMemo(() => {
    if (Array.isArray(reviewsList) && reviewsList.length > 0) {
      const sum = reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
      const avg = product.rating ? parseFloat(product.rating).toFixed(1) : (sum / reviewsList.length).toFixed(1);
      const count = Number(product.reviews) || reviewsList.length;
      return {
        avg,
        count,
      };
    }
    const avg = product.rating ? parseFloat(product.rating).toFixed(1) : "0.0";
    const count = Number(product.reviews) || 0;
    return { avg, count };
  }, [reviewsList, product.rating, product.reviews]);

  // Dynamic Offers List
  const displayOffers = React.useMemo(() => {
    if (Array.isArray(product.offers) && product.offers.length > 0) {
      return product.offers.map((o) => ({
        code: o.code || (typeof o === "string" ? o : "OFFER"),
        desc: o.desc || o.description || o.title || "Special limited time offer",
      }));
    }

    if (couponsList && couponsList.length > 0) {
      return couponsList.slice(0, 3).map((c) => {
        let desc = c.description;
        if (!desc) {
          if (c.type === "Percentage" || c.unit === "%") {
            desc = `Get ${c.discountValue || 10}% OFF${
              c.minOrderValue
                ? ` on orders above ₹${Number(c.minOrderValue).toLocaleString("en-IN")}`
                : ""
            }`;
          } else if (c.type === "Fixed" || c.unit === "₹") {
            desc = `₹${c.discountValue || 500} OFF${
              c.minOrderValue
                ? ` on orders above ₹${Number(c.minOrderValue).toLocaleString("en-IN")}`
                : ""
            }`;
          } else {
            desc = c.name || "Special store coupon discount";
          }
        }
        return {
          code: c.code,
          desc,
        };
      });
    }

    return [
      {
        code: "FLAT10",
        desc: "Get 10% OFF on orders above ₹3,000",
      },
      {
        code: "TREK500",
        desc: "₹500 OFF on orders above ₹7,500",
      },
      {
        code: "FREEDEL",
        desc: "Free Shipping on prepaid orders",
      },
    ];
  }, [product.offers, couponsList]);

  const handleColorClick = (item) => {
    setSelectedColor(item.name);
    if (item.image && setActiveThumb && allProductImages.length > 0) {
      const idx = allProductImages.indexOf(item.image);
      if (idx !== -1) {
        setActiveThumb(idx);
      }
    }
  };

  return (
    <aside className="product-right-sticky">
      <div className="product-right-panel wildcraft-panel">
        <div className="product-right-content-scroll">
          <p className="brand-name">{product.brand}</p>

          <h1 className="wildcraft-product-title">{product.name}</h1>

          {/* Rating block - clickable to view all reviews */}
          <div
            className="top-rating-line wildcraft-rating"
            style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
            onClick={() => {
              if (setActiveTab) setActiveTab("Reviews");
              setTimeout(() => {
                const tabsBar = document.querySelector(".product-section-tabs-bar");
                if (tabsBar) {
                  tabsBar.scrollIntoView({ behavior: "smooth" });
                }
              }, 60);
            }}
            title="Click to view customer reviews"
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
              {ratingStats.avg}
            </span>
            <div
              className="stars-container"
              style={{ display: "flex", gap: "2px", alignItems: "center" }}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const ratingVal = parseFloat(ratingStats.avg) || 0;
                const isFilled = ratingVal > 0 && i < Math.round(ratingVal);
                return (
                  <Star
                    key={i}
                    size={14}
                    fill={isFilled ? "#ffa41c" : "transparent"}
                    color={isFilled ? "#ffa41c" : "#d1d5db"}
                  />
                );
              })}
            </div>
            <span
              className="review-link"
              style={{
                fontSize: "13px",
                color: "#ff6600",
                textDecoration: "underline",
                cursor: "pointer",
                lineHeight: "1",
                fontWeight: "600",
              }}
            >
              ({ratingStats.count} reviews)
            </span>
          </div>

          {/* Price block */}
          <div className="adidas-price-block wildcraft-price-block">
            {product.oldPrice && (
              <div className="mrp-line">
                <span className="mrp-label-text">MRP </span>
                <span className="mrp-old-price">₹{Number(product.oldPrice).toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="price-row">
              <span className="sale-line">₹{Number(product.price).toLocaleString("en-IN")}</span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="discount-badge">
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                </span>
              )}
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
                  <circle cx="18" cy="18" r="16" fill="#ffa41c" stroke="#ffa41c" strokeWidth="1" />
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
                <div className="dzire-credit-subtitle">₹1000 = 50 Credit Points</div>
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
              <span className="dzire-earn-points">{Math.round(product.price * 0.05)} Points</span>
            </div>
          </div>

          {/* Colors selector */}
          <div className="selector-block wildcraft-selector">
            <h4 className="selector-title">COLOR: {selectedColor?.toUpperCase()}</h4>
            <div className="color-swatches-row">
              {colors.map((item) => (
                <button
                  key={item.name}
                  className={`color-dot-btn ${selectedColor === item.name ? "active" : ""}`}
                  style={{ "--swatch-color": item.color }}
                  onClick={() => handleColorClick(item)}
                  title={item.name}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="selector-block wildcraft-selector">
            <h4 className="selector-title">SIZE: {selectedSize ? `(${selectedSize})` : ""}</h4>
            <div className="size-buttons-row">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  className={`size-pill-btn ${selectedSize === sz ? "active" : ""}`}
                  onClick={() => setSelectedSize(sz)}
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
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div ref={actionsRef} className="action-buttons-stack">
              <button className="wildcraft-add-to-cart" onClick={handleAddToCartClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span>Add to Cart</span>
              </button>

              <div className="secondary-buttons-row">
                <button className="sec-btn" onClick={handleBuyNowClick}>
                  <Zap size={18} fill="none" />
                  <span>Buy Now</span>
                </button>
                <button
                  className={`sec-btn ${isWishlisted ? "active" : ""}`}
                  onClick={() => toggleWishlist(product)}
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
                  onClick={() => toggleCompare(product)}
                >
                  <RefreshCw size={18} color={isCompared ? "#ff6600" : "currentColor"} />
                  <span>Compare</span>
                </button>
              </div>
            </div>

            {/* Highlighted Offers & Coupons Box */}
            <div className="offers-coupons-highlight-box">
              <div className="offers-header">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff6600"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="header-icon"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <span>Offers & Coupons</span>
              </div>

              <div className="offers-body">
                {displayOffers.map((item, idx) => {
                  const isCopied = copiedCode === item.code;
                  return (
                    <div
                      key={item.code || idx}
                      className="offer-item"
                      onClick={() => handleCopyCode(item.code)}
                      style={{ cursor: "pointer" }}
                      title="Click to copy coupon code"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ff6600"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="offer-icon"
                      >
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                      <div className="offer-details">
                        <span className="code" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          {item.code}
                          {isCopied && (
                            <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700" }}>
                              COPIED! ✓
                            </span>
                          )}
                        </span>
                        <span className="desc">{item.desc}</span>
                      </div>
                      <svg
                        className="chevron-right"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  );
                })}

                <div className="view-all-offers-orange" onClick={() => navigate("/offers")}>
                  View All Offers &gt;
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="dzire-panel-divider"></div>

            {/* Delivery Estimation */}
            <div
              className="dzire-delivery-row dzire-delivery-estimation"
              style={{
                border: "none",
                background: "none",
                padding: "0",
                margin: "12px 0",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <div className="dzire-delivery-info">
                <div className="dzire-delivery-title">Estimated Delivery</div>
                {isEditingPincode ? (
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                    <input
                      type="text"
                      maxLength={6}
                      value={tempPincode}
                      onChange={(e) => setTempPincode(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="Pincode"
                      style={{
                        width: "80px",
                        padding: "3px 6px",
                        fontSize: "12px",
                        borderRadius: "4px",
                        border: "1px solid #cbd5e1",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempPincode.length === 6) {
                          setPincode(tempPincode);
                          setIsEditingPincode(false);
                        } else {
                          alert("Please enter a valid 6-digit pincode.");
                        }
                      }}
                      style={{
                        background: "#ff6600",
                        color: "#fff",
                        border: "none",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Check
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPincode(false)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#64748b",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="dzire-delivery-sub">
                    2 - 4 Days (Deliver to <b>{pincode}</b>){" "}
                    <span
                      className="dzire-delivery-change"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setTempPincode(pincode);
                        setIsEditingPincode(true);
                      }}
                    >
                      Change
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="dzire-panel-divider"></div>

            {/* Secure Checkout Row */}
            <div
              className="dzire-delivery-row dzire-secure-checkout"
              style={{
                border: "none",
                background: "none",
                padding: "0",
                margin: "12px 0",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <div className="dzire-delivery-info">
                <div className="dzire-delivery-title">Secure Checkout</div>
                <div className="dzire-delivery-sub">Safe & encrypted payments</div>
              </div>
            </div>

            {/* Divider */}
            <div className="dzire-panel-divider"></div>

            {/* Payment Partners (We Accept) */}
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

            {/* Divider */}
            <div className="dzire-panel-divider"></div>

            {/* Share This Product with circular buttons */}
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
              <div className="share-buttons-row" style={{ display: "flex", gap: "10px" }}>
                {/* Copy Link */}
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
                {/* WhatsApp */}
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
                {/* Facebook */}
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
    </aside>
  );
};

export default ProductRightPanel;
