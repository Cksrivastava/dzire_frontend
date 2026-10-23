import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import "./EventSection.css";
import { eventAPI } from "../services/api";
import wsClient from "../services/websocket";
import { getSectionSettings, SECTION_SETTINGS_EVENT } from "../services/sectionSettings";

const parseEventDate = (dateStr) => {
  if (!dateStr) return { day: "—", month: "—" };
  const str = String(dateStr).trim();
  const tokens = str.replace(/[,']/g, " ").trim().split(/\s+/);
  const dayToken = tokens.find((t) => /^\d{1,2}$/.test(t));
  const monthToken = tokens.find(
    (t) =>
      /^[a-zA-Z]{3,}/.test(t) &&
      !/^(mon|tue|wed|thu|fri|sat|sun)/i.test(t)
  );

  if (dayToken && monthToken) {
    return {
      day: dayToken.padStart(2, "0"),
      month: monthToken.slice(0, 3).toUpperCase(),
    };
  }

  const parts = str.split(" ");
  return {
    day: parts[1] || parts[0] || "—",
    month: (parts[0] || "—").slice(0, 3).toUpperCase(),
  };
};

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [eventSectionConfig, setEventSectionConfig] = useState(() => getSectionSettings().events);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.events) {
        setEventSectionConfig(e.detail.events);
      } else {
        setEventSectionConfig(getSectionSettings().events);
      }
    };
    window.addEventListener(SECTION_SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(SECTION_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const loadEvents = (skipCache = false) => {
    eventAPI
      .getAll({ skipCache })
      .then((res) => {
        if (Array.isArray(res.events)) {
          const visible = res.events
            .filter((e) => e.visibility !== "in-store" && e.status !== "Cancelled")
            .slice(0, 4);
          setEvents(visible.length > 0 ? visible : res.events.slice(0, 4));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadEvents(false);
    const unsub = wsClient.on("EVENTS_UPDATED", () => loadEvents(true));
    return () => {
      unsub();
    };
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="event-section">
      <div className="event-section-container">
        {/* Section Header */}
        <div className="home-event-section-header">
          {eventSectionConfig.subtitle && (
            <span className="home-event-section-subtitle">{eventSectionConfig.subtitle}</span>
          )}
          <h2 className="home-event-section-title">
            {eventSectionConfig.title || "Join Experiences. Learn. Connect."}
          </h2>
          {eventSectionConfig.description && (
            <p className="home-event-section-description">
              {eventSectionConfig.description}
            </p>
          )}
        </div>

        {/* Event Grid */}
        <div className="home-event-grid">
          {events.map((event) => {
            const { day, month } = parseEventDate(event.date);
            const eventId = event.id || event._id;
            const priceText = event.isFree
              ? "Free"
              : String(event.price || "").startsWith("₹")
              ? event.price
              : event.price
              ? `₹${event.price}`
              : "Free";

            const eventSlug = event.slug || (event.title ? event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : (event.id || event._id));

            return (
              <Link
                key={eventId}
                to={`/event/${eventSlug}`}
                className="home-event-card"
                style={{ backgroundImage: `url(${event.image})` }}
              >
                <div className="home-event-card-overlay"></div>

                <div className="home-event-card-top">
                  <span className="home-event-card-badge">
                    {event.category || event.type || "EVENT"}
                  </span>
                  <div className="event-card-date-badge">
                    <span className="event-day">{day}</span>
                    <span className="event-month">{month}</span>
                  </div>
                </div>

                <div className="home-event-card-bottom">
                  <div className="home-event-meta-row">
                    <div className="home-event-detail-item">
                      <FaMapMarkerAlt className="event-icon" />
                      <span>{event.location || "Online"}</span>
                    </div>
                    {event.time && (
                      <div className="home-event-detail-item">
                        <FaRegClock className="event-icon" />
                        <span>{event.time}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="home-event-card-title">{event.title}</h3>

                  <div className="home-event-card-price">
                    <span>{priceText}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="event-view-all">
          <Link to="/event" className="view-all-events-btn">
            VIEW ALL EVENTS <span className="btn-arrow">&raquo;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventSection;
