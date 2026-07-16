import React, { useEffect, useState } from "react";
import "./Bannerfooter.css";

const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=80",
  },
];

const Bannerfooter = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  // ✅ AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bannerfooter-section">
      <div className="bannerfooter-slider">
        <div
          className="bannerfooter-track"
          style={{
            transform: `translateX(-${currentBanner * 100}%)`,
          }}
        >
          {banners.map((banner) => (
            <div
              className="bannerfooter-slide"
              key={banner.id}
            >
              <img
                src={banner.image}
                alt="banner"
                className="bannerfooter-image"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bannerfooter-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`dot ${currentBanner === index ? "active" : ""}`}
            onClick={() => setCurrentBanner(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Bannerfooter;