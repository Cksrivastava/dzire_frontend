import React, { useContext, useEffect, useMemo, useState } from "react";
import "./ProductSection.css";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { ShopContext } from "../context/ShopContext";
import { ChevronLeft, ChevronRight, Heart, Star, ShoppingCart, RefreshCw, ClipboardList, Flame, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BannerSection from "./BannerSection";
import WaysToSave from "./WaysToSave";
import PriceCardsSection from "./PriceCardsSection";
import TrendingPage from "./TrendingPage";

const products = [
  {
    id: 1,
    brand: "CTR (Coasters)",
    name: "Traditional CTR OD4 | High-Ankle Trekking Shoes",
    price: 1499,
    oldPrice: "2,499",
    rating: "4.6",
    reviews: "1.2k",
    offers: "+2 offers",
    badge: "Best Seller",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/09/OD4-olv-1.jpg",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 2,
    brand: "DOMYOS",
    name: "Men Fitness Tracksuit Jacket With Moisture Management",
    price: 999,
    oldPrice: "",
    rating: "4.5",
    reviews: "1.3k",
    offers: "",
    badge: "",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 3,
    brand: "CTR (Coasters)",
    name: "CTR Trek1 » Light Weight & Low Ankle Trekking Shoes",
    price: 1549,
    oldPrice: "1,999",
    rating: "4.7",
    reviews: "1.1k",
    offers: "",
    badge: "",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/10/Trek1-cmnt-1.jpg",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 4,
    brand: "CTR (Coasters)",
    name: "Women & Kids CTR TREK1 » Low Ankle & Light Weight Trekking Shoes",
    price: 1498,
    oldPrice: "1,799",
    rating: "4.4",
    reviews: "520",
    offers: "",
    badge: "",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/10/W-Trek1-cmnt-1.jpg",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 5,
    brand: "CTR (Coasters)",
    name: "Women CTR TREK2 » High-Ankle & Light-Weight Trekking Shoes",
    price: 1549,
    oldPrice: "1,899",
    rating: "4.8",
    reviews: "640",
    offers: "",
    badge: "",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/09/W-Trek2-cmnt-1.jpg",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 6,
    brand: "CTR (Coasters)",
    name: "CTR Sherpa2 » High Ankle | Waterproof Hiking & Trekking Shoes",
    price: 1999,
    oldPrice: "2,499",
    rating: "4.9",
    reviews: "2.3k",
    offers: "+1 offer",
    badge: "Trending",
    images: [
      "https://dzirestore.in/wp-content/uploads/2026/03/Sherpa2-olv-1.jpg",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 7,
    brand: "ADVENTURE WORX",
    name: "Xplore 55L Rucksack - For Multi-Day Trekking & Backpacking",
    price: 5599,
    oldPrice: "6,599",
    rating: "4.8",
    reviews: "140",
    offers: "",
    badge: "Premium",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/07/aw-xplore55-yellow-10.jpg",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 8,
    brand: "ADVENTURE WORX",
    name: "Zero Series Rucksack - 40/50/60 L",
    price: 2499,
    oldPrice: "2,999",
    rating: "4.6",
    reviews: "320",
    offers: "",
    badge: "",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/08/aw-zero50-pg-3.jpg",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 9,
    brand: "TRIPOLE GEAR",
    name: "Walker 65L Rucksack - Trekking & Travel",
    price: 3299,
    oldPrice: "3,499",
    rating: "4.7",
    reviews: "480",
    offers: "+2 offers",
    badge: "Hot Buy",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/08/tr-walker65-og-1.jpg",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 10,
    brand: "ADVENTURE WORX",
    name: "Xplore 35L Rucksack – For Day-Hikes & Backpacking",
    price: 3599,
    oldPrice: "3,999",
    rating: "4.5",
    reviews: "180",
    offers: "",
    badge: "",
    images: [
      "https://dzirestore.in/wp-content/uploads/2025/09/aw-xpl35-cal-6.jpg",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 11,
    brand: "TEST BRAND",
    name: "Testing Product 11 | Premium Performance Sports Gear",
    price: 999,
    oldPrice: "1,999",
    rating: "4.8",
    reviews: "120",
    offers: "+1 offer",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 12,
    brand: "TEST BRAND",
    name: "Testing Product 12 | Lightweight Outdoor Adventure Jacket",
    price: 1499,
    oldPrice: "2,499",
    rating: "4.7",
    reviews: "85",
    offers: "",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 13,
    brand: "TEST BRAND",
    name: "Testing Product 13 | High-Volume Sports Water Flask",
    price: 499,
    oldPrice: "799",
    rating: "4.6",
    reviews: "310",
    offers: "+2 offers",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 14,
    brand: "TEST BRAND",
    name: "Testing Product 14 | Heavy-Duty Hiking Trekking Poles",
    price: 799,
    oldPrice: "1,299",
    rating: "4.5",
    reviews: "150",
    offers: "",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 15,
    brand: "TEST BRAND",
    name: "Testing Product 15 | Comfortable All-Weather Sleeping Bag",
    price: 1999,
    oldPrice: "2,999",
    rating: "4.8",
    reviews: "230",
    offers: "+1 offer",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 16,
    brand: "TEST BRAND",
    name: "Testing Product 16 | Durable 2-Person Dome Camping Tent",
    price: 2999,
    oldPrice: "4,499",
    rating: "4.9",
    reviews: "450",
    offers: "+2 offers",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 17,
    brand: "TEST BRAND",
    name: "Testing Product 17 | Advanced Smart Sport Activity Watch",
    price: 2499,
    oldPrice: "3,999",
    rating: "4.6",
    reviews: "680",
    offers: "+3 offers",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 18,
    brand: "TEST BRAND",
    name: "Testing Product 18 | Dual-Speed Mountain Gear Bicycle",
    price: 9999,
    oldPrice: "14,999",
    rating: "4.7",
    reviews: "95",
    offers: "+5 offers",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 19,
    brand: "TEST BRAND",
    name: "Testing Product 19 | High-Bounce Premium FIFA Soccer Ball",
    price: 1199,
    oldPrice: "1,799",
    rating: "4.4",
    reviews: "180",
    offers: "",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517747614396-d21a78b850e8?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 20,
    brand: "TEST BRAND",
    name: "Testing Product 20 | Non-Slip Professional Alignment Yoga Mat",
    price: 699,
    oldPrice: "1,099",
    rating: "4.5",
    reviews: "720",
    offers: "",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 21,
    brand: "TEST BRAND",
    name: "Testing Product 21 | Ultra-Comfort Sleeping Bag for Cold Weather",
    price: 1899,
    oldPrice: "2,999",
    rating: "4.7",
    reviews: "940",
    offers: "+1 offer",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 22,
    brand: "TEST BRAND",
    name: "Testing Product 22 | Waterproof 2-Person Camping Tent Easy Setup",
    price: 3499,
    oldPrice: "4,999",
    rating: "4.8",
    reviews: "1.5k",
    offers: "+2 offers",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 23,
    brand: "TEST BRAND",
    name: "Testing Product 23 | DZIRE Smart Fitness Watch Heart Rate Monitor",
    price: 2499,
    oldPrice: "4,499",
    rating: "4.5",
    reviews: "2.8k",
    offers: "+3 offers",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 24,
    brand: "TEST BRAND",
    name: "Testing Product 24 | Heavy-Duty Trekking Pole Anti-Shock Grip",
    price: 899,
    oldPrice: "1,499",
    rating: "4.6",
    reviews: "390",
    offers: "",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 25,
    brand: "TEST BRAND",
    name: "Testing Product 25 | Premium Stainless Steel Gym Water Bottle",
    price: 599,
    oldPrice: "999",
    rating: "4.7",
    reviews: "4.1k",
    offers: "",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 26,
    brand: "TEST BRAND",
    name: "Testing Product 26 | Men Heavy Thermal Fleece Winter Jacket",
    price: 2199,
    oldPrice: "3,499",
    rating: "4.8",
    reviews: "820",
    offers: "+1 offer",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 27,
    brand: "TEST BRAND",
    name: "Testing Product 27 | Kiprun Ultra-Light Breathable Running Shoes",
    price: 1899,
    oldPrice: "2,799",
    rating: "4.4",
    reviews: "610",
    offers: "",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 28,
    brand: "TEST BRAND",
    name: "Testing Product 28 | BTWIN Sport Hybrid Cycle 21 Speed",
    price: 14999,
    oldPrice: "18,999",
    rating: "4.7",
    reviews: "180",
    offers: "+4 offers",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 29,
    brand: "TEST BRAND",
    name: "Testing Product 29 | Kipsta Premium FIFA Match Football Size 5",
    price: 1299,
    oldPrice: "1,999",
    rating: "4.6",
    reviews: "750",
    offers: "",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517747614396-d21a78b850e8?auto=format&fit=crop&w=900&q=80"
    ],
  },
  {
    id: 30,
    brand: "TEST BRAND",
    name: "Testing Product 30 | Anti-Slip High-Density 6mm Yoga Mat",
    price: 699,
    oldPrice: "1,199",
    rating: "4.5",
    reviews: "1.9k",
    offers: "",
    badge: "Testing",
    images: [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=80"
    ],
  },
];

const rightSideProducts = [
  "Running Shoes",
  "Gym Trackpants",
  "Fitness Jacket",
  "Gym Shorts",
  "Rain Jacket",
  "Cargo Trousers",
  "Travel Backpack",
  "Trekking Shoes",
  "Cycling Gloves",
  "Sports T-Shirt",
  "Yoga Mat",
  "Training Gloves",
  "Water Bottle",
  "Camping Tent",
  "Hiking Bag",
  "Sports Cap",
  "Men Hoodie",
  "Women Leggings",
  "Fitness Band",
  "Outdoor Jacket",
  "Running Socks",
  "Climbing Rope",
  "Football Shoes",
  "Swimming Goggles",
];

const formatPrice = (value) => `₹ ${value.toLocaleString("en-IN")}`;

const ProductCard = ({ item, sectionKey, isHomePage = false }) => {
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
    navigate(`/product/${item.id}`);
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
        </div>

        {isHomePage && (item.offers || item.oldPrice) && (
          <div style={{ display: 'flex', marginBottom: '8px' }}>
            <span className="offer-tag-price-side" style={{ margin: '0' }}>{offerText}</span>
          </div>
        )}

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
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ShoppingCart size={18} />
                <span className="cart-btn-text">ADD TO CART</span>
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ShoppingCart size={18} />
                <span className="cart-btn-text">Add to Cart</span>
              </span>
            )}
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

const ProductSection = ({
  products: productList = products,
  showExtraSections = true,
  isHomePage = false,
}) => {
  const [bottomStart, setBottomStart] = useState(0);
  const [topItemsPerView, setTopItemsPerView] = useState(4);
  const [bottomItemsPerView, setBottomItemsPerView] = useState(5);
  const [isMobile, setIsMobile] = useState(false);

  const checklistRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Limit to exactly 10 products in the Product Checklist
  const topProducts = useMemo(() => products.slice(0, 10), []);

  const checkScrollBounds = () => {
    const el = checklistRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    // Add a 5px buffer to handle fractional pixel roundings in various browsers
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 5;
    setCanScrollRight(!isAtEnd);
  };

  // Popular & New Arrivals Refs
  const popularRef = React.useRef(null);
  const newArrivalsRef = React.useRef(null);

  // Auto-scroll loop helper for Product Checklist (All Products)
  const scrollNextChecklist = () => {
    const el = checklistRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".product-card-wrapper");
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap) || 12;

    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 15;
    if (isAtEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    }
  };

  // Auto-scroll loop helper for Popular Products (Best Sellers)
  const scrollNextPopular = () => {
    const el = popularRef.current;
    if (!el) return;
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 15;
    if (isAtEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: 298, behavior: "smooth" });
    }
  };

  // Auto-scroll loop helper for New Arrivals
  const scrollNextNewArrivals = () => {
    const el = newArrivalsRef.current;
    if (!el) return;
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 15;
    if (isAtEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: 298, behavior: "smooth" });
    }
  };

  // Register auto-scroll hooks with 10-second interval and 10-second hover inactivity timeout
  useAutoScroll(checklistRef, scrollNextChecklist, 10000, 10000);
  useAutoScroll(popularRef, scrollNextPopular, 10000, 10000);
  useAutoScroll(newArrivalsRef, scrollNextNewArrivals, 10000, 10000);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      const mobile = width < 900;
      setIsMobile(mobile);

      if (width < 600) {
        setTopItemsPerView(2);
      } else if (width < 900) {
        setTopItemsPerView(2);
      } else if (width < 1300) {
        setTopItemsPerView(3);
      } else {
        setTopItemsPerView(4);
      }
      setBottomItemsPerView(mobile ? productList.length : width < 1200 ? 3 : 5);
      setTimeout(checkScrollBounds, 50);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [topProducts.length, productList.length]);

  useEffect(() => {
    setBottomStart(0);
  }, [topItemsPerView, bottomItemsPerView]);

  const bottomProducts = productList;

  const newArrivalsProducts = useMemo(() => {
    return productList.filter((_, idx) => idx % 2 !== 0);
  }, [productList]);

  const handleTopPrev = () => {
    const el = checklistRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".product-card-wrapper");
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap) || 18;

    el.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
  };

  const handleTopNext = () => {
    const el = checklistRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".product-card-wrapper");
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap) || 18;

    el.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
  };

  const handlePopularPrev = () => {
    const el = popularRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".marquee-card-wrapper");
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      el.scrollBy({ left: -(cardWidth + 10), behavior: "smooth" });
    } else {
      el.scrollBy({ left: -290, behavior: "smooth" });
    }
  };

  const handlePopularNext = () => {
    const el = popularRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".marquee-card-wrapper");
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      el.scrollBy({ left: cardWidth + 10, behavior: "smooth" });
    } else {
      el.scrollBy({ left: 290, behavior: "smooth" });
    }
  };

  const handleNewArrivalsPrev = () => {
    const el = newArrivalsRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".marquee-card-wrapper");
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      el.scrollBy({ left: -(cardWidth + 10), behavior: "smooth" });
    } else {
      el.scrollBy({ left: -290, behavior: "smooth" });
    }
  };

  const handleNewArrivalsNext = () => {
    const el = newArrivalsRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".marquee-card-wrapper");
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      el.scrollBy({ left: cardWidth + 10, behavior: "smooth" });
    } else {
      el.scrollBy({ left: 290, behavior: "smooth" });
    }
  };

  // Set up click-and-drag desktop mouse interaction for Product Checklist
  useEffect(() => {
    const el = checklistRef.current;
    if (!el) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let scrollLeftStart = 0;
    let hasDragged = false;

    const handleMouseDown = (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      hasDragged = false;
      startX = e.pageX - el.offsetLeft;
      startY = e.pageY - el.offsetTop;
      scrollLeftStart = el.scrollLeft;

      el.style.scrollBehavior = "auto";
      el.style.cursor = "grabbing";
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.pageX - el.offsetLeft;
      const y = e.pageY - el.offsetTop;
      const walkX = x - startX;
      const walkY = y - startY;

      if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
        hasDragged = true;
      }

      el.scrollLeft = scrollLeftStart - walkX;
    };

    const handleMouseUpOrLeave = () => {
      if (!isDragging) return;
      isDragging = false;

      el.style.cursor = "grab";
      el.style.scrollBehavior = "smooth";

      if (hasDragged) {
        const preventClick = (clickEvent) => {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
          el.removeEventListener("click", preventClick, true);
        };
        el.addEventListener("click", preventClick, true);
      }
    };

    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUpOrLeave);

    checkScrollBounds();

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUpOrLeave);
    };
  }, [topProducts]);



  return (
    <>
      <div className="product-sections-wrapper">
        <section className="workout-section" id="product-checklist">
          <div className="workout-left">
            <div className="workout-left-content">
              <h2 className="trending-header-title" style={{ fontFamily: '"Rubik", sans-serif', fontSize: '34px', fontWeight: '900', margin: '0 0 24px 0', color: '#111111', lineHeight: '1.2' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle', marginRight: '6px' }}>
                  <ClipboardList size={28} style={{ color: '#ff6600', flexShrink: 0 }} />
                  <span className="workout-subtitle" style={{ fontFamily: '"Rubik", sans-serif', color: '#ff6600', margin: 0, textAlign: 'left', lineHeight: '1.2', fontSize: '28px', fontWeight: 'bold' }}>
                    Shop <br className="desktop-break" />
                    your
                  </span>
                </span>
                <span style={{ fontFamily: '"Rubik", sans-serif', display: 'inline-block', verticalAlign: 'middle', marginTop: '4px', fontWeight: 'bold' }}>
                  Outdoor <br className="desktop-break" />
                  Collection
                </span>
              </h2>

              <div className="workout-controls" style={{ display: "flex", gap: "12px", marginTop: "12px", marginLeft: "-4px", padding: "4px" }}>
                <button
                  className="slider-arrow-new"
                  onClick={handleTopPrev}
                  disabled={!canScrollLeft}
                  type="button"
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "6px",
                    border: "1px solid #d5d5d5",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    opacity: !canScrollLeft ? 0.45 : 1,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    if (canScrollLeft) {
                      e.currentTarget.style.borderColor = "#111111";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d5d5d5";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <ChevronLeft size={22} color="#111111" />
                </button>

                <button
                  className="slider-arrow-new"
                  onClick={handleTopNext}
                  disabled={!canScrollRight}
                  type="button"
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "6px",
                    border: "1px solid #d5d5d5",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    opacity: !canScrollRight ? 0.45 : 1,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    if (canScrollRight) {
                      e.currentTarget.style.borderColor = "#111111";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d5d5d5";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <ChevronRight size={22} color="#111111" />
                </button>
              </div>
            </div>
          </div>

          <div className="workout-right">
            <div className="top-slider-wrapper" style={{ overflow: "hidden", width: "100%", paddingTop: "12px", paddingBottom: "12px", marginTop: "-12px", marginBottom: "-12px" }}>
              <div
                ref={checklistRef}
                className="workout-grid"
                onScroll={checkScrollBounds}
                style={{
                  display: "flex",
                  gap: "12px",
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  userSelect: "none",
                  cursor: "grab",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  width: "100%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  marginTop: "-10px",
                  marginBottom: "-10px",
                  scrollSnapType: "x mandatory",
                }}
              >
                {topProducts.map((item) => (
                  <div
                    className="product-card-wrapper"
                    key={`top-wrapper-${item.id}`}
                    style={{
                      flex: `0 0 calc((100% - (${topItemsPerView} - 1) * 12px) / ${topItemsPerView})`,
                      width: `calc((100% - (${topItemsPerView} - 1) * 12px) / ${topItemsPerView})`,
                      scrollSnapAlign: "start",
                    }}
                  >
                    <ProductCard
                      key={`top-${item.id}`}
                      item={item}
                      sectionKey="top"
                      isHomePage={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider"></div>

        <section className="popular-section">
          <div className="trending-header-modern" style={{ paddingBottom: '14px' }}>
            <div className="trending-header-content">
              <span className="trending-header-badge">200+ Products</span>

              <div className="trending-header-main-row" style={{ alignItems: 'center' }}>
                <div className="trending-header-left-side">
                  <h2 className="trending-header-title" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Flame size={24} style={{ color: '#ff3333' }} /> Trending Gear</h2>
                  <p className="trending-header-description">Discover the products outdoor enthusiasts are exploring the most.</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="popular-controls" style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="slider-arrow-new"
                      onClick={handlePopularPrev}
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
                        padding: 0
                      }}
                      onMouseEnter={(e) => {
                        if (1) {
                          e.currentTarget.style.borderColor = "#111111";
                          e.currentTarget.style.transform = "scale(1.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#d5d5d5";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <ChevronLeft size={20} color="#111111" />
                    </button>

                    <button
                      className="slider-arrow-new"
                      onClick={handlePopularNext}
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
                        padding: 0
                      }}
                      onMouseEnter={(e) => {
                        if (1) {
                          e.currentTarget.style.borderColor = "#111111";
                          e.currentTarget.style.transform = "scale(1.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#d5d5d5";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <ChevronRight size={20} color="#111111" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="popular-main-layout" style={{ overflow: 'hidden', width: '100%', paddingTop: '12px', paddingBottom: '12px', marginTop: '-12px', marginBottom: '-12px' }}>
            <InteractiveMarquee
              items={bottomProducts}
              speed={0}
              direction="left"
              containerRef={popularRef}
              renderItem={(item, idx, ipv) => {
                const count = ipv || 4;
                return (
                  <div
                    key={`popular-wrapper-${item.id}-${idx}`}
                    className="marquee-card-wrapper"
                    style={{
                      flex: `0 0 calc((100% - (${count} - 1) * 10px) / ${count})`,
                      width: `calc((100% - (${count} - 1) * 10px) / ${count})`,
                      scrollSnapAlign: "start",
                    }}
                  >
                    <ProductCard
                      key={`popular-${item.id}-${idx}`}
                      item={item}
                      sectionKey="popular"
                      isHomePage={true}
                    />
                  </div>
                );
              }}
            />
          </div>
        </section>
      </div>

      <div className="new-arrivals-bg-wrapper">
        <div className="product-sections-wrapper" style={{ background: 'transparent' }}>
          <section className="popular-section" id="new-arrivals">
            <div className="trending-header-modern" style={{ paddingBottom: '14px' }}>
              <div className="trending-header-content">
                <span className="trending-header-badge">10+ Products</span>

                <div className="trending-header-main-row" style={{ alignItems: 'center' }}>
                  <div className="trending-header-left-side">
                    <h2 className="trending-header-title" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={24} style={{ color: '#ffa41c' }} /> New Arrivals</h2>
                    <p className="trending-header-description">Shop your gears, newly arrive at our website.</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="popular-controls" style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="slider-arrow-new"
                        onClick={handleNewArrivalsPrev}
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
                          padding: 0
                        }}
                        onMouseEnter={(e) => {
                          if (1) {
                            e.currentTarget.style.borderColor = "#111111";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#d5d5d5";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <ChevronLeft size={20} color="#111111" />
                      </button>

                      <button
                        className="slider-arrow-new"
                        onClick={handleNewArrivalsNext}
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
                          padding: 0
                        }}
                        onMouseEnter={(e) => {
                          if (1) {
                            e.currentTarget.style.borderColor = "#111111";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#d5d5d5";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <ChevronRight size={20} color="#111111" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="popular-main-layout" style={{ overflow: 'hidden', width: '100%', paddingTop: '12px', paddingBottom: '12px', marginTop: '-12px', marginBottom: '-12px' }}>
              <InteractiveMarquee
                items={newArrivalsProducts}
                speed={0}
                direction="right"
                containerRef={newArrivalsRef}
                renderItem={(item, idx, ipv) => {
                  const count = ipv || 4;
                  return (
                    <div
                      key={`newarrivals-wrapper-${item.id}-${idx}`}
                      className="marquee-card-wrapper"
                      style={{
                        flex: `0 0 calc((100% - (${count} - 1) * 10px) / ${count})`,
                        width: `calc((100% - (${count} - 1) * 10px) / ${count})`,
                        scrollSnapAlign: "start",
                      }}
                    >
                      <ProductCard
                        key={`newarrivals-${item.id}-${idx}`}
                        item={item}
                        sectionKey="newarrivals"
                        isHomePage={true}
                      />
                    </div>
                  );
                }}
              />
            </div>
          </section>
        </div>
      </div>

      <div className="product-sections-wrapper">
        {showExtraSections ? (
          <>
            <BannerSection />
            <div style={{ backgroundColor: '#fff', width: '100%' }}>
              <div className="section-divider"></div>
              <PriceCardsSection />
              <div className="section-divider"></div>
            </div>
            <TrendingPage />
            <div className="section-divider"></div>
            <WaysToSave />
            <div className="section-divider"></div>
          </>
        ) : (
          <div className="section-divider"></div>
        )}
      </div>
    </>
  );
};

export default ProductSection;