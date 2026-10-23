import React from "react";

const BlogTabs = ({
  primaryCategories,
  moreCategories,
  activeCategory,
  setActiveCategory,
  isMoreOpen,
  setIsMoreOpen,
  isMoreActive,
  moreDropdownRef,
}) => {
  return (
    <section className="blog-tabs-wrapper">
      {primaryCategories.map((item) => (
        <button
          key={item}
          className={`blog-tab-btn ${activeCategory === item ? "active" : ""}`}
          onClick={() => {
            setActiveCategory(item);
            setIsMoreOpen(false);
          }}
        >
          {item}
        </button>
      ))}

      {/* More Categories Dropdown */}
      <div className="blog-more-tab-wrapper" ref={moreDropdownRef}>
        <button
          type="button"
          className={`blog-tab-btn blog-more-tab-btn ${isMoreActive ? "active" : ""} ${isMoreOpen ? "open" : ""}`}
          onClick={() => setIsMoreOpen((prev) => !prev)}
          aria-expanded={isMoreOpen}
        >
          {isMoreActive ? (
            <>
              <span>{activeCategory}</span>
              <span
                className="blog-more-clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCategory("All");
                  setIsMoreOpen(false);
                }}
                title="Clear filter"
              >
                ✕
              </span>
            </>
          ) : (
            <>
              <span>More</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`blog-more-arrow ${isMoreOpen ? "rotated" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </>
          )}
        </button>

        {isMoreOpen && (
          <div className="blog-more-dropdown">
            <div className="blog-more-dropdown-header">
              <span>More Categories</span>
              <span>{moreCategories.length} topics</span>
            </div>
            <div className="blog-more-dropdown-list">
              {moreCategories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`blog-more-item ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsMoreOpen(false);
                    }}
                  >
                    <span>{cat}</span>
                    {isSelected && <span className="blog-more-checkmark">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogTabs;
