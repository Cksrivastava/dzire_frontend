import React from "react";
import { SlidersHorizontal } from "lucide-react";

const RentalFilterBar = ({
  categoryList,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="rental-top-filter-bar">
      <div className="rental-filter-label-badge">
        <SlidersHorizontal size={18} className="filter-header-icon" />
        <span>Filter:</span>
      </div>
      <div className="rental-cat-chips-scroll">
        {categoryList.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              className={`rental-cat-pill ${isActive ? "active" : ""}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {Icon && <Icon size={14} className="pill-icon" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RentalFilterBar;
