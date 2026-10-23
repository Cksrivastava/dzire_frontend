import React, { useContext, useEffect, useState, useRef } from "react";
import "./TrendingPage.css";
import "./ProductSection.css";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../services/api";
import TrendingProductCard from "./trending/TrendingProductCard";
import CommunityFavoritesSection from "./trending/CommunityFavoritesSection";
import RecentlyViewedSection from "./trending/RecentlyViewedSection";

export { TrendingProductCard };

const mapProduct = (p) => {
  const numericPrice = typeof p.price === "number" ? p.price : (parseFloat(String(p.price).replace(/[^0-9.]/g, "")) || 0);
  const numericOldPrice = p.oldPrice ? (typeof p.oldPrice === "number" ? p.oldPrice : (parseFloat(String(p.oldPrice).replace(/[^0-9.]/g, "")) || null)) : null;

  return {
    ...p,
    id: p.id || p._id,
    name: p.name || p.title || "Product",
    brand: p.brand || "DZIRE",
    price: numericPrice,
    oldPrice: numericOldPrice ? numericOldPrice.toLocaleString("en-IN") : "",
    rating: p.rating || "4.8",
    reviews: String(p.reviews || (p.reviewsList?.length) || "12"),
    image: p.image || (p.images && p.images[0]) || "",
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
    badge: p.badge || "",
    offers: p.offers || "",
  };
};

const isWebsiteVisible = (p) => {
  if (!p) return false;
  const vis = (p.visibility || p.productChannel || "").toString().toLowerCase();
  const webStatus = (p.webStatus || "").toString().toLowerCase();
  if (vis === "in-store" || vis === "instore" || webStatus === "in-store") return false;
  return true;
};

const TrendingPage = ({ products: propProducts }) => {
  const { addToCart, toggleWishlist, wishlistItems = [], toggleCompare, compareItems = [] } =
    useContext(ShopContext);

  const navigate = useNavigate();

  const isWishlisted = (id) => wishlistItems.some((item) => item.id === id);
  const isCompared = (id) => compareItems.some((item) => item.id === id);

  const [communityProducts, setCommunityProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    if (Array.isArray(propProducts) && propProducts.length > 0) {
      const webOnly = propProducts.filter(isWebsiteVisible).map(mapProduct);
      setCommunityProducts(webOnly);
      return;
    }

    let mounted = true;
    productAPI
      .getAll()
      .then((res) => {
        if (mounted && res && Array.isArray(res.products)) {
          const webOnly = res.products.filter(isWebsiteVisible).map(mapProduct);
          setCommunityProducts(webOnly);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [propProducts]);

  const handleCardClick = (item) => {
    if (item && item.id) {
      try {
        const stored = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
        const nextStored = [item.id, ...stored.filter((id) => String(id) !== String(item.id))].slice(0, 20);
        localStorage.setItem("recentlyViewed", JSON.stringify(nextStored));
      } catch (e) {}
    }
    const slug =
      item?.seoSlug ||
      item?.slug ||
      (item?.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : item?.id);
    navigate(`/product/${slug}`);
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
  const bestSellersRef = useRef(null);

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

  useEffect(() => {
    if (!communityProducts || communityProducts.length === 0) {
      setRecentlyViewed([]);
      return;
    }

    let found = [];
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids) && ids.length > 0) {
          found = ids
            .map((pId) => communityProducts.find((item) => String(item.id) === String(pId)))
            .filter(Boolean);
        }
      }
    } catch (e) {}

    if (found.length > 0) {
      const remaining = communityProducts.filter((p) => !found.some((f) => String(f.id) === String(p.id)));
      setRecentlyViewed([...found, ...remaining]);
    } else {
      // Show dynamic catalog products if no specific browsing history yet
      setRecentlyViewed(communityProducts);
    }
  }, [communityProducts]);

  // Slider controls logic for Recently Viewed
  const recentlyViewedRef = useRef(null);

  // Auto-scroll loop helper for Best Sellers
  const scrollNextBestSellers = () => {
    const el = bestSellersRef.current;
    if (!el) return;
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 15;
    if (isAtEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const cards = el.querySelectorAll(".marquee-card-wrapper");
      const scrollDist = cards.length > 0 ? cards[0].offsetWidth + 10 : 290;
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
      const scrollDist = cards.length > 0 ? cards[0].offsetWidth + 10 : 290;
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
      <CommunityFavoritesSection
        products={communityProducts}
        bestSellersRef={bestSellersRef}
        handleBestSellersPrev={handleBestSellersPrev}
        handleBestSellersNext={handleBestSellersNext}
        isWishlisted={isWishlisted}
        isCompared={isCompared}
        handleCardClick={handleCardClick}
        handleWishlist={handleWishlist}
        handleCompare={handleCompare}
        handleAddToCart={handleAddToCart}
      />

      <RecentlyViewedSection
        recentlyViewed={recentlyViewed}
        recentlyViewedRef={recentlyViewedRef}
        handleRecentlyViewedPrev={handleRecentlyViewedPrev}
        handleRecentlyViewedNext={handleRecentlyViewedNext}
        isWishlisted={isWishlisted}
        isCompared={isCompared}
        handleCardClick={handleCardClick}
        handleWishlist={handleWishlist}
        handleCompare={handleCompare}
        handleAddToCart={handleAddToCart}
      />
    </>
  );
};

export default TrendingPage;