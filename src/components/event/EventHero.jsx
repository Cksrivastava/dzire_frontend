import React, { useState, useEffect } from "react";
import { Search, Footprints, MapPin, ChevronDown } from "lucide-react";
import {
  getBannerSettings,
  BANNER_SETTINGS_EVENT,
} from "../../services/bannerSettings";

const EventHero = ({
  searchQuery,
  selectedActivity,
  selectedLocation,
  onSearchChange,
  onActivityChange,
  onLocationChange,
}) => {
  const [eventConfig, setEventConfig] = useState(
    () => getBannerSettings().event
  );

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.event) {
        setEventConfig(e.detail.event);
      } else {
        setEventConfig(getBannerSettings().event);
      }
    };
    window.addEventListener(BANNER_SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(BANNER_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const heroStyle = (eventConfig?.image || eventConfig?.bgImage)
    ? {
        backgroundImage: `url(${eventConfig.image || eventConfig.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <section className="dzire-events-hero" style={heroStyle}>
      <div className="dzire-events-hero-overlay"></div>
      <div className="dzire-events-hero-container">
        <div className="hero-text-content">
          <h1 className="hero-main-heading">
            {eventConfig?.title ? (
              eventConfig.title
            ) : (
              <>
                {eventConfig?.titleLine1 || "EXPLORE"}{" "}
                <span className="highlight-orange">
                  {eventConfig?.titleHighlight || "ADVENTURES"}
                </span>
                <br />
                {eventConfig?.titleLine2 || "NEAR YOU"}
              </>
            )}
          </h1>
          <p className="hero-subtext">
            {eventConfig?.subtitle ||
              eventConfig?.subtext ||
              "Discover treks, cycling events, camping trips, climbing workshops and more outdoor experiences."}
          </p>
        </div>

        {/* Search Bar Floating Card */}
        <div className="hero-search-card">
          {/* Input Search */}
          <div className="search-field-box search-input-box">
            <input
              type="text"
              placeholder={
                eventConfig?.searchPlaceholder ||
                "Search events, places, peak names..."
              }
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Activity Dropdown */}
          <div className="search-field-box dropdown-box">
            <Footprints size={18} className="field-icon" />
            <div className="select-wrapper">
              <span className="field-label">Activity</span>
              <select
                value={selectedActivity}
                onChange={(e) => onActivityChange(e.target.value)}
              >
                <option value="All">All Activities</option>
                <option value="trekking">Trekking</option>
                <option value="camping">Camping</option>
                <option value="cycling">Cycling</option>
                <option value="climbing">Climbing</option>
              </select>
            </div>
            <ChevronDown size={16} className="arrow-icon" />
          </div>

          {/* Location Dropdown */}
          <div className="search-field-box dropdown-box">
            <MapPin size={18} className="field-icon" />
            <div className="select-wrapper">
              <span className="field-label">Location</span>
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
              >
                <option value="All">All Locations</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Himachal">Himachal Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Karnataka">Karnataka</option>
              </select>
            </div>
            <ChevronDown size={16} className="arrow-icon" />
          </div>

          {/* Search Button */}
          <button className="hero-search-btn" aria-label="Search Events">
            <Search size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventHero;
