import React from "react";
import { categoriesPills } from "../../data/eventsData";

const EventCategoryPills = ({
  selectedCategory,
  onSelectCategory,
  pillsContainerRef,
}) => {
  return (
    <section className="dzire-category-pills-bar">
      <div className="pills-container-wrapper">
        <div className="pills-container" ref={pillsContainerRef}>
          {categoriesPills.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`category-pill-btn ${isActive ? "active" : ""}`}
                onClick={() => onSelectCategory(isActive ? "all" : cat.id)}
              >
                <div className="pill-icon-wrap">
                  <Icon size={20} />
                </div>
                <span className="pill-label">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventCategoryPills;
