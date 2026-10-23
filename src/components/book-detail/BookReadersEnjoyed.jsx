import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Star, Heart, RefreshCw, ShoppingCart } from "lucide-react";
import { readersAlsoEnjoyed, booksDatabase } from "../../data/booksData";

const BookReadersEnjoyed = ({
  sliderRef,
  onScrollSlider,
  onBookClick,
  isWishlisted,
  isInCompare,
  onWishlistToggle,
  onCompareToggle,
  onAddToCart,
}) => {
  return (
    <section className="readers-enjoyed-section">
      <div className="section-header-flex">
        <h2>Readers Also Enjoyed</h2>
        <div className="header-actions-flex">
          <Link to="/bookstore" className="view-all-link">
            <span>View All Books</span>
            <ChevronRight size={16} />
          </Link>
          <div className="slider-arrows">
            <button
              className="arrow-btn"
              onClick={() => onScrollSlider("left")}
              aria-label="Previous books"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="arrow-btn"
              onClick={() => onScrollSlider("right")}
              aria-label="Next books"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="books-slider-wrapper" ref={sliderRef}>
        {readersAlsoEnjoyed.map((b) => {
          const itemWishlisted = isWishlisted(b.id);
          const itemCompared = isInCompare ? isInCompare(b.id) : false;

          return (
            <div
              key={b.id}
              className="product-card is-home-page bookstore-card book-slider-card"
              onClick={() => onBookClick(b)}
              role="button"
              tabIndex={0}
            >
              {/* Image Box */}
              <div className="product-image-box">
                {b.badge && <span className="product-badge">{b.badge}</span>}
                <img
                  src={b.image}
                  alt={b.name}
                  className="product-main-image book-cover-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = b.fallbackImage;
                  }}
                />
              </div>

              {/* Product Info Section */}
              <div className="product-info">
                <div className="brand-rating-row">
                  <h4 className="brand-name">by {b.author}</h4>
                </div>

                <p className="book-item-name">{b.name}</p>

                {/* Rating Row */}
                <div className="product-rating-row">
                  <span className="rating-val">{b.rating}</span>
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
                  <span className="reviews-count">({b.reviews})</span>
                </div>

                {/* Price Row */}
                <div className="price-row">
                  {b.oldPrice && <span className="old-price">₹ {b.oldPrice}</span>}
                  <span className="new-price">₹ {b.price}</span>
                  {(b.discount || b.offers) && (
                    <span className="offer-tag-price-side">
                      {b.discount || b.offers}
                    </span>
                  )}
                </div>

                {/* Action Buttons: Wishlist, Compare, Add to Cart */}
                <div className="add-to-cart-container">
                  <button
                    className={`product-wishlist-btn-bottom ${
                      itemWishlisted ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onWishlistToggle(b, itemWishlisted);
                    }}
                    type="button"
                    title="Wishlist"
                  >
                    <Heart
                      size={16}
                      fill={itemWishlisted ? "#ff3333" : "transparent"}
                      color={itemWishlisted ? "#ff3333" : "#111111"}
                    />
                  </button>

                  <button
                    className={`product-compare-btn-bottom ${
                      itemCompared ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompareToggle(b, itemCompared);
                    }}
                    type="button"
                    title="Compare"
                  >
                    <RefreshCw
                      size={16}
                      color={itemCompared ? "#ff6600" : "#111111"}
                    />
                  </button>

                  <button
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(b);
                    }}
                    type="button"
                  >
                    <ShoppingCart size={15} />
                    <span className="cart-btn-text">ADD TO CART</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BookReadersEnjoyed;
