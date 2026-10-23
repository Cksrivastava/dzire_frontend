import React, { useState, useEffect } from "react";
import "./Hero.css";
import image1 from "../assets/image.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import { offerAPI } from "../services/api";

const defaultImages = [image1, image2, image3];

const Hero = () => {
  const [slides, setSlides] = useState(defaultImages);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    offerAPI
      .getAll()
      .then((res) => {
        if (mounted && res && Array.isArray(res.offers)) {
          const bannerImages = res.offers
            .filter((o) => o.status === "Active" && (o.bannerImage || o.image))
            .map((o) => o.bannerImage || o.image);
          if (bannerImages.length > 0) {
            setSlides(bannerImages);
          }
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="hero-slider-container">
      <div
        className="hero-slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((img, index) => (
          <div className="hero-slide" key={index}>
            <img src={img} alt={`Sports banner ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;