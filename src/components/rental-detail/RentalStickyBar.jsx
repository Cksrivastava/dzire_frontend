import React from "react";
import { MessageSquare } from "lucide-react";

const RentalStickyBar = ({ show, product, image, onEnquire }) => {
  if (!show) return null;

  return (
    <div className="dzire-sticky-bottom-bar">
      <div className="sticky-bar-content">
        <div className="sticky-product-details">
          <img src={image} alt={product.name} className="sticky-img" />
          <div>
            <h4 className="sticky-name">{product.name}</h4>
            <p className="sticky-price-info">
              <strong>₹ {product.price}/day</strong>
            </p>
          </div>
        </div>

        <button className="dzire-sticky-btn" onClick={onEnquire}>
          <MessageSquare size={18} />
          <span>Enquire Product</span>
        </button>
      </div>
    </div>
  );
};

export default RentalStickyBar;
