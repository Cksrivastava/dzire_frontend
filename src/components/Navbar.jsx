import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  Heart,
  ShoppingCart,
  RefreshCw,
  User,
  X,
  LogOut,
  ChevronRight,
  MapPin,
  Shirt,
  Footprints,
  Backpack,
  Watch,
  BookOpen,
  Gamepad2,
  Shield,
  HeartPulse,
  Compass,
  Tag,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { PiPants } from "react-icons/pi";
import "./Navbar.css";
import logo from "../assets/logo.png";
import { couponAPI, productAPI, eventAPI } from "../services/api";
import wsClient from "../services/websocket";

const defaultSearchSuggestions = [
  "Polished Cycle",
  "Sports Shoes",
  "Camping Jacket",
  "Training Gloves",
  "Running Bag",
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showAnnouncement, setShowAnnouncement] = useState(false); // Default to false (hidden on load/refresh)
  const [closedManually, setClosedManually] = useState(false);
  const [announcementCoupon, setAnnouncementCoupon] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState(defaultSearchSuggestions);
  const [allProducts, setAllProducts] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const [mobileSectionsOpen, setMobileSectionsOpen] = useState({
    categories: false,
    activity: false,
    gender: false,
    community: false,
    dzire: false,
  });

  const toggleMobileSection = (section) => {
    setMobileSectionsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navigate = useNavigate();
  const { cartCount, wishlistItems, compareItems = [], user, logoutUser } = useContext(ShopContext);

  useEffect(() => {
    let mounted = true;

    couponAPI
      .getAll()
      .then((res) => {
        if (mounted && res && res.success && Array.isArray(res.coupons) && res.coupons.length > 0) {
          const active = res.coupons.find((c) => c.status === "Active");
          if (active) setAnnouncementCoupon(active);
        }
      })
      .catch(() => {});

    const fetchProducts = () => {
      productAPI
        .getAll()
        .then((res) => {
          if (!mounted) return;
          const prods = Array.isArray(res) ? res : (res?.products || []);
          if (Array.isArray(prods)) {
            setAllProducts(prods);
            const names = prods.slice(0, 8).map((p) => p.name).filter(Boolean);
            if (names.length > 0) setSearchSuggestions(names);
          }
        })
        .catch(() => {});
    };

    const fetchEvents = () => {
      eventAPI
        .getAll()
        .then((res) => {
          if (!mounted) return;
          const evts = Array.isArray(res) ? res : (res?.events || res?.data || []);
          if (Array.isArray(evts)) {
            setAllEvents(evts);
          }
        })
        .catch(() => {});
    };

    fetchProducts();
    fetchEvents();

    const unsubProduct = wsClient?.on ? wsClient.on("PRODUCT_UPDATED", fetchProducts) : null;
    const unsubEvents = wsClient?.on ? wsClient.on("EVENTS_UPDATED", fetchEvents) : null;

    return () => {
      mounted = false;
      if (typeof unsubProduct === "function") unsubProduct();
      if (typeof unsubEvents === "function") unsubEvents();
    };
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Track if the user has scrolled down at least once
  const hasScrolledDown = React.useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (closedManually) return;

      const currentScrollY = window.scrollY;

      // Mark that user scrolled down past a small threshold
      if (currentScrollY > 0) {
        hasScrolledDown.current = true;
      }

      // Hide immediately when scrolling down (away from the top)
      if (currentScrollY > 0) {
        setShowAnnouncement(false);
      }
      // Show ONLY when reaching the top AND they have scrolled down at least once
      else if (currentScrollY <= 20 && hasScrolledDown.current) {
        setShowAnnouncement(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [closedManually]);

  const trimmedSearch = searchText.trim().toLowerCase();

  const allCategories = [
    { name: "Top-Wear", path: "/shop?category=Top-Wear", type: "Category" },
    { name: "Bottom-Wear", path: "/shop?category=Bottom-Wear", type: "Category" },
    { name: "Foot-Wear", path: "/shop?category=Foot-Wear", type: "Category" },
    { name: "Accessories", path: "/shop?category=Accessories", type: "Category" },
    { name: "Camping", path: "/events/camping", type: "Activity" },
    { name: "Cycling", path: "/events/cycling", type: "Activity" },
    { name: "Climbing", path: "/events/climbing", type: "Activity" },
    { name: "All Treks & Events", path: "/event", type: "Adventures" },
  ];

  const matchedCategories = trimmedSearch
    ? allCategories.filter((c) => c.name.toLowerCase().includes(trimmedSearch))
    : [];

  const matchedProducts = trimmedSearch
    ? allProducts
        .filter(
          (p) =>
            (p.name && p.name.toLowerCase().includes(trimmedSearch)) ||
            (p.category && p.category.toLowerCase().includes(trimmedSearch)) ||
            (p.brand && p.brand.toLowerCase().includes(trimmedSearch))
        )
        .slice(0, 5)
    : [];

  const matchedEvents = trimmedSearch
    ? allEvents
        .filter(
          (ev) =>
            (ev.title && ev.title.toLowerCase().includes(trimmedSearch)) ||
            (ev.category && ev.category.toLowerCase().includes(trimmedSearch)) ||
            (ev.location && ev.location.toLowerCase().includes(trimmedSearch))
        )
        .slice(0, 4)
    : [];

  const trendingKeywords = [
    "Trekking",
    "Camping",
    "Backpack",
    "Yoga Mat",
    "Shoes",
    "Cycling",
    "Climbing",
    "Jacket",
  ];

  const handleSelectSuggestion = (text) => {
    setSearchText(text);
    setIsSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(text)}`);
    setMenuOpen(false);
  };

  const handleNavigate = (path) => {
    setIsSearchOpen(false);
    navigate(path);
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const finalSearch = searchText.trim();

    if (finalSearch) {
      setIsSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(finalSearch)}`);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      <div className="header-wrapper">
        {showAnnouncement && (
          <div className="announcement-bar">
            <div className="announcement-marquee-wrapper">
              <marquee behavior="scroll" direction="left" scrollamount="4">
                <span className="announcement-text">
                  Welcome to Dzire Store. {announcementCoupon ? (
                    <>Use code <span className="announcement-highlight">"{announcementCoupon.code}"</span> & Get <span className="announcement-highlight">{announcementCoupon.discountType === 'Percentage' || announcementCoupon.discountType === 'percent' ? `${announcementCoupon.discountValue}% OFF` : `₹${announcementCoupon.discountValue} OFF`}</span>{announcementCoupon.minOrderValue ? ` on orders above ₹${announcementCoupon.minOrderValue}` : ''}!</>
                  ) : (
                    <>Use code <span className="announcement-highlight">"WELCOME10"</span> & Get Flat <span className="announcement-highlight">10% OFF</span> on your 1st order.</>
                  )}
                </span>
                <span className="announcement-separator">•</span>
                <span className="announcement-text">
                  Free Shipping on orders above <span className="announcement-highlight">₹{announcementCoupon?.minOrderValue || 999}!</span>
                </span>
                <span className="announcement-separator">•</span>
                <span className="announcement-text">
                  Check out our new <span className="announcement-highlight">Sahyadri & Himalayan Trekking Events</span> inside!
                </span>
              </marquee>
            </div>
            <button
              className="announcement-close-btn"
              onClick={() => {
                setClosedManually(true);
                setShowAnnouncement(false);
              }}
              aria-label="Close announcement"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <header className="navbar">
          <div className="nav-container">
            <div className="nav-left">
              <button
                className="menu-btn"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={28} />
              </button>

              <Link to="/" className="brand">
                <img src={logo} alt="Dzire Sport" className="brand-logo" />
              </Link>
            </div>

            <div className="nav-search-wrapper" ref={searchContainerRef}>
              <form className="nav-search" onSubmit={handleSearch}>
                <Search size={18} className="search-icon-left" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="I am searching for..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    if (!isSearchOpen) setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsSearchOpen(false);
                    }
                  }}
                />
                {searchText.trim().length > 0 && (
                  <button
                    type="button"
                    className="nav-search-clear-btn"
                    onClick={() => {
                      setSearchText("");
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
                <button type="submit" className="search-btn">Search</button>
              </form>

              {isSearchOpen && (
                <div className="nav-search-dropdown">
                  <div className="nav-search-results-scroll">
                    {!trimmedSearch ? (
                      <>
                        <div className="nav-search-section-title">
                          <Sparkles size={13} /> Trending Searches
                        </div>
                        <div className="nav-search-trending-chips">
                          {trendingKeywords.map((kw, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="nav-search-trending-chip"
                              onClick={() => handleSelectSuggestion(kw)}
                            >
                              <Search size={12} />
                              {kw}
                            </button>
                          ))}
                        </div>
                        {allEvents.length > 0 && (
                          <>
                            <div className="nav-search-section-title" style={{ marginTop: "10px" }}>
                              <Compass size={13} /> Popular Adventures
                            </div>
                            {allEvents.slice(0, 3).map((ev) => {
                              const evImg = ev.image || (Array.isArray(ev.images) && ev.images[0]) || "";
                              return (
                                <div
                                  key={ev._id || ev.id}
                                  className="nav-search-item"
                                  onClick={() => handleNavigate(`/event/${ev.slug || ev._id || ev.id}`)}
                                >
                                  {evImg ? (
                                    <img src={evImg} alt={ev.title} className="nav-search-item-img" />
                                  ) : (
                                    <div className="nav-search-item-img-placeholder">⛺</div>
                                  )}
                                  <div className="nav-search-item-info">
                                    <div className="nav-search-item-name">{ev.title}</div>
                                    <div className="nav-search-item-sub">
                                      <span className="nav-search-item-badge">Event</span>
                                      {ev.location && <span>• {ev.location}</span>}
                                    </div>
                                  </div>
                                  <span className="nav-search-item-price">₹{ev.price}</span>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {matchedCategories.length > 0 && (
                          <>
                            <div className="nav-search-section-title">
                              <Tag size={13} /> Categories & Activities
                            </div>
                            {matchedCategories.map((cat, idx) => (
                              <div
                                key={idx}
                                className="nav-search-tag-chip"
                                onClick={() => handleNavigate(cat.path)}
                              >
                                <Search size={14} style={{ color: "#ff6600" }} />
                                <span>{cat.name}</span>
                                <span className="nav-search-item-badge" style={{ marginLeft: "auto" }}>
                                  {cat.type}
                                </span>
                              </div>
                            ))}
                          </>
                        )}

                        {matchedEvents.length > 0 && (
                          <>
                            <div
                              className="nav-search-section-title"
                              style={{ marginTop: matchedCategories.length > 0 ? "8px" : "0" }}
                            >
                              <Compass size={13} /> Events & Adventures ({matchedEvents.length})
                            </div>
                            {matchedEvents.map((ev) => {
                              const evImg = ev.image || (Array.isArray(ev.images) && ev.images[0]) || "";
                              return (
                                <div
                                  key={ev._id || ev.id}
                                  className="nav-search-item"
                                  onClick={() => handleNavigate(`/event/${ev.slug || ev._id || ev.id}`)}
                                >
                                  {evImg ? (
                                    <img src={evImg} alt={ev.title} className="nav-search-item-img" />
                                  ) : (
                                    <div className="nav-search-item-img-placeholder">⛺</div>
                                  )}
                                  <div className="nav-search-item-info">
                                    <div className="nav-search-item-name">{ev.title}</div>
                                    <div className="nav-search-item-sub">
                                      <span className="nav-search-item-badge">Event</span>
                                      {ev.location && <span>• {ev.location}</span>}
                                    </div>
                                  </div>
                                  <span className="nav-search-item-price">₹{ev.price}</span>
                                </div>
                              );
                            })}
                          </>
                        )}

                        {matchedProducts.length > 0 && (
                          <>
                            <div
                              className="nav-search-section-title"
                              style={{
                                marginTop:
                                  matchedCategories.length > 0 || matchedEvents.length > 0
                                    ? "8px"
                                    : "0",
                              }}
                            >
                              <Shirt size={13} /> Products ({matchedProducts.length})
                            </div>
                            {matchedProducts.map((p) => {
                              const pImg = p.image || (Array.isArray(p.images) && p.images[0]) || "";
                              const pPrice = p.salePrice || p.price || 0;
                              return (
                                <div
                                  key={p._id || p.id}
                                  className="nav-search-item"
                                  onClick={() => handleNavigate(`/product/${p._id || p.id}`)}
                                >
                                  {pImg ? (
                                    <img src={pImg} alt={p.name} className="nav-search-item-img" />
                                  ) : (
                                    <div className="nav-search-item-img-placeholder">📦</div>
                                  )}
                                  <div className="nav-search-item-info">
                                    <div className="nav-search-item-name">{p.name}</div>
                                    <div className="nav-search-item-sub">
                                      {p.category && (
                                        <span className="nav-search-item-badge">{p.category}</span>
                                      )}
                                      {p.brand && <span>• {p.brand}</span>}
                                    </div>
                                  </div>
                                  <span className="nav-search-item-price">₹{pPrice}</span>
                                </div>
                              );
                            })}
                          </>
                        )}

                        {matchedCategories.length === 0 &&
                          matchedEvents.length === 0 &&
                          matchedProducts.length === 0 && (
                            <div className="nav-search-empty-state">
                              <span>No direct matches found</span>
                              Try checking your spelling or search our full catalog below.
                            </div>
                          )}
                      </>
                    )}
                  </div>

                  {trimmedSearch && (
                    <div
                      className="nav-search-footer-action"
                      onClick={() => handleSelectSuggestion(searchText.trim())}
                    >
                      <span>
                        View all results for "<strong>{searchText}</strong>"
                      </span>
                      <ChevronRight size={15} />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="nav-right">
              <a
                href="https://www.google.com/maps/place/Dzire+-+Outdoor+Equipment+Store/@18.5051661,73.8346188,651m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bc2bff8d5681535:0xe687ac1a4cd24b1a!8m2!3d18.5051661!4d73.8346188!16s%2Fg%2F11vxm9s2t_?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="nav-item store-link"
              >
                <div className="nav-icon-wrapper">
                  <MapPin size={22} />
                </div>
                <span>Find a Store</span>
              </a>

              <Link to={user ? "/profile" : "/login?redirectTo=/profile"} className="nav-item account-link">
                <div className="nav-icon-wrapper">
                  <User size={22} />
                </div>
                <span>Account</span>
              </Link>

              <Link to={user ? "/cart" : "/login?redirectTo=/cart"} className="nav-item cart-link">
                <div className="nav-icon-wrapper">
                  <ShoppingCart size={22} />
                  {user && cartCount > 0 && (
                    <span className="nav-badge cart-badge">{cartCount}</span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              <Link to={user ? "/wishlist" : "/login?redirectTo=/wishlist"} className="nav-item wishlist-link">
                <div className="nav-icon-wrapper">
                  <Heart
                    size={22}
                    fill={user && wishlistItems.length > 0 ? "#ff3333" : "transparent"}
                    color={user && wishlistItems.length > 0 ? "#ff3333" : "currentColor"}
                  />
                  {user && wishlistItems.length > 0 && (
                    <span className="nav-badge">{wishlistItems.length}</span>
                  )}
                </div>
                <span>Wishlist</span>
              </Link>

              <Link to={user ? "/compare" : "/login?redirectTo=/compare"} className="nav-item compare-link">
                <div className="nav-icon-wrapper">
                  <RefreshCw size={21} />
                  {user && compareItems.length > 0 && (
                    <span className="nav-badge compare-badge">{compareItems.length}</span>
                  )}
                </div>
                <span>Compare</span>
              </Link>

              {user && (
                <button onClick={handleLogout} className="nav-item logout-btn">
                  <div className="nav-icon-wrapper">
                    <LogOut size={22} />
                  </div>
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="secondary-navbar">
          <div className="sec-nav-container">
            {/* Left Column: Browse Categories Button */}
            <div className="browse-categories-wrapper">
              <Link to="/shop" className="browse-categories-btn">
                <span>BROWSE CATEGORIES</span>
                <span className="arrow" style={{ transition: 'transform 0.2s ease', display: 'flex', alignItems: 'center', opacity: 0.8 }}>&raquo;</span>
              </Link>
              <div className="categories-dropdown-menu">
                <Link to="/shop?category=Top-Wear" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <Shirt size={16} className="cat-item-icon" />
                    <span>Top-Wear</span>
                  </div>
                  <ChevronRight size={14} className="cat-chevron" />
                </Link>
                <Link to="/shop?category=Bottom-Wear" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <PiPants size={16} className="cat-item-icon" />
                    <span>Bottom-Wear</span>
                  </div>
                  <ChevronRight size={14} className="cat-chevron" />
                </Link>
                <Link to="/shop?category=Foot-Wear" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <Footprints size={16} className="cat-item-icon" />
                    <span>Foot-Wear</span>
                  </div>
                  <ChevronRight size={14} className="cat-chevron" />
                </Link>
                <Link to="/shop?category=Bags" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <Backpack size={16} className="cat-item-icon" />
                    <span>Bags</span>
                  </div>
                  <ChevronRight size={14} className="cat-chevron" />
                </Link>
                <Link to="/shop?category=Accessories" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <Watch size={16} className="cat-item-icon" />
                    <span>Accessories</span>
                  </div>
                  <ChevronRight size={14} className="cat-chevron" />
                </Link>
                <Link to="/bookstore" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <BookOpen size={16} className="cat-item-icon" />
                    <span>Book Store</span>
                  </div>
                </Link>
                <Link to="/shop?category=Games" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <Gamepad2 size={16} className="cat-item-icon" />
                    <span>Game</span>
                  </div>
                </Link>
                <Link to="/shop?category=Safety" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <Shield size={16} className="cat-item-icon" />
                    <span>Safety & Survival</span>
                  </div>
                </Link>
                <Link to="/shop?category=Support" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <HeartPulse size={16} className="cat-item-icon" />
                    <span>Support & Recovery</span>
                  </div>
                </Link>
                <Link to="/shop?category=Season" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <Compass size={16} className="cat-item-icon" />
                    <span>Shop by SEASON</span>
                  </div>
                  <ChevronRight size={14} className="cat-chevron" />
                </Link>
                <Link to="/shop?category=Brands" className="cat-dropdown-item">
                  <div className="cat-item-left">
                    <Tag size={16} className="cat-item-icon" />
                    <span>Shop by BRANDS</span>
                  </div>
                  <ChevronRight size={14} className="cat-chevron" />
                </Link>
              </div>
            </div>

            {/* Right Column: Nav Links */}
            <div className="sec-nav-links">
              {/* Link 1: ACTIVITY with dropdown */}
              <div className="sec-nav-dropdown-item">
                <span className="sec-nav-link-title">ACTIVITY <span className="arrow">&raquo;</span></span>
                <div className="sec-nav-dropdown">
                  <Link to="/shop?category=hiking">Trekking</Link>
                  <Link to="/events/camping">Camping</Link>
                  <Link to="/shop?category=running">Running</Link>
                  <Link to="/events/cycling">Cycling</Link>
                  <Link to="/shop?category=swimming">Swimming</Link>
                  <Link to="/events/climbing">Climbing</Link>
                </div>
              </div>

              {/* Link 2: GENDER with dropdown */}
              <div className="sec-nav-dropdown-item">
                <span className="sec-nav-link-title">GENDER <span className="arrow">&raquo;</span></span>
                <div className="sec-nav-dropdown">
                  <Link to="/shop?category=men">Men</Link>
                  <Link to="/shop?category=women">Women</Link>
                  <Link to="/shop?category=unisex">Unisex</Link>
                </div>
              </div>

              {/* Link 3: SALE */}
              <Link to="/shop" className="sec-nav-simple-link sale-link">SALE</Link>

              {/* Link 4: Events */}
              <Link to="/event" className="sec-nav-simple-link">Events</Link>

              {/* Link 5: Rentals */}
              <Link to="/rental" className="sec-nav-simple-link">Rentals</Link>

              {/* Link 6: Community with dropdown */}
              <div className="sec-nav-dropdown-item">
                <span className="sec-nav-link-title">Community <span className="arrow">&raquo;</span></span>
                <div className="sec-nav-dropdown">
                  <Link to="/blog">Blogs</Link>
                  <Link to="/events/himalaya">Himalaya Tours</Link>
                  <Link to="/events/sahyadri">Sahyadri Treks</Link>
                </div>
              </div>

              {/* Link 7: Dzire+ with dropdown */}
              <div className="sec-nav-dropdown-item">
                <span className="sec-nav-link-title">Dzire <span className="arrow">&raquo;</span></span>
                <div className="sec-nav-dropdown">
                  <Link to="/events/travel">Travel Partners</Link>
                  <Link to="/about">Travel Benefits</Link>
                </div>
              </div>

              {/* Link 8: Sale Button */}
              <div className="sec-nav-sale-btn-wrapper">
                <Link to="/shop" className="sec-nav-sale-btn">
                  <span>SALE</span>
                  <span className="arrow" style={{ transition: 'transform 0.2s ease', display: 'flex', alignItems: 'center', opacity: 0.8 }}>&raquo;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <div className="mobile-menu-scroll-content">
          {/* 1. BROWSE CATEGORIES */}
          <div className={`mobile-menu-accordion-item ${mobileSectionsOpen.categories ? "is-open" : ""}`}>
            <button className="mobile-menu-accordion-head" onClick={() => toggleMobileSection("categories")}>
              <span>BROWSE CATEGORIES</span>
              {mobileSectionsOpen.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <div className="mobile-menu-accordion-body">
              <Link to="/shop?category=Top-Wear" onClick={() => setMenuOpen(false)}>
                <Shirt size={16} />
                <span>Top-Wear</span>
              </Link>
              <Link to="/shop?category=Bottom-Wear" onClick={() => setMenuOpen(false)}>
                <PiPants size={16} />
                <span>Bottom-Wear</span>
              </Link>
              <Link to="/shop?category=Foot-Wear" onClick={() => setMenuOpen(false)}>
                <Footprints size={16} />
                <span>Foot-Wear</span>
              </Link>
              <Link to="/shop?category=Bags" onClick={() => setMenuOpen(false)}>
                <Backpack size={16} />
                <span>Bags</span>
              </Link>
              <Link to="/shop?category=Accessories" onClick={() => setMenuOpen(false)}>
                <Watch size={16} />
                <span>Accessories</span>
              </Link>
              <Link to="/bookstore" onClick={() => setMenuOpen(false)}>
                <BookOpen size={16} />
                <span>Book Store</span>
              </Link>
              <Link to="/shop?category=Games" onClick={() => setMenuOpen(false)}>
                <Gamepad2 size={16} />
                <span>Game</span>
              </Link>
              <Link to="/shop?category=Safety" onClick={() => setMenuOpen(false)}>
                <Shield size={16} />
                <span>Safety & Survival</span>
              </Link>
              <Link to="/shop?category=Support" onClick={() => setMenuOpen(false)}>
                <HeartPulse size={16} />
                <span>Support & Recovery</span>
              </Link>
              <Link to="/shop?category=Season" onClick={() => setMenuOpen(false)}>
                <Compass size={16} />
                <span>Shop by SEASON</span>
              </Link>
              <Link to="/shop?category=Brands" onClick={() => setMenuOpen(false)}>
                <Tag size={16} />
                <span>Shop by BRANDS</span>
              </Link>
            </div>
          </div>

          {/* 2. ACTIVITY */}
          <div className={`mobile-menu-accordion-item ${mobileSectionsOpen.activity ? "is-open" : ""}`}>
            <button className="mobile-menu-accordion-head" onClick={() => toggleMobileSection("activity")}>
              <span>ACTIVITY</span>
              {mobileSectionsOpen.activity ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <div className="mobile-menu-accordion-body">
              <Link to="/shop?category=hiking" onClick={() => setMenuOpen(false)}>Trekking</Link>
              <Link to="/events/camping" onClick={() => setMenuOpen(false)}>Camping</Link>
              <Link to="/shop?category=running" onClick={() => setMenuOpen(false)}>Running</Link>
              <Link to="/events/cycling" onClick={() => setMenuOpen(false)}>Cycling</Link>
              <Link to="/shop?category=swimming" onClick={() => setMenuOpen(false)}>Swimming</Link>
              <Link to="/events/climbing" onClick={() => setMenuOpen(false)}>Climbing</Link>
            </div>
          </div>

          {/* 3. GENDER */}
          <div className={`mobile-menu-accordion-item ${mobileSectionsOpen.gender ? "is-open" : ""}`}>
            <button className="mobile-menu-accordion-head" onClick={() => toggleMobileSection("gender")}>
              <span>GENDER</span>
              {mobileSectionsOpen.gender ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <div className="mobile-menu-accordion-body">
              <Link to="/shop?category=men" onClick={() => setMenuOpen(false)}>Men</Link>
              <Link to="/shop?category=women" onClick={() => setMenuOpen(false)}>Women</Link>
              <Link to="/shop?category=unisex" onClick={() => setMenuOpen(false)}>Unisex</Link>
            </div>
          </div>

          {/* 4. SALE */}
          <div className="mobile-menu-direct-link">
            <Link to="/shop" className="sale-link" onClick={() => setMenuOpen(false)}>SALE</Link>
          </div>

          {/* 5. EVENTS */}
          <div className="mobile-menu-direct-link">
            <Link to="/event" onClick={() => setMenuOpen(false)}>Events</Link>
          </div>

          {/* 6. RENTALS */}
          <div className="mobile-menu-direct-link">
            <Link to="/rental" onClick={() => setMenuOpen(false)}>Rentals</Link>
          </div>

          {/* 7. COMMUNITY */}
          <div className={`mobile-menu-accordion-item mobile-menu-community-item ${mobileSectionsOpen.community ? "is-open" : ""}`}>
            <button className="mobile-menu-accordion-head" onClick={() => toggleMobileSection("community")}>
              <span>COMMUNITY</span>
              {mobileSectionsOpen.community ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <div className="mobile-menu-accordion-body">
              <Link to="/blog" onClick={() => setMenuOpen(false)}>Blogs</Link>
              <Link to="/events/himalaya" onClick={() => setMenuOpen(false)}>Himalaya Tours</Link>
              <Link to="/events/sahyadri" onClick={() => setMenuOpen(false)}>Sahyadri Treks</Link>
            </div>
          </div>

          {/* 8. DZIRE */}
          <div className={`mobile-menu-accordion-item ${mobileSectionsOpen.dzire ? "is-open" : ""}`}>
            <button className="mobile-menu-accordion-head" onClick={() => toggleMobileSection("dzire")}>
              <span>DZIRE</span>
              {mobileSectionsOpen.dzire ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <div className="mobile-menu-accordion-body">
              <Link to="/events/travel" onClick={() => setMenuOpen(false)}>Travel Partners</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>Travel Benefits</Link>
            </div>
          </div>

          {/* 9. Prominent SALE Button */}
          <div className="mobile-menu-sale-btn-container">
            <Link to="/shop" className="mobile-menu-sale-btn" onClick={() => setMenuOpen(false)}>
              <span>SALE</span>
              <span className="arrow">&raquo;</span>
            </Link>
          </div>

          {/* 10. ACCOUNT Link (Matching 100% with menu items) */}
          <div className="mobile-menu-direct-link">
            <Link to={user ? "/profile" : "/login?redirectTo=/profile"} onClick={() => setMenuOpen(false)}>ACCOUNT</Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;