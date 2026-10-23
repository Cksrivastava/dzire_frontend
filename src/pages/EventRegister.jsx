import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { allEvents } from "../data/eventDetail";
import { eventAPI } from "../services/api";
import "./EventRegister.css";

const EventRegister = () => {
  const { id, slug } = useParams();
  const eventIdentifier = slug || id;
  const location = useLocation();
  const navigate = useNavigate();

  const [remoteEvent, setRemoteEvent] = useState(null);

  useEffect(() => {
    if (!location.state?.event && eventIdentifier) {
      eventAPI
        .getById(eventIdentifier)
        .then((res) => {
          if (res && res.event) setRemoteEvent(res.event);
        })
        .catch(() => {});
    }
  }, [eventIdentifier, location.state?.event]);

  const event =
    location.state?.event ||
    remoteEvent ||
    allEvents.find(
      (item) =>
        String(item.slug) === String(eventIdentifier) ||
        String(item.id) === String(eventIdentifier) ||
        String(item._id) === String(eventIdentifier)
    );

  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);

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

          <div className="register-progress">
            <span></span>
          </div>

          <p className="step-text">STEP 1 OF 4</p>
          <h1>How many are going?</h1>

          <div className="register-layout">
            <div className="register-left">
              <h2>I want to register</h2>

              <div className="count-box">
                <div className="count-item">
                  <button onClick={() => setAdult(Math.max(1, adult - 1))}>−</button>
                  <strong>{adult}</strong>
                  <button onClick={() => setAdult(adult + 1)}>+</button>
                  <p>Adult</p>
                </div>

                <div className="count-item">
                  <button onClick={() => setChild(Math.max(0, child - 1))}>−</button>
                  <strong>{child}</strong>
                  <button onClick={() => setChild(child + 1)}>+</button>
                  <p>Child</p>
                </div>
              </div>

              <div className="register-form">
                <h2>Your contact information</h2>

                <label>First name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

                <label>Last name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />

                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label>Phone number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
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
                  <span>I am an Dzire Member</span>
                </div>

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
                type="button"
                className={`continue-btn ${!isFormValid ? "disabled" : ""}`}
                onClick={() => isFormValid && navigate(`/event-step-2/${event.slug || event.id || eventIdentifier}`, { state: { event } })}
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

export default EventRegister;