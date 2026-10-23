import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Star, Compass } from "lucide-react";
import { relatedAdventures } from "../../data/booksData";

const BookRelatedAdventures = () => {
  const navigate = useNavigate();

  return (
    <section className="related-adventures-section">
      <div className="section-header-flex">
        <h2>Related Adventures</h2>
        <Link to="/event" className="view-all-link">
          <span>View All Adventures</span>
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="adventures-grid">
        {relatedAdventures.map((adv) => (
          <div
            key={adv.id}
            className="adventure-card product-card-style"
            onClick={() => navigate("/event")}
          >
            <div className="adv-img-box square-img-box">
              {adv.badge && <span className="product-card-badge">{adv.badge}</span>}
              <img src={adv.image} alt={adv.title} />
            </div>
            <div className="adv-info">
              <div className="adv-category-row">
                <span className="adv-location-tag">{adv.location}</span>
                <span className="adv-duration-tag">• {adv.duration}</span>
              </div>
              <h3 className="adv-title">{adv.title}</h3>
              <div className="adv-rating-row">
                <span className="rating-score">{adv.rating}</span>
                <div
                  className="stars-flex-mini"
                  style={{ display: "flex", gap: "2px", alignItems: "center" }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      fill={i < 4 ? "#ffa41c" : "transparent"}
                      color={i < 4 ? "#ffa41c" : "#cbd5e1"}
                    />
                  ))}
                </div>
                <span className="reviews-count">({adv.reviews})</span>
              </div>
              <div className="adv-price-row">
                <div className="price-flex">
                  {adv.originalPrice && (
                    <span className="adv-old-price">{adv.originalPrice}</span>
                  )}
                  <span className="adv-price">{adv.price}</span>
                </div>
                <button className="adv-action-btn" aria-label="Explore adventure">
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div
          className="adventure-card view-all-card product-card-style"
          onClick={() => navigate("/event")}
        >
          <div className="view-all-content">
            <div className="view-all-circle">
              <Compass size={30} className="compass-icon" />
            </div>
            <h4>Explore All</h4>
            <p>12+ Adventures</p>
            <div className="view-all-btn-link">
              <span>View All</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookRelatedAdventures;
