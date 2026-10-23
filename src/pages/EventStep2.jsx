import React, { useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { allEvents } from "../data/eventDetail";
import "./EventRegister.css";

const EventStep2 = () => {
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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isMember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    validateEmail(formData.email) &&
    formData.phone.trim() !== "";

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
            <span style={{ width: "50%" }}></span>
          </div>

          <p className="step-text">STEP 2 OF 4</p>
          <h1>Who’s going?</h1>

          <div className="register-layout">

            {/* LEFT */}
            <div className="register-left">
              <div className="register-form">
                <h2>Contact information</h2>

                <label>First name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />

                <label>Last name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />

                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />

                <label>Phone number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  required
                />

                <div className="check-row">
                  <input
                    type="checkbox"
                    name="isMember"
                    checked={formData.isMember}
                    onChange={handleChange}
                  />
                  <span>I am a member</span>
                </div>

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
                className={`continue-btn ${!isFormValid ? "disabled" : ""}`}
                onClick={() =>
                  isFormValid && navigate(`/event-step-3/${event.slug || event.id || eventIdentifier}`, { state: { event } })
                }
                disabled={!isFormValid}
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

export default EventStep2;