import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const BookLightbox = ({
  zoomImageIndex,
  bookImages,
  onClose,
  onPrev,
  onNext,
}) => {
  if (zoomImageIndex === -1) return null;

  return (
    <div className="product-lightbox-overlay" onClick={onClose}>
      <div className="product-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="product-lightbox-close"
          onClick={onClose}
          aria-label="Close Lightbox"
        >
          <X size={24} />
        </button>
        <button
          className="product-lightbox-nav prev"
          onClick={onPrev}
          aria-label="Previous image"
        >
          <ChevronLeft size={36} />
        </button>
        <img
          src={bookImages[zoomImageIndex]?.src}
          alt={`Zoomed ${bookImages[zoomImageIndex]?.label}`}
          className="product-lightbox-image"
        />
        <button
          className="product-lightbox-nav next"
          onClick={onNext}
          aria-label="Next image"
        >
          <ChevronRight size={36} />
        </button>
        <div className="product-lightbox-indicator">
          {zoomImageIndex + 1} / {bookImages.length}
        </div>
      </div>
    </div>
  );
};

export default BookLightbox;
