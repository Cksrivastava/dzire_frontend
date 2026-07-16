import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Tag } from "lucide-react";
import "./PriceCardsSection.css";

const priceCards = [
  {
    id: 1,
    badge: "BEST VALUE",
    title: "STARTER PICKS",
    price: "499",
    isTrending: false,
  },
  {
    id: 2,
    badge: "TRENDING",
    title: "POPULAR GEAR",
    price: "999",
    isTrending: true,
  },
  {
    id: 3,
    badge: "TOP RATED",
    title: "PRO ESSENTIALS",
    price: "1,499",
    isTrending: false,
  },
  {
    id: 4,
    badge: "EDITOR'S CHOICE",
    title: "PREMIUM RANGE",
    price: "1,999",
    isTrending: false,
  },
];

const PriceCardsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="price-cards-section" ref={sectionRef}>
      <div className="price-cards-container">
        
        {/* Left Side: Header info */}
        <div className="price-cards-left">
          <div className="budget-friendly-badge">
            <Tag size={13} className="tag-icon" />
            <span>BUDGET FRIENDLY</span>
          </div>
          <h2>
            Gear for <br />
            <span className="budget-highlight-text">Every Budget!</span>
          </h2>
          <p className="price-cards-subtitle">
            Quality products at prices that don't break the bank.
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="price-cards-divider"></div>

        {/* Right Side: Grid of 4 Cards */}
        <div className={`price-cards-grid ${isVisible ? "animate-cards" : ""}`}>
          {priceCards.map((item) => (
            <div 
              className="budget-price-card" 
              key={item.id}
            >
              <div className="budget-card-content">
                <div className="budget-badge-pill">{item.badge}</div>
                
                <div className="budget-card-title">{item.title}</div>
                <div className="budget-card-below">BELOW</div>

                <div className="budget-price-container">
                  <span className="budget-currency-symbol">₹</span>
                  <span className="budget-price-value">{item.price}</span>
                </div>

                <button className="budget-action-btn btn-outline">
                  <span>SHOP NOW</span>
                  <ArrowRight size={15} className="btn-arrow-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PriceCardsSection;