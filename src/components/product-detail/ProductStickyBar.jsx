import React from "react";
import { Zap, Heart, RefreshCw } from "lucide-react";

export const ProductStickyBar = ({
  showStickyBar,
  product,
  allProductImages,
  colors,
  selectedColor,
  setSelectedColor,
  setActiveThumb,
  handleAddToCartClick,
  handleBuyNowClick,
  toggleWishlist,
  wishlistItems = [],
  toggleCompare,
  compareItems = [],
}) => {
  const isWishlisted = wishlistItems.some((item) => String(item.id) === String(product.id));
  const isCompared = compareItems.some((item) => String(item.id) === String(product.id));

  return (
    <div className={`dzire-sticky-bottom-bar ${showStickyBar ? "visible" : ""}`}>
      <div className="dzire-sticky-bar-inner">
        <div className="dzire-sticky-bar-left">
          <img src={allProductImages[0]} alt={product.name} className="dzire-sticky-bar-thumb" />
          <div className="dzire-sticky-bar-meta">
            <span className="dzire-sticky-bar-name">{product.name}</span>
            <div className="dzire-sticky-bar-price-wrapper">
              <span className="dzire-sticky-bar-price">₹{product.price}</span>
              {product.oldPrice && (
                <span className="dzire-sticky-bar-old-price">₹{product.oldPrice}</span>
              )}
            </div>
          </div>

          {/* FULL HEIGHT COLOR SELECTOR BLOCK */}
          {colors && colors.length > 0 && (
            <div className="dzire-sticky-full-height-color-box">
              <span className="sticky-color-tag">
                Color: <strong>{selectedColor}</strong>
              </span>
              <div className="sticky-color-swatches-inline">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    className={`sticky-swatch-box ${selectedColor === c.name ? "selected" : ""}`}
                    style={{ backgroundColor: c.color }}
                    onClick={() => {
                      setSelectedColor(c.name);
                      if (c.image) {
                        const idx = allProductImages.indexOf(c.image);
                        if (idx !== -1) setActiveThumb(idx);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="dzire-sticky-bar-right">
          <button className="dzire-sticky-btn add-to-cart-btn" onClick={handleAddToCartClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          <button className="dzire-sticky-icon-btn" onClick={handleBuyNowClick} title="Buy Now">
            <Zap size={18} fill="none" />
          </button>
          <button
            className={`dzire-sticky-icon-btn ${isWishlisted ? "active" : ""}`}
            onClick={() => toggleWishlist(product)}
            title="Wishlist"
          >
            <Heart
              size={18}
              fill={isWishlisted ? "#ff3333" : "none"}
              color={isWishlisted ? "#ff3333" : "currentColor"}
            />
          </button>
          <button
            className={`dzire-sticky-icon-btn ${isCompared ? "active" : ""}`}
            onClick={() => toggleCompare(product)}
            title="Compare"
          >
            <RefreshCw
              size={17}
              color={isCompared ? "#ff6600" : "currentColor"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductStickyBar;
