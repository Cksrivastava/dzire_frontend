import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export const CartEmptyState = () => {
  return (
    <div className="dz-cart-empty-state">
      <div className="dz-empty-icon-circle">🛒</div>
      <h2>Your Cart is Empty</h2>
      <p>Explore our outdoor gear collection and add your favorite items!</p>
      <Link to="/shop" className="dz-continue-shopping-btn">
        <ChevronLeft size={18} />
        Continue Shopping
      </Link>
    </div>
  );
};

export default CartEmptyState;
