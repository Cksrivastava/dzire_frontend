import React from "react";
import { Filter, ChevronDown, LayoutGrid, List } from "lucide-react";

const EventListingHeader = ({
  resultsCount,
  sortBy,
  viewMode,
  onOpenMobileFilters,
  onSortChange,
  onViewModeChange,
}) => {
  return (
    <div className="listing-control-header">
      <div className="results-count">
        <span className="results-count-text">{resultsCount} Events Found</span>
        <button
          className="mobile-filter-trigger-btn"
          onClick={onOpenMobileFilters}
        >
          <Filter size={15} />
          <span>Filter</span>
        </button>
      </div>

      <div className="control-actions-right">
        <div className="sort-dropdown-wrap">
          <span className="sort-label">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="Upcoming First">Upcoming First</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Rating">Rating</option>
          </select>
          <ChevronDown size={14} className="sort-arrow" />
        </div>

        <div className="view-toggle-buttons">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => onViewModeChange("grid")}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => onViewModeChange("list")}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventListingHeader;
