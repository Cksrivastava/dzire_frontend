import React from "react";
import { Star, ShoppingCart, Heart } from "lucide-react";
import visaImg from "../../assets/visa.png";
import masterImg from "../../assets/master.png";
import upiImg from "../../assets/upi.png";
import appleImg from "../../assets/apple.png";

const BookBuyingPanel = ({
  currentBook,
  quantity,
  wishlisted,
  onQuantityChange,
  onAddToCart,
  onWishlistToggle,
  onNavigateOffers,
}) => {
  return (
    <aside className="book-right-sticky">
      <div className="book-right-panel">
        {/* 1. Main Buying Block (Header, Price, Credits, Qty, Add to Cart) */}
        <div className="book-buying-main-block">
          <span className="book-category-tag">
            {currentBook.category || currentBook.genre || "MOUNTAINEERING"}
          </span>
          <h1 className="book-main-title">{currentBook.title || currentBook.name}</h1>
          <p className="book-main-author">{currentBook.author}</p>

          {/* Rating Row */}
          <div className="book-main-rating-row">
            <div className="stars-flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#ffa41c" color="#ffa41c" />
              ))}
            </div>
            <span className="rating-score">
              {currentBook.rating || "4.8"}{" "}
              <span className="reviews-link">
                ({currentBook.reviewsCount || currentBook.reviews || "128"} Reviews)
              </span>
            </span>
          </div>

          {/* Price Block */}
          <div className="book-main-price-block">
            {(currentBook.originalPrice || currentBook.oldPrice) && (
              <div className="book-mrp-line">
                <span className="book-mrp-label">MRP </span>
                <span className="book-main-old-price">
                  ₹{currentBook.originalPrice || currentBook.oldPrice}
                </span>
              </div>
            )}
            <div className="book-price-row">
              <span className="book-main-price">₹{currentBook.price}</span>
              {(currentBook.discount || currentBook.offers) && (
                <span className="book-main-discount-badge">
                  {currentBook.discount || currentBook.offers}
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
              <span className="dzire-earn-points">
                {Math.round((currentBook.price || 499) * 0.05)} Points
              </span>
            </div>
          </div>

          {/* QTY Selector */}
          <div className="book-qty-block">
            <h4 className="book-qty-label">QTY</h4>
            <div className="book-qty-picker">
              <button onClick={() => onQuantityChange(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => onQuantityChange(quantity + 1)}>+</button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="book-main-actions-row">
            <button className="book-add-to-cart-big-btn" onClick={onAddToCart}>
              <ShoppingCart size={20} />
              <span>ADD TO CART</span>
            </button>

            <button
              className={`book-wishlist-big-btn ${wishlisted ? "active" : ""}`}
              onClick={onWishlistToggle}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart
                size={20}
                fill={wishlisted ? "#ff3333" : "transparent"}
                color={wishlisted ? "#ff3333" : "currentColor"}
              />
            </button>
          </div>
        </div>

        {/* 2. Offers & Coupons Section */}
        <div className="book-offers-block">
          <div className="book-panel-divider"></div>

          <div className="book-offers-box">
            <div className="book-offers-header">
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
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span>Offers &amp; Coupons</span>
            </div>
            <div className="book-offers-body">
              <div className="book-offer-item">
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
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <div className="book-offer-details">
                  <span className="book-offer-code">BOOK10</span>
                  <span className="book-offer-desc">Get 10% OFF on orders above ₹500</span>
                </div>
                <svg
                  className="book-offer-chevron"
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
              <div className="book-offer-item">
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
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <div className="book-offer-details">
                  <span className="book-offer-code">READ500</span>
                  <span className="book-offer-desc">₹100 OFF on orders above ₹1,000</span>
                </div>
                <svg
                  className="book-offer-chevron"
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
              <div className="book-offer-item">
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
                >
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <div className="book-offer-details">
                  <span className="book-offer-code">FREEDEL</span>
                  <span className="book-offer-desc">Free Shipping on prepaid orders</span>
                </div>
                <svg
                  className="book-offer-chevron"
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
              <div className="book-view-all-offers" onClick={onNavigateOffers}>
                View All Offers &gt;
              </div>
            </div>
          </div>
        </div>

        {/* 3. Estimated Delivery & Trust Section */}
        <div className="book-delivery-trust-block">
          <div className="book-panel-divider"></div>

          {/* Estimated Delivery */}
          <div className="book-delivery-row">
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
            <div className="book-delivery-info">
              <div className="book-delivery-title">Estimated Delivery</div>
              <div className="book-delivery-sub">
                2 - 4 Days (Deliver to <b>110001</b>) <span className="book-delivery-change">Change</span>
              </div>
            </div>
          </div>

          <div className="book-panel-divider"></div>

          {/* Secure Checkout */}
          <div className="book-delivery-row">
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
            <div className="book-delivery-info">
              <div className="book-delivery-title">Secure Checkout</div>
              <div className="book-delivery-sub">Safe &amp; encrypted payments</div>
            </div>
          </div>

          <div className="book-panel-divider"></div>

          {/* We Accept */}
          <div className="book-we-accept-row">
            <span className="book-we-accept-label">We Accept:</span>
            <div className="book-payment-badges">
              <img src={visaImg} alt="Visa" className="book-payment-badge-img" />
              <img src={masterImg} alt="Mastercard" className="book-payment-badge-img" />
              <img src={upiImg} alt="UPI" className="book-payment-badge-img" />
              <img src={appleImg} alt="Apple Pay" className="book-payment-badge-img" />
            </div>
          </div>

          <div className="book-panel-divider"></div>

          {/* Share This Product */}
          <div className="book-share-section">
            <div className="book-share-title">Share this product</div>
            <div className="book-share-buttons">
              <button
                className="book-share-btn"
                title="Copy Link"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
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
                className="book-share-btn book-share-whatsapp"
                title="Share on WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                >
                  <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.737 5.469 2.025 7.769L0 32l8.469-2.016A15.927 15.927 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.5a13.43 13.43 0 0 1-6.875-1.894l-.494-.294-5.025 1.2 1.219-4.888-.319-.5A13.435 13.435 0 0 1 2.5 16C2.5 8.544 8.544 2.5 16 2.5S29.5 8.544 29.5 16 23.456 29.5 16 29.5zm7.544-9.806c-.413-.206-2.438-1.2-2.813-1.338-.375-.131-.65-.2-.919.206-.275.4-1.056 1.338-1.3 1.612-.238.269-.475.3-.888.1-.413-.206-1.744-.644-3.319-2.044-1.225-1.088-2.05-2.431-2.294-2.844-.238-.413-.025-.637.181-.844.181-.181.413-.469.619-.706.206-.238.275-.413.413-.688.131-.275.069-.519-.031-.725-.1-.206-.919-2.225-1.256-3.044-.331-.8-.669-.688-.919-.7-.238-.013-.506-.013-.775-.013-.269 0-.706.1-1.075.5-.369.4-1.406 1.375-1.406 3.35s1.438 3.887 1.637 4.156c.2.269 2.831 4.325 6.863 6.063.963.413 1.712.656 2.294.838.963.3 1.844.256 2.538.156.775-.112 2.438-.994 2.781-1.956.344-.963.344-1.787.238-1.956-.1-.175-.375-.275-.788-.481z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="book-share-btn book-share-facebook"
                title="Share on Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BookBuyingPanel;
