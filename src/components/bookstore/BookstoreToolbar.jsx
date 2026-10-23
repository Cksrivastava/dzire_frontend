import React from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

const BookstoreToolbar = ({
  searchTerm,
  setSearchTerm,
  mainCategories,
  activeCategory,
  setActiveCategory,
  moreCategories,
  isMoreOpen,
  setIsMoreOpen,
  moreDropdownRef,
  isMoreActive,
  activeMoreObj,
  booksData,
}) => {
  return (
    <div className="bookstore-toolbar">
      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-chips">
        {mainCategories.map((cat) => (
          <button
            key={cat}
            className={`chip-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => {
              setActiveCategory(cat);
              setIsMoreOpen(false);
            }}
          >
            {cat}
          </button>
        ))}

        {/* And More Dropdown */}
        <div className="more-category-wrapper" ref={moreDropdownRef}>
          <button
            type="button"
            className={`chip-btn more-chip-btn ${isMoreActive ? "active" : ""} ${isMoreOpen ? "open" : ""}`}
            onClick={() => setIsMoreOpen((prev) => !prev)}
            aria-expanded={isMoreOpen}
          >
            {isMoreActive ? (
              <>
                <span>{activeMoreObj?.label || activeCategory}</span>
                <span
                  className="more-chip-clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCategory("All");
                    setIsMoreOpen(false);
                  }}
                  title="Clear filter"
                >
                  <X size={12} />
                </span>
              </>
            ) : (
              <>
                <span>and more</span>
                <ChevronDown
                  size={14}
                  className={`dropdown-arrow ${isMoreOpen ? "rotated" : ""}`}
                />
              </>
            )}
          </button>

          {isMoreOpen && (
            <div className="more-categories-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-header-title">More Categories</span>
                <span className="dropdown-header-count">
                  {moreCategories.length} categories
                </span>
              </div>
              <div className="dropdown-list">
                {moreCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = activeCategory === cat.id;
                  const count = booksData.filter((b) => b.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`dropdown-item ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setIsMoreOpen(false);
                      }}
                    >
                      <div className="dropdown-item-left">
                        <span className="dropdown-item-icon">
                          <Icon size={14} />
                        </span>
                        <span className="dropdown-item-label">{cat.label}</span>
                      </div>
                      <div className="dropdown-item-right">
                        <span className="dropdown-item-count">{count}</span>
                        {isSelected && (
                          <Check size={14} className="dropdown-item-check" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookstoreToolbar;
