import React from "react";
import { Trash2, Truck } from "lucide-react";
import CartItemRow from "./CartItemRow";

export const CartTable = ({
  items,
  handleProductClick,
  handleUpdateQuantity,
  handleRemoveItem,
  handleMoveToWishlist,
  handleColorSelect,
  handleSizeSelect,
  handleClearCart,
  amountAwayFromFreeShipping,
  freeShippingProgress,
}) => {
  return (
    <div className="dz-cart-left-col">
      <div className="dz-cart-table-card">
        {/* Table Header */}
        <div className="dz-cart-table-header">
          <span className="col-product">PRODUCT</span>
          <span className="col-price">PRICE</span>
          <span className="col-quantity">QUANTITY</span>
          <span className="col-total">TOTAL</span>
        </div>

        {/* Product Rows */}
        <div className="dz-cart-items-list">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              handleProductClick={handleProductClick}
              handleUpdateQuantity={handleUpdateQuantity}
              handleRemoveItem={handleRemoveItem}
              handleMoveToWishlist={handleMoveToWishlist}
              handleColorSelect={handleColorSelect}
              handleSizeSelect={handleSizeSelect}
            />
          ))}
        </div>

        {/* BOTTOM LEFT ACTION ROW & FREE SHIPPING BANNER ATTACHED INSIDE TABLE CARD */}
        <div className="dz-cart-left-bottom">
          <button
            type="button"
            className="dz-clear-cart-btn"
            onClick={handleClearCart}
          >
            <Trash2 size={16} />
            <span>Clear Cart</span>
          </button>

          <div className="dz-free-shipping-banner">
            <div className="shipping-text-line">
              <Truck size={18} className="truck-icon" />
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
        </div>
      </div>
    </div>
  );
};

export default CartTable;
