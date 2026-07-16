import React, { useContext, useEffect, useMemo, useState } from "react";
import "./TrendingPage.css";
import "./ProductSection.css";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { ShopContext } from "../context/ShopContext";
import { ChevronLeft, ChevronRight, Heart, Star, ShoppingCart, RefreshCw, Trophy, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { featuredProducts } from "../data/products";

const products = [
  {
    id: 101,
    brand: "CTR (Coasters)",
    name: "Traditional CTR OD4 | High-Ankle Trekking Shoes",
    price: 1499,
    oldPrice: "2,499",
    rating: "4.6",
    reviews: "1.2k",
    offers: "+2 offers",
    badge: "Best Seller",
    category: "Foot-Wear",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/09/OD4-olv-1.jpg",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
    ],
    thumb: "https://dzirestore.in/wp-content/uploads/2025/09/OD4-olv-1.jpg",
  },
  {
    id: 102,
    brand: "DZIRE",
    name: "Athletic Jacket With Stretch Comfort",
    price: 1299,
    oldPrice: "2,599",
    rating: "4.8",
    reviews: "2.1k",
    offers: "+1 offer",
    badge: "Best seller",
    category: "Outerwear",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    ],
    thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: 103,
    brand: "CTR (Coasters)",
    name: "CTR Trek1 » Light Weight & Low Ankle Trekking Shoes",
    price: 1549,
    oldPrice: "1,999",
    rating: "4.7",
    reviews: "1.1k",
    offers: "",
    badge: "",
    category: "Foot-Wear",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/10/Trek1-cmnt-1.jpg",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"
    ],
    thumb: "https://dzirestore.in/wp-content/uploads/2025/10/Trek1-cmnt-1.jpg",
  },
  {
    id: 104,
    brand: "CTR (Coasters)",
    name: "Women & Kids CTR TREK1 » Low Ankle & Light Weight Trekking Shoes",
    price: 1498,
    oldPrice: "1,799",
    rating: "4.4",
    reviews: "520",
    offers: "",
    badge: "",
    category: "Foot-Wear",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/10/W-Trek1-cmnt-1.jpg",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80"
    ],
    thumb: "https://dzirestore.in/wp-content/uploads/2025/10/W-Trek1-cmnt-1.jpg",
  },
  {
    id: 105,
    brand: "CTR (Coasters)",
    name: "Women CTR TREK2 » High-Ankle & Light-Weight Trekking Shoes",
    price: 1549,
    oldPrice: "1,899",
    rating: "4.8",
    reviews: "640",
    offers: "",
    badge: "",
    category: "Foot-Wear",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/09/W-Trek2-cmnt-1.jpg",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80"
    ],
    thumb: "https://dzirestore.in/wp-content/uploads/2025/09/W-Trek2-cmnt-1.jpg",
  },
  {
    id: 106,
    brand: "CTR (Coasters)",
    name: "CTR Sherpa2 » High Ankle | Waterproof Hiking & Trekking Shoes",
    price: 1999,
    oldPrice: "2,499",
    rating: "4.9",
    reviews: "2.3k",
    offers: "+1 offer",
    badge: "Trending",
    category: "Foot-Wear",
    images: [
      "https://dzirestore.in/wp-content/uploads/2026/03/Sherpa2-olv-1.jpg",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"
    ],
    thumb: "https://dzirestore.in/wp-content/uploads/2026/03/Sherpa2-olv-1.jpg",
  },
  {
    id: 107,
    brand: "ADVENTURE WORX",
    name: "Xplore 55L Rucksack - For Multi-Day Trekking & Backpacking",
    price: 5599,
    oldPrice: "6,599",
    rating: "4.8",
    reviews: "140",
    offers: "",
    badge: "Premium",
    category: "Bags",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/07/aw-xplore55-yellow-10.jpg",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    ],
    thumb: "https://dzirestore.in/wp-content/uploads/2025/07/aw-xplore55-yellow-10.jpg",
  },
  {
    id: 108,
    brand: "ADVENTURE WORX",
    name: "Zero Series Rucksack - 40/50/60 L",
    price: 2499,
    oldPrice: "2,999",
    rating: "4.6",
    reviews: "320",
    offers: "",
    badge: "",
    category: "Bags",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/08/aw-zero50-pg-3.jpg",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    ],
    thumb: "https://dzirestore.in/wp-content/uploads/2025/08/aw-zero50-pg-3.jpg",
  },
  {
    id: 109,
    brand: "TRIPOLE GEAR",
    name: "Walker 65L Rucksack - Trekking & Travel",
    price: 3299,
    oldPrice: "3,499",
    rating: "4.7",
    reviews: "480",
    offers: "+2 offers",
    badge: "Hot Buy",
    category: "Bags",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/08/tr-walker65-og-1.jpg",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    ],
    thumb: "https://dzirestore.in/wp-content/uploads/2025/08/tr-walker65-og-1.jpg",
  },
  {
    id: 110,
    brand: "ADVENTURE WORX",
    name: "Xplore 35L Rucksack – For Day-Hikes & Backpacking",
    price: 3599,
    oldPrice: "3,999",
    rating: "4.5",
    reviews: "180",
    offers: "",
    badge: "",
    category: "Bags",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/09/aw-xpl35-cal-6.jpg",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    ],
    thumb: "https://dzirestore.in/wp-content/uploads/2025/09/aw-xpl35-cal-6.jpg",
  },
];

