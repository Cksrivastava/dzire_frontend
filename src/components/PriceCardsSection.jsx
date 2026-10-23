import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import "./PriceCardsSection.css";
import { getSectionSettings, SECTION_SETTINGS_EVENT } from "../services/sectionSettings";

const PriceCardsSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [budgetConfig, setBudgetConfig] = useState(() => getSectionSettings().budget);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.budget) {
        setBudgetConfig(e.detail.budget);
      } else {
        setBudgetConfig(getSectionSettings().budget);
      }
    };
    window.addEventListener(SECTION_SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(SECTION_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const {
    badge = "BUDGET FRIENDLY",
    titleLine1 = "Gear for",
    titleLine2 = "Every Budget!",
    subtitle = "Quality products at prices that don't break the bank.",
    cards = [],
  } = budgetConfig || {};

  const handleShopPrice = (priceStr) => {
    const num = String(priceStr).replace(/[^0-9]/g, "");
    navigate(`/shop?maxPrice=${num}`);
  };

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
          {badge && (
            <div className="budget-friendly-badge">
              <Tag size={13} className="tag-icon" />
              <span>{badge}</span>
            </div>
          )}
          <h2>
            {titleLine1 || "Gear for"} <br />
            <span className="budget-highlight-text">{titleLine2 || "Every Budget!"}</span>
          </h2>
          {subtitle && (
            <p className="price-cards-subtitle">
              {subtitle}
            </p>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="price-cards-divider"></div>

        {/* Right Side: Grid of Cards */}
        <div className={`price-cards-grid ${isVisible ? "animate-cards" : ""}`}>
          {(cards || []).map((item) => (
            <div 
              className="budget-price-card" 
              key={item.id}
              onClick={() => handleShopPrice(item.price)}
              style={{ cursor: "pointer" }}
            >
              <div className="budget-card-content">
                <div className="budget-badge-pill">{item.badge}</div>
                
                <div className="budget-card-title">{item.title}</div>
                <div className="budget-card-below">BELOW</div>

                <div className="budget-price-container">
                  <span className="budget-currency-symbol">₹</span>
                  <span className="budget-price-value">{item.price}</span>
                </div>

                <button 
                  className="budget-action-btn btn-outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShopPrice(item.price);
                  }}
                >
                  <span>{item.btnText || "SHOP NOW"}</span>
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