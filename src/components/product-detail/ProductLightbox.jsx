import React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export const ProductLightbox = ({
  zoomImageIndex,
  setZoomImageIndex,
  allProductImages,
}) => {
  if (zoomImageIndex === -1) return null;

  return (
    <div className="product-lightbox-overlay" onClick={() => setZoomImageIndex(-1)}>
      <div className="product-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="product-lightbox-close" onClick={() => setZoomImageIndex(-1)}>
          <X size={24} />
        </button>
        {allProductImages.length > 1 && (
          <button
            className="product-lightbox-nav prev"
            onClick={() =>
              setZoomImageIndex((prev) =>
                prev === 0 ? allProductImages.length - 1 : prev - 1
              )
            }
          >
            <ChevronLeft size={36} />
          </button>
        )}
        <img
          src={allProductImages[zoomImageIndex]}
          alt={`Zoomed view ${zoomImageIndex + 1}`}
          className="product-lightbox-image"
        />
        {allProductImages.length > 1 && (
          <button
            className="product-lightbox-nav next"
            onClick={() =>
              setZoomImageIndex((prev) =>
                prev === allProductImages.length - 1 ? 0 : prev + 1
              )
            }
          >
            <ChevronRight size={36} />
          </button>
        )}
        <div className="product-lightbox-indicator">
          {zoomImageIndex + 1} / {allProductImages.length}
        </div>
      </div>
    </div>
  );
};

export default ProductLightbox;
