import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./EventDetail.css";
import { allEvents } from "../data/eventDetail";

const renderStars = (rating) => {
  const fullStars = Math.round(rating);
  return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
};

const EventDetail = () => {
  const { id } = useParams();
  const [showMoreDates, setShowMoreDates] = useState(false);
  const [openOverview, setOpenOverview] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const event = allEvents.find((item) => item.id === Number(id));

  const [selectedDate, setSelectedDate] = useState({
    label: event?.date,
    time: event?.time,
  });

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="event-detail-page">
          <div className="event-detail-main-container">
            <div className="event-not-found-box">
              <h2>Event not found</h2>
              <p>The event you are looking for does not exist.</p>
              <Link to="/events/camping" className="event-detail-back-link">
                ← Back to Events
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="event-detail-page">
        <div className="event-detail-main-container">
          <div className="event-breadcrumb">
            <Link to="/events/camping">Classes & Events</Link>
            <span>/</span>
            <span>Camping And Hiking</span>
            <span>/</span>
            <span>{event.title}</span>
          </div>

          <div className="event-hero-image-wrap">
            <img src={event.image} alt={event.title} />
          </div>

          <div className="event-top-details-grid">
            <div className="event-top-left">
              <h1 className="event-main-title">{event.title}</h1>

              <div className="event-meta-block">
                <p className="event-date-text">{selectedDate.label}</p>

                <button
                  type="button"
                  className="event-more-dates-btn"
                  onClick={() => setShowMoreDates(!showMoreDates)}
                >
                  More dates {showMoreDates ? "▲" : "▼"}
                </button>

                {showMoreDates && event.moreDates?.length > 0 && (
                  <div className="event-more-dates-box">
                    {event.moreDates.map((item, index) => (
                      <div
                        className={`event-more-date-item ${selectedDate.label === item.label &&
                          selectedDate.time === item.time
                          ? "selected-event-date"
                          : ""
                          }`}
                        key={index}
                        onClick={() => {
                          setSelectedDate(item);
                          setShowMoreDates(false);
                        }}
                      >
                        <p>{item.label}</p>
                        <span>{item.time}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="event-time-text">{selectedDate.time}</p>

                <div className="event-location-row">
                  <span className="event-location-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                    </svg>
                  </span>

                  <a
                    className="event-location-line clickable-location"
                    href={`https://www.google.com/maps/search/?api=1&query=${event.location} ${event.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {event.location}
                  </a>
                </div>
              </div>
            </div>

            <div className="event-register-card">
              <div className="event-register-prices">
                <h3>{event.memberPrice}</h3>
                <p>for members</p>
                <span>{event.nonMemberPrice} for non-members</span>
              </div>

              <Link
                to={`/event-register/${event.id}`}
                state={{
                  event: {
                    ...event,
                    date: selectedDate.label,
                    time: selectedDate.time,
                  },
                }}
                className="event-register-btn"
              >
                Register
              </Link>

              <div className="event-spots-left">{event.spotsLeft}</div>
            </div>
          </div>

          <div className="event-content-grid">
            <div className="event-content-left">

              <section className="event-section-box">
                <button
                  type="button"
                  className="event-overview-btn"
                  onClick={() => setOpenOverview(!openOverview)}
                >
                  Overview {openOverview ? "▲" : "▼"}
                </button>

                {openOverview && (
                  <>
                    <div className="event-small-rating-row">
                      <span className="event-small-stars">
                        {renderStars(event.rating)}
                      </span>
                      <span className="event-small-reviews">
                        ({event.reviews} reviews)
                      </span>
                    </div>

                    <p className="event-group-size">{event.groupSize}</p>
                    <p className="event-overview-text">{event.description}</p>
                  </>
                )}
              </section>

              <section className="event-section-box">
                <button
                  type="button"
                  className="event-overview-btn"
                  onClick={() => setOpenDetails(!openDetails)}
                >
                  Details {openDetails ? "▲" : "▼"}
                </button>

                {openDetails && (
                  <p className="event-overview-text" style={{ marginTop: "12px" }}>
                    Add your details
                  </p>
                )}
              </section>

              <section className="event-section-box">
                <div className="event-location-topbar">
                  <div>
                    <h2 className="event-section-title">Activity location</h2>

                    <div className="event-location-heading-row">
                      <span className="event-location-icon event-location-icon-small">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                        </svg>
                      </span>
                      <h4 className="event-location-name">{event.location}</h4>
                    </div>

                    <p className="event-location-address">{event.address}</p>
                  </div>

                  <button type="button" className="event-direction-btn">
                    Get directions
                  </button>
                </div>

                <div className="event-map-wrap">
                  <iframe
                    title="Dzire Adventure Hub Lucknow"
                    src="https://www.google.com/maps?q=Dzire%20Adventure%20Hub%20Lucknow%20Uttar%20Pradesh&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </section>

              <section className="event-section-box">
                <h2 className="event-section-title">Have more questions?</h2>

                <p className="event-info-text">
                  Visit our{" "}
                  <a href="/faq" className="event-link">
                    FAQs
                  </a>{" "}
                  or contact us at{" "}
                  <a href="tel:+91-9923080044" className="event-link">
                    +91-9923080044
                  </a>
                  .
                </p>
              </section>

              <section className="event-section-box">
                <h2 className="event-section-title">Cancellation policy</h2>
                <p className="event-info-text">{event.cancellation}</p>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventDetail;