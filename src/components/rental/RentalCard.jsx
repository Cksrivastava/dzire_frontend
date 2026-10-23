import React from "react";
import { Heart } from "lucide-react";
import { getItemMetaIcon } from "./RentalIcons";

const RentalCard = ({
  item,
  isWishlisted,
  onCardClick,
  onWishlistToggle,
}) => {
  const wishlisted = isWishlisted(item.id);

  return (
    <div
      className="rental-card"
      onClick={() => onCardClick(item)}
      role="button"
      tabIndex={0}
    >
      {/* Top Flush Image Box */}
      <div className="rental-img-box">
        {item.badge && (
          <span className="rental-badge-top">{item.badge}</span>
        )}

        <button
          className={`rental-wishlist-btn ${wishlisted ? "active" : ""}`}
          onClick={(e) => onWishlistToggle(e, item)}
          type="button"
          aria-label="Toggle Wishlist"
        >
          <Heart
            size={15}
            fill={wishlisted ? "#ff3333" : "transparent"}
            color={wishlisted ? "#ff3333" : "#0f172a"}
          />
        </button>

        <img
          src={item.image}
          alt={item.name}
          className="rental-main-img"
        />
      </div>

      {/* Card Content Info */}
      <div className="rental-info-box">
        <h3 className="rental-card-title">{item.name}</h3>

        {/* Capacity & Available Meta Row */}
        <div className="rental-meta-flex-row">
          <div className="rental-meta-row">
            {getItemMetaIcon(item.category)}
            <span>{item.capacity || "Standard Fit"}</span>
          </div>
          <div className="rental-status-tag">
            <span>{item.status || "Available"}</span>
          </div>
        </div>

        {/* Price Line */}
        <div className="rental-price-line">
          <span className="rental-price">₹{item.price}</span>
          <span className="rental-per-day">/ day</span>
        </div>

        {/* Full Width Orange View Details Button */}
        <button className="rental-view-details-btn" type="button">
          View Details
        </button>
      </div>
    </div>
  );
};

export default RentalCard;
