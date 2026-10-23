import React from "react";

export const ProductGallery = ({
  product,
  allProductImages,
  activeThumb,
  setActiveThumb,
  mobileSliderRef,
  handleMobileSliderScroll,
  handleMobileThumbClick,
  setZoomImageIndex,
}) => {
  return (
    <section className="product-gallery-section wildcraft-gallery">
      {/* Desktop Gallery (Hidden on Mobile/Tablet) */}
      <div className="desktop-gallery-wrapper">
        <div className="wildcraft-main-images">
          {/* Col 1: First image */}
          <div className="gallery-img-col">
            <div className="gallery-grid-card main-img-card">
              <div className="gallery-image-wrap">
                <img
                  src={allProductImages[activeThumb] || allProductImages[0] || product.image}
                  alt={`${product.name} active`}
                  className="gallery-grid-image"
                />
              </div>
              <button
                className="zoom-btn"
                title="Zoom In"
                onClick={() => setZoomImageIndex(activeThumb)}
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

          {/* Col 2: Second image */}
          <div className="gallery-img-col">
            <div className="gallery-grid-card main-img-card">
              <div className="gallery-image-wrap">
                <img
                  src={allProductImages[1] || allProductImages[0] || product.image}
                  alt={`${product.name} secondary`}
                  className="gallery-grid-image"
                />
              </div>
              <button
                className="zoom-btn"
                title="Zoom In"
                onClick={() => setZoomImageIndex(1)}
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

        {/* Desktop thumbnails row */}
        <div className="wildcraft-thumbnails-row">
          {allProductImages.slice(0, 5).map((img, index) => (
            <button
              key={index}
              className={`thumb-card ${activeThumb === index ? "active" : ""}`}
              onClick={() => setActiveThumb(index)}
            >
              <img src={img} alt={`Thumb ${index + 1}`} />
            </button>
          ))}
          {allProductImages.length > 5 && (
            <button
              className={`thumb-card more-thumbs-card ${activeThumb >= 5 ? "active" : ""}`}
              onClick={() => setActiveThumb(5)}
            >
              <img src={allProductImages[5]} alt="Thumb 6" />
              <div className="more-overlay">
                <span className="plus-count">+{allProductImages.length - 5}</span>
                <span className="more-lbl">More</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Gallery (Hidden on Desktop) */}
      <div className="mobile-gallery-wrapper">
        {/* Horizontal scrollable swipeable main images slider */}
        <div
          className="mobile-gallery-slider"
          ref={mobileSliderRef}
          onScroll={handleMobileSliderScroll}
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
                onClick={() => setZoomImageIndex(index)}
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

        {/* Scrollable thumbnails row */}
        <div className="mobile-thumbnails-scroll-container">
          <div className="mobile-thumbnails-scroll">
            {allProductImages.map((img, index) => (
              <button
                key={index}
                className={`thumb-card ${activeThumb === index ? "active" : ""}`}
                onClick={() => handleMobileThumbClick(index)}
              >
                <img src={img} alt={`Thumb ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet only: Brand + Product Title below gallery */}
      <div className="mobile-brand-title-block">
        <p className="mobile-brand-label">{product.brand}</p>
        <h1 className="mobile-product-title">{product.name}</h1>
      </div>
    </section>
  );
};

export default ProductGallery;
