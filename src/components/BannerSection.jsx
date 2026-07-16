import React, { useEffect, useRef, useState } from "react";
import "./BannerSection.css";

const banners = [
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
  const [currentBanner, setCurrentBanner] = useState(0);
  const touchStartX = useRef(null);

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
    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
