import React from "react";
import { ChevronDown } from "./EventDetailHeader";

const EventDetailAccordions = ({
  event,
  detailsOpen,
  setDetailsOpen,
  learnOpen,
  setLearnOpen,
}) => {
  return (
    <>
      {/* Accordion 1: Details */}
      <div className="event-accordion-card">
        <div className="accordion-header" onClick={() => setDetailsOpen(!detailsOpen)}>
          <div className="accordion-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            <span>Details</span>
          </div>
          <ChevronDown open={detailsOpen} />
        </div>

        {detailsOpen && (
          <div className="accordion-body">
            <div className="details-metrics-grid">
              <div className="metric-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <div className="metric-info">
                  <span className="metric-label">Duration</span>
                  <span className="metric-val">2 Hours</span>
                </div>
              </div>

              <div className="metric-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <div className="metric-info">
                  <span className="metric-label">Mode</span>
                  <span className="metric-val">{event.location?.includes("Online") ? "Online (Live)" : "In-Person"}</span>
                </div>
              </div>

              <div className="metric-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
                <div className="metric-info">
                  <span className="metric-label">Level</span>
                  <span className="metric-val">Beginner Friendly</span>
                </div>
              </div>

              <div className="metric-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                <div className="metric-info">
                  <span className="metric-label">Language</span>
                  <span className="metric-val">English</span>
                </div>
              </div>

              <div className="metric-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <div className="metric-info">
                  <span className="metric-label">Group Size</span>
                  <span className="metric-val">{event.groupSize || "50 People"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: What you'll learn */}
      <div className="event-accordion-card">
        <div className="accordion-header" onClick={() => setLearnOpen(!learnOpen)}>
          <div className="accordion-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
            <span>What you'll learn</span>
          </div>
          <ChevronDown open={learnOpen} />
        </div>

        {learnOpen && (
          <div className="accordion-body">
            <ul className="learn-list">
              <li>Topographic map reading and contour line interpretation</li>
              <li>Magnetic compass alignment & taking bearings in dense fog</li>
              <li>GPS handheld & mobile offline route mapping</li>
              <li>High-altitude wilderness safety and emergency exit protocols</li>
            </ul>
          </div>
        )}
      </div>

      {/* Accordion 3: Venue */}
      <div className="event-accordion-card venue-card">
        <div className="accordion-header">
          <div className="accordion-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <span>Venue</span>
          </div>
        </div>

        <div className="accordion-body">
          <div className="venue-grid">
            <div className="venue-map-img">
              <img src={event.mapImage || "https://images.unsplash.com/photo-1577086664693-894d8405334a?auto=format&fit=crop&w=600&q=80"} alt="Venue Map" />
            </div>

            <div className="venue-info">
              <h4 className="venue-name">{event.location || "Dzire Experience Studio"}</h4>
              <p className="venue-address">{event.address || "123 Adventure Street, Koramangala, Bengaluru, Karnataka 560034"}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="google-maps-link"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailAccordions;
