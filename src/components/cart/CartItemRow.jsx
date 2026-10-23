import React from "react";

export const CartItemRow = ({
  item,
  handleProductClick,
  handleUpdateQuantity,
  handleRemoveItem,
  handleMoveToWishlist,
  handleColorSelect,
  handleSizeSelect,
}) => {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="dz-cart-item-group">
      {/* Top 4-Column Main Grid */}
      <div className="dz-cart-item-main-grid">
        {/* Product Info Cell (Col 1) */}
        <div className="col-product dz-product-info-cell">
          <div
            className="dz-product-img-box clickable-product-link"
            onClick={() => handleProductClick(item)}
            title={`View ${item.name}`}
          >
            <img src={item.image} alt={item.name} />
          </div>
          <div className="dz-product-details-box">
            <h3
              className="dz-product-title clickable-product-link"
              onClick={() => handleProductClick(item)}
              title={`View ${item.name}`}
            >
              {item.name}
            </h3>
            <div className="dz-product-spec-line">
              Color: {item.color} &nbsp;•&nbsp; Size: {item.size}
            </div>
            <div className="dz-product-meta-row">
              <div className="dz-stock-badge">
                <span className="stock-dot"></span>
                <span className="stock-text">In Stock</span>
              </div>
              <span className="dz-mobile-unit-price">
                ₹{item.price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Price Cell (Col 2 - Desktop/Tablet) */}
        <div className="col-price dz-price-cell">
          <span className="dz-price-val">₹{item.price.toLocaleString("en-IN")}</span>
        </div>

        {/* Quantity Cell (Col 3) */}
        <div className="col-quantity dz-quantity-cell">
          <div className="dz-qty-stepper">
            <button
              type="button"
              className="qty-minus"
              onClick={() => handleUpdateQuantity(item.id, -1)}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="qty-val">{item.quantity}</span>
            <button
              type="button"
              className="qty-plus"
              onClick={() => handleUpdateQuantity(item.id, 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div className="dz-item-action-links">
            <button
              type="button"
              className="action-link-remove"
              onClick={() => handleRemoveItem(item.id)}
            >
              Remove
            </button>
            <span className="link-divider">|</span>
            <button
              type="button"
              className="action-link-wishlist"
              onClick={() => handleMoveToWishlist(item)}
            >
              Move to Wishlist
            </button>
          </div>
        </div>

        {/* Total Cell (Col 4) */}
        <div className="col-total dz-total-cell">
          <span className="dz-mobile-total-label">Subtotal:</span>
          <span className="dz-total-val">₹{itemTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Variant Selector Card Sub-Row */}
      <div className="dz-cart-item-variant-row">
        <div className="dz-variant-selector-card">
          {/* Color Section */}
          {item.availableColors && item.availableColors.length > 0 && (
            <div className="variant-section-col">
              <span className="variant-section-title">Color:</span>
              <div className="color-swatches-group">
                {item.availableColors.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    title={col.name}
                    className={`color-swatch-rect ${
                      item.color === col.name ? "selected" : ""
                    }`}
                    style={{ backgroundColor: col.hex }}
                    onClick={() => handleColorSelect(item.id, col.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Section */}
          {item.availableSizes && item.availableSizes.length > 0 && (
            <div className="variant-section-col">
              <span className="variant-section-title">Size:</span>
              <div className="size-pills-group">
                {item.availableSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-pill-box ${
                      item.size === s ? "selected" : ""
                    }`}
                    onClick={() => handleSizeSelect(item.id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
