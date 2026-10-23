import React from "react";

const RentalGallery = ({
  allProductImages,
  product,
  activeThumb,
  mobileSliderRef,
  onThumbClick,
  onMobileSliderScroll,
  onMobileThumbClick,
  onZoomClick,
}) => {
  return (
    <section className="product-gallery-section wildcraft-gallery">
      {/* Desktop Gallery */}
      <div className="desktop-gallery-wrapper">
        <div className="wildcraft-main-images">
          {/* Col 1 */}
          <div className="gallery-img-col">
            <div className="gallery-grid-card main-img-card">
              <div className="gallery-image-wrap">
                <img
                  src={allProductImages[activeThumb]}
                  alt={`${product.name} active`}
                  className="gallery-grid-image"
                />
              </div>
              <button
                className="zoom-btn"
                title="Zoom In"
                onClick={() => onZoomClick(activeThumb)}
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

          {/* Col 2 */}
          <div className="gallery-img-col">
            <div className="gallery-grid-card main-img-card">
              <div className="gallery-image-wrap">
                <img
                  src={allProductImages[1] || allProductImages[0]}
                  alt={`${product.name} secondary`}
                  className="gallery-grid-image"
                />
              </div>
              <button
                className="zoom-btn"
                title="Zoom In"
                onClick={() => onZoomClick(1)}
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
        </div>

        {/* Thumbnails row */}
        <div className="wildcraft-thumbnails-row">
          {allProductImages.slice(0, 5).map((img, index) => (
            <button
              key={index}
              className={`thumb-card ${activeThumb === index ? "active" : ""}`}
              onClick={() => onThumbClick(index)}
            >
              <img src={img} alt={`Thumb ${index + 1}`} />
            </button>
          ))}
          <button
            className={`thumb-card more-thumbs-card ${activeThumb === 5 ? "active" : ""}`}
            onClick={() => onThumbClick(5)}
          >
            <img src={allProductImages[5] || allProductImages[0]} alt="Thumb 6" />
            <div className="more-overlay">
              <span className="plus-count">
                +{Math.max(1, allProductImages.length - 5)}
              </span>
              <span className="more-lbl">More</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Gallery */}
      <div className="mobile-gallery-wrapper">
        <div
          className="mobile-gallery-slider"
          ref={mobileSliderRef}
          onScroll={onMobileSliderScroll}
        >
          {allProductImages.map((img, index) => (
            <div className="mobile-gallery-slide-card" key={index}>
              <div className="gallery-image-wrap">
                <img
                  src={img}
                  alt={`${product.name} slide ${index + 1}`}
                  className="gallery-grid-image"
                />
              </div>
              <button
                className="zoom-btn"
                title="Zoom In"
                onClick={() => onZoomClick(index)}
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
          ))}
        </div>

        <div className="mobile-thumbnails-scroll-container">
          <div className="mobile-thumbnails-scroll">
            {allProductImages.map((img, index) => (
              <button
                key={index}
                className={`thumb-card ${activeThumb === index ? "active" : ""}`}
                onClick={() => onMobileThumbClick(index)}
              >
                <img src={img} alt={`Thumb ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile title */}
      <div className="mobile-brand-title-block">
        <p className="mobile-brand-label">{product.brand}</p>
        <h1 className="mobile-product-title">{product.name}</h1>
      </div>
    </section>
  );
};

export default RentalGallery;
