import React, { useMemo, useState, useEffect } from "react";
import { Heart, Star, ShoppingCart, RefreshCw } from "lucide-react";

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "string") {
    if (value.startsWith("₹")) return value;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? value : `₹ ${num.toLocaleString("en-IN")}`;
  }
  return `₹ ${Number(value).toLocaleString("en-IN")}`;
};

export const TrendingProductCard = ({
  item,
  isActive,
  isCompared,
  onCardClick,
  onWishlist,
  onCompare,
  onAddToCart,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productImages = useMemo(() => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      const validImages = item.images.filter(Boolean);
      if (validImages.length > 0) return validImages;
    }
    const baseImage = item.image || item.thumb;
    if (baseImage) return [baseImage];
    return [];
  }, [item]);

  const offerText = useMemo(() => {
    if (item.offers) return item.offers;
    if (item.oldPrice && item.price) {
      const oldP = parseFloat(String(item.oldPrice).replace(/[^0-9.]/g, ""));
      const newP = parseFloat(String(item.price).replace(/[^0-9.]/g, ""));
      if (oldP > newP) {
        const discount = Math.round(((oldP - newP) / oldP) * 100);
        return `${discount}% OFF`;
      }
    }
    return "";
  }, [item.offers, item.oldPrice, item.price]);

  useEffect(() => {
    if (productImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [productImages.length]);

  return (
    <div
      className="product-card is-home-page"
      onClick={() => onCardClick(item)}
      role="button"
    >
      <div className="product-image-box">
        {item.badge && <span className="product-badge">{item.badge}</span>}

        <div
          className="product-image-slider"
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
          }}
        >
          {productImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${item.name} ${index + 1}`}
              className="product-main-image"
            />
          ))}
        </div>

        {productImages.length > 1 && (
          <div className="product-image-dots">
            {productImages.map((_, index) => (
              <button
                key={`dot-${index}`}
                className={`product-image-dot ${index === currentImageIndex ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <div
          className="brand-rating-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "4px",
          }}
        >
          <h4 className="brand-name" style={{ margin: 0 }}>
            {item.brand}
          </h4>
        </div>

        <p>{item.name}</p>

        <div
          className="product-rating-row"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            marginTop: "4px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#111",
              marginRight: "4px",
            }}
          >
            {item.rating}
          </span>
          <div
            className="stars-container"
            style={{ display: "flex", gap: "1px", alignItems: "center" }}
          >
            {[...Array(5)].map((_, i) => {
              const ratingVal = parseFloat(item.rating) || 0;
              const isFilled = i < Math.round(ratingVal);
              return (
                <Star
                  key={i}
                  size={12}
                  fill={isFilled ? "#ffa41c" : "transparent"}
                  color={isFilled ? "#ffa41c" : "#d1d5db"}
                />
              );
            })}
          </div>
          <span
            className="reviews-count"
            style={{ color: "#777", fontSize: "12px", marginLeft: "6px" }}
          >
            ({item.reviews || "112"})
          </span>
        </div>

        <div className="price-row">
          {item.oldPrice && <span className="old-price">₹ {String(item.oldPrice).replace(/^₹\s*/, "")}</span>}
          <span className="new-price">{formatPrice(item.price)}</span>
          {(item.offers || item.oldPrice) && (
            <span className="offer-tag-price-side">{offerText}</span>
          )}
        </div>

        <div className="add-to-cart-container">
          <button
            className={`product-wishlist-btn-bottom ${isActive ? "active" : ""}`}
            onClick={(e) => onWishlist(e, item)}
            type="button"
            title="Wishlist"
          >
            <Heart
              size={16}
              fill={isActive ? "#ff3333" : "transparent"}
              color={isActive ? "#ff3333" : "#111111"}
            />
          </button>
          <button
            className={`product-compare-btn-bottom ${isCompared ? "active" : ""}`}
            onClick={(e) => onCompare(e, item)}
            type="button"
            title="Compare"
          >
            <RefreshCw size={16} color={isCompared ? "#ff6600" : "#111111"} />
          </button>
          <button
            className="add-to-cart-btn"
            onClick={(e) => onAddToCart(e, item)}
            type="button"
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <ShoppingCart size={18} />
              <span className="cart-btn-text">ADD TO CART</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingProductCard;
