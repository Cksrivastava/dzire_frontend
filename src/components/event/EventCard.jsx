import React from "react";
import { Tag, Heart, Calendar, Clock, ArrowRight } from "lucide-react";

const EventCard = ({ event, isWishlisted, onToggleWishlist, onClick }) => {
  const formattedPrice =
    event.isFree || String(event.price).toLowerCase() === "free"
      ? "Free"
      : String(event.price).startsWith("₹")
      ? event.price
      : `₹${event.price}`;

  const eventBadge =
    event.badge ||
    event.category ||
    event.type ||
    "WORKSHOP";

  return (
    <div className="event-card-item" onClick={onClick}>
      {/* Card Image Box */}
      <div className="event-card-image-wrap">
        <img src={event.image} alt={event.title} className="event-card-img" />
        <span className="event-card-badge-pill">
          <Tag size={13} className="badge-icon-svg" />
          <span>{String(eventBadge).toUpperCase()}</span>
        </span>
        <button
          className={`event-wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={(e) => onToggleWishlist(event.id || event._id, e)}
          title="Add to Wishlist"
        >
          <Heart
            size={18}
            fill={isWishlisted ? "#ff3333" : "none"}
            color={isWishlisted ? "#ff3333" : "#ffffff"}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Card Info Details */}
      <div className="event-card-details">
        <h3 className="event-card-title">{event.title}</h3>

        <div className="event-schedule-group">
          <div className="event-meta-schedule-row event-date-row">
            <Calendar size={15} className="meta-schedule-icon" />
            <span>{event.date}</span>
          </div>
          {event.time && (
            <div className="event-meta-schedule-row event-time-row">
              <Clock size={15} className="meta-schedule-icon" />
              <span>{event.time}</span>
            </div>
          )}
        </div>

        <div className="event-price-action-flex">
          <span className="event-price-val">{formattedPrice}</span>
          <button className="event-btn-orange">
            <span>VIEW DETAILS</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="event-dates-footer-pill">
          <div className="dates-footer-left">
            <Calendar size={14} className="dates-icon" />
            <span>
              {event.moreDates && event.moreDates.length > 0
                ? `${event.moreDates.length + 1} Dates Available`
                : "Multiple Dates Available"}
            </span>
          </div>
          <span className="dates-footer-right">
            CHECK DATES <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
