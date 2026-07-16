import React, { useState, useEffect } from "react";
import "./Hero.css";
import image1 from "../assets/image.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";

const Hero = () => {
  const images = [image1, image2, image3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="hero-slider-container">
      <div
        className="hero-slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div className="hero-slide" key={index}>
            <img src={img} alt={`Sports banner ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {images.map((_, index) => (
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