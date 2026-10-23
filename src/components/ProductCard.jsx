import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Star, ShoppingCart, RefreshCw } from "lucide-react";
import { ShopContext } from "../context/ShopContext";

const formatPrice = (value) => `₹ ${value.toLocaleString("en-IN")}`;

export const ProductCard = ({ item, sectionKey, isHomePage = false }) => {
  const { addToCart, toggleWishlist, wishlistItems = [], toggleCompare, compareItems = [] } =
    useContext(ShopContext);

  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const uniqueItem = {
    ...item,
    id: `${sectionKey}-${item.id}`,
    originalId: item.id,
    sectionKey,
  };

  const productImages = useMemo(() => {
    if (item.images && item.images.length > 1) {
      return item.images;
    }
    const baseImage = item.image || (item.images && item.images[0]);
    if (!baseImage) return [];

    const fallbacks = [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    ];

    const idx = (item.id || 0) % fallbacks.length;
    return [baseImage, fallbacks[idx]];
  }, [item]);

  const isWishlisted = wishlistItems.some(
    (product) => product.id === uniqueItem.id
  );

  const isCompared = compareItems.some(
    (product) => product.id === uniqueItem.id
  );

  const offerText = useMemo(() => {
    if (item.offers) return item.offers;
    if (item.oldPrice && item.price) {
      const oldP = parseFloat(String(item.oldPrice).replace(/,/g, ''));
      const newP = parseFloat(item.price);
      if (oldP > newP) {
        const discount = Math.round(((oldP - newP) / oldP) * 100);
        return `${discount}% OFF`;
      }
    }
    return "+2 offers";
  }, [item.offers, item.oldPrice, item.price]);

  useEffect(() => {
    if (productImages.length <= 1) return;

    const delay = isHomePage ? 5000 : 1500;
    const shouldRun = isHomePage ? true : isHovered;

    if (!shouldRun) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, delay);

    return () => clearInterval(interval);
  }, [isHovered, productImages.length, isHomePage]);

  const handleCardClick = () => {
    const slug =
      item.seoSlug ||
      item.slug ||
      (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : item.id);
    navigate(`/product/${slug}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(uniqueItem);
    navigate("/cart");
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(uniqueItem);
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    toggleCompare(uniqueItem);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (productImages.length <= 1) return;

    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (productImages.length <= 1) return;

    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div
      className={`product-card ${isHomePage ? "is-home-page" : ""}`}
      onClick={handleCardClick}
      role="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <div className="product-image-box">
        {item.badge && <span className="product-badge">{item.badge}</span>}

        <div
          className="product-image-slider"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {productImages.map((img, index) => (
            <img
              key={`${uniqueItem.id}-img-${index}`}
              src={img}
              alt={item.name}
              className="product-main-image"
            />
          ))}
        </div>

        {productImages.length > 1 && (
          isHomePage ? (
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
          ) : (
            <>
              <button
                className="product-image-arrow product-image-arrow-left"
                onClick={handlePrevImage}
                type="button"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="product-image-arrow product-image-arrow-right"
                onClick={handleNextImage}
                type="button"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )
        )}
      </div>

      <div className="product-info">
        {isHomePage ? (
          <>
            <div className="brand-rating-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '4px' }}>
              <h4 className="brand-name" style={{ margin: 0 }}>{item.brand}</h4>
            </div>

            <p>{item.name}</p>

            <div className="product-rating-row" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#111', marginRight: '4px' }}>{item.rating}</span>
              <div className="stars-container" style={{ display: 'flex', gap: '1px', alignItems: 'center' }}>
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
              <span className="reviews-count" style={{ color: '#777', fontSize: '12px', marginLeft: '6px' }}>
                ({item.reviews || "112"})
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="brand-rating-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '6px' }}>
              <h4 className="brand-name" style={{ margin: 0 }}>{item.brand}</h4>

              <div className="product-rating-row" style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                <Star size={12} fill="#ff6600" color="#ff6600" />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#204ecf' }}>{item.rating}</span>
                {item.reviews && <span className="reviews-count" style={{ color: '#7b7b7b', fontSize: '11px', marginLeft: '2px' }}>| {item.reviews}</span>}
              </div>
            </div>

            <p>{item.name}</p>
          </>
        )}

        <div className="price-row" style={{ marginBottom: '6px' }}>
          {item.oldPrice && <span className="old-price">₹ {item.oldPrice}</span>}
          <span className="new-price">{formatPrice(item.price)}</span>
          {isHomePage && (item.offers || item.oldPrice) && (
            <span className="offer-tag-price-side">{offerText}</span>
          )}
        </div>

        {!isHomePage && item.offers && <div className="offer-row">{item.offers}</div>}

        <div className="add-to-cart-container" style={isHomePage ? {} : { display: 'flex', gap: '8px', width: '100%', marginTop: 'auto' }}>
          <button
            className={`product-wishlist-btn-bottom ${isWishlisted ? "active" : ""}`}
            onClick={handleWishlist}
            type="button"
            title="Wishlist"
            style={isHomePage ? {} : {
              width: '38px',
              height: '36px',
              borderRadius: '14px',
              border: '1px solid #d5d5d5',
              background: '#f7f7f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.3s ease'
            }}
          >
            <Heart
              size={16}
              fill={isWishlisted ? "#ff3333" : "transparent"}
              color={isWishlisted ? "#ff3333" : (isHomePage ? "#111111" : "#555555")}
            />
          </button>
          <button
            className={`product-compare-btn-bottom ${isCompared ? "active" : ""}`}
            onClick={handleCompare}
            type="button"
            title="Compare"
            style={isHomePage ? {} : {
              width: '38px',
              height: '36px',
              borderRadius: '14px',
              border: '1px solid #d5d5d5',
              background: '#f7f7f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.3s ease'
            }}
          >
            <RefreshCw
              size={16}
              color={isCompared ? "#ff6600" : (isHomePage ? "#111111" : "#555555")}
            />
          </button>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            type="button"
            style={isHomePage ? {} : { flex: 1 }}
          >
            {isHomePage ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <ShoppingCart size={15} />
                <span className="cart-btn-text">ADD TO CART</span>
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <ShoppingCart size={15} />
                <span className="cart-btn-text">Add to Cart</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
