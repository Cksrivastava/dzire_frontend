import React from "react";
import { Link } from "react-router-dom";

const EventCategorySidebar = ({
  pageTitle,
  today,
  selectedDate,
  setSelectedDate,
  selectedLocation,
  setSelectedLocation,
  selectedSubCategory,
  onSelectSubCategory,
  selectedExperiences,
  onToggleExperience,
  hasActiveFilters,
  onResetFilters,
  activityOpen,
  setActivityOpen,
  experienceOpen,
  setExperienceOpen,
  showMobileFilter,
  setShowMobileFilter,
  openItems,
  toggleItem,
  categories,
  experiences,
}) => {
  const [showLocationSelect, setShowLocationSelect] = React.useState(false);

  return (
    <>
      <div className="classes-mobile-filter-bar">
        <button
          className="classes-mobile-filter-btn"
          type="button"
          onClick={() => setShowMobileFilter(true)}
        >
          ☰ Filter {hasActiveFilters && "•"}
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
          <div className="sidebar-block sidebar-header-block">
            <div className="sidebar-header-flex">
              <h3 className="sidebar-title">Filter</h3>
              {hasActiveFilters && (
                <button
                  className="sidebar-reset-btn"
                  type="button"
                  onClick={onResetFilters}
                >
                  Reset All
                </button>
              )}
            </div>
          </div>

          {/* Location Filter */}
          <div className="sidebar-block">
            <div className="sidebar-heading">Location</div>
            {selectedLocation ? (
              <div className="location-selected-chip">
                <span className="location-icon-wrap">📍</span>
                <span className="location-name-text">{selectedLocation}</span>
                <button
                  className="clear-location-btn"
                  type="button"
                  onClick={() => setSelectedLocation("")}
                  title="Clear Location"
                >
                  ✕
                </button>
              </div>
            ) : showLocationSelect ? (
              <div className="location-select-wrap">
                <select
                  className="location-dropdown-select"
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setShowLocationSelect(false);
                  }}
                  autoFocus
                >
                  <option value="">Choose a location...</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Varanasi">Varanasi</option>
                  <option value="Darjeeling">Darjeeling</option>
                </select>
              </div>
            ) : (
              <button
                className="location-add-btn"
                type="button"
                onClick={() => setShowLocationSelect(true)}
              >
                <span className="location-icon-wrap">📍</span>
                <span>Add a location</span>
              </button>
            )}
          </div>

          {/* Available Dates */}
          <div className="sidebar-block">
            <div className="sidebar-heading-row-flex">
              <div className="sidebar-heading">Available Dates</div>
              {selectedDate && (
                <button
                  type="button"
                  className="clear-date-link-btn"
                  onClick={() => setSelectedDate("")}
                >
                  Clear
                </button>
              )}
            </div>
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

          {/* Activity Accordion with Clickable Sub-Items */}
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
                        className={`sidebar-activity-toggle ${pageTitle === item.title ? "active" : ""}`}
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
                          {item.items.map((sub, idx) => {
                            const isSubActive = selectedSubCategory === sub;
                            return (
                              <div
                                className={`sidebar-subitem ${isSubActive ? "active" : ""}`}
                                key={idx}
                                onClick={() => onSelectSubCategory(sub)}
                              >
                                {isSubActive ? `✓ ${sub}` : sub}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Experience Type Checkboxes */}
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
                    <input
                      type="checkbox"
                      checked={selectedExperiences.includes(item)}
                      onChange={() => onToggleExperience(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default EventCategorySidebar;
