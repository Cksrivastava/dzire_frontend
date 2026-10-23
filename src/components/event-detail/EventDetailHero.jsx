import React from "react";

const EventDetailHero = ({ event, onBack }) => {
  return (
    <>
      {/* Back Button */}
      <button type="button" className="event-back-btn" onClick={onBack}>
        ← Back to Events
      </button>

      {/* Hero Banner Image */}
      <div className="event-hero-banner">
        <img src={event.image} alt={event.title} />
      </div>
    </>
  );
};

export default EventDetailHero;