const formatPrice = (value) => `₹ ${value.toLocaleString("en-IN")}`;

const TrendingProductCard = ({ item, isActive, isCompared, onCardClick, onWishlist, onCompare, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [productImages.length]);

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

  const handleFloatingAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(e, item);
  };

  return (
    <div
      className="product-card is-home-page"
      onClick={() => onCardClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onCardClick(item);
        }
      }}
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

        <div className="price-row">
          {item.oldPrice && <span className="old-price">₹ {item.oldPrice}</span>}
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
            <RefreshCw
              size={16}
              color={isCompared ? "#ff6600" : "#111111"}
            />
          </button>
          <button
            className="add-to-cart-btn"
            onClick={(e) => onAddToCart(e, item)}
            type="button"
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <ShoppingCart size={18} />
              <span className="cart-btn-text">ADD TO CART</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const InteractiveMarquee = ({ items, speed = 1, direction = "left", renderItem, containerRef: externalRef }) => {
  const localRef = React.useRef(null);
  const containerRef = externalRef || localRef;
  const [itemsPerView, setItemsPerView] = React.useState(4);

  React.useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerView(2);
      } else if (width < 900) {
        setItemsPerView(2);
      } else if (width < 1300) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (direction === "right" && speed > 0) {
      el.scrollLeft = el.scrollWidth / 2;
    }

    let isUserInteracting = false;
    let isHovered = false;
    let frameId;
    let timeoutId;

    const autoScroll = () => {
      if (!isUserInteracting && !isHovered && speed > 0) {
        const halfWidth = el.scrollWidth / 2;
        if (direction === "left") {
          el.scrollLeft += speed;
          if (el.scrollLeft >= halfWidth) {
            el.scrollLeft -= halfWidth;
          }
        } else {
          el.scrollLeft -= speed;
          if (el.scrollLeft <= 0) {
            el.scrollLeft += halfWidth;
          }
        }
      }
      if (speed > 0) {
        frameId = requestAnimationFrame(autoScroll);
      }
    };

    let isDragging = false;
    let startX;
    let scrollLeftStart;

    const handleMouseDown = (e) => {
      isDragging = true;
      isUserInteracting = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeftStart = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeftStart - walk;
    };

    const handleMouseUpOrLeave = () => {
      if (isDragging) {
        isDragging = false;
        el.style.cursor = 'grab';
      }
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        isUserInteracting = false;
      }, 2000);
    };

    const handleTouchStart = () => {
      isUserInteracting = true;
      clearTimeout(timeoutId);
    };

    const handleTouchEnd = () => {
      timeoutId = setTimeout(() => {
        isUserInteracting = false;
      }, 2000);
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUpOrLeave);
    el.addEventListener('mouseleave', handleMouseUpOrLeave);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('wheel', handleTouchStart);

    if (speed > 0) {
      frameId = requestAnimationFrame(autoScroll);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseUpOrLeave);
      el.removeEventListener('mouseleave', handleMouseUpOrLeave);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('wheel', handleTouchStart);
    };
  }, [speed, direction, items]);

  const duplicatedItems = speed > 0 ? [...items, ...items] : items;

  return (
    <div
      ref={containerRef}
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        width: '100%',
        cursor: 'grab',
        display: 'flex',
        userSelect: 'none',
        scrollbarWidth: 'none',
        paddingTop: '10px',
        paddingBottom: '10px',
        marginTop: '-10px',
        marginBottom: '-10px',
        scrollSnapType: "x mandatory",
      }}
      className="marquee-container-interactive"
    >
      <div style={{ display: 'flex', gap: '10px', padding: '10px 0', width: '100%' }} className="marquee-track">
        {duplicatedItems.map((item, idx) => renderItem(item, idx, itemsPerView))}
      </div>
    </div>
  );
};

