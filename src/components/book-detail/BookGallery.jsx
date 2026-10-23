import React from "react";

const BookGallery = ({
  bookImages,
  title,
  activeCoverIndex,
  mobileBookSliderRef,
  onMobileScroll,
  onDotClick,
  onZoomClick,
}) => {
  return (
    <div className="book-gallery-container">
      <div
        className="book-covers-grid book-mobile-slider"
        ref={mobileBookSliderRef}
        onScroll={onMobileScroll}
      >
        {bookImages.map((imgItem, idx) => (
          <div className="book-cover-col" key={idx}>
            <div className="book-gallery-card">
              <div
                className="book-img-wrap"
                onClick={() => onZoomClick(idx)}
                role="button"
                tabIndex={0}
                title="Click to zoom image"
              >
                <img
                  src={imgItem.src}
                  alt={title}
                  className="book-main-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = imgItem.fallback;
                  }}
                />
              </div>
              <button
                className="book-zoom-btn"
                title="Zoom Image"
                onClick={(e) => {
                  e.stopPropagation();
                  onZoomClick(idx);
                }}
                aria-label="Zoom Image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Swipe Dot Indicators */}
      <div className="book-mobile-dots">
        {bookImages.map((_, idx) => (
          <button
            key={idx}
            className={`book-dot-btn ${activeCoverIndex === idx ? "active" : ""}`}
            onClick={() => onDotClick(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BookGallery;
