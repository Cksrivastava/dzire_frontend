import React from "react";

const EventDetailOverview = ({ event }) => {
  return (
    <div className="event-section-block">
      <h2 className="section-block-heading">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#FF6600" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Overview</span>
      </h2>
      {event.description && /<[a-z][\s\S]*>/i.test(event.description) ? (
        <div
          className="section-block-text event-rich-description-render"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      ) : (
        <p className="section-block-text" style={{ whiteSpace: "pre-line" }}>
          {event.description ||
            "This workshop is designed for trekkers of all levels who want to make informed decisions about navigation in the mountains. Learn map reading, compass techniques, GPS basics, and route planning to stay safe and confident on every trek."}
        </p>
      )}
    </div>
  );
};

export default EventDetailOverview;
