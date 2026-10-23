import React from "react";
import { ShoppingCart, Heart } from "lucide-react";
import everestBookCover from "../../assets/everest-book-cover.svg";

const BookStickyBar = ({
  show,
  currentBook,
  isWishlisted,
  onAddToCart,
  onWishlistToggle,
}) => {
  if (!show) return null;

  return (
    <div className="dzire-sticky-bottom-bar visible">
      <div className="dzire-sticky-bar-inner">
        <div className="dzire-sticky-bar-left">
          <img
            src={currentBook.image}
            alt={currentBook.title || currentBook.name}
            className="dzire-sticky-bar-thumb"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = currentBook.fallbackImage || everestBookCover;
            }}
          />
          <div className="dzire-sticky-bar-meta">
            <span className="dzire-sticky-bar-name">
              {currentBook.title || currentBook.name}
            </span>
            <div className="dzire-sticky-bar-price-wrapper">
              <span className="dzire-sticky-bar-price">₹{currentBook.price}</span>
              {(currentBook.originalPrice || currentBook.oldPrice) && (
                <span className="dzire-sticky-bar-old-price">
                  ₹{currentBook.originalPrice || currentBook.oldPrice}
                </span>
              )}
              {(currentBook.discount || currentBook.offers) && (
                <span className="sticky-discount-badge">
                  {currentBook.discount || currentBook.offers}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="dzire-sticky-bar-right">
          <button
            className="dzire-sticky-btn dzire-sticky-cart-btn"
            onClick={onAddToCart}
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
          <button
            className={`dzire-sticky-icon-btn ${
              isWishlisted ? "active" : ""
            }`}
            onClick={onWishlistToggle}
            title="Wishlist"
          >
            <Heart
              size={18}
              fill={isWishlisted ? "#ff3333" : "none"}
              color={isWishlisted ? "#ff3333" : "currentColor"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookStickyBar;
