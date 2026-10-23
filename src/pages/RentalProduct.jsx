import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Product.css";
import "./RentalProduct.css";

import { rentalProductsDatabase } from "../data/rentalProductsData";
import RentalBreadcrumbs from "../components/rental-detail/RentalBreadcrumbs";
import RentalGallery from "../components/rental-detail/RentalGallery";
import RentalFeatureBadges from "../components/rental-detail/RentalFeatureBadges";
import RentalTabs from "../components/rental-detail/RentalTabs";
import RentalFBT from "../components/rental-detail/RentalFBT";
import RentalRightPanel from "../components/rental-detail/RentalRightPanel";
import RentalStickyBar from "../components/rental-detail/RentalStickyBar";
import RentalImageZoomModal from "../components/rental-detail/RentalImageZoomModal";
import { rentalAPI } from "../services/api";

export { rentalProductsDatabase };

const RentalProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const actionsRef = useRef(null);
  const mobileSliderRef = useRef(null);

  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [quantity, setQuantity] = useState(1);
  const [zoomImageIndex, setZoomImageIndex] = useState(-1);
  const [selectedColor, setSelectedColor] = useState("RED / WHITE");
  const [selectedSize, setSelectedSize] = useState("M");
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Date range state for Rental
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const defaultToDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  }, []);

  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(defaultToDateStr);

  const fromDateInputRef = useRef(null);
  const toDateInputRef = useRef(null);

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const rentalDays = useMemo(() => {
    if (!fromDate || !toDate) return 1;
    const diffTime = new Date(toDate) - new Date(fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [fromDate, toDate]);

  const {
    addToCart,
    toggleWishlist,
    wishlistItems = [],
    toggleCompare,
    compareItems = [],
  } = useContext(ShopContext);

  const [remoteProduct, setRemoteProduct] = useState(null);

  useEffect(() => {
    let mounted = true;
    rentalAPI.getById(id)
      .then((res) => {
        if (mounted && res.rental) {
          setRemoteProduct(res.rental);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [id]);

  const product = useMemo(() => {
    if (remoteProduct) return remoteProduct;
    try {
      const stored = localStorage.getItem("dzire_admin_rentals_list");
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          const match = list.find((item) => String(item.id) === String(id));
          if (match) return match;
        }
      }
    } catch (_) {}
    return (
      rentalProductsDatabase.find((item) => String(item.id) === String(id)) ||
      rentalProductsDatabase[0]
    );
  }, [id, remoteProduct]);

  const allProductImages = useMemo(() => {
    return product.images && product.images.length > 0
      ? product.images
      : [product.image];
  }, [product]);

  const colors = [
    { name: "RED / WHITE", color: "#d32f2f" },
    { name: "BLACK / WHITE", color: "#111" },
    { name: "GREY / WHITE", color: "#757575" },
    { name: "GREEN / WHITE", color: "#2e7d32" },
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const isWishlisted = product
    ? wishlistItems.some((item) => String(item.id) === String(product.id))
    : false;

  const isCompared = product
    ? compareItems.some((item) => String(item.id) === String(product.id))
    : false;

  useEffect(() => {
    const updateHeaderNavHeight = () => {
      const nav =
        document.querySelector(".header-wrapper") ||
        document.querySelector(".navbar");
      if (nav) {
        document.documentElement.style.setProperty(
          "--header-nav-height",
          `${nav.offsetHeight}px`
        );
      }
    };
    updateHeaderNavHeight();
    window.addEventListener("resize", updateHeaderNavHeight);
    return () => window.removeEventListener("resize", updateHeaderNavHeight);
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

  const handleMobileSliderScroll = () => {
    if (!mobileSliderRef.current) return;
    const scrollLeft = mobileSliderRef.current.scrollLeft;
    const width = mobileSliderRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveThumb(index);
  };

  const handleMobileThumbClick = (index) => {
    setActiveThumb(index);
    if (mobileSliderRef.current) {
      const width = mobileSliderRef.current.offsetWidth;
      mobileSliderRef.current.scrollTo({
        left: index * width,
        behavior: "smooth",
      });
    }
  };

  const handleEnquireClick = () => {
    navigate("/rental-booking", {
      state: {
        productName: product.name,
        costing: `₹${product.price}/day`,
        size: selectedSize,
        color: selectedColor,
        quantity,
        fromDate,
        toDate,
        rentalDays,
        product,
        totalPrice: product.price * quantity * rentalDays,
      },
    });
  };

  // Frequently Bought Together data
  const fbtItem1 = rentalProductsDatabase[1] || product;
  const fbtItem2 = rentalProductsDatabase[2] || product;
  const fbtTotalPrice =
    (product.price + (fbtItem1?.price || 0) + (fbtItem2?.price || 0)) * quantity;
  const fbtTotalMRP =
    ((product.oldPrice || product.price) +
      (fbtItem1?.oldPrice || fbtItem1?.price || 0) +
      (fbtItem2?.oldPrice || fbtItem2?.price || 0)) *
    quantity;
  const fbtSavings = fbtTotalMRP - fbtTotalPrice;
  const fbtDiscountPercent =
    fbtTotalMRP > 0 ? Math.round((fbtSavings / fbtTotalMRP) * 100) : 0;

  const handleFbtAddBundleToCart = () => {
    navigate("/rental-booking", {
      state: {
        productName: `${product.name} + Bundle`,
        costing: `₹${fbtTotalPrice}/day`,
        size: selectedSize,
        color: selectedColor,
        quantity,
        product,
        totalPrice: fbtTotalPrice,
      },
    });
  };

  const handleTabClick = (e, key) => {
    setActiveTab(key);
    const btn = e.currentTarget;
    const container = btn.parentElement;
    if (container) {
      const btnLeft = btn.offsetLeft;
      container.scrollTo({
        left: Math.max(0, btnLeft - 16),
        behavior: "smooth",
      });
    }

    const tabsBar = document.querySelector(".product-section-tabs-bar");
    if (tabsBar) {
      const nav =
        document.querySelector(".header-wrapper") ||
        document.querySelector(".navbar");
      const offset = nav
        ? nav.offsetHeight
        : window.innerWidth <= 480
        ? 116
        : 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = tabsBar.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleFromDateChange = (val) => {
    setFromDate(val);
    if (new Date(val) >= new Date(toDate)) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 2);
      setToDate(nextDay.toISOString().split("T")[0]);
    }
  };

  return (
    <div className="product-page-layout-wrapper">
      <Navbar />

      <div className="product-page wildcraft-page">
        <RentalBreadcrumbs category={product.category} name={product.name} />

        {/* Main Sticky Grid Layout */}
        <div className="product-sticky-layout wildcraft-grid">
          {/* Left Column */}
          <div className="product-left-column">
            <RentalGallery
              allProductImages={allProductImages}
              product={product}
              activeThumb={activeThumb}
              mobileSliderRef={mobileSliderRef}
              onThumbClick={setActiveThumb}
              onMobileSliderScroll={handleMobileSliderScroll}
              onMobileThumbClick={handleMobileThumbClick}
              onZoomClick={(index) => setZoomImageIndex(index)}
            />

            <RentalFeatureBadges />

            <RentalTabs
              product={product}
              allProductImages={allProductImages}
              activeTab={activeTab}
              onTabClick={handleTabClick}
            />

            <RentalFBT
              product={product}
              allProductImages={allProductImages}
              fbtItem1={fbtItem1}
              fbtItem2={fbtItem2}
              fbtTotalPrice={fbtTotalPrice}
              fbtTotalMRP={fbtTotalMRP}
              fbtSavings={fbtSavings}
              fbtDiscountPercent={fbtDiscountPercent}
              onAddBundle={handleFbtAddBundleToCart}
            />
          </div>

          {/* Right Sticky Buy Box Sidebar */}
          <RentalRightPanel
            product={product}
            colors={colors}
            sizes={sizes}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            quantity={quantity}
            rentalDays={rentalDays}
            fromDate={fromDate}
            toDate={toDate}
            todayStr={todayStr}
            actionsRef={actionsRef}
            fromDateInputRef={fromDateInputRef}
            toDateInputRef={toDateInputRef}
            isWishlisted={isWishlisted}
            isCompared={isCompared}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
            onQuantityChange={setQuantity}
            onFromDateChange={handleFromDateChange}
            onToDateChange={setToDate}
            onEnquire={handleEnquireClick}
            onToggleWishlist={() => toggleWishlist(product)}
            onToggleCompare={() => toggleCompare(product)}
            formatDateForDisplay={formatDateForDisplay}
          />
        </div>
      </div>

      {/* Fullscreen Image Zoom Modal */}
      <RentalImageZoomModal
        zoomImageIndex={zoomImageIndex}
        images={allProductImages}
        onClose={() => setZoomImageIndex(-1)}
      />

      {/* Sticky Bottom Bar */}
      <RentalStickyBar
        show={showStickyBar}
        product={product}
        image={allProductImages[0]}
        onEnquire={handleEnquireClick}
      />

      <Footer />
    </div>
  );
};

export default RentalProduct;