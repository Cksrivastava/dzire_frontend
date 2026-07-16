import React from "react";
import { Link } from "react-router-dom";
import { FaRegCalendar, FaMapMarkerAlt } from "react-icons/fa";
import "./EventSection.css";

const eventData = [
  {
    id: 1,
    category: "TREK",
    date: "24 - 30 May, 2026",
    day: "24 - 30",
    month: "MAY",
    year: "2026",
    title: "Hampta Pass Trek",
    location: "Himachal Pradesh",
    price: "₹ 8,999 onwards",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    category: "WORKSHOP",
    date: "02 Jun, 2026",
    day: "02",
    month: "JUN",
    year: "2026",
    title: "Wilderness Camping Workshop",
    location: "Dehradun",
    price: "₹ 1,499",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    category: "CLIMBING",
    date: "15 - 16 Jun, 2026",
    day: "15 - 16",
    month: "JUN",
    year: "2026",
    title: "Rock Climbing Basic Skills",
    location: "Malviya Nagar",
    price: "₹ 2,999",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    category: "MEETUP",
    date: "29 Jun, 2026",
    day: "29",
    month: "JUN",
    year: "2026",
    title: "Dzire Adventure Community Meetup",
    location: "Bangalore",
    price: "Free",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80"
  }
];

const EventSection = () => {
  return (
    <section className="event-section">
      <div className="event-section-container">

        {/* Header Block */}
        <div className="home-event-section-header">
          <span className="home-event-section-subtitle">UPCOMING EVENTS</span>
          <h2 className="home-event-section-title">Join Experiences. Learn. Connect.</h2>
          <p className="home-event-section-description">
            Workshops, treks, and meetups for adventurers and explorers.
          </p>
        </div>

        {/* Event Grid */}
        <div className="home-event-grid">
          {eventData.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="home-event-card"
              style={{ backgroundImage: `url(${event.image})` }}
            >
              {/* Card Overlay */}
              <div className="home-event-card-overlay"></div>

              {/* Card Content Top: Category Badge & Date Badge */}
              <div className="home-event-card-top">
                <span className="home-event-card-badge">{event.category}</span>
                <div className="event-card-date-badge">
                  <span className="event-day">{event.day}</span>
                  <span className="event-month">{event.month} {event.year}</span>
                </div>
              </div>

              {/* Card Content Bottom: Info */}
              <div className="home-event-card-bottom">
                <div className="home-event-detail-item" style={{ marginBottom: '2px' }}>
                  <FaMapMarkerAlt className="event-icon" />
                  <span>{event.location}</span>
                </div>

                <h3 className="home-event-card-title">{event.title}</h3>

                <div className="home-event-card-price">
                  <span>{event.price}</span>
                </div>
              </div>
            </Link>
          ))}
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
