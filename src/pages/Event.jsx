import React, { useState } from "react";
import {
  Tent,
  Mountain,
  Bike,
  Dumbbell,
  Compass,
  Snowflake,
  Trees,
  Waves,
  MapPin,
  ChevronDown,
  Search,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Event.css";

const categories = [
  { icon: Tent, title: "Camping & Hiking", path: "/events/camping" },
  { icon: Mountain, title: "Climbing", path: "/events/climbing" },
  { icon: Bike, title: "Cycling", path: "/events/cycling" },
  { icon: Dumbbell, title: "Fitness", path: "/events/fitness" },
  { icon: Compass, title: "Outdoor Skills", path: "/events/outdoor-skills" },
  { icon: Snowflake, title: "Snowsports", path: "/events/snowsports" },
  { icon: Trees, title: "Stewardship", path: "/events/stewardship" },
  { icon: MapPin, title: "Travel", path: "/events/travel" },
  { icon: Waves, title: "Watersports", path: "/events/watersports" },
];

const featureCards = [
  {
    title: "In-Store Workshops",
    desc: "Hands-on classes will help you master essential skills like bike repairs, navigation, and backpacking with expert guidance.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Presentations",
    desc: "Free, inspiring seminars by Dzire experts and partners will introduce you to outdoor activities and dream-worthy destinations.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Events",
    desc: "Immersive opportunities to connect with fellow members—from run clubs and film tours to service projects and celebrations.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
  },
];

const Event = () => {
  const navigate = useNavigate();
  const [activity, setActivity] = useState("All activities");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("Within 100 miles");

  return (
    <>
      <Navbar />

      <main className="event-page">
        <section className="event-subnav">
          <div className="event-container">
            <a href="#">Locations</a>
            <a href="#">Activities</a>
            <a href="#">FAQs & Resources</a>
          </div>
        </section>

        <section className="event-top-strip">
          <div className="event-container">
            Need something for your next adventure? Rent top gear from your local
            Dzire Store.
            <a href="#"> Search rental gear</a>
          </div>
        </section>

        <section className="event-hero">
          <div className="event-hero-overlay"></div>

          <div className="event-container event-hero-inner">
            <div className="event-search-panel">
              <h1>Connect to the co-op</h1>
              <p>
                Join us for an in-store workshop, presentation or local event.
              </p>

              <div className="event-search-grid">
                <div className="event-field">
                  <label>Activity</label>
                  <div className="event-select">
                    <select
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                    >
                      <option>All activities</option>
                      <option>Camping & Hiking</option>
                      <option>Climbing</option>
                      <option>Cycling</option>
                      <option>Fitness</option>
                      <option>Outdoor Skills</option>
                      <option>Snowsports</option>
                      <option>Stewardship</option>
                      <option>Travel</option>
                      <option>Watersports</option>
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </div>

                <div className="event-field">
                  <label>Location</label>
                  <div className="event-input">
                    <MapPin size={16} />
                    <input
                      type="text"
                      placeholder="ZIP code or City, State"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <button className="event-search-btn" type="button">
                  <Search size={16} />
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="event-categories">
          <div className="event-container">
            <h2 className="section-title">Browse by category</h2>

            <div className="event-category-grid">
              {categories.map(({ icon: Icon, title, path }) => (
                <div
                  className="event-category-item"
                  key={title}
                  onClick={() => navigate(path)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="event-category-icon">
                    <Icon size={30} strokeWidth={1.8} />
                  </div>
                  <span>{title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="event-feature-section">
          <div className="event-container">
            <h2 className="event-feature-heading">
              There’s more in-store! Join us at Dzire for education & inspiration.
            </h2>

            <div className="event-feature-grid">
              {featureCards.map((item) => (
                <div className="event-feature-card" key={item.title}>
                  <div className="event-feature-image-wrap">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="event-feedback-section">
          <div className="event-container">
            <div className="event-feedback-line">
              <div className="space">How are we doing?</div>
              <a href="#">Give us feedback</a>
              <span>on this page.</span>
            </div>
          </div>
        </section>

        <section className="event-signup-section">
          <div className="event-feedback-line"></div>
          <div className="event-container">
            <div className="event-signup-box">
              <h2>Sign up for Dzire emails</h2>
              <p>
                Get 15% off one REI Co-op brand item. <a href="#"> Details</a>
              </p>

              <form className="event-signup-form">
                <div className="event-signup-field">
                  <label>Email</label>
                  <div className="event-signup-input">
                    <input type="email" placeholder="" />
                    <Mail size={18} />
                  </div>
                </div>

                <button type="submit">Sign me up!</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Event;