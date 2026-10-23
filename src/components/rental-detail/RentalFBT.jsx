import React from "react";
import { ShoppingCart, Plus, MessageSquare } from "lucide-react";

const RentalFBT = ({
  product,
  allProductImages,
  fbtItem1,
  fbtItem2,
  fbtTotalPrice,
  fbtTotalMRP,
  fbtSavings,
  fbtDiscountPercent,
  onAddBundle,
}) => {
  return (
    <section className="fbt-section">
      <div className="fbt-inner-card">
        <div className="fbt-content">
          <div className="fbt-left-column-layout">
            <div className="fbt-header">
              <div className="fbt-header-left">
                <div className="fbt-title-row">
                  <span className="fbt-bag-icon">
                    <ShoppingCart size={18} />
                  </span>
                  <h3 className="fbt-heading">Frequently Bought Together</h3>
                </div>
              </div>
            </div>

            <div className="fbt-products-slider-wrapper">
              <div className="fbt-products-row">
                <div className="fbt-product-card">
                  <div className="fbt-image-container">
                    <img src={allProductImages[0]} alt={product.name} />
                  </div>
                  <div className="fbt-product-info">
                    <h4 className="fbt-name">{product.name}</h4>
                    <div className="fbt-price-row">
                      <span className="fbt-price">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="fbt-connector-plus">
                  <Plus size={16} />
                </div>

                <div className="fbt-product-card">
                  <div className="fbt-image-container">
                    <img src={fbtItem1.image} alt={fbtItem1.name} />
                  </div>
                  <div className="fbt-product-info">
                    <h4 className="fbt-name">{fbtItem1.name}</h4>
                    <div className="fbt-price-row">
                      <span className="fbt-price">
                        ₹{fbtItem1.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="fbt-connector-plus">
                  <Plus size={16} />
                </div>

                <div className="fbt-product-card">
                  <div className="fbt-image-container">
                    <img src={fbtItem2.image} alt={fbtItem2.name} />
                  </div>
                  <div className="fbt-product-info">
                    <h4 className="fbt-name">{fbtItem2.name}</h4>
                    <div className="fbt-price-row">
                      <span className="fbt-price">
                        ₹{fbtItem2.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="fbt-summary-card">
            <span className="fbt-bundle-label-new">BUNDLE PRICE</span>
            <span className="fbt-bundle-price-new">
              ₹{fbtTotalPrice.toLocaleString()}
            </span>
            <span className="fbt-mrp-line">
              MRP{" "}
              <span className="fbt-mrp-striked">
                ₹{fbtTotalMRP.toLocaleString()}
              </span>
            </span>
            {fbtSavings > 0 && (
              <div className="fbt-save-pill">
                <span>
                  You Save ₹{fbtSavings.toLocaleString()} ({fbtDiscountPercent}%)
                </span>
              </div>
            )}
            <button className="fbt-add-all-btn" onClick={onAddBundle}>
              <span className="fbt-btn-row1">
                <MessageSquare size={14} />
                <span>Enquire</span>
              </span>
              <span className="fbt-btn-row2">Products</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalFBT;
