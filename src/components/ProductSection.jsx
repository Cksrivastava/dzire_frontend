import React, { useEffect, useMemo, useState, useRef } from "react";
import "./ProductSection.css";
import { useAutoScroll } from "../hooks/useAutoScroll";
import BannerSection from "./BannerSection";
import WaysToSave from "./WaysToSave";
import PriceCardsSection from "./PriceCardsSection";
import TrendingPage from "./TrendingPage";
import ProductCard from "./ProductCard";
import InteractiveMarquee from "./InteractiveMarquee";
import OutdoorCollectionSection from "./product-section/OutdoorCollectionSection";
import TrendingGearSection from "./product-section/TrendingGearSection";
import NewArrivalsSection from "./product-section/NewArrivalsSection";
import { productSectionProducts } from "../data/productSectionData";
import { categoryAPI } from "../services/api";

// Re-export for backward compatibility
export { ProductCard, InteractiveMarquee };

// Helper to check if a product is visible on the website (website + in-store)
export const isVisibleOnWebsite = (item) => {
  if (!item) return false;
  const vis = (item.visibility || item.productChannel || item.channelVisibility || item.productChannelVisibility || "").toString().trim().toLowerCase();
  const webStatus = (item.webStatus || "").toString().trim().toLowerCase();

  // If set to in-store only, hide from website
  if (
    vis === "in-store" ||
    vis === "instore" ||
    vis === "in-store only" ||
    vis === "store" ||
    vis === "pos_only"
  ) {
    return false;
  }
  if (webStatus === "in-store" || webStatus === "add_to_web" || webStatus === "hidden") {
    return false;
  }

  return true;
};

// Helper to check if a product belongs to the outdoor category type
export const isOutdoorProduct = (item, catList = []) => {
  if (!item) return false;

  // 1. Direct categoryType or section on the item
  const itemCatType = (item.categoryType || item.category_type || "").toString().trim().toLowerCase();
  if (itemCatType.includes("outdoor")) return true;

  const itemSection = (item.section || "").toString().trim().toLowerCase();
  if (itemSection === "outdoor") return true;

  // 2. Look up the item's category in the categories list (check if ANY category of that name is outdoor)
  const itemCat = (item.category || "").toString().trim().toLowerCase();
  if (itemCat && Array.isArray(catList) && catList.length > 0) {
    const hasOutdoorCat = catList.some((c) => {
      const catName = (c.name || "").toString().trim().toLowerCase();
      const catSlug = (c.slug || c.id || "").toString().trim().toLowerCase();
      const isMatch = catName === itemCat || catSlug === itemCat || itemCat.includes(catName);
      if (!isMatch) return false;
      const catType = (c.type || "").toString().trim().toLowerCase();
      return catType.includes("outdoor");
    });

    if (hasOutdoorCat) return true;
  }

  // 3. Fallback: outdoor category keywords
  const outdoorKeywords = [
    "outdoor", "trek", "hike", "hiking", "camp", "camping", "climb", "climbing",
    "foot-wear", "footwear", "shoe", "shoes", "boot", "boots",
    "bag", "bags", "backpack", "backpacks", "rucksack",
    "cycle", "cycling", "run", "running", "adventure", "rainwear", "jacket", "outerwear"
  ];
  if (outdoorKeywords.some((kw) => itemCat.includes(kw))) {
    return true;
  }

  return false;
};

const EMPTY_LIST = [];

const ProductSection = ({
  products: productList = EMPTY_LIST,
  categories: propCategories = EMPTY_LIST,
  showExtraSections = true,
  isHomePage = false,
}) => {
  const [bottomStart, setBottomStart] = useState(0);
  const [topItemsPerView, setTopItemsPerView] = useState(4);
  const [bottomItemsPerView, setBottomItemsPerView] = useState(5);
  const [isMobile, setIsMobile] = useState(false);

  const [categories, setCategories] = useState(() => {
    if (Array.isArray(propCategories) && propCategories.length > 0) return propCategories;
    try {
      const stored = localStorage.getItem("dzire_all_categories_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    if (Array.isArray(propCategories) && propCategories.length > 0) {
      setCategories(propCategories);
      return;
    }
    let mounted = true;
    categoryAPI
      .getAll()
      .then((res) => {
        if (mounted && res && res.success && Array.isArray(res.categories)) {
          setCategories(res.categories);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [propCategories?.length]);

  const effectiveCategories = useMemo(() => {
    if (Array.isArray(propCategories) && propCategories.length > 0) {
      return propCategories;
    }
    return categories;
  }, [propCategories, categories]);

  const checklistRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // All products visible on website
  const webProducts = useMemo(() => {
    return (productList || []).filter(isVisibleOnWebsite);
  }, [productList]);

  // In the home page, Shop your Outdoor Collection:
  // suggests products belonging to outdoor category types,
  // and reliably shows products from starting so the section is never blank!
  const topProducts = useMemo(() => {
    if (isHomePage) {
      const outdoorItems = webProducts.filter((p) => isOutdoorProduct(p, effectiveCategories));
      if (outdoorItems.length > 0) {
        return outdoorItems;
      }
    }
    return webProducts.slice(0, 10);
  }, [webProducts, effectiveCategories, isHomePage]);

  const checkScrollBounds = () => {
    const el = checklistRef.current;
    if (!el) return;
    const canLeft = el.scrollLeft > 2;
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 5;
    setCanScrollLeft((prev) => (prev !== canLeft ? canLeft : prev));
    setCanScrollRight((prev) => (prev !== !isAtEnd ? !isAtEnd : prev));
  };

  // Popular & New Arrivals Refs
  const popularRef = useRef(null);
  const newArrivalsRef = useRef(null);

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
      setBottomItemsPerView(mobile ? webProducts.length : width < 1200 ? 3 : 5);
      setTimeout(checkScrollBounds, 50);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [topProducts.length, webProducts.length]);

  useEffect(() => {
    setBottomStart(0);
  }, [topItemsPerView, bottomItemsPerView]);

  // In other areas show all products visible on website
  const bottomProducts = webProducts;

  const newArrivalsProducts = useMemo(() => {
    if (!webProducts || webProducts.length === 0) return [];
    const oddOnes = webProducts.filter((_, idx) => idx % 2 !== 0);
    return oddOnes.length > 0 ? oddOnes : webProducts;
  }, [webProducts]);

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
        <OutdoorCollectionSection
          topProducts={topProducts}
          topItemsPerView={topItemsPerView}
          checklistRef={checklistRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          handleTopPrev={handleTopPrev}
          handleTopNext={handleTopNext}
          checkScrollBounds={checkScrollBounds}
        />

        <div className="section-divider"></div>

        <TrendingGearSection
          bottomProducts={bottomProducts}
          popularRef={popularRef}
          handlePopularPrev={handlePopularPrev}
          handlePopularNext={handlePopularNext}
        />
      </div>

      <NewArrivalsSection
        newArrivalsProducts={newArrivalsProducts}
        newArrivalsRef={newArrivalsRef}
        handleNewArrivalsPrev={handleNewArrivalsPrev}
        handleNewArrivalsNext={handleNewArrivalsNext}
      />

      <div className="product-sections-wrapper">
        {showExtraSections ? (
          <>
            <BannerSection />
            <div style={{ backgroundColor: "#fff", width: "100%" }}>
              <div className="section-divider"></div>
              <PriceCardsSection />
              <div className="section-divider"></div>
            </div>
            <TrendingPage products={webProducts} />
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