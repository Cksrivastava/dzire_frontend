import React from "react";

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

const EventSidebarFilter = ({
  dateFilter,
  customDate,
  selectedDurations,
  selectedDifficulties,
  onDateFilterChange,
  onCustomDateChange,
  onDurationToggle,
  onDifficultyToggle,
  onResetFilters,
  onApplyFilters,
}) => {
  return (
    <aside className="events-filter-sidebar">
      <div className="filter-sidebar-header">
        <h3>Filters</h3>
        <button className="reset-filter-btn" onClick={onResetFilters}>
          Reset
        </button>
      </div>

      {/* Date Filter Block */}
      <div className="filter-group">
        <h4 className="filter-group-title">Date</h4>
        <div className="radio-options-list">
          {DATE_OPTIONS.map((dOption) => (
            <label key={dOption} className="radio-option-item">
              <input
                type="radio"
                name="dateFilter"
                checked={dateFilter === dOption}
                onChange={() => onDateFilterChange(dOption)}
              />
              <span className="custom-radio"></span>
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
              <span className="custom-checkbox"></span>
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
              <span className="custom-checkbox"></span>
              <span className="checkbox-label">{diff}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        className="apply-filters-btn"
        type="button"
        onClick={onApplyFilters}
      >
        Apply Filters
      </button>
    </aside>
  );
};

export default EventSidebarFilter;
