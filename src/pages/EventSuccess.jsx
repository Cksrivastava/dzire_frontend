import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { allEvents } from "../data/eventDetail";
import "./EventRegister.css";

const EventSuccess = () => {
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

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="register-page">
          <h2>Booking not found</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* GREEN SUCCESS HERO */}
      <section className="success-hero">
        <div className="register-container">
          <h1>You're going!</h1>
          <p>Your spot is reserved for this event.</p>
        </div>
      </section>

      <main className="register-page">
        <div className="register-container">

          {/* EVENT DETAILS */}
          <div className="review-box">
            <h2>Booking Details</h2>

            <p><b>Event:</b> {event.title}</p>
            <p><b>Date:</b> {event.date}</p>
            <p><b>Time:</b> {event.time}</p>
            <p><b>Location:</b> {event.location}</p>

            <hr style={{ margin: "14px 0" }} />

            <p><b>Status:</b> Confirmed</p>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ marginTop: "24px" }}>
            <Link to="/" className="back-btn">
              Back to Home
            </Link>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default EventSuccess;