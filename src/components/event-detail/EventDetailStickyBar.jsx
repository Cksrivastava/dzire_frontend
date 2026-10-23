import React from "react";
import { ArrowIcon } from "./EventDetailBookingCard";

const EventDetailStickyBar = ({
  event,
  showStickyBar,
  onRegister,
}) => {
  return (
    <div className={`dzire-sticky-bottom-bar ${showStickyBar ? "visible" : ""}`}>
      <div className="dzire-sticky-bar-inner">
        <div className="dzire-sticky-bar-left">
          <img
            src={event.heroImage || event.image}
            alt={event.title}
            className="dzire-sticky-bar-thumb"
          />
          <div className="dzire-sticky-bar-meta">
            <span className="dzire-sticky-bar-name">{event.title}</span>
            <div className="dzire-sticky-bar-price-wrapper">
              <span className="dzire-sticky-bar-price">{event.price}</span>
              <span className="dzire-sticky-bar-subtext">Per Person</span>
            </div>
          </div>
        </div>

        <div className="dzire-sticky-bar-right">
          <button
            type="button"
            className="dzire-sticky-btn dzire-sticky-cart-btn"
            onClick={onRegister}
          >
            <span>REGISTER NOW</span>
            <ArrowIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailStickyBar;
