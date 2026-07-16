import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, RefreshCw, Zap, Check, Shield, Truck, Sparkles, Star, MessageSquare, Award, Activity, Wrench, Info, X, LayoutDashboard, FileText, ClipboardList, Plus, Tag, ShoppingCart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import { featuredProducts } from "../data/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import visaImg from "../assets/visa.png";
import masterImg from "../assets/master.png";
import upiImg from "../assets/upi.png";
import appleImg from "../assets/apple.png";
import "./Product.css";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const similarSliderRef = useRef(null);
  const similarRow2SliderRef = useRef(null);
  const actionsRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const [similarCanScrollLeft, setSimilarCanScrollLeft] = useState(false);
  const [similarCanScrollRight, setSimilarCanScrollRight] = useState(true);

  const [similarRow2CanScrollLeft, setSimilarRow2CanScrollLeft] = useState(false);
  const [similarRow2CanScrollRight, setSimilarRow2CanScrollRight] = useState(true);

  const checkSimilarScrollBounds = () => {
    const el = similarSliderRef.current;
    if (!el) return;
    setSimilarCanScrollLeft(el.scrollLeft > 2);
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 5;
    setSimilarCanScrollRight(!isAtEnd);
  };

  const checkSimilarRow2ScrollBounds = () => {
    const el = similarRow2SliderRef.current;
    if (!el) return;
    setSimilarRow2CanScrollLeft(el.scrollLeft > 2);
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 5;
    setSimilarRow2CanScrollRight(!isAtEnd);
  };

  const handleSimilarPrev = () => {
    const el = similarSliderRef.current;
    if (!el) return;
    el.scrollBy({ left: -248, behavior: "smooth" });
  };

  const handleSimilarNext = () => {
    const el = similarSliderRef.current;
    if (!el) return;
    el.scrollBy({ left: 248, behavior: "smooth" });
  };

  const handleSimilarRow2Prev = () => {
    const el = similarRow2SliderRef.current;
    if (!el) return;
    el.scrollBy({ left: -248, behavior: "smooth" });
  };

  const handleSimilarRow2Next = () => {
    const el = similarRow2SliderRef.current;
    if (!el) return;
    el.scrollBy({ left: 248, behavior: "smooth" });
  };

  const fbtSliderRef = useRef(null);

  const handleFbtScrollLeft = () => {
    if (fbtSliderRef.current) {
      fbtSliderRef.current.scrollBy({ left: -220, behavior: "smooth" });
    }
  };

  const handleFbtScrollRight = () => {
    if (fbtSliderRef.current) {
      fbtSliderRef.current.scrollBy({ left: 220, behavior: "smooth" });
    }
  };

  const { addToCart, toggleWishlist, wishlistItems = [], toggleCompare, compareItems = [] } =
    useContext(ShopContext);

  const product = useMemo(() => {
    return featuredProducts.find((item) => String(item.id) === String(id));
  }, [id]);

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

  useEffect(() => {
    window.addEventListener("resize", checkSimilarScrollBounds);
    return () => window.removeEventListener("resize", checkSimilarScrollBounds);
  }, []);

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
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // States
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Overview");

  const [activeThumb, setActiveThumb] = useState(0);
  const mobileSliderRef = useRef(null);

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
        behavior: "smooth"
      });
    }
  };

  // Dynamic gallery images list
  const allProductImages = useMemo(() => {
    if (!product) return [];
    const baseImages = (product.images && product.images.length > 0)
      ? [...product.images]
      : [product.image];

    const placeholders = [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    ];

    let i = 0;
    while (baseImages.length < 6 && i < placeholders.length) {
      const ph = placeholders[i++];
      if (!baseImages.includes(ph)) {
        baseImages.push(ph);
      }
    }
    return baseImages;
  }, [product]);

  // Dynamic colors based on brand/category
  const colors = useMemo(() => {
    if (!product) return [];
    if (product.brand?.toLowerCase() === "wildcraft" || product.name?.toLowerCase().includes("wildcraft")) {
      return [
        { name: "Black", color: "#111", image: allProductImages[0] },
        { name: "Dark Blue", color: "#25406b", image: allProductImages[1] || allProductImages[0] },
        { name: "Olive Green", color: "#3a4632", image: allProductImages[2] || allProductImages[0] }
      ];
    }
    return [
      { name: "Red / White", color: "#d32f2f", image: allProductImages[0] },
      { name: "Black / White", color: "#111", image: allProductImages[1] || allProductImages[0] },
      { name: "Grey / White", color: "#757575", image: allProductImages[2] || allProductImages[0] },
      { name: "Green / White", color: "#2e7d32", image: allProductImages[3] || allProductImages[0] }
    ];
  }, [product, allProductImages]);

  const [selectedColor, setSelectedColor] = useState(colors[0]?.name);

  // Dynamic sizes based on category
  const sizes = useMemo(() => {
    if (!product) return [];
    const cat = product.category?.toLowerCase() || "";
    if (cat.includes("bag") || cat.includes("backpack") || cat.includes("rucksack")) {
      return ["35L", "45L", "60L"];
    }
    if (cat.includes("tops") || cat.includes("t-shirt") || cat.includes("clothing") || cat.includes("apparel")) {
      return ["S", "M", "L", "XL", "XXL"];
    }
    return ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState(sizes[1] || sizes[0]);

  // Context flags
  const isWishlisted = product ? wishlistItems.some((item) => String(item.id) === String(product.id)) : false;
  const isCompared = product ? compareItems.some((item) => String(item.id) === String(product.id)) : false;

  // Handlers
  const handleAddToCartClick = () => {
    if (!product) return;
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
    });
  };

  const handleBuyNowClick = () => {
    if (!product) return;
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
    });
    navigate("/cart");
  };

  // Frequently Bought Together data
  const { fbtItem1, fbtItem2 } = useMemo(() => {
    if (!product) return { fbtItem1: null, fbtItem2: null };
    const others = featuredProducts.filter((item) => String(item.id) !== String(product.id));
    return {
      fbtItem1: others[0] || product,
      fbtItem2: others[1] || product
    };
  }, [product]);

  const fbtTotalPrice = product ? (product.price + (fbtItem1?.price || 0) + (fbtItem2?.price || 0)) : 0;
  const fbtTotalMRP = product ? ((product.oldPrice || product.price) + (fbtItem1?.oldPrice || fbtItem1?.price || 0) + (fbtItem2?.oldPrice || fbtItem2?.price || 0)) : 0;
  const fbtSavings = fbtTotalMRP - fbtTotalPrice;
  const fbtDiscountPercent = fbtTotalMRP > 0 ? Math.round((fbtSavings / fbtTotalMRP) * 100) : 0;

  const handleFbtAddBundleToCart = () => {
    if (!product) return;

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
    });

    if (fbtItem1) {
      addToCart({
        ...fbtItem1,
        selectedSize: (fbtItem1.category?.toLowerCase().includes("bag") || fbtItem1.category?.toLowerCase().includes("backpack")) ? "35L" : "M",
        selectedColor: "Default",
      });
    }

    if (fbtItem2) {
      addToCart({
        ...fbtItem2,
        selectedSize: (fbtItem2.category?.toLowerCase().includes("bag") || fbtItem2.category?.toLowerCase().includes("backpack")) ? "35L" : "M",
        selectedColor: "Default",
      });
    }

    navigate("/cart");
  };

  // Similar Products list
  const similarProducts = useMemo(() => {
    if (!product) return [];
    const cat = product.category || "";

    // Filter matching category, excluding items with the same name as the current product
    let list = featuredProducts.filter(
      (item) => String(item.id) !== String(product.id) && item.category === cat && item.name !== product.name
    );

    // De-duplicate items by name
    const uniqueList = [];
    const seenNames = new Set();
    for (const item of list) {
      if (!seenNames.has(item.name)) {
        seenNames.add(item.name);
        uniqueList.push(item);
      }
    }
    list = uniqueList;

    // Fill with remaining products from other categories if less than 5 unique matches
    if (list.length < 5) {
      const remaining = featuredProducts.filter(
        (item) =>
          String(item.id) !== String(product.id) &&
          item.name !== product.name &&
          !seenNames.has(item.name)
      );

      const uniqueRemaining = [];
      for (const item of remaining) {
        if (!seenNames.has(item.name)) {
          seenNames.add(item.name);
          uniqueRemaining.push(item);
        }
      }
      list = [...list, ...uniqueRemaining];
    }
    return list.slice(0, 10);
  }, [product]);

  const [reviewFilter, setReviewFilter] = useState("All");

  const defaultReviewsData = useMemo(() => {
    if (!product) return [];
    const isShoes = product.category?.toLowerCase().includes("foot-wear") || product.category?.toLowerCase().includes("shoes");
    if (isShoes) {
      return [
        { id: 1, name: "Amit K.", initials: "AK", rating: 5, tags: ["Comfort", "Durability"], date: "Reviewed 4 days ago", helpful: 14, comment: "Extremely comfortable for long trekking sessions. High-ankle support is superb on rocky patches, and the grip on wet soil is top-notch." },
        { id: 2, name: "Rahul S.", initials: "RS", rating: 4, tags: ["Durability", "Sizing"], date: "Reviewed 1 week ago", helpful: 8, comment: "Sturdy build quality and water-resistance works great. Fits perfectly. A bit heavy, but it feels like it can survive any terrain." },
        { id: 3, name: "Priya N.", initials: "PN", rating: 5, tags: ["Comfort", "Sizing"], date: "Reviewed 2 weeks ago", helpful: 19, comment: "The cushion inside is so soft. Sizing is absolutely accurate, I bought my regular size 7 and it fits perfectly with thick socks." },
        { id: 4, name: "Karan J.", initials: "KJ", rating: 5, tags: ["Comfort", "Durability"], date: "Reviewed 3 weeks ago", helpful: 24, comment: "Wore these for a week-long Himalayan trek. Unbelievable durability and comfort. No blisters at all!" }
      ];
    } else {
      return [
        { id: 1, name: "Vikram M.", initials: "VM", rating: 5, tags: ["Comfort", "Durability"], date: "Reviewed 3 days ago", helpful: 22, comment: "Very spacious and ergonomic. Used it for a 4-day mountain trek, and the shoulder paddings distributed the weight perfectly. Rain cover is of good quality." },
        { id: 2, name: "Sunita P.", initials: "SP", rating: 5, tags: ["Durability", "Sizing"], date: "Reviewed 5 days ago", helpful: 11, comment: "Loads of loops and pocket compartments. Zips are high quality. Totally value for money for any backpacker." },
        { id: 3, name: "Ananya R.", initials: "AR", rating: 4, tags: ["Comfort", "Sizing"], date: "Reviewed 10 days ago", helpful: 16, comment: "The adjustable straps make it super comfortable. It fits very snug on my shoulders. I got the 45L sizing and it's perfect for weekend trips." },
        { id: 4, name: "Rohit T.", initials: "RT", rating: 5, tags: ["Durability", "Comfort"], date: "Reviewed 2 weeks ago", helpful: 31, comment: "Super rugged bag. Survived heavy rains and rough handling at airports. Back ventilation is highly comfortable." }
      ];
    }
  }, [product]);

  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    setReviewsList(defaultReviewsData);
  }, [defaultReviewsData]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === "All") return reviewsList;
    return reviewsList.filter(r => r.tags.includes(reviewFilter));
  }, [reviewFilter, reviewsList]);

  // Review Modal Form state & handlers
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewTags, setNewReviewTags] = useState([]);

  const handleTagToggle = (tag) => {
    if (newReviewTags.includes(tag)) {
      setNewReviewTags(newReviewTags.filter(t => t !== tag));
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
    const initials = newReviewName
      .trim()
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

    const addedReview = {
      id: Date.now(),
      name: newReviewName.trim(),
      initials,
      rating: newReviewRating,
      tags: newReviewTags,
      date: "Reviewed just now",
      helpful: 0,
      comment: newReviewComment.trim(),
    };

    setReviewsList([addedReview, ...reviewsList]);

    // Reset Form
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewTags([]);
    setNewReviewRating(5);
    setShowReviewModal(false);
  };

  const renderBreadcrumbs = (showProductName = true) => {
    if (!product) return null;
    const cat = product.category || "Shop";
    let subcat = "Product";
    const catLower = cat.toLowerCase();
    if (catLower.includes("bag") || catLower.includes("backpack")) {
      subcat = "Rucksack";
    } else if (catLower.includes("foot-wear") || catLower.includes("shoes")) {
      subcat = "Trekking Shoes";
    } else if (catLower.includes("tops") || catLower.includes("apparel") || catLower.includes("clothing")) {
      subcat = "Tops";
    } else if (catLower.includes("camping") || catLower.includes("tent")) {
      subcat = "Camping Gear";
    } else if (catLower.includes("fitness") || catLower.includes("gym")) {
      subcat = "Fitness Gear";
    } else if (catLower.includes("cycling") || catLower.includes("cycle")) {
      subcat = "Bicycles";
    }

    const showSubcat = subcat && subcat !== "Product" && subcat.toLowerCase() !== cat.toLowerCase();

    return (
      <>
        <span onClick={() => navigate("/")}>Home</span>
        <span className="separator">&gt;</span>
        <span onClick={() => navigate("/shop")}>{cat}</span>
        {showSubcat && (
          <>
            <span className="separator">&gt;</span>
            <span onClick={() => navigate(`/shop?category=${cat}`)}>{subcat}</span>
          </>
        )}
        {showProductName && (
          <>
            <span className="separator">&gt;</span>
            <span className="current-crumb" style={{ cursor: 'default' }}>{product.name}</span>
          </>
        )}
      </>
    );
  };

  // Overview features layout helper
  const overviewTitle = product ? (product.brand === "WILDCRAFT" ? "Built for serious treks. Ready for anything." : `Designed for performance. Made for you.`) : "";
  const overviewDesc = product
    ? (product.brand === "WILDCRAFT"
      ? "The Wildcraft Verge 45L is a durable and feature-packed backpack designed for multi-day treks and adventures. With an ergonomic fit, intelligent storage and all-weather protection, it's your ideal companion on every trail."
      : `The ${product.name} is built to deliver unmatched comfort, style, and long-lasting durability. Engineered with premium materials, it offers high-performance specs that keep you ready for any activity, whether outdoors or in the city.`)
    : "";


  // If product not found (placed safely after hooks)
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

        {/* Mobile Header - breadcrumbs only, shown on mobile/tablet (<=992px) */}
        <div className="product-mobile-header">
          <div className="product-mobile-breadcrumb">
            {renderBreadcrumbs(false)}
          </div>
        </div>

        {/* Breadcrumb (Desktop Only) */}
        <div className="product-breadcrumb wildcraft-breadcrumb product-desktop-only">
          {renderBreadcrumbs(true)}
        </div>

        {/* Main Sticky Layout */}
        <div className="product-sticky-layout wildcraft-grid">

          {/* Left Column */}
          <div className="product-left-column">

            {/* Gallery Section */}
            <section className="product-gallery-section wildcraft-gallery">

              {/* Desktop Gallery (Hidden on Mobile/Tablet) */}
              <div className="desktop-gallery-wrapper">
                <div className="wildcraft-main-images">
                  {/* Col 1: First image */}
                  <div className="gallery-img-col">
                    <div className="gallery-grid-card main-img-card">
                      <div className="gallery-image-wrap">
                        <img
                          src={allProductImages[activeThumb]}
                          alt={`${product.name} active`}
                          className="gallery-grid-image"
                        />
                      </div>
                      <button className="zoom-btn" title="Zoom In">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                      </button>
                    </div>
                  </div>
                  {/* Col 2: Second image */}
                  <div className="gallery-img-col">
                    <div className="gallery-grid-card main-img-card">
                      <div className="gallery-image-wrap">
                        <img
                          src={allProductImages[1] || allProductImages[0]}
                          alt={`${product.name} secondary`}
                          className="gallery-grid-image"
                        />
                      </div>
                      <button className="zoom-btn" title="Zoom In">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop thumbnails row */}
                <div className="wildcraft-thumbnails-row">
                  {allProductImages.slice(0, 5).map((img, index) => (
                    <button
                      key={index}
                      className={`thumb-card ${activeThumb === index ? 'active' : ''}`}
                      onClick={() => setActiveThumb(index)}
                    >
                      <img src={img} alt={`Thumb ${index + 1}`} />
                    </button>
                  ))}
                  <button
                    className={`thumb-card more-thumbs-card ${activeThumb === 5 ? 'active' : ''}`}
                    onClick={() => setActiveThumb(5)}
                  >
                    <img src={allProductImages[5]} alt="Thumb 6" />
                    <div className="more-overlay">
                      <span className="plus-count">+{Math.max(1, allProductImages.length - 5)}</span>
                      <span className="more-lbl">More</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mobile/Tablet Gallery (Hidden on Desktop) */}
              <div className="mobile-gallery-wrapper">
                {/* Horizontal scrollable swipeable main images slider */}
                <div className="mobile-gallery-slider" ref={mobileSliderRef} onScroll={handleMobileSliderScroll}>
                  {allProductImages.map((img, index) => (
                    <div className="mobile-gallery-slide-card" key={index}>
                      <div className="gallery-image-wrap">
                        <img
                          src={img}
                          alt={`${product.name} slide ${index + 1}`}
                          className="gallery-grid-image"
                        />
                      </div>
                      <button className="zoom-btn" title="Zoom In">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Scrollable thumbnails row showing exactly 4 items at a time */}
                <div className="mobile-thumbnails-scroll-container">
                  <div className="mobile-thumbnails-scroll">
                    {allProductImages.map((img, index) => (
                      <button
                        key={index}
                        className={`thumb-card ${activeThumb === index ? 'active' : ''}`}
                        onClick={() => handleMobileThumbClick(index)}
                      >
                        <img src={img} alt={`Thumb ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile/Tablet only: Brand + Product Title below gallery */}
              <div className="mobile-brand-title-block">
                <p className="mobile-brand-label">{product.brand}</p>
                <h1 className="mobile-product-title">{product.name}</h1>
              </div>
            </section>

            {/* Feature Badges Strip — shown right after thumbnails */}
            <div className="feature-badges-strip">
              {product.category?.toLowerCase().includes("bag") ? (
                <>
                  <div className="feature-strip-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M8 22V12h8v10" /></svg>
                    <span>45L Capacity</span>
                  </div>
                  <div className="feature-strip-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" /></svg>
                    <span>Lightweight</span>
                  </div>
                  <div className="feature-strip-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M12 12a5 5 0 0 0-5-5H2v2c0 2.8 2.2 5 5 5h5z" /><path d="M12 12a5 5 0 0 1 5-5h5v2c0 2.8-2.2 5-5 5h-5z" /></svg>
                    <span>Rain Cover</span>
                  </div>
                  <div className="feature-strip-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /></svg>
                    <span>Air Flow Back</span>
                  </div>
                  <div className="feature-strip-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>
                    <span>Trek Ready</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="feature-strip-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                    <span>Premium Quality</span>
                  </div>
                  <div className="feature-strip-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" /></svg>
                    <span>Lightweight</span>
                  </div>
                  <div className="feature-strip-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /></svg>
                    <span>Breathable</span>
                  </div>
                  <div className="feature-strip-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 11 2 2 4-4" /></svg>
                    <span>Ergonomic Design</span>
                  </div>
                  <div className="feature-strip-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    <span>High Durability</span>
                  </div>
                </>
              )}
            </div>

            {/* Lower content: Tabs & Accordion */}
            <section className="product-lower-content wildcraft-lower">
              <div className="product-section-tabs-bar wildcraft-tabs">
                {[
                  { key: "Overview", icon: <LayoutDashboard size={14} /> },
                  { key: "Description", icon: <FileText size={14} /> },
                  { key: "Specifications", icon: <ClipboardList size={14} /> },
                  { key: "Additional Info", icon: <Info size={14} /> },
                  { key: "Reviews", icon: <Star size={14} /> },
                ].map(({ key, icon }) => (
                  <button
                    key={key}
                    className={`product-section-tab ${activeTab === key ? "active" : ""}`}
                    onClick={() => setActiveTab(key)}
                  >
                    <span className="tab-icon">{icon}</span>
                    {key === "Reviews" ? `Reviews (${product.rating ? Math.round(product.rating * 25) : 124})` : key}
                  </button>
                ))}
              </div>

              <div className="wildcraft-tab-content">
                {activeTab === "Overview" && (
                  <div className="overview-scroll-container">
                    <div className="overview-tab-pane">
                      <h3 className="overview-title">{overviewTitle}</h3>
                      <p className="overview-desc">{overviewDesc}</p>

                      {/* Banners */}
                      <div className="wildcraft-banners-grid">
                        <div className="wildcraft-banner-card" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${allProductImages[3] || allProductImages[0]})` }}>
                          <h4>Comfort System</h4>
                          <p>Keeps you cool, dry, and comfortable all day long.</p>
                        </div>
                        <div className="wildcraft-banner-card" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${allProductImages[2] || allProductImages[0]})` }}>
                          <h4>Water Resistant Material</h4>
                          <p>Built to handle splashes and tough daily use.</p>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="overview-extra-content">
                        <h4 className="overview-extra-title">Key Highlights & Features</h4>
                        <ul className="overview-features-list">
                          <li><span><strong>Ergonomic Support:</strong> Reduces strain and optimizes comfort for continuous long hours of usage.</span></li>
                          <li><span><strong>All-Weather Performance:</strong> Built with premium materials to resist splashes, sweat, and unpredictable conditions.</span></li>
                          <li><span><strong>Smart Storage & Access:</strong> Multiple utility segments designed for modern organization and fast retrieval.</span></li>
                          <li><span><strong>Eco-Conscious Materials:</strong> Engineered responsibly with durable, high-grade components built to last.</span></li>
                          <li><span><strong>Maximum Breathability:</strong> Specialized airflow patterns allow swift ventilation and heat dissipation.</span></li>
                        </ul>
                      </div>


                    </div>
                  </div>
                )}

                {activeTab === "Description" && (
                  <div className="tab-pane-box desc-tab-grid">
                    <div className="desc-story-column">
                      <h4 className="desc-pane-title">Craftsmanship & Design Philosophy</h4>
                      <p className="desc-para-lead">
                        {product.category?.toLowerCase().includes("bag")
                          ? `The ${product.name} is a high-capacity, heavy-duty backpack built for serious trekking, backpacking, and travel. Crafted with premium, weather-resistant materials and smart storage layouts, it offers maximum load stability, padded support, and organizational ease for long journeys.`
                          : product.category?.toLowerCase().includes("foot-wear") || product.category?.toLowerCase().includes("shoes")
                            ? `The ${product.name} is a high-performance trekking shoe designed to conquer tough, rocky terrains. Built with a durable high-ankle profile for optimal support, water-resistant upper materials, and a multi-directional rubber lug sole for superior grip on both wet and dry surfaces.`
                            : `The ${product.name} is designed to deliver superior utility, daily comfort, and durability. Engineered with top-grade materials, it offers high-performance specs that keep you ready for any activity, whether outdoors or in the city.`
                        }
                      </p>
                      <p className="desc-para-body">
                        Designed after extensive feedback from outdoor enthusiasts, this product integrates specialized ergonomics to minimize physical fatigue. Every fabric panel, buckle, and seam is carefully selected and tested to meet rigid durability guidelines, ensuring it performs when you need it most.
                      </p>
                      <div className="desc-highlight-box">
                        <Sparkles className="highlight-box-icon" size={18} />
                        <p className="highlight-text">
                          "Each unit is individually tested under high-stress conditions to guarantee exceptional weather resistance and long-term functional stability."
                        </p>
                      </div>
                    </div>

                    <div className="desc-metrics-column">
                      <h4 className="desc-pane-title">Performance Metrics</h4>
                      <div className="performance-metrics-list">
                        <div className="metric-item">
                          <div className="metric-header">
                            <span className="metric-name">Durability</span>
                            <span className="metric-val">95%</span>
                          </div>
                          <div className="metric-bar-outer">
                            <div className="metric-bar-inner" style={{ width: "95%" }}></div>
                          </div>
                        </div>

                        <div className="metric-item">
                          <div className="metric-header">
                            <span className="metric-name">Comfort & Ergonomics</span>
                            <span className="metric-val">90%</span>
                          </div>
                          <div className="metric-bar-outer">
                            <div className="metric-bar-inner" style={{ width: "90%" }}></div>
                          </div>
                        </div>

                        <div className="metric-item">
                          <div className="metric-header">
                            <span className="metric-name">Weather Protection</span>
                            <span className="metric-val">88%</span>
                          </div>
                          <div className="metric-bar-outer">
                            <div className="metric-bar-inner" style={{ width: "88%" }}></div>
                          </div>
                        </div>

                        <div className="metric-item">
                          <div className="metric-header">
                            <span className="metric-name">Versatility</span>
                            <span className="metric-val">92%</span>
                          </div>
                          <div className="metric-bar-outer">
                            <div className="metric-bar-inner" style={{ width: "92%" }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="why-choose-list-wrap">
                        <h5 className="why-choose-title">Key Highlights</h5>
                        <ul className="why-choose-bullets">
                          <li><Check className="bullet-icon" size={14} /> <span>Premium materials built for rugged usage</span></li>
                          <li><Check className="bullet-icon" size={14} /> <span>Ergonomic support panels to prevent fatigue</span></li>
                          <li><Check className="bullet-icon" size={14} /> <span>Reinforced stitching at heavy load zones</span></li>
                          <li><Check className="bullet-icon" size={14} /> <span>Convenient quick-access pockets</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Specifications" && (
                  <div className="tab-pane-box specs-group-grid">
                    <div className="specs-card">
                      <div className="specs-card-header">
                        <Activity className="specs-icon" size={18} />
                        <h4>General Details</h4>
                      </div>
                      <div className="specs-card-body">
                        <div className="spec-row"><span className="label">Brand</span><span className="val">{product.brand}</span></div>
                        <div className="spec-row"><span className="label">Category</span><span className="val">{product.category}</span></div>
                        <div className="spec-row"><span className="label">Product Code</span><span className="val">DZ-{String(product.id).padStart(4, '0')}</span></div>
                        <div className="spec-row"><span className="label">Ideal For</span><span className="val">Unisex</span></div>
                      </div>
                    </div>

                    <div className="specs-card">
                      <div className="specs-card-header">
                        <Award className="specs-icon" size={18} />
                        <h4>Material & Design</h4>
                      </div>
                      <div className="specs-card-body">
                        {product.category?.toLowerCase().includes("foot-wear") || product.category?.toLowerCase().includes("shoes") ? (
                          <>
                            <div className="spec-row"><span className="label">Ankle Profile</span><span className="val">{product.name?.toLowerCase().includes("high-ankle") ? "High Ankle" : "Low Ankle"}</span></div>
                            <div className="spec-row"><span className="label">Outsole</span><span className="val">Traction Rubber Sole</span></div>
                            <div className="spec-row"><span className="label">Upper Material</span><span className="val">Water-Resistant Mesh & Leather</span></div>
                            <div className="spec-row"><span className="label">Lining</span><span className="val">Breathable Fabric</span></div>
                          </>
                        ) : product.category?.toLowerCase().includes("bag") ? (
                          <>
                            <div className="spec-row"><span className="label">Capacity</span><span className="val">45 Liters</span></div>
                            <div className="spec-row"><span className="label">Rain Cover</span><span className="val">Included (Bottom Pocket)</span></div>
                            <div className="spec-row"><span className="label">Material</span><span className="val">Heavy-Duty Ripstop Polyester</span></div>
                            <div className="spec-row"><span className="label">Zippers</span><span className="val">YKK Heavy Duty Zips</span></div>
                          </>
                        ) : (
                          <>
                            <div className="spec-row"><span className="label">Material</span><span className="val">Breathable Polyester Blend</span></div>
                            <div className="spec-row"><span className="label">Fit</span><span className="val">Regular Athletic Fit</span></div>
                            <div className="spec-row"><span className="label">Stretching</span><span className="val">4-Way Flex Fabric</span></div>
                            <div className="spec-row"><span className="label">Wash Care</span><span className="val">Machine wash cold</span></div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="specs-card">
                      <div className="specs-card-header">
                        <Shield className="specs-icon" size={18} />
                        <h4>Warranty & Services</h4>
                      </div>
                      <div className="specs-card-body">
                        <div className="spec-row"><span className="label">Warranty</span><span className="val">1 Year Brand Warranty</span></div>
                        <div className="spec-row"><span className="label">Returns</span><span className="val">14 Days Easy Returns</span></div>
                        <div className="spec-row"><span className="label">Support</span><span className="val">Lifetime Email/Phone Support</span></div>
                        <div className="spec-row"><span className="label">Shipping</span><span className="val">Free Delivery in 3-5 Days</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Additional Info" && (
                  <div className="tab-pane-box info-cards-grid">
                    <div className="info-card">
                      <div className="info-card-header">
                        <div className="info-card-icon-wrapper">
                          <Truck size={20} />
                        </div>
                        <h4>Shipping & Delivery</h4>
                      </div>
                      <p className="info-card-desc">
                        Get fast and secure shipping on every order.
                      </p>
                      <ul className="info-card-bullets">
                        <li>Same-day dispatch for orders placed before 2 PM.</li>
                        <li>Standard free delivery: 3 to 5 business days.</li>
                        <li>Express next-day delivery option available at checkout.</li>
                        <li>Real-time shipment tracking via SMS and email alerts.</li>
                      </ul>
                    </div>

                    <div className="info-card">
                      <div className="info-card-header">
                        <div className="info-card-icon-wrapper">
                          <RefreshCw size={20} />
                        </div>
                        <h4>Easy Returns & Exchanges</h4>
                      </div>
                      <p className="info-card-desc">
                        Shop with confidence using our seamless returns process.
                      </p>
                      <ul className="info-card-bullets">
                        <li>14-day hassle-free return and exchange policy.</li>
                        <li>Free door-step pick-up for return shipments.</li>
                        <li>Exchanges for size and color available at nearest brand stores.</li>
                        <li>Instant refunds initiated directly to your original payment source.</li>
                      </ul>
                    </div>

                    <div className="info-card">
                      <div className="info-card-header">
                        <div className="info-card-icon-wrapper">
                          <Wrench size={20} />
                        </div>
                        <h4>Care & Maintenance</h4>
                      </div>
                      <p className="info-card-desc">
                        Follow these tips to maximize the lifespan of your adventure gear.
                      </p>
                      <ul className="info-card-bullets">
                        {product.category?.toLowerCase().includes("foot-wear") || product.category?.toLowerCase().includes("shoes") ? (
                          <>
                            <li>Wipe clean with a damp cloth or soft brush after every trek.</li>
                            <li>Let the shoes dry naturally away from direct sunlight/heaters.</li>
                            <li>Store in a cool, dry place with paper stuffed inside to retain shape.</li>
                            <li>Do not machine wash, bleach, or tumble dry the shoes.</li>
                          </>
                        ) : (
                          <>
                            <li>Clean with mild liquid soap and cold water by hand.</li>
                            <li>Do not bleach, machine wash, or tumble dry.</li>
                            <li>Hang to dry in a well-ventilated shade area.</li>
                            <li>Keep zip tracks clean by using a small dry brush.</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "Reviews" && (
                  <div className="tab-pane-box reviews-pane-grid">
                    {/* Review Summary Panel */}
                    <div className="reviews-summary-card">
                      <h4 className="reviews-summary-title">Customer Ratings</h4>
                      <div className="rating-big-row">
                        <span className="rating-big-num">{product.rating || "4.7"}</span>
                        <div className="rating-big-details">
                          <div className="stars-row-big">
                            {Array.from({ length: 5 }, (_, i) => {
                              const ratingVal = parseFloat(product.rating) || 4.7;
                              const isFilled = i < Math.round(ratingVal);
                              return (
                                <Star
                                  key={i}
                                  size={18}
                                  fill={isFilled ? "#ffa41c" : "transparent"}
                                  color={isFilled ? "#ffa41c" : "#d1d5db"}
                                />
                              );
                            })}
                          </div>
                          <span className="total-ratings-count">{product.rating ? Math.round(product.rating * 25) : 124} Verified Reviews</span>
                        </div>
                      </div>

                      <div className="rating-bars-list">
                        <div className="rating-bar-row">
                          <span className="star-num">5 ★</span>
                          <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: "78%" }}></div></div>
                          <span className="rating-percent">78%</span>
                        </div>
                        <div className="rating-bar-row">
                          <span className="star-num">4 ★</span>
                          <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: "15%" }}></div></div>
                          <span className="rating-percent">15%</span>
                        </div>
                        <div className="rating-bar-row">
                          <span className="star-num">3 ★</span>
                          <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: "5%" }}></div></div>
                          <span className="rating-percent">5%</span>
                        </div>
                        <div className="rating-bar-row">
                          <span className="star-num">2 ★</span>
                          <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: "1%" }}></div></div>
                          <span className="rating-percent">1%</span>
                        </div>
                        <div className="rating-bar-row">
                          <span className="star-num">1 ★</span>
                          <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: "1%" }}></div></div>
                          <span className="rating-percent">1%</span>
                        </div>
                      </div>

                      <button className="write-review-btn" onClick={() => setShowReviewModal(true)}>
                        <MessageSquare size={16} /> WRITE A REVIEW
                      </button>
                    </div>

                    {/* Review List Panel */}
                    <div className="reviews-list-card">
                      <div className="reviews-filter-tags">
                        <button
                          className={`filter-tag ${reviewFilter === "All" ? "active" : ""}`}
                          onClick={() => setReviewFilter("All")}
                        >
                          All ({reviewsList.length})
                        </button>
                        <button
                          className={`filter-tag ${reviewFilter === "Comfort" ? "active" : ""}`}
                          onClick={() => setReviewFilter("Comfort")}
                        >
                          Comfort ({reviewsList.filter(r => r.tags?.includes("Comfort")).length})
                        </button>
                        <button
                          className={`filter-tag ${reviewFilter === "Durability" ? "active" : ""}`}
                          onClick={() => setReviewFilter("Durability")}
                        >
                          Durability ({reviewsList.filter(r => r.tags?.includes("Durability")).length})
                        </button>
                        <button
                          className={`filter-tag ${reviewFilter === "Sizing" ? "active" : ""}`}
                          onClick={() => setReviewFilter("Sizing")}
                        >
                          Sizing ({reviewsList.filter(r => r.tags?.includes("Sizing")).length})
                        </button>
                      </div>

                      <div className="review-cards-column">
                        {filteredReviews.length > 0 ? (
                          filteredReviews.map((rev) => (
                            <div className="review-card-item" key={rev.id}>
                              <div className="review-card-top">
                                <div className={`user-avatar-badge ${rev.id % 2 === 0 ? "dark-avatar" : ""}`}>{rev.initials}</div>
                                <div className="user-meta-info">
                                  <strong>{rev.name}</strong>
                                  <span className="verified-badge">Verified Buyer</span>
                                </div>
                                <div className="review-stars-wrap" style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                  {Array.from({ length: 5 }, (_, i) => {
                                    const isFilled = i < rev.rating;
                                    return (
                                      <Star
                                        key={i}
                                        size={13}
                                        fill={isFilled ? "#ffa41c" : "transparent"}
                                        color={isFilled ? "#ffa41c" : "#d1d5db"}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                              <p className="review-comment">"{rev.comment}"</p>
                              <div className="review-helpful-row">
                                <span className="review-date">{rev.date}</span>
                                <button className="helpful-btn">Helpful ({rev.helpful})</button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p style={{ fontSize: '13.5px', color: '#64748b', fontStyle: 'italic', margin: '20px 0' }}>
                            No reviews found matching "{reviewFilter}".
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Frequently Bought Together */}
            <section className="fbt-section">
              <div className="fbt-inner-card">
                {/* Content Row: Products (left column with header) + Summary Card */}
                <div className="fbt-content">
                  {/* Left Column: Header + Products row */}
                  <div className="fbt-left-column-layout">
                    {/* Header Row: Icon + Title + Save Badge */}
                    <div className="fbt-header">
                      <div className="fbt-header-left">
                        <div className="fbt-title-row">
                          <span className="fbt-bag-icon">
                            <ShoppingCart size={18} />
                          </span>
                          <h3 className="fbt-heading">Frequently Bought Together</h3>
                        </div>
                      </div>
                    </div>

                    {/* Products list wrapper */}
                    <div className="fbt-products-slider-wrapper">
                      <div className="fbt-products-row" ref={fbtSliderRef}>
                        {/* Product 01 */}
                        <div className="fbt-product-card">
                          <div className="fbt-image-container">
                            <img src={allProductImages[0]} alt={product.name} />
                          </div>
                          <div className="fbt-product-info">
                            <h4 className="fbt-name">{product.name}</h4>
                            <div className="fbt-price-row">
                              <span className="fbt-price">₹{product.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {fbtItem1 && (
                          <>
                            <div className="fbt-connector-plus"><Plus size={16} /></div>
                            <div className="fbt-product-card">
                              <div className="fbt-image-container">
                                <img src={fbtItem1.image} alt={fbtItem1.name} />
                              </div>
                              <div className="fbt-product-info">
                                <h4 className="fbt-name">{fbtItem1.name}</h4>
                                <div className="fbt-price-row">
                                  <span className="fbt-price">₹{fbtItem1.price.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {fbtItem2 && (
                          <>
                            <div className="fbt-connector-plus"><Plus size={16} /></div>
                            <div className="fbt-product-card">
                              <div className="fbt-image-container">
                                <img src={fbtItem2.image} alt={fbtItem2.name} />
                              </div>
                              <div className="fbt-product-info">
                                <h4 className="fbt-name">{fbtItem2.name}</h4>
                                <div className="fbt-price-row">
                                  <span className="fbt-price">₹{fbtItem2.price.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Bundle Summary Card */}
                  <div className="fbt-summary-card">
                    <span className="fbt-bundle-label-new">BUNDLE PRICE</span>
                    <span className="fbt-bundle-price-new">₹{fbtTotalPrice.toLocaleString()}</span>
                    <span className="fbt-mrp-line">MRP <span className="fbt-mrp-striked">₹{fbtTotalMRP.toLocaleString()}</span></span>
                    {fbtSavings > 0 && (
                      <div className="fbt-save-pill">
                        <span>You Save ₹{fbtSavings.toLocaleString()} ({fbtDiscountPercent}%)</span>
                      </div>
                    )}
                    <button className="fbt-add-all-btn" onClick={handleFbtAddBundleToCart}>
                      <span className="fbt-btn-row1">
                        <ShoppingCart size={14} />
                        <span>Add Bundle to</span>
                      </span>
                      <span className="fbt-btn-row2">Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Sticky Column */}
          <aside className="product-right-sticky">
            <div className="product-right-panel wildcraft-panel">
              <div className="product-right-content-scroll">
                <p className="brand-name">{product.brand}</p>

                <h1 className="wildcraft-product-title">
                  {product.name}
                </h1>

                {/* Rating block */}
                <div className="top-rating-line wildcraft-rating" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span className="rating-num" style={{ fontSize: '14px', fontWeight: '700', color: '#111', lineHeight: '1' }}>{product.rating || "4.4"}</span>
                  <div className="stars-container" style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    {Array.from({ length: 5 }, (_, i) => {
                      const ratingVal = parseFloat(product.rating) || 4.4;
                      const isFilled = i < Math.round(ratingVal);
                      return (
                        <Star
                          key={i}
                          size={14}
                          fill={isFilled ? "#ffa41c" : "transparent"}
                          color={isFilled ? "#ffa41c" : "#d1d5db"}
                        />
                      );
                    })}
                  </div>
                  <span className="review-link" style={{ fontSize: '13px', color: '#888', textDecoration: 'none', cursor: 'pointer', lineHeight: '1' }}>
                    ({product.rating ? Math.round(product.rating * 25) : 112})
                  </span>
                </div>

                {/* Price block */}
                <div className="adidas-price-block wildcraft-price-block">
                  {product.oldPrice && (
                    <div className="mrp-line">
                      <span className="mrp-label-text">MRP </span>
                      <span className="mrp-old-price">₹{product.oldPrice}</span>
                    </div>
                  )}
                  <div className="price-row">
                    <span className="sale-line">₹{product.price}</span>
                    {product.oldPrice && (
                      <span className="discount-badge">
                        {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* DZIRE+ Credit Points Card */}
                <div className="dzire-credit-card">
                  <div className="dzire-credit-left">
                    <div className="dzire-credit-coin">
                      <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="16" fill="url(#goldGrad)" stroke="#FFA000" strokeWidth="1" />
                        <circle cx="18" cy="18" r="13" fill="none" stroke="#FFE082" strokeWidth="1" strokeDasharray="3 2" />
                        <text x="18" y="24" fontSize="16" fontWeight="900" fill="#B78103" textAnchor="middle" fontFamily="'Inter', -apple-system, sans-serif">₹</text>
                        <defs>
                          <radialGradient id="goldGrad" cx="18" cy="18" r="16" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 18) rotate(45) scale(16)">
                            <stop offset="0%" stopColor="#FFFDF0" />
                            <stop offset="40%" stopColor="#FFD54F" />
                            <stop offset="100%" stopColor="#FFB300" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="dzire-credit-info">
                      <div className="dzire-credit-title">
                        <span className="dzire-brand-text">DZIRE+</span>
                        <span style={{ fontWeight: 700 }}>CREDIT POINTS</span>
                      </div>
                      <div className="dzire-credit-subtitle">1000 = 50 Credit Points</div>
                    </div>
                  </div>
                  <div className="dzire-credit-right">
                    <div className="dzire-earn-header">
                      <span className="dzire-info-icon" title="Dzire Credit Points Info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                      </span>
                      <span className="dzire-earn-label">You earn</span>
                    </div>
                    <span className="dzire-earn-points">{Math.round(product.price * 0.05)} Points</span>
                  </div>
                </div>

                {/* Colors selector */}
                <div className="selector-block wildcraft-selector">
                  <h4 className="selector-title">COLOR: {selectedColor?.toUpperCase()}</h4>
                  <div className="color-swatches-row">
                    {colors.map((item) => (
                      <button
                        key={item.name}
                        className={`color-dot-btn ${selectedColor === item.name ? 'active' : ''}`}
                        style={{ "--swatch-color": item.color }}
                        onClick={() => setSelectedColor(item.name)}
                        title={item.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size selector */}
                <div className="selector-block wildcraft-selector">
                  <h4 className="selector-title">SIZE: (CAPACITY)</h4>
                  <div className="size-buttons-row">
                    {sizes.map((sz) => (
                      <button
                        key={sz}
                        className={`size-pill-btn ${selectedSize === sz ? 'active' : ''}`}
                        onClick={() => setSelectedSize(sz)}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sticky Actions Wrapper */}
                <div className="product-right-sticky-actions">
                  {/* Quantity selector */}
                  <div className="selector-block wildcraft-selector">
                    <h4 className="selector-title">QTY</h4>
                    <div className="qty-picker">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                      <span>{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div ref={actionsRef} className="action-buttons-stack">
                    <button className="wildcraft-add-to-cart" onClick={handleAddToCartClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                      <span>Add to Cart</span>
                    </button>

                    <div className="secondary-buttons-row">
                      <button className="sec-btn" onClick={handleBuyNowClick}>
                        <Zap size={18} fill="none" />
                        <span>Buy Now</span>
                      </button>
                      <button className={`sec-btn ${isWishlisted ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
                        <Heart size={18} fill={isWishlisted ? "#ff3333" : "none"} color={isWishlisted ? "#ff3333" : "currentColor"} />
                        <span>Wishlist</span>
                      </button>
                      <button className={`sec-btn ${isCompared ? 'active' : ''}`} onClick={() => toggleCompare(product)}>
                        <RefreshCw size={18} color={isCompared ? "#ff6600" : "currentColor"} />
                        <span>Compare</span>
                      </button>
                    </div>
                  </div>

                  {/* Highlighted Offers & Coupons Box */}
                  <div className="offers-coupons-highlight-box">
                    <div className="offers-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="header-icon"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                      <span>Offers & Coupons</span>
                    </div>

                    <div className="offers-body">
                      <div className="offer-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="offer-icon"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                        <div className="offer-details">
                          <span className="code">FLAT10</span>
                          <span className="desc">Get 10% OFF on orders above ₹3,000</span>
                        </div>
                        <svg className="chevron-right" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                      </div>

                      <div className="offer-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="offer-icon"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                        <div className="offer-details">
                          <span className="code">TREK500</span>
                          <span className="desc">₹500 OFF on orders above ₹7,500</span>
                        </div>
                        <svg className="chevron-right" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                      </div>

                      <div className="offer-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="offer-icon"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                        <div className="offer-details">
                          <span className="code">FREEDEL</span>
                          <span className="desc">Free Shipping on prepaid orders</span>
                        </div>
                        <svg className="chevron-right" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                      </div>

                      <div className="view-all-offers-orange" onClick={() => navigate("/offers")}>
                        View All Offers &gt;
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="dzire-panel-divider"></div>

                  {/* Delivery Estimation */}
                  <div className="dzire-delivery-row dzire-delivery-estimation" style={{ border: 'none', background: 'none', padding: '0', margin: '12px 0' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                    <div className="dzire-delivery-info">
                      <div className="dzire-delivery-title">Estimated Delivery</div>
                      <div className="dzire-delivery-sub">
                        2 - 4 Days (Deliver to <b>110001</b>) <span className="dzire-delivery-change">Change</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="dzire-panel-divider"></div>

                  {/* Secure Checkout Row */}
                  <div className="dzire-delivery-row dzire-secure-checkout" style={{ border: 'none', background: 'none', padding: '0', margin: '12px 0' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <div className="dzire-delivery-info">
                      <div className="dzire-delivery-title">Secure Checkout</div>
                      <div className="dzire-delivery-sub">Safe & encrypted payments</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="dzire-panel-divider"></div>

                  {/* Share This Product with circular buttons */}
                  <div className="share-section-flat" style={{ margin: '12px 0' }}>
                    <div className="share-title" style={{ fontWeight: '700', fontSize: '15px', color: '#111', marginBottom: '8px' }}>Share this product</div>
                    <div className="share-buttons-row" style={{ display: 'flex', gap: '10px' }}>
                      {/* Copy Link */}
                      <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }} className="share-round-btn copy-link" title="Copy Product Link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                      </button>
                      {/* WhatsApp */}
                      <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="share-round-btn whatsapp" title="Share on WhatsApp">
                        <FaWhatsapp size={19} />
                      </a>
                      {/* Facebook */}
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="share-round-btn facebook" title="Share on Facebook">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" /></svg>
                      </a>
                    </div>
                  </div>

                  {/* Payment Partners (We Accept) */}
                  <div className="payment-partners" style={{ borderTop: 'none', padding: '0', marginTop: '12px' }}>
                    <span className="accept-label">We Accept:</span>
                    <div className="payment-badges" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <img src={visaImg} alt="Visa" className="payment-badge-img" style={{ height: '24px' }} />
                      <img src={masterImg} alt="Mastercard" className="payment-badge-img" style={{ height: '24px' }} />
                      <img src={upiImg} alt="UPI" className="payment-badge-img" style={{ height: '24px' }} />
                      <img src={appleImg} alt="Apple Pay" className="payment-badge-img" style={{ height: '24px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>




        {/* Similar Products (Full Width) */}
        <div className="similar-products-fullwidth-wrapper" style={{ maxWidth: "1240px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <section className="similar-products-section">
            <div className="section-head">
              <h3 className="section-title">Similar Products</h3>
              <span className="view-all-link" onClick={() => navigate("/shop")}>
                View All <span className="arrow">›</span>
              </span>
            </div>

            <div className="similar-slider-wrap" style={{ position: "relative" }}>
              <button
                className="slider-arrow-new"
                onClick={handleSimilarPrev}
                disabled={!similarCanScrollLeft}
                type="button"
                style={{
                  position: "absolute", left: "-18px", top: "50%",
                  transform: "translateY(-50%)", width: "36px", height: "36px",
                  borderRadius: "50%", border: "1px solid #ddd", background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: similarCanScrollLeft ? "pointer" : "not-allowed",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)", padding: 0, zIndex: 10,
                  opacity: similarCanScrollLeft ? 1 : 0.4, transition: "all 0.2s"
                }}
              >
                <ChevronLeft size={18} color="#333" />
              </button>

              <div ref={similarSliderRef} className="similar-products-slider" onScroll={checkSimilarScrollBounds}>
                {similarProducts.slice(0, 5).map((p) => (
                  <div key={p.id} className="sim-card" onClick={() => navigate(`/product/${p.id}`)}>
                    <div className="sim-card-img-wrap">
                      <img src={p.image} alt={p.name} />
                      <button
                        className="sim-wish-btn"
                        title="Add to Wishlist"
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                      >
                        <Heart
                          size={15}
                          fill={wishlistItems.some((item) => String(item.id) === String(p.id)) ? "#ff3333" : "none"}
                          color={wishlistItems.some((item) => String(item.id) === String(p.id)) ? "#ff3333" : "#888"}
                        />
                      </button>
                    </div>
                    <div className="sim-card-info">
                      <div className="sim-card-name">{p.name}</div>
                      <div className="sim-card-rating">
                        <span className="sim-stars">★★★★★</span>
                        <span className="sim-count">({p.rating ? Math.round(p.rating * 20) : 76})</span>
                      </div>
                      <div className="sim-card-price-row">
                        <span className="sim-price">₹{p.price}</span>
                        {p.oldPrice && (
                          <span className="sim-disc">
                            {Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="slider-arrow-new"
                onClick={handleSimilarNext}
                disabled={!similarCanScrollRight}
                type="button"
                style={{
                  position: "absolute", right: "-18px", top: "50%",
                  transform: "translateY(-50%)", width: "36px", height: "36px",
                  borderRadius: "50%", border: "1px solid #ddd", background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: similarCanScrollRight ? "pointer" : "not-allowed",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)", padding: 0, zIndex: 10,
                  opacity: similarCanScrollRight ? 1 : 0.4, transition: "all 0.2s"
                }}
              >
                <ChevronRight size={18} color="#333" />
              </button>
            </div>

            {/* Second row: next 5 similar products as a slider */}
            {similarProducts.length > 5 && (
              <div className="similar-slider-wrap" style={{ position: "relative", marginTop: "24px" }}>
                <button
                  className="slider-arrow-new"
                  onClick={handleSimilarRow2Prev}
                  disabled={!similarRow2CanScrollLeft}
                  type="button"
                  style={{
                    position: "absolute", left: "-18px", top: "50%",
                    transform: "translateY(-50%)", width: "36px", height: "36px",
                    borderRadius: "50%", border: "1px solid #ddd", background: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: similarRow2CanScrollLeft ? "pointer" : "not-allowed",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)", padding: 0, zIndex: 10,
                    opacity: similarRow2CanScrollLeft ? 1 : 0.4, transition: "all 0.2s"
                  }}
                >
                  <ChevronLeft size={18} color="#333" />
                </button>

                <div ref={similarRow2SliderRef} className="similar-products-slider" onScroll={checkSimilarRow2ScrollBounds}>
                  {similarProducts.slice(5, 10).map((p) => (
                    <div key={p.id} className="sim-card" onClick={() => navigate(`/product/${p.id}`)}>
                      <div className="sim-card-img-wrap">
                        <img src={p.image} alt={p.name} />
                        <button
                          className="sim-wish-btn"
                          title="Add to Wishlist"
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                        >
                          <Heart
                            size={15}
                            fill={wishlistItems.some((item) => String(item.id) === String(p.id)) ? "#ff3333" : "none"}
                            color={wishlistItems.some((item) => String(item.id) === String(p.id)) ? "#ff3333" : "#888"}
                          />
                        </button>
                      </div>
                      <div className="sim-card-info">
                        <div className="sim-card-name">{p.name}</div>
                        <div className="sim-card-rating">
                          <span className="sim-stars">★★★★★</span>
                          <span className="sim-count">({p.rating ? Math.round(p.rating * 20) : 76})</span>
                        </div>
                        <div className="sim-card-price-row">
                          <span className="sim-price">₹{p.price}</span>
                          {p.oldPrice && (
                            <span className="sim-disc">
                              {Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="slider-arrow-new"
                  onClick={handleSimilarRow2Next}
                  disabled={!similarRow2CanScrollRight}
                  type="button"
                  style={{
                    position: "absolute", right: "-18px", top: "50%",
                    transform: "translateY(-50%)", width: "36px", height: "36px",
                    borderRadius: "50%", border: "1px solid #ddd", background: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: similarRow2CanScrollRight ? "pointer" : "not-allowed",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)", padding: 0, zIndex: 10,
                    opacity: similarRow2CanScrollRight ? 1 : 0.4, transition: "all 0.2s"
                  }}
                >
                  <ChevronRight size={18} color="#333" />
                </button>
              </div>
            )}

          </section>
        </div>
      </div>

      {showReviewModal && (
        <div className="review-modal-overlay">
          <div className="review-modal-card">
            <div className="review-modal-header">
              <h3>Write a Review</h3>
              <button className="review-modal-close" onClick={() => setShowReviewModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="review-modal-form">
              <div className="form-group">
                <label>Overall Rating</label>
                <div className="star-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-select-btn ${star <= newReviewRating ? 'active' : ''}`}
                      onClick={() => setNewReviewRating(star)}
                    >
                      <Star size={24} fill={star <= newReviewRating ? "#ff6600" : "transparent"} color="#ff6600" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reviewer-name">Your Name</label>
                <input
                  id="reviewer-name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Review Tags (Select all that apply)</label>
                <div className="tag-pill-selector">
                  {["Comfort", "Durability", "Sizing"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-pill-btn ${newReviewTags.includes(tag) ? 'active' : ''}`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reviewer-comment">Review Description</label>
                <textarea
                  id="reviewer-comment"
                  rows="4"
                  placeholder="Write your review comments here..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="review-modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer showPopularSearches={false} showReviews={false} />

      {/* Sticky Bottom Buy/Action Bar */}
      <div className={`dzire-sticky-bottom-bar ${showStickyBar ? 'visible' : ''}`}>
        <div className="dzire-sticky-bar-inner">
          <div className="dzire-sticky-bar-left">
            <img src={allProductImages[0]} alt={product.name} className="dzire-sticky-bar-thumb" />
            <div className="dzire-sticky-bar-meta">
              <span className="dzire-sticky-bar-name">{product.name}</span>
              <div className="dzire-sticky-bar-price-wrapper">
                <span className="dzire-sticky-bar-price">₹{product.price}</span>
                {product.oldPrice && (
                  <span className="dzire-sticky-bar-old-price">₹{product.oldPrice}</span>
                )}
              </div>
            </div>
          </div>
          <div className="dzire-sticky-bar-right">
            <button className="dzire-sticky-btn add-to-cart-btn" onClick={handleAddToCartClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
              <span>Add to Cart</span>
            </button>
            <button className="dzire-sticky-icon-btn" onClick={handleBuyNowClick} title="Buy Now">
              <Zap size={18} fill="none" />
            </button>
            <button className={`dzire-sticky-icon-btn ${wishlistItems.some((item) => String(item.id) === String(product.id)) ? 'active' : ''}`} onClick={() => toggleWishlist(product)} title="Wishlist">
              <Heart size={18} fill={wishlistItems.some((item) => String(item.id) === String(product.id)) ? "#ff3333" : "none"} color={wishlistItems.some((item) => String(item.id) === String(product.id)) ? "#ff3333" : "currentColor"} />
            </button>
            <button className={`dzire-sticky-icon-btn ${compareItems.some((item) => String(item.id) === String(product.id)) ? 'active' : ''}`} onClick={() => toggleCompare(product)} title="Compare">
              <RefreshCw size={17} color={compareItems.some((item) => String(item.id) === String(product.id)) ? "#ff6600" : "currentColor"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
