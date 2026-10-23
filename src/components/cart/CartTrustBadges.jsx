import React from "react";
import { ShieldCheck, RefreshCcw, Tag, HelpCircle } from "lucide-react";

export const CartTrustBadges = () => {
  return (
    <div className="dz-trust-badges-grid">
      <div className="trust-badge-card">
        <ShieldCheck size={28} className="trust-badge-icon" />
        <div className="trust-badge-content">
          <h4>Secure Payments</h4>
          <p>100% secure &amp; encrypted payment options</p>
        </div>
      </div>

      <div className="trust-badge-card">
        <RefreshCcw size={28} className="trust-badge-icon" />
        <div className="trust-badge-content">
          <h4>Easy Returns</h4>
          <p>7-day easy returns on eligible products</p>
        </div>
      </div>

      <div className="trust-badge-card">
        <Tag size={28} className="trust-badge-icon" />
        <div className="trust-badge-content">
          <h4>Genuine Products</h4>
          <p>100% authentic gear from trusted brands</p>
        </div>
      </div>

      <div className="trust-badge-card">
        <HelpCircle size={28} className="trust-badge-icon" />
        <div className="trust-badge-content">
          <h4>Need Help?</h4>
          <p>Chat with our adventure experts</p>
        </div>
      </div>
    </div>
  );
};

export default CartTrustBadges;
