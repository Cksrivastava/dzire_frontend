import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export const CartHeader = ({ totalCount }) => {
  return (
    <div className="dz-cart-top-bar">
      <div className="dz-cart-title-section">
        <h1 className="dz-cart-main-heading">
          Your Cart{" "}
          <span className="dz-cart-item-count">
            ({totalCount} {totalCount === 1 ? "Item" : "Items"})
          </span>
        </h1>
        <nav className="dz-cart-breadcrumbs">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">&gt;</span>
          <span className="breadcrumb-current">Cart</span>
        </nav>
      </div>
      <div className="dz-cart-secure-badge">
        <ShieldCheck size={18} className="shield-icon" />
        <span>100% Secure Checkout</span>
      </div>
    </div>
  );
};

export default CartHeader;
