import React from "react";
import { Link } from "react-router-dom";
import { Headphones, Package, ShoppingBag, ArrowRight } from "lucide-react";

const OrderSupportFooter = () => {
  return (
    <>
      {/* FULL-WIDTH SUPPORT & NAVIGATION CARD (SINGLE UNIFIED CARD WITH 3 COLUMNS) */}
      <div className="dz-support-footer-card">
        <div className="support-col">
          <div className="support-header-line">
            <Headphones size={28} className="support-icon" />
            <h3>Need Help?</h3>
          </div>
          <p className="support-desc">Our support team is here for you.</p>
          <Link to="/support" className="support-arrow-link">
            <span>Contact Support</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="support-col">
          <div className="support-header-line">
            <Package size={28} className="support-icon" />
            <h3>Easy Returns</h3>
          </div>
          <p className="support-desc">You can raise a return request within 7 days of delivery.</p>
          <Link to="/return-policy" className="support-arrow-link">
            <span>View Return Policy</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="support-col">
          <div className="support-header-line">
            <ShoppingBag size={28} className="support-icon" />
            <h3>Continue Shopping</h3>
          </div>
          <p className="support-desc">Explore more gear for your next adventure.</p>
          <Link to="/shop" className="support-arrow-link">
            <span>Shop Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* BOTTOM MESSAGE */}
      <div className="dz-bottom-closing-message">
        Thank you for shopping with Dzire. Adventure awaits! ❤️
      </div>
    </>
  );
};

export default OrderSupportFooter;
