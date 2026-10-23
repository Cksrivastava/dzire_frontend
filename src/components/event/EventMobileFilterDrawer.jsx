import React from "react";
import { X } from "lucide-react";

const DATE_OPTIONS = [
  "Any Date",
  "Today",
  "Tomorrow",
  "This Weekend",
  "Next Weekend",
  "Custom Date",
];

const DURATION_OPTIONS = [
  "Any Duration",
  "Half Day",
  "1 Day",
  "2 Days",
  "3 Days",
  "4+ Days",
];

const DIFFICULTY_OPTIONS = ["Easy", "Moderate", "Difficult", "Extreme"];

const EventMobileFilterDrawer = ({
  isOpen,
  dateFilter,
  customDate,
  selectedDurations,
  selectedDifficulties,
  filteredEventsCount,
  onClose,
  onDateFilterChange,
  onCustomDateChange,
  onDurationToggle,
  onDifficultyToggle,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-filter-overlay" onClick={onClose}>
      <div
        className="mobile-filter-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-filter-drawer-header">
          <h3>Filter Events</h3>
          <button
            className="mobile-filter-close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mobile-filter-drawer-body">
          {/* Date Filter Block */}
          <div className="filter-group">
            <h4 className="filter-group-title">Date</h4>
            <div className="radio-options-list">
              {DATE_OPTIONS.map((dOption) => (
                <label key={dOption} className="radio-option-item">
                  <input
                    type="radio"
                    name="dateFilterMobile"
                    checked={dateFilter === dOption}
                    onChange={() => onDateFilterChange(dOption)}
                  />
                  <span className="radio-label">{dOption}</span>
                </label>
              ))}
            </div>

            {dateFilter === "Custom Date" && (
              <div className="custom-date-input-wrap">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => onCustomDateChange(e.target.value)}
                  className="custom-date-picker"
                />
              </div>
            )}
          </div>

          {/* Duration Filter Block */}
          <div className="filter-group">
            <h4 className="filter-group-title">Duration</h4>
            <div className="checkbox-options-list">
              {DURATION_OPTIONS.map((dur) => (
                <label key={dur} className="checkbox-option-item">
                  <input
                    type="checkbox"
                    checked={selectedDurations.includes(dur)}
                    onChange={() => onDurationToggle(dur)}
                  />
                  <span className="checkbox-label">{dur}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Filter Block */}
          <div className="filter-group">
            <h4 className="filter-group-title">Difficulty</h4>
            <div className="checkbox-options-list">
              {DIFFICULTY_OPTIONS.map((diff) => (
                <label key={diff} className="checkbox-option-item">
                  <input
                    type="checkbox"
                    checked={selectedDifficulties.includes(diff)}
                    onChange={() => onDifficultyToggle(diff)}
                  />
                  <span className="checkbox-label">{diff}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mobile-filter-drawer-footer">
          <button
            className="reset-filter-btn-mobile"
            onClick={onResetFilters}
          >
            Reset
          </button>
          <button
            className="apply-filter-btn-mobile"
            onClick={onClose}
          >
            Apply ({filteredEventsCount} Events)
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventMobileFilterDrawer;
