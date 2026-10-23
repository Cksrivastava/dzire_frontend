import React, { useMemo, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShopContext } from "../context/ShopContext";

import {
  rentalProducts,
  categoryList,
} from "../data/rentalCatalogData";
import RentalBanner from "../components/rental/RentalBanner";
import RentalFilterBar from "../components/rental/RentalFilterBar";
import RentalCard from "../components/rental/RentalCard";

import "./Rental.css";
import { rentalAPI } from "../services/api";
import { getBannerSettings, BANNER_SETTINGS_EVENT } from "../services/bannerSettings";

export { rentalProducts, categoryList };

const Rental = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useContext(ShopContext);

  const [rentalsList, setRentalsList] = useState(() => {
    try {
      const stored = localStorage.getItem("dzire_admin_rentals_list");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) { }
    return rentalProducts || [];
  });
  const [activeCategory, setActiveCategory] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const [rentalConfig, setRentalConfig] = useState(() => getBannerSettings().rental);

  useEffect(() => {
    const handleBannerUpdate = (e) => {
      if (e.detail?.rental) {
        setRentalConfig(e.detail.rental);
      } else {
        setRentalConfig(getBannerSettings().rental);
      }
    };
    window.addEventListener(BANNER_SETTINGS_EVENT, handleBannerUpdate);
    window.addEventListener("storage", handleBannerUpdate);
    return () => {
      window.removeEventListener(BANNER_SETTINGS_EVENT, handleBannerUpdate);
      window.removeEventListener("storage", handleBannerUpdate);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadRentals = () => {
      try {
        const stored = localStorage.getItem("dzire_admin_rentals_list");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRentalsList(parsed);
            return;
          }
        }
      } catch (_) { }

      rentalAPI.getAll()
        .then((res) => {
          if (mounted && Array.isArray(res?.rentals) && res.rentals.length > 0) {
            setRentalsList(res.rentals);
          } else {
            setRentalsList(rentalProducts);
          }
        })
        .catch(() => {
          if (mounted) setRentalsList(rentalProducts);
        });
    };

    loadRentals();
    const handleRentalsUpdate = (e) => {
      if (Array.isArray(e.detail)) {
        setRentalsList(e.detail);
      } else {
        loadRentals();
      }
    };

    window.addEventListener("dzire_rentals_updated", handleRentalsUpdate);
    window.addEventListener("storage", handleRentalsUpdate);
    return () => {
      mounted = false;
      window.removeEventListener("dzire_rentals_updated", handleRentalsUpdate);
      window.removeEventListener("storage", handleRentalsUpdate);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") {
      return rentalsList;
    }
    return rentalsList.filter((p) => p.category === activeCategory);
  }, [activeCategory, rentalsList]);

  const handleCardClick = (item) => {
    navigate(`/rental-product/${item.id}`);
  };

  const handleWishlistToggle = (e, item) => {
    e.stopPropagation();
    toggleWishlist(item);
    const wishlisted = isWishlisted(item.id);
    showToast(
      wishlisted
        ? `Removed "${item.name}" from Wishlist`
        : `Added "${item.name}" to Wishlist!`
    );
  };

  return (
    <>
      <Navbar />

      <div className="rental-page">
        {/* Banner + Overlay Buttons */}
        <RentalBanner />

        <div className="main">
          {/* Top Filter Bar with Icon & Categories */}
          <RentalFilterBar
            categoryList={categoryList}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <div className="products">
            <div className="header">
              <h1>{rentalConfig?.belowBannerHeading || "Check out our premium"}</h1>
              <span className="rental-count-tag">{filteredProducts.length} items</span>
            </div>
            {rentalConfig?.belowBannerSubtitle && (
              <p
                style={{
                  color: "#64748b",
                  margin: "4px 0 16px 0",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {rentalConfig.belowBannerSubtitle}
              </p>
            )}

            {/* Rental Product Cards Grid */}
            <div className="rental-grid">
              {filteredProducts.map((item) => (
                <RentalCard
                  key={item.id}
                  item={item}
                  isWishlisted={isWishlisted}
                  onCardClick={handleCardClick}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="rental-toast">
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Rental;