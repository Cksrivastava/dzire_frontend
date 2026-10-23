import React from "react";
import { X } from "lucide-react";

const RentalImageZoomModal = ({ zoomImageIndex, images, onClose }) => {
  if (zoomImageIndex < 0) return null;

  return (
    <div className="image-zoom-modal" onClick={onClose}>
      <button className="close-zoom-btn" onClick={onClose}>
        <X size={24} />
      </button>
      <img
        src={images[zoomImageIndex]}
        alt="Zoom View"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default RentalImageZoomModal;
