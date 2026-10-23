import React from "react";
import { Star, Heart, RefreshCw, ShoppingCart } from "lucide-react";

const BookstoreProductCard = ({
  book,
  isWishlisted,
  isInCompare,
  onCardClick,
  onWishlist,
  onCompare,
  onAddToCart,
}) => {
  const wishlisted = isWishlisted(book.id);
  const compared = isInCompare(book.id);

  return (
    <div
      className="product-card is-home-page bookstore-card"
      onClick={() => onCardClick(book)}
      role="button"
      tabIndex={0}
    >
      {/* Image Box */}
      <div className="product-image-box">
        {book.badge && (
          <span className="product-badge">{book.badge}</span>
        )}
        <img
          src={book.image}
          alt={book.name}
          className="product-main-image book-cover-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = book.fallbackImage;
          }}
        />
      </div>

      {/* Product Info Section matching Home Page */}
      <div className="product-info">
        <div className="brand-rating-row">
          <h4 className="brand-name">by {book.author}</h4>
        </div>

        <p className="book-item-name">{book.name}</p>

        {/* Rating Row */}
        <div className="product-rating-row">
          <span className="rating-val">{book.rating}</span>
          <div className="stars-container">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < 4 ? "#ffa41c" : "transparent"}
                color={i < 4 ? "#ffa41c" : "#d1d5db"}
              />
            ))}
          </div>
          <span className="reviews-count">({book.reviews})</span>
        </div>

        {/* Price Row */}
        <div className="price-row">
          {book.oldPrice && (
            <span className="old-price">₹ {book.oldPrice}</span>
          )}
          <span className="new-price">₹ {book.price}</span>
          {book.offers && (
            <span className="offer-tag-price-side">{book.offers}</span>
          )}
        </div>

        {/* Action Buttons: Wishlist, Compare, Add to Cart */}
        <div className="add-to-cart-container">
          <button
            className={`product-wishlist-btn-bottom ${
              wishlisted ? "active" : ""
            }`}
            onClick={(e) => onWishlist(e, book)}
            type="button"
            title="Wishlist"
          >
            <Heart
              size={16}
              fill={wishlisted ? "#ff3333" : "transparent"}
              color={wishlisted ? "#ff3333" : "#111111"}
            />
          </button>

          <button
            className={`product-compare-btn-bottom ${
              compared ? "active" : ""
            }`}
            onClick={(e) => onCompare(e, book)}
            type="button"
            title="Compare"
          >
            <RefreshCw
              size={16}
              color={compared ? "#ff6600" : "#111111"}
            />
          </button>

          <button
            className="add-to-cart-btn"
            onClick={(e) => onAddToCart(e, book)}
            type="button"
          >
            <ShoppingCart size={15} />
            <span className="cart-btn-text">ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookstoreProductCard;
