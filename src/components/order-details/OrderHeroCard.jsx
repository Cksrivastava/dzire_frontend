import React from "react";
import { Check } from "lucide-react";

const OrderHeroCard = ({ customerName, email, onNavigateOrders, onNavigateShop }) => {
  return (
    <div className="dz-thankyou-hero-card">
      <div className="dz-thankyou-left">
        <div className="dz-thankyou-title-row">
          <div className="dz-success-check-circle">
            <Check size={24} strokeWidth={3} />
          </div>
          <h1 className="dz-thankyou-heading">Thank you, {customerName}!</h1>
        </div>
        <p className="dz-thankyou-subtext">
          Your order has been placed successfully.<br />
          We've sent an order confirmation email to <strong>{email}</strong>
        </p>
        <div className="dz-thankyou-actions">
          <button
            type="button"
            className="dz-btn-view-orders"
            onClick={onNavigateOrders}
          >
            View My Orders
          </button>
          <button
            type="button"
            className="dz-btn-continue-shop"
            onClick={onNavigateShop}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <div className="dz-thankyou-right-art">
        {/* SVG Mountain Illustration matching design */}
        <svg
          viewBox="0 0 500 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="dz-mountain-svg"
        >
          {/* Sun */}
          <circle cx="280" cy="50" r="18" fill="#fed7aa" opacity="0.8" />
          {/* Birds */}
          <path d="M260 65 Q265 60 270 65 Q275 60 280 65" stroke="#78716c" strokeWidth="1.5" fill="none" />
          <path d="M245 75 Q249 71 253 75 Q257 71 261 75" stroke="#78716c" strokeWidth="1.2" fill="none" />

          {/* Background Mountains */}
          <polygon points="120,220 220,110 320,220" fill="#e7e5e4" opacity="0.7" />
          <polygon points="260,220 370,80 480,220" fill="#d6d3d1" opacity="0.8" />

          {/* Foreground Snowy Mountain */}
          <polygon points="180,220 310,40 440,220" fill="#a8a29e" />
          {/* Snow Peaks */}
          <polygon points="310,40 285,85 305,95 320,80 335,90 310,40" fill="#ffffff" />
          <polygon points="220,110 205,135 220,142 235,130 220,110" fill="#ffffff" />

          {/* Pine Trees Base Layer */}
          <path d="M50,220 L70,170 L90,220 Z" fill="#2d5a27" />
          <path d="M75,220 L95,160 L115,220 Z" fill="#1e3a1e" />
          <path d="M100,220 L120,150 L140,220 Z" fill="#36642d" />
          <path d="M125,220 L145,165 L165,220 Z" fill="#244722" />
          <path d="M150,220 L170,175 L190,220 Z" fill="#2d5a27" />
          <path d="M340,220 L355,175 L370,220 Z" fill="#1e3a1e" />
          <path d="M360,220 L378,160 L396,220 Z" fill="#2d5a27" />
          <path d="M385,220 L405,150 L425,220 Z" fill="#244722" />
          <path d="M415,220 L435,165 L455,220 Z" fill="#36642d" />
          <path d="M445,220 L465,175 L485,220 Z" fill="#1e3a1e" />

          {/* Ground Slope Line */}
          <path d="M20,220 Q200,215 490,220" stroke="#78716c" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );
};

export default OrderHeroCard;
