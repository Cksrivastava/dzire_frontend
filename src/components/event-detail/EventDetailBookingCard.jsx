import React from "react";
import visaImg from "../../assets/visa.png";
import masterImg from "../../assets/master.png";
import upiImg from "../../assets/upi.png";
import appleImg from "../../assets/apple.png";

const ArrowIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const EventDetailBookingCard = ({ event, onRegister }) => {
  return (
    <div className="event-right-col">
      <div className="sticky-booking-card">
        <div className="event-booking-top-block">
          <div className="price-tag-row">
            <span className="price-amount">{event.price}</span>
            <span className="price-period">Per Person</span>
          </div>

          <button type="button" className="register-now-btn" onClick={onRegister}>
            REGISTER NOW <ArrowIcon size={14} />
          </button>

          <div className="secure-spot-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span>Secure your spot</span>
          </div>
        </div>

        {/* Secure Checkout & Trust Section (Under Register Now on Laptop, Bottom on Mobile) */}
        <div className="event-secure-checkout-card">
          <div className="event-panel-divider"></div>

          {/* Secure Checkout */}
          <div className="event-trust-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div className="event-trust-info">
              <div className="event-trust-title">Secure Checkout</div>
              <div className="event-trust-sub">Safe &amp; encrypted payments</div>
            </div>
          </div>

          {/* Divider */}
          <div className="event-panel-divider"></div>

          {/* We Accept */}
          <div className="event-we-accept-row">
            <span className="event-we-accept-label">We Accept:</span>
            <div className="event-payment-badges">
              <img src={visaImg} alt="Visa" className="event-payment-badge-img" />
              <img src={masterImg} alt="Mastercard" className="event-payment-badge-img" />
              <img src={upiImg} alt="UPI" className="event-payment-badge-img" />
              <img src={appleImg} alt="Apple Pay" className="event-payment-badge-img" />
            </div>
          </div>

          {/* Divider */}
          <div className="event-panel-divider"></div>

          {/* Share This Product / Event */}
          <div className="event-share-section">
            <div className="event-share-title">Share this product</div>
            <div className="event-share-buttons">
              <button
                className="event-share-btn"
                title="Copy Link"
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Event link copied!"); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </button>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="event-share-btn event-share-whatsapp"
                title="Share on WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.737 5.469 2.025 7.769L0 32l8.469-2.016A15.927 15.927 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.5a13.43 13.43 0 0 1-6.875-1.894l-.494-.294-5.025 1.2 1.219-4.888-.319-.5A13.435 13.435 0 0 1 2.5 16C2.5 8.544 8.544 2.5 16 2.5S29.5 8.544 29.5 16 23.456 29.5 16 29.5zm7.544-9.806c-.413-.206-2.438-1.2-2.813-1.338-.375-.131-.65-.2-.919.206-.275.4-1.056 1.338-1.3 1.612-.238.269-.475.3-.888.1-.413-.206-1.744-.644-3.319-2.044-1.225-1.088-2.05-2.431-2.294-2.844-.238-.413-.025-.637.181-.844.181-.181.413-.469.619-.706.206-.238.275-.413.413-.688.131-.275.069-.519-.031-.725-.1-.206-.919-2.225-1.256-3.044-.331-.8-.669-.688-.919-.7-.238-.013-.506-.013-.775-.013-.269 0-.706.1-1.075.5-.369.4-1.406 1.375-1.406 3.35s1.438 3.887 1.637 4.156c.2.269 2.831 4.325 6.863 6.063.963.413 1.712.656 2.294.838.963.3 1.844.256 2.538.156.775-.112 2.438-.994 2.781-1.956.344-.963.344-1.787.238-1.956-.1-.175-.375-.275-.788-.481z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="event-share-btn event-share-facebook"
                title="Share on Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailBookingCard;
export { ArrowIcon };
