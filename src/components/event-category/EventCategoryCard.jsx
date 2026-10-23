import React from "react";
import { Link } from "react-router-dom";

const EventCategoryCard = ({ event }) => {
  const typeLower = (event?.type || event?.category || "WORKSHOP").toLowerCase();
  let icon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></svg>
  );

  if (typeLower.includes("adventure") || typeLower.includes("trek")) {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M8 3l4 8 5-5 5 15H2L8 3z" /></svg>
    );
  } else if (typeLower.includes("photo") || typeLower.includes("camera")) {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
    );
  } else if (typeLower.includes("first aid") || typeLower.includes("medical") || typeLower.includes("health")) {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
    );
  }

  const formattedPrice =
    event.isFree || String(event.price).toLowerCase() === "free"
      ? "Free"
      : String(event.price).startsWith("₹")
      ? event.price
      : `₹${event.price}`;

  return (
    <Link to={`/event/${event.slug || event.id}`} className="event-card-link">
      <div className="event-card">
        {/* Image with badge overlay */}
        <div className="event-image-wrap">
          <img src={event.image} alt={event.title} />
          <div className="event-type-badge">
            <span className="event-badge-icon">{icon}</span>
            <span>{(event.type || event.category || "WORKSHOP").toUpperCase()}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="event-card-body">
          <h3 className="event-title">{event.title}</h3>

          <div className="event-schedule-group">
            <div className="event-date-row">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              <span>{event.date}</span>
            </div>

            {event.time && (
              <div className="event-date-row event-time-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span>{event.time}</span>
              </div>
            )}
          </div>

          <div className="event-price-action-row">
            <span className="event-price">{formattedPrice}</span>
            <span className="event-view-btn">
              VIEW DETAILS
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </span>
          </div>

          <div className="event-more-dates-box">
            <div className="event-more-dates-left">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              <span>Multiple Dates Available</span>
            </div>
            <span className="event-check-dates-btn">
              CHECK DATES
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCategoryCard;