const TrendingPage = () => {
  const { addToCart, toggleWishlist, wishlistItems = [], toggleCompare, compareItems = [] } =
    useContext(ShopContext);

  const navigate = useNavigate();

  const isWishlisted = (id) => wishlistItems.some((item) => item.id === id);
  const isCompared = (id) => compareItems.some((item) => item.id === id);

  const handleCardClick = (item) => {
    navigate(`/product/${item.id}`);
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart(item);
    navigate("/cart");
  };

  const handleWishlist = (e, item) => {
    e.stopPropagation();
    toggleWishlist(item);
  };

  const handleCompare = (e, item) => {
    e.stopPropagation();
    toggleCompare(item);
  };

  // Slider controls logic for Best Sellers
  const bestSellersRef = React.useRef(null);

  const handleBestSellersPrev = () => {
    const el = bestSellersRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".marquee-card-wrapper");
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      el.scrollBy({ left: -(cardWidth + 10), behavior: "smooth" });
    } else {
      el.scrollBy({ left: -290, behavior: "smooth" });
    }
  };

  const handleBestSellersNext = () => {
    const el = bestSellersRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".marquee-card-wrapper");
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      el.scrollBy({ left: cardWidth + 10, behavior: "smooth" });
    } else {
      el.scrollBy({ left: 290, behavior: "smooth" });
    }
  };

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      const ids = JSON.parse(stored);
      const found = ids
        .map((pId) => featuredProducts.find((item) => String(item.id) === String(pId)))
        .filter(Boolean);
      setRecentlyViewed(found);
    } else {
      const defaults = [103, 104, 105, 106, 107]
        .map((pId) => featuredProducts.find((item) => String(item.id) === String(pId)))
        .filter(Boolean);
      setRecentlyViewed(defaults);
    }
  }, []);

  // Slider controls logic for Recently Viewed
  const recentlyViewedRef = React.useRef(null);

  // Auto-scroll loop helper for Best Sellers
  const scrollNextBestSellers = () => {
    const el = bestSellersRef.current;
    if (!el) return;
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 15;
    if (isAtEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const cards = el.querySelectorAll(".marquee-card-wrapper");
      const scrollDist = cards.length > 0 ? (cards[0].offsetWidth + 10) : 290;
      el.scrollBy({ left: scrollDist, behavior: "smooth" });
    }
  };

  // Auto-scroll loop helper for Recently Viewed
  const scrollNextRecentlyViewed = () => {
    const el = recentlyViewedRef.current;
    if (!el) return;
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 15;
    if (isAtEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const cards = el.querySelectorAll(".marquee-card-wrapper");
      const scrollDist = cards.length > 0 ? (cards[0].offsetWidth + 10) : 290;
      el.scrollBy({ left: scrollDist, behavior: "smooth" });
    }
  };

  // Register auto-scroll hooks with 10-second interval and 10-second hover inactivity timeout
  useAutoScroll(bestSellersRef, scrollNextBestSellers, 10000, 10000);
  useAutoScroll(recentlyViewedRef, scrollNextRecentlyViewed, 10000, 10000);

  const handleRecentlyViewedPrev = () => {
    const el = recentlyViewedRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".marquee-card-wrapper");
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      el.scrollBy({ left: -(cardWidth + 10), behavior: "smooth" });
    } else {
      el.scrollBy({ left: -290, behavior: "smooth" });
    }
  };

  const handleRecentlyViewedNext = () => {
    const el = recentlyViewedRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".marquee-card-wrapper");
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      el.scrollBy({ left: cardWidth + 10, behavior: "smooth" });
    } else {
      el.scrollBy({ left: 290, behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="trending-showcase-section" id="best-sellers">
        <div className="trending-header-modern">
          <div className="trending-header-content">
            <span className="trending-header-badge">150+ Products</span>

            <div className="trending-header-main-row">
              <div className="trending-header-left-side">
                <h2 className="trending-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Trophy size={24} style={{ color: '#ffa41c' }} /> Community Favorites</h2>
                <p className="trending-header-subtitle">
                  The outdoor essentials our adventure community keeps coming back to.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2px' }}>
                <div className="trending-controls" style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="slider-arrow-new"
                    onClick={handleBestSellersPrev}
                    type="button"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      border: "1px solid #d5d5d5",
                      background: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      opacity: 1,
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                      padding: 0,
                      color: "#111111"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#ff6600";
                      e.currentTarget.style.color = "#ff6600";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#d5d5d5";
                      e.currentTarget.style.color = "#111111";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <ChevronLeft size={20} color="currentColor" />
                  </button>

                  <button
                    className="slider-arrow-new"
                    onClick={handleBestSellersNext}
                    type="button"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      border: "1px solid #d5d5d5",
                      background: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      opacity: 1,
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                      padding: 0,
                      color: "#111111"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#ff6600";
                      e.currentTarget.style.color = "#ff6600";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#d5d5d5";
                      e.currentTarget.style.color = "#111111";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <ChevronRight size={20} color="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="trending-main-layout" style={{ overflow: 'hidden', width: '100%', paddingTop: '12px', paddingBottom: '12px', marginTop: '-12px', marginBottom: '-12px' }}>
          <InteractiveMarquee
            items={products}
            speed={0}
            direction="left"
            containerRef={bestSellersRef}
            renderItem={(item, idx, ipv) => {
              const isActive = isWishlisted(item.id);
              const count = ipv || 4;
              return (
                <div
                  key={`trending-wrapper-${item.id}-${idx}`}
                  className="marquee-card-wrapper"
                  style={{
                    flex: `0 0 calc((100% - (${count} - 1) * 10px) / ${count})`,
                    width: `calc((100% - (${count} - 1) * 10px) / ${count})`,
                    scrollSnapAlign: "start",
                  }}
                >
                  <TrendingProductCard
                    key={`${item.id}-${idx}`}
                    item={item}
                    isActive={isActive}
                    isCompared={isCompared(item.id)}
                    onCardClick={handleCardClick}
                    onWishlist={handleWishlist}
                    onCompare={handleCompare}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              );
            }}
          />
        </div>
      </section>

      {recentlyViewed && recentlyViewed.length > 0 && (
        <>
          <div className="section-divider"></div>
          <section className="trending-showcase-section" id="recently-viewed" style={{ marginTop: '30px' }}>
            <div className="trending-header-modern">
              <div className="trending-header-content">
                <span className="trending-header-badge">Based on your activity</span>

                <div className="trending-header-main-row">
                  <div className="trending-header-left-side">
                    <h2 className="trending-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><History size={24} style={{ color: '#4b5563' }} /> Continue Exploring</h2>
                    <p className="trending-header-subtitle">
                      Pick up right where you left off.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2px' }}>
                    <div className="trending-controls" style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="slider-arrow-new"
                        onClick={handleRecentlyViewedPrev}
                        type="button"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "6px",
                          border: "1px solid #d5d5d5",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          opacity: 1,
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease",
                          padding: 0,
                          color: "#111111"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#ff6600";
                          e.currentTarget.style.color = "#ff6600";
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#d5d5d5";
                          e.currentTarget.style.color = "#111111";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <ChevronLeft size={20} color="currentColor" />
                      </button>

                      <button
                        className="slider-arrow-new"
                        onClick={handleRecentlyViewedNext}
                        type="button"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "6px",
                          border: "1px solid #d5d5d5",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          opacity: 1,
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease",
                          padding: 0,
                          color: "#111111"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#ff6600";
                          e.currentTarget.style.color = "#ff6600";
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#d5d5d5";
                          e.currentTarget.style.color = "#111111";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <ChevronRight size={20} color="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="trending-main-layout" style={{ overflow: 'hidden', width: '100%', paddingTop: '12px', paddingBottom: '12px', marginTop: '-12px', marginBottom: '-12px' }}>
              <InteractiveMarquee
                items={recentlyViewed}
                speed={0}
                direction="left"
                containerRef={recentlyViewedRef}
                renderItem={(item, idx, ipv) => {
                  const isActive = isWishlisted(item.id);
                  const count = ipv || 4;
                  return (
                    <div
                      key={`recently-wrapper-${item.id}-${idx}`}
                      className="marquee-card-wrapper"
                      style={{
                        flex: `0 0 calc((100% - (${count} - 1) * 10px) / ${count})`,
                        width: `calc((100% - (${count} - 1) * 10px) / ${count})`,
                        scrollSnapAlign: "start",
                      }}
                    >
                      <TrendingProductCard
                        key={`${item.id}-${idx}`}
                        item={item}
                        isActive={isActive}
                        isCompared={isCompared(item.id)}
                        onCardClick={handleCardClick}
                        onWishlist={handleWishlist}
                        onCompare={handleCompare}
                        onAddToCart={handleAddToCart}
                      />
                    </div>
                  );
                }}
              />
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default TrendingPage;