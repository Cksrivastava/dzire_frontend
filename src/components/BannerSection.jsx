import React, { useEffect, useRef, useState } from "react";
import "./BannerSection.css";
import { offerAPI } from "../services/api";
import { getBannerSettings, BANNER_SETTINGS_EVENT } from "../services/bannerSettings";

const defaultBanners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80",
    title: "Running Shoes Collection",
    subtitle: "Lightweight shoes for road, gym and daily training",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80",
    title: "Sports Bags & Backpacks",
    subtitle: "Carry your essentials with stylish and durable bags",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    title: "Travel & Adventure Gear",
    subtitle: "Perfect items for outdoor trips and weekend travel",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80",
    title: "Sportswear Essentials",
    subtitle: "Comfortable outfits for workout, running and training",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80",
    title: "Fitness Accessories",
    subtitle: "Shop daily-use accessories for active lifestyle",
  },
];

const BannerSection = () => {
  const [banners, setBanners] = useState(() => {
    const homeConfig = getBannerSettings().home;
    if (homeConfig && (homeConfig.image || homeConfig.title)) {
      return [{
        id: 1,
        image: homeConfig.image || defaultBanners[0].image,
        title: homeConfig.title || defaultBanners[0].title,
        subtitle: homeConfig.subtitle || defaultBanners[0].subtitle,
      }];
    }
    const saved = getBannerSettings().homeExplore?.banners;
    return Array.isArray(saved) && saved.length > 0 ? saved : defaultBanners;
  });
  const [currentBanner, setCurrentBanner] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    const handleUpdate = (e) => {
      const homeConfig = e.detail?.home || getBannerSettings().home;
      if (homeConfig && (homeConfig.image || homeConfig.title)) {
        setBanners([{
          id: 1,
          image: homeConfig.image || defaultBanners[0].image,
          title: homeConfig.title || defaultBanners[0].title,
          subtitle: homeConfig.subtitle || defaultBanners[0].subtitle,
        }]);
        return;
      }
      const updated = e.detail?.homeExplore?.banners || getBannerSettings().homeExplore?.banners;
      if (Array.isArray(updated) && updated.length > 0) {
        setBanners(updated);
      }
    };
    window.addEventListener(BANNER_SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(BANNER_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const customBanners = getBannerSettings().homeExplore?.banners;
    const hasCustom = localStorage.getItem("dzire_page_banners_settings");

    if (!hasCustom) {
      offerAPI
        .getAll()
        .then((res) => {
          if (mounted && res && res.success && Array.isArray(res.offers)) {
            const activeOffers = res.offers.filter((o) => o.status !== "Inactive");
            if (activeOffers.length > 0) {
              const mapped = activeOffers.map((o, idx) => ({
                id: o.id || o._id || idx,
                image: o.bannerImage || o.image || defaultBanners[idx % defaultBanners.length].image,
                title: o.title || o.name || "Special Offer",
                subtitle: o.description || o.subtitle || (o.code ? `Use coupon code: ${o.code}` : "Exclusive limited-time discount at Dzire Store"),
              }));
              setBanners(mapped);
            }
          }
        })
        .catch(() => {});
    }

    return () => {
      mounted = false;
    };
  }, []);

  const goToPrev = () => {
    setCurrentBanner((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentBanner((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const swipeDistance = touchStartX.current - event.changedTouches[0].clientX;

    if (Math.abs(swipeDistance) > 40) {
      swipeDistance > 0 ? goToNext() : goToPrev();
    }

    touchStartX.current = null;
  };

  return (
    <section className="banner-section">
      <div
        className="banner-slider"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="banner-track"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <div className="banner-slide" key={banner.id}>
              <img
                src={banner.image}
                alt={banner.title}
                className="banner-image"
              />
              <div className="banner-overlay">
                <h2>{banner.title}</h2>
                <p>{banner.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="banner-dots">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentBanner === index ? "active" : ""}`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
