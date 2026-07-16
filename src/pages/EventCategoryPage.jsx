import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./EventCategoryPage.css";
import { allEvents } from "../data/eventDetail";

const categories = [
  {
    title: "Camping And Hiking",
    path: "/events/camping",
    items: ["Backpacking", "Camping", "Hiking", "Trekking"],
  },
  {
    title: "Climbing",
    path: "/events/climbing",
    items: ["Bouldering", "Ice Climbing", "Mountaineering", "Rock Climbing"],
  },
  {
    title: "Cycling (12)",
    path: "/events/cycling",
    items: [
      "Bikepacking (1)",
      "General Cycling (9)",
      "Gravel Riding",
      "Mountain Biking (2)",
      "Road Cycling",
    ],
  },
  {
    title: "Fitness",
    path: "/events/fitness",
    items: ["Running", "Yoga"],
  },
  {
    title: "Outdoor Skills",
    path: "/events/outdoor-skills",
    items: ["Avalanche Safety", "Cooking", "Navigation", "Photography", "Survival"],
  },
  {
    title: "Snowsports",
    path: "/events/snowsports",
    items: ["Skiing", "Snowboarding", "Snowshoeing"],
  },
  {
    title: "Stewardship",
    path: "/events/stewardship",
    items: ["Trail Work", "Conservation", "Cleanup"],
  },
  {
    title: "Travel",
    path: "/events/travel",
    items: ["Adventure Travel", "Weekend Trips", "Guided Tours"],
  },
  {
    title: "Watersports",
    path: "/events/watersports",
    items: ["Kayaking", "Paddleboarding", "Rafting"],
  },
];

const experiences = [
  "Outdoor Class",
  "Indoor Class",
  "Day Trip",
  "Service Project",
  "Special Event (10)",
  "Indoor Workshop (5)",
  "Community Talk (11)",
  "Basic Skills",
];

const ITEMS_PER_PAGE = 9;

const renderStars = (rating) => {
  const fullStars = Math.round(rating);
  return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
};

const EventCategoryPage = ({ pageTitle = "Camping And Hiking" }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [activityOpen, setActivityOpen] = useState(true);
  const [experienceOpen, setExperienceOpen] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openItems, setOpenItems] = useState({ [pageTitle]: true });

  const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE);

  const currentEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage]);

  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const toggleItem = (title) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const changePage = (page) => {
    setCurrentPage(page);
    setShowMobileFilter(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    const nextPage = currentPage < totalPages ? currentPage + 1 : 1;
    changePage(nextPage);
  };

  return (
    <>
      <Navbar />

      <div className="classes-page">
        <div className="classes-container">
          <div className="classes-heading-row classes-heading-simple">
            <div>
              <p className="classes-small-label">Classes & Events</p>
              <h1>{pageTitle} Classes & Events</h1>
            </div>
          </div>

          <div className="classes-layout">
            <div className="classes-mobile-filter-bar">
              <button
                className="classes-mobile-filter-btn"
                type="button"
                onClick={() => setShowMobileFilter(true)}
              >
                ☰ Filter
              </button>
            </div>

            {showMobileFilter && (
              <div
                className="classes-sidebar-overlay show"
                onClick={() => setShowMobileFilter(false)}
              ></div>
            )}

            <aside className={`classes-sidebar ${showMobileFilter ? "show" : ""}`}>
              <div className="classes-mobile-sidebar-top">
                <h3>Filters</h3>
                <button
                  className="classes-mobile-close-btn"
                  type="button"
                  onClick={() => setShowMobileFilter(false)}
                >
                  ✕
                </button>
              </div>

              <div className="classes-sidebar-inner">
                <div className="sidebar-block">
                  <h3 className="sidebar-title">Filter</h3>
                </div>

                <div className="sidebar-block">
                  <div className="sidebar-heading">Location</div>
                  <button className="location-add-btn" type="button">
                    <span className="location-icon-wrap">📍</span>
                    <span>Add a location</span>
                  </button>
                </div>

                <div className="sidebar-block">
                  <div className="sidebar-heading">Available Dates</div>
                  <div className="date-picker-wrap">
                    <input
                      type="date"
                      className="date-picker-input"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sidebar-block sidebar-accordion-block">
                  <button
                    type="button"
                    className="sidebar-main-toggle"
                    onClick={() => setActivityOpen(!activityOpen)}
                  >
                    <span>Activity</span>
                    <span className={`chevron ${activityOpen ? "open" : ""}`}>^</span>
                  </button>

                  {activityOpen && (
                    <div className="sidebar-accordion-content">
                      {categories.map((item) => {
  const isOpen = !!openItems[item.title];

  return (
    <div className="sidebar-activity-item" key={item.title}>
      
      <button
        type="button"
        className={`sidebar-activity-toggle ${
          pageTitle === item.title ? "active" : ""
        }`}
        onClick={() => toggleItem(item.title)}
      >
        <span className="plus-icon">{isOpen ? "−" : "+"}</span>

        <Link
          to={item.path}
          className="sidebar-activity-label"
          onClick={() => setShowMobileFilter(false)}
        >
          {item.title}
        </Link>
      </button>

      {/* SUB ITEMS */}
      {isOpen && item.items && (
        <div className="sidebar-submenu">
          {item.items.map((sub, idx) => (
            <div className="sidebar-subitem" key={idx}>
              {sub}
            </div>
          ))}
        </div>
      )}
    </div>
  );
})}
                    </div>
                  )}
                </div>

                <div className="sidebar-block sidebar-accordion-block">
                  <button
                    type="button"
                    className="sidebar-main-toggle"
                    onClick={() => setExperienceOpen(!experienceOpen)}
                  >
                    <span>Experience Type</span>
                    <span className={`chevron ${experienceOpen ? "open" : ""}`}>^</span>
                  </button>

                  {experienceOpen && (
                    <div className="sidebar-experience-list">
                      {experiences.map((item) => (
                        <label key={item} className="sidebar-check-row custom-check">
                          <input type="checkbox" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <section className="classes-content">
              <div className="classes-grid">
                {currentEvents.map((event) => (
                  <Link
                    to={`/event/${event.id}`}
                    className="event-card-link"
                    key={event.id}
                  >
                    <div className="event-card">
                      <div className="event-image-wrap">
                        <img src={event.image} alt={event.title} />
                      </div>

                      <div className="event-card-body">
                        <p className="event-type">{event.type}</p>
                        <h3 className="event-title">{event.title}</h3>

                        <div className="event-rating-row">
                          <span className="event-stars">{renderStars(event.rating)}</span>
                          <span className="event-reviews">({event.reviews})</span>
                        </div>

                        <div className="event-bottom-row">
                          <span>{event.date}</span>
                          <strong>{event.price}</strong>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="classes-pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={currentPage === index + 1 ? "active" : ""}
                    onClick={() => changePage(index + 1)}
                    type="button"
                  >
                    {index + 1}
                  </button>
                ))}

                <button onClick={handleNextPage} type="button">
                  {">"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventCategoryPage;