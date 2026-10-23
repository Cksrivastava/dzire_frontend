import React, { useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { allEvents } from "../data/eventDetail";
import "./EventRegister.css";

const EventStep3 = () => {
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

  const [agreed, setAgreed] = useState(false);
  
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

          {/* progress */}
          <div className="register-progress">
            <span style={{ width: "75%" }}></span>
          </div>

          <p className="step-text">STEP 3 OF 4</p>
          <h1>Review your booking</h1>

          <div className="register-layout">

            {/* LEFT */}
            <div className="register-left">

              <div className="review-box">
                <h2>Booking Summary</h2>

                <p><b>Event:</b> {event.title}</p>
                <p><b>Date:</b> {event.date}</p>
                <p><b>Time:</b> {event.time}</p>
                <p><b>Location:</b> {event.location}</p>

                <hr style={{ margin: "12px 0" }} />

                <p><b>Participants:</b> 1 Adult</p>

                <hr style={{ margin: "12px 0" }} />

                <p><b>Total Price:</b> {event.memberPrice}</p>
              </div>

              <div className="check-row">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>I agree to the terms and cancellation policy</span>
              </div>

            </div>

            {/* RIGHT */}
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
                className={`continue-btn ${!agreed ? "disabled" : ""}`}
                onClick={() =>
                  agreed && navigate(`/event-step-4/${event.slug || event.id || eventIdentifier}`, { state: { event } })
                }
                disabled={!agreed}
              >
                Continue
              </button>
            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default EventStep3;