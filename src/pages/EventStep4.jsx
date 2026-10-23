import React, { useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { allEvents } from "../data/eventDetail";
import "./EventRegister.css";
import { eventAPI } from "../services/api";

const EventStep4 = () => {
  const navigate = useNavigate();
  const { id, slug } = useParams();
  const eventIdentifier = slug || id;
  const location = useLocation();

  const event =
    location.state?.event ||
    allEvents.find(
      (item) =>
        String(item.slug) === String(eventIdentifier) ||
        String(item.id) === String(eventIdentifier) ||
        String(item._id) === String(eventIdentifier)
    );

  const [confirmed, setConfirmed] = useState(false);

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="register-page">
          <h2>Event not found</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="register-page">
        <div className="register-container">
          <Link to={`/event/${event.slug || event.id || eventIdentifier}`} className="continue-link">
            ‹ Continue Browsing
          </Link>

          <div className="register-progress">
            <span style={{ width: "100%" }}></span>
          </div>

          <p className="step-text">STEP 4 OF 4</p>
          <h1>Confirm and register</h1>

          <div className="register-layout">
            <div className="register-left">
              <div className="review-box">
                <h2>Final Confirmation</h2>

                <p><b>Event:</b> {event.title}</p>
                <p><b>Date:</b> {event.date}</p>
                <p><b>Time:</b> {event.time}</p>
                <p><b>Location:</b> {event.location}</p>
                <p><b>Total Price:</b> {event.memberPrice}</p>
              </div>

              <div className="check-row">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                <span>I confirm my booking details are correct.</span>
              </div>
            </div>

            <aside className="register-card">
              <div className="event-summary">
                <img src={event.image} alt={event.title} />

                <div>
                  <h3>{event.title}</h3>
                  <p>{event.date}</p>
                  <p>{event.time}</p>
                  <p>{event.location}</p>
                  <strong>{event.spotsLeft}</strong>
                </div>
              </div>

              <div className="price-summary">
                <p>Non-member {event.nonMemberPrice}</p>
                <p>Member {event.memberPrice}</p>
              </div>
              <button
                className={`continue-btn ${!confirmed ? "disabled" : ""}`}
                onClick={async () => {
                  if (!confirmed) return;
                  try {
                    await eventAPI.register({
                      eventId: event.id || event._id || eventIdentifier,
                      name: location.state?.name || "Participant",
                      email: location.state?.email || "participant@example.com",
                      phone: location.state?.phone || "",
                      date: event.date,
                      time: event.time,
                      tickets: 1,
                      amountPaid: event.memberPrice || event.price || "Free",
                    });
                  } catch (err) {
                    console.warn("Backend event registration sync fallback:", err);
                  }
                  navigate(`/event-success/${event.slug || event.id || eventIdentifier}`, { state: { event } });
                }}
                disabled={!confirmed}
              >
                Register
              </button>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default EventStep4;