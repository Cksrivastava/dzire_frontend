import React, { useContext, useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { featuredProducts } from "../data/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductBreadcrumbs from "../components/product-detail/ProductBreadcrumbs";
import ProductGallery from "../components/product-detail/ProductGallery";
import ProductFeatureBadges from "../components/product-detail/ProductFeatureBadges";
import ProductTabs from "../components/product-detail/ProductTabs";
import ProductReviewModal from "../components/product-detail/ProductReviewModal";
import ProductFBT from "../components/product-detail/ProductFBT";
import ProductRightPanel from "../components/product-detail/ProductRightPanel";
import ProductSimilarSlider from "../components/product-detail/ProductSimilarSlider";
import ProductStickyBar from "../components/product-detail/ProductStickyBar";
import ProductLightbox from "../components/product-detail/ProductLightbox";
import "./Product.css";
import { productAPI } from "../services/api";
import wsClient from "../services/websocket";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Refs
  const similarSliderRef = useRef(null);
  const actionsRef = useRef(null);
  const fbtSliderRef = useRef(null);
  const mobileSliderRef = useRef(null);

  // Layout & UI States
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(-1);
  const [similarCanScrollLeft, setSimilarCanScrollLeft] = useState(false);
  const [similarCanScrollRight, setSimilarCanScrollRight] = useState(true);

  // Shop Context
  const {
    addToCart,
    toggleWishlist,
    wishlistItems = [],
    toggleCompare,
    compareItems = [],
  } = useContext(ShopContext);

  const [remoteProduct, setRemoteProduct] = useState(null);
  const [remoteSimilarProducts, setRemoteSimilarProducts] = useState([]);

  const fetchProductData = useCallback((skipCache = false) => {
    productAPI.getById(id, { skipCache })
      .then((res) => {
        if (res.product) {
          setRemoteProduct(res.product);
        }
        if (Array.isArray(res.similarProducts)) {
          setRemoteSimilarProducts(res.similarProducts);
        }
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    setRemoteProduct(null);
    setRemoteSimilarProducts([]);
    fetchProductData(false);
  }, [id, fetchProductData]);

  // Catalog Products list for recommendations
  const [catalogProducts, setCatalogProducts] = useState([]);

  const fetchCatalog = useCallback((skipCache = false) => {
    productAPI.getAll({ limit: 100, skipCache })
      .then((res) => {
        if (Array.isArray(res.products)) {
          setCatalogProducts(res.products);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCatalog(false);
  }, [fetchCatalog]);

  // Real-time WebSocket listener: update product & catalog instantly without page refresh
  useEffect(() => {
    const unsubProduct = wsClient.on("PRODUCT_UPDATED", () => {
      fetchProductData(true);
      fetchCatalog(true);
    });

    return () => {
      unsubProduct();
    };
  }, [fetchProductData, fetchCatalog]);

  // Product Data
  const product = useMemo(() => {
    if (remoteProduct) return remoteProduct;
    return featuredProducts.find(
      (item) =>
        String(item.id) === String(id) ||
        (item.seoSlug && item.seoSlug === id) ||
        (item.slug && item.slug === id) ||
        (item.name && item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") === id)
    );
  }, [id, remoteProduct]);

  // Gallery Images List - dynamically aggregated from uploaded images and variations
  const allProductImages = useMemo(() => {
    if (!product) return [];
    const imagesList = [];
    const seen = new Set();

    const addImg = (src) => {
      if (src && typeof src === "string" && !seen.has(src.trim())) {
        seen.add(src.trim());
        imagesList.push(src.trim());
      }
    };

    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach(addImg);
    }
    if (product.image) addImg(product.image);
    if (product.thumb) addImg(product.thumb);

    if (Array.isArray(product.variations)) {
      product.variations.forEach((v) => {
        if (v && v.img) addImg(v.img);
      });
    }

    if (imagesList.length === 0) {
      imagesList.push("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80");
    }

    return imagesList;
  }, [product]);

  // Dynamic colors from product variations, attributes, or fallback
  const colors = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.variations) && product.variations.length > 0) {
      const activeVars = product.variations.filter((v) => v.status !== "Inactive");
      const list = activeVars.length > 0 ? activeVars : product.variations;
      const seenColors = new Set();
      const extracted = [];
      for (const v of list) {
        const cName = v.color || "Default";
        if (!seenColors.has(cName.toLowerCase())) {
          seenColors.add(cName.toLowerCase());
          extracted.push({
            name: cName,
            color: v.hex || "#111",
            image: v.img || allProductImages[0] || product.image,
          });
        }
      }
      if (extracted.length > 0) return extracted;
    }

    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors.map((c, i) =>
        typeof c === "string"
          ? { name: c, color: "#111", image: allProductImages[i] || allProductImages[0] }
          : { name: c.name || "Default", color: c.color || c.hex || "#111", image: c.image || c.img || allProductImages[0] }
      );
    }

    if (
      product.brand?.toLowerCase() === "wildcraft" ||
      product.name?.toLowerCase().includes("wildcraft")
    ) {
      return [
        { name: "Black", color: "#111", image: allProductImages[0] },
        { name: "Dark Blue", color: "#25406b", image: allProductImages[1] || allProductImages[0] },
        { name: "Olive Green", color: "#3a4632", image: allProductImages[2] || allProductImages[0] },
      ];
    }

    return [
      { name: "Default", color: "#111", image: allProductImages[0] || product.image }
    ];
  }, [product, allProductImages]);

  // Dynamic sizes from product variations or product sizes array
  const sizes = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.variations) && product.variations.length > 0) {
      const activeVars = product.variations.filter((v) => v.status !== "Inactive");
      const list = activeVars.length > 0 ? activeVars : product.variations;
      const seenSizes = new Set();
      const extracted = [];
      for (const v of list) {
        if (Array.isArray(v.sizes)) {
          v.sizes.forEach((s) => {
            const trimmed = String(s).trim();
            if (trimmed && !seenSizes.has(trimmed)) {
              seenSizes.add(trimmed);
              extracted.push(trimmed);
            }
          });
        } else if (v.size) {
          const trimmed = String(v.size).trim();
          if (trimmed && !seenSizes.has(trimmed)) {
            seenSizes.add(trimmed);
            extracted.push(trimmed);
          }
        }
      }
      if (extracted.length > 0) return extracted;
    }

    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      return product.sizes.map(String);
    }

    const cat = product.category?.toLowerCase() || "";
    if (cat.includes("bag") || cat.includes("backpack") || cat.includes("rucksack")) {
      return ["35L", "45L", "60L"];
    }
    if (
      cat.includes("tops") ||
      cat.includes("t-shirt") ||
      cat.includes("clothing") ||
      cat.includes("apparel")
    ) {
      return ["S", "M", "L", "XL", "XXL"];
    }
    return ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  }, [product]);

  // Product Selection States
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name);
  const [selectedSize, setSelectedSize] = useState(sizes[1] || sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");

  // Keep selectedColor and selectedSize in sync when product changes
  useEffect(() => {
    if (colors && colors.length > 0) setSelectedColor(colors[0]?.name);
    if (sizes && sizes.length > 0) setSelectedSize(sizes[1] || sizes[0]);
    setActiveThumb(0);
  }, [product?.id]);

  // Recently viewed & scroll bounds check
  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem("recentlyViewed");
      let list = stored ? JSON.parse(stored) : [];
      list = list.filter((pId) => String(pId) !== String(product.id));
      list.unshift(product.id);
      list = list.slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(list));
    }
    setTimeout(checkSimilarScrollBounds, 150);
  }, [product]);

  const checkSimilarScrollBounds = () => {
    const el = similarSliderRef.current;
    if (!el) return;
    setSimilarCanScrollLeft(el.scrollLeft > 2);
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 5;
    setSimilarCanScrollRight(!isAtEnd);
  };

  const handleSimilarPrev = () => {
    const el = similarSliderRef.current;
    if (!el) return;
    el.scrollBy({ left: -320, behavior: "smooth" });
  };

  const handleSimilarNext = () => {
    const el = similarSliderRef.current;
    if (!el) return;
    el.scrollBy({ left: 320, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("resize", checkSimilarScrollBounds);
    return () => window.removeEventListener("resize", checkSimilarScrollBounds);
  }, []);

  // Update nav height CSS variable
  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.querySelector(".header-wrapper") || document.querySelector(".navbar");
      if (nav) {
        document.documentElement.style.setProperty("--header-nav-height", `${nav.offsetHeight}px`);
      }
    };
    updateNavHeight();
    const navEl = document.querySelector(".header-wrapper") || document.querySelector(".navbar");
    let ro = null;
    if (navEl && window.ResizeObserver) {
      ro = new ResizeObserver(updateNavHeight);
      ro.observe(navEl);
    }
    window.addEventListener("resize", updateNavHeight);
    window.addEventListener("scroll", updateNavHeight);
    return () => {
      if (ro && navEl) ro.unobserve(navEl);
      window.removeEventListener("resize", updateNavHeight);
      window.removeEventListener("scroll", updateNavHeight);
    };
  }, []);

  // Sticky bottom bar and tabs bar stuck detection
  useEffect(() => {
    const handleScroll = () => {
      if (actionsRef.current) {
        const rect = actionsRef.current.getBoundingClientRect();
        if (rect.bottom < 0) {
          setShowStickyBar(true);
        } else {
          setShowStickyBar(false);
        }
      }
      const tabsBar = document.querySelector(".product-section-tabs-bar");
      const nav = document.querySelector(".header-wrapper") || document.querySelector(".navbar");
      if (tabsBar && nav) {
        const navHeight = nav.offsetHeight;
        const rect = tabsBar.getBoundingClientRect();
        if (rect.top <= navHeight + 4) {
          tabsBar.classList.add("is-stuck");
        } else {
          tabsBar.classList.remove("is-stuck");
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // URL scroll param handling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollVal = params.get("scroll");
    if (scrollVal) {
      setTimeout(() => {
        if (scrollVal === "bottom") {
          window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight);
        } else {
          window.scrollTo(0, parseInt(scrollVal, 10));
        }
      }, 800);
    }
  }, []);

  // Mobile Gallery Slider Handlers
  const handleMobileSliderScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const clientWidth = e.target.clientWidth;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== activeThumb && index >= 0 && index < allProductImages.length) {
        setActiveThumb(index);
      }
    }
  };

  const handleMobileThumbClick = (index) => {
    setActiveThumb(index);
    if (mobileSliderRef.current) {
      mobileSliderRef.current.scrollTo({
        left: index * mobileSliderRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  // Add to Cart & Buy Now Handlers
  const handleAddToCartClick = () => {
    if (!product) return;
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    });
  };

  const handleBuyNowClick = () => {
    if (!product) return;
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    });
    navigate("/cart");
  };

  // Full product pool combining live catalog from API and fallback
  const catalogPool = useMemo(() => {
    if (catalogProducts && catalogProducts.length > 0) {
      return catalogProducts;
    }
    return featuredProducts;
  }, [catalogProducts]);

  // Frequently Bought Together data
  const { fbtItem1, fbtItem2 } = useMemo(() => {
    if (!product) return { fbtItem1: null, fbtItem2: null };
    const others = catalogPool.filter(
      (item) => String(item.id) !== String(product.id) && item.name !== product.name
    );
    return {
      fbtItem1: others[0] || product,
      fbtItem2: others[1] || product,
    };
  }, [product, catalogPool]);

  const fbtTotalPrice = product
    ? product.price + (fbtItem1?.price || 0) + (fbtItem2?.price || 0)
    : 0;
  const fbtTotalMRP = product
    ? (product.oldPrice || product.price) +
      (fbtItem1?.oldPrice || fbtItem1?.price || 0) +
      (fbtItem2?.oldPrice || fbtItem2?.price || 0)
    : 0;
  const fbtSavings = fbtTotalMRP - fbtTotalPrice;
  const fbtDiscountPercent =
    fbtTotalMRP > 0 ? Math.round((fbtSavings / fbtTotalMRP) * 100) : 0;

  const handleFbtAddBundleToCart = () => {
    if (!product) return;

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity: 1,
    });

    if (fbtItem1) {
      addToCart({
        ...fbtItem1,
        selectedSize:
          fbtItem1.category?.toLowerCase().includes("bag") ||
          fbtItem1.category?.toLowerCase().includes("backpack")
            ? "35L"
            : "M",
        selectedColor: "Default",
        quantity: 1,
      });
    }

    if (fbtItem2) {
      addToCart({
        ...fbtItem2,
        selectedSize:
          fbtItem2.category?.toLowerCase().includes("bag") ||
          fbtItem2.category?.toLowerCase().includes("backpack")
            ? "35L"
            : "M",
        selectedColor: "Default",
        quantity: 1,
      });
    }

    navigate("/cart");
  };

  // Helper to check if a product is visible on the website (exclude in-store only)
  const isWebVisible = (p) => {
    if (!p) return false;
    const vis = (p.visibility || p.productChannel || "").toString().trim().toLowerCase();
    const webStatus = (p.webStatus || "").toString().trim().toLowerCase();
    if (vis === "in-store" || vis === "instore" || vis === "in-store only" || vis === "store") return false;
    if (webStatus === "in-store" || webStatus === "add_to_web" || webStatus === "hidden") return false;
    return true;
  };

  // Helper to test if categories are similar
  const isSimilarCategory = (cat1, cat2) => {
    if (!cat1 || !cat2) return false;
    const norm1 = String(cat1).trim().toLowerCase().replace(/[-\s_]/g, "");
    const norm2 = String(cat2).trim().toLowerCase().replace(/[-\s_]/g, "");
    if (!norm1 || !norm2) return false;
    if (norm1 === norm2) return true;
    if (norm1.length >= 4 && norm2.length >= 4) {
      if (norm1.startsWith(norm2) || norm2.startsWith(norm1)) return true;
    }
    return false;
  };

  // Similar Products list dynamically matched to category (no dummy data)
  const similarProducts = useMemo(() => {
    if (!product) return [];

    const currentCat = product.category || "";
    const currentCatType = product.categoryType || "";
    const currentId = String(product.id || product._id || "");
    const currentName = (product.name || "").trim().toLowerCase();

    const pool = [];
    const seenIds = new Set();
    const seenNames = new Set();

    const addProduct = (item) => {
      if (!item) return;
      const itemId = String(item.id || item._id || "");
      const itemName = (item.name || "").trim().toLowerCase();

      // Exclude current product
      if (itemId && itemId === currentId) return;
      if (itemName && itemName === currentName) return;
      if (item.seoSlug && product.seoSlug && item.seoSlug === product.seoSlug) return;
      if (item.slug && product.slug && item.slug === product.slug) return;

      // Exclude in-store only items
      if (!isWebVisible(item)) return;

      // Deduplicate
      if (seenIds.has(itemId) || seenNames.has(itemName)) return;

      seenIds.add(itemId);
      seenNames.add(itemName);
      pool.push(item);
    };

    // 1. Add products returned directly from backend similarProducts endpoint
    if (Array.isArray(remoteSimilarProducts)) {
      remoteSimilarProducts.forEach(addProduct);
    }

    // 2. Add products from live catalogProducts that match category or categoryType
    if (Array.isArray(catalogProducts)) {
      catalogProducts.forEach((item) => {
        const itemCat = item.category || "";
        const itemCatType = item.categoryType || "";

        const matchesCategory = isSimilarCategory(itemCat, currentCat);
        const matchesCatType =
          Boolean(currentCatType) &&
          Boolean(itemCatType) &&
          currentCatType.toLowerCase() === itemCatType.toLowerCase();

        if (matchesCategory || matchesCatType) {
          addProduct(item);
        }
      });
    }

    // 3. Fallback only if live catalog is completely empty (e.g. offline dev with dummy products), match category strictly
    if (pool.length === 0 && (!catalogProducts || catalogProducts.length === 0)) {
      featuredProducts.forEach((item) => {
        if (isSimilarCategory(item.category, currentCat)) {
          addProduct(item);
        }
      });
    }

    // Return only products strictly matching the similar category - zero dummy padding!
    return pool.slice(0, 10);
  }, [product, remoteSimilarProducts, catalogProducts]);

  // Reviews Data & State - dynamic product-specific customer reviews
  const generateProductReviews = useCallback((prod) => {
    if (!prod) return [];
    const cat = (prod.category || "").toLowerCase();
    const isShoes =
      cat.includes("foot-wear") ||
      cat.includes("shoes") ||
      cat.includes("shoe") ||
      cat.includes("boot");
    const isBag =
      cat.includes("bag") ||
      cat.includes("backpack") ||
      cat.includes("rucksack");
    const isApparel =
      cat.includes("top") ||
      cat.includes("shirt") ||
      cat.includes("jacket") ||
      cat.includes("pant") ||
      cat.includes("apparel") ||
      cat.includes("clothing");

    return [
      {
        id: "rev-1",
        name: "Amit Sharma",
        initials: "AS",
        rating: 5,
        title: "Outstanding comfort & durability",
        tags: ["Comfort", "Durability"],
        date: "Reviewed 3 days ago",
        helpful: 18,
        verified: true,
        comment: isShoes
          ? "Extremely comfortable for long walks and hiking trails. The traction on wet and uneven surfaces is phenomenal, and the cushioning keeps feet fatigue-free all day."
          : isBag
          ? "Spacious compartments with ergonomic shoulder padding. The material feels heavy-duty and keeps all gear protected in tough weather."
          : isApparel
          ? "Fabric feels super breathable and soft against the skin. Fits true to size and the stitching quality is top tier."
          : `Exceptional build quality and finish. The ${prod.name} exceeds expectations in durability and performance.`,
      },
      {
        id: "rev-2",
        name: "Priya Nair",
        initials: "PN",
        rating: 5,
        title: "Worth every rupee - 100% Genuine",
        tags: ["Quality", "Sizing"],
        date: "Reviewed 1 week ago",
        helpful: 12,
        verified: true,
        comment: `Bought this ${prod.name} after comparing multiple options. The quality from ${prod.brand || "DZIRE"} is unmatched. Perfectly packaged and fast dispatch.`,
      },
      {
        id: "rev-3",
        name: "Rahul Verma",
        initials: "RV",
        rating: 4,
        title: "Rugged and well engineered",
        tags: ["Durability", "Performance"],
        date: "Reviewed 2 weeks ago",
        helpful: 9,
        verified: true,
        comment: "Very sturdy and dependable under rough use. Tested it extensively on outdoor trails. Excellent value for money.",
      },
      {
        id: "rev-4",
        name: "Sneha Patel",
        initials: "SP",
        rating: 5,
        title: "Highly recommended for outdoor enthusiasts",
        tags: ["Comfort", "Quality"],
        date: "Reviewed 3 weeks ago",
        helpful: 15,
        verified: true,
        comment: `The finish on this ${prod.name} is top class. Lightweight, functional, and very stylish. Extremely happy with this purchase!`,
      },
    ];
  }, []);

  const [reviewsList, setReviewsList] = useState([]);
  const [reviewFilter, setReviewFilter] = useState("All");

  useEffect(() => {
    if (!product) {
      setReviewsList([]);
      return;
    }

    // 1. Check if product.reviewsList came directly from backend API
    if (Array.isArray(product.reviewsList) && product.reviewsList.length > 0) {
      const active = product.reviewsList.filter((r) => !r.hidden);
      setReviewsList(active.length > 0 ? active : product.reviewsList);
      return;
    }

    // 2. Check localStorage for reviews added in /admin/inventory
    const targetId = product.id || product._id;
    const prodSlug = product.seoSlug || product.slug;
    const prodNameSlug = product.name
      ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      : "";
    const lookupKeys = [
      targetId ? `dzire_product_reviews_${targetId}` : null,
      prodSlug ? `dzire_product_reviews_${prodSlug}` : null,
      prodNameSlug ? `dzire_product_reviews_${prodNameSlug}` : null,
      id ? `dzire_product_reviews_${id}` : null,
    ].filter(Boolean);

    let foundSavedReviews = null;
    for (const key of lookupKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            foundSavedReviews = parsed;
            break;
          }
        } catch (e) {}
      }
    }

    if (foundSavedReviews && foundSavedReviews.length > 0) {
      const active = foundSavedReviews.filter((r) => !r.hidden);
      setReviewsList(active.length > 0 ? active : foundSavedReviews);
      return;
    }

    // 3. Fallback to product-aware dynamic reviews
    setReviewsList(generateProductReviews(product));
  }, [product, id, generateProductReviews]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === "All") return reviewsList;
    const matched = reviewsList.filter((r) => Array.isArray(r.tags) && r.tags.includes(reviewFilter));
    return matched.length > 0 ? matched : reviewsList;
  }, [reviewFilter, reviewsList]);

  // Review Modal State & Handlers
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewTags, setNewReviewTags] = useState([]);

  const handleTagToggle = (tag) => {
    if (newReviewTags.includes(tag)) {
      setNewReviewTags(newReviewTags.filter((t) => t !== tag));
    } else {
      setNewReviewTags([...newReviewTags, tag]);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      alert("Please fill out both your name and review comment!");
      return;
    }
    const initials =
      newReviewName
        .trim()
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    const addedReview = {
      id: Date.now(),
      name: newReviewName.trim(),
      initials,
      rating: newReviewRating,
      tags: newReviewTags.length > 0 ? newReviewTags : ["Comfort", "Quality"],
      date: "Reviewed just now",
      helpful: 0,
      verified: true,
      comment: newReviewComment.trim(),
    };

    const updated = [addedReview, ...reviewsList];
    setReviewsList(updated);

    if (product) {
      const targetId = product.id || product._id;
      const prodSlug = product.seoSlug || product.slug;
      if (targetId) {
        try {
          localStorage.setItem(`dzire_product_reviews_${targetId}`, JSON.stringify(updated));
        } catch (e) {}
      }
      if (prodSlug) {
        try {
          localStorage.setItem(`dzire_product_reviews_${prodSlug}`, JSON.stringify(updated));
        } catch (e) {}
      }
      productAPI.addReview(targetId || id, {
        name: newReviewName.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        tags: newReviewTags,
      }).catch(() => {});
    }
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewTags([]);
    setNewReviewRating(5);
    setShowReviewModal(false);
  };

  // Overview copy helpers - purely dynamic from product details
  const overviewTitle = product ? product.shortDesc || product.name || "" : "";
  const overviewDesc = product ? product.longDesc || product.description || "" : "";

  const isWishlisted = product
    ? wishlistItems.some((item) => String(item.id) === String(product.id))
    : false;
  const isCompared = product
    ? compareItems.some((item) => String(item.id) === String(product.id))
    : false;

  // Not Found view
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist.</p>
          <button onClick={() => navigate("/shop")} className="back-shop-btn">
            Back to Shop
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="product-page-layout-wrapper">
      <Navbar />

      <div className="product-page wildcraft-page">
        {/* Mobile Header Breadcrumb (<=992px) */}
        <ProductBreadcrumbs product={product} isMobile={true} />

        {/* Desktop Breadcrumb (>992px) */}
        <ProductBreadcrumbs product={product} isMobile={false} />

        {/* Main Sticky Layout */}
        <div className="product-sticky-layout wildcraft-grid">
          {/* Left Column */}
          <div className="product-left-column">
            {/* Gallery Section */}
            <ProductGallery
              product={product}
              allProductImages={allProductImages}
              activeThumb={activeThumb}
              setActiveThumb={setActiveThumb}
              mobileSliderRef={mobileSliderRef}
              handleMobileSliderScroll={handleMobileSliderScroll}
              handleMobileThumbClick={handleMobileThumbClick}
              setZoomImageIndex={setZoomImageIndex}
            />

            {/* Feature Badges Strip */}
            <ProductFeatureBadges category={product.category} />

            {/* Lower content: Tabs & Accordion */}
            <ProductTabs
              product={product}
              allProductImages={allProductImages}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              overviewTitle={overviewTitle}
              overviewDesc={overviewDesc}
              reviewsList={reviewsList}
              filteredReviews={filteredReviews}
              reviewFilter={reviewFilter}
              setReviewFilter={setReviewFilter}
              setShowReviewModal={setShowReviewModal}
            />

            {/* Frequently Bought Together */}
            <ProductFBT
              product={product}
              allProductImages={allProductImages}
              fbtItem1={fbtItem1}
              fbtItem2={fbtItem2}
              fbtSliderRef={fbtSliderRef}
              fbtTotalPrice={fbtTotalPrice}
              fbtTotalMRP={fbtTotalMRP}
              fbtSavings={fbtSavings}
              fbtDiscountPercent={fbtDiscountPercent}
              handleFbtAddBundleToCart={handleFbtAddBundleToCart}
            />
          </div>

          {/* Right Sticky Column */}
          <ProductRightPanel
            product={product}
            reviewsList={reviewsList}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            colors={colors}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            sizes={sizes}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
            actionsRef={actionsRef}
            handleAddToCartClick={handleAddToCartClick}
            handleBuyNowClick={handleBuyNowClick}
            toggleWishlist={toggleWishlist}
            isWishlisted={isWishlisted}
            toggleCompare={toggleCompare}
            isCompared={isCompared}
            setActiveThumb={setActiveThumb}
            allProductImages={allProductImages}
          />
        </div>

        {/* Similar Products (Full Width) */}
        <ProductSimilarSlider
          similarProducts={similarProducts}
          similarSliderRef={similarSliderRef}
          similarCanScrollLeft={similarCanScrollLeft}
          similarCanScrollRight={similarCanScrollRight}
          handleSimilarPrev={handleSimilarPrev}
          handleSimilarNext={handleSimilarNext}
          checkSimilarScrollBounds={checkSimilarScrollBounds}
        />
      </div>

      {/* Review Modal Form */}
      <ProductReviewModal
        showReviewModal={showReviewModal}
        setShowReviewModal={setShowReviewModal}
        handleReviewSubmit={handleReviewSubmit}
        newReviewRating={newReviewRating}
        setNewReviewRating={setNewReviewRating}
        newReviewName={newReviewName}
        setNewReviewName={setNewReviewName}
        newReviewTags={newReviewTags}
        handleTagToggle={handleTagToggle}
        newReviewComment={newReviewComment}
        setNewReviewComment={setNewReviewComment}
      />

      <Footer showPopularSearches={false} showReviews={false} />

      {/* Sticky Bottom Buy/Action Bar */}
      <ProductStickyBar
        showStickyBar={showStickyBar}
        product={product}
        allProductImages={allProductImages}
        colors={colors}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        setActiveThumb={setActiveThumb}
        handleAddToCartClick={handleAddToCartClick}
        handleBuyNowClick={handleBuyNowClick}
        toggleWishlist={toggleWishlist}
        wishlistItems={wishlistItems}
        toggleCompare={toggleCompare}
        compareItems={compareItems}
      />

      {/* Lightbox / Image Zoom Popup */}
      <ProductLightbox
        zoomImageIndex={zoomImageIndex}
        setZoomImageIndex={setZoomImageIndex}
        allProductImages={allProductImages}
      />
    </div>
  );
};

export default Product;
