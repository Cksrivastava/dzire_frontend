import React from "react";
import { Plus, ShoppingCart } from "lucide-react";

export const ProductFBT = ({
  product,
  allProductImages,
  fbtItem1,
  fbtItem2,
  fbtSliderRef,
  fbtTotalPrice,
  fbtTotalMRP,
  fbtSavings,
  fbtDiscountPercent,
  handleFbtAddBundleToCart,
}) => {
  return (
    <section className="fbt-section">
      <div className="fbt-inner-card">
        {/* Content Row: Products (left column with header) + Summary Card */}
        <div className="fbt-content">
          {/* Left Column: Header + Products row */}
          <div className="fbt-left-column-layout">
            {/* Header Row: Icon + Title + Save Badge */}
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

            {/* Products list wrapper */}
            <div className="fbt-products-slider-wrapper">
              <div className="fbt-products-row" ref={fbtSliderRef}>
                {/* Product 01 */}
                <div className="fbt-product-card">
                  <div className="fbt-image-container">
                    <img src={allProductImages[0]} alt={product.name} />
                  </div>
                  <div className="fbt-product-info">
                    <h4 className="fbt-name">{product.name}</h4>
                    <div className="fbt-price-row">
                      <span className="fbt-price">₹{product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {fbtItem1 && (
                  <>
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
                          <span className="fbt-price">₹{fbtItem1.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {fbtItem2 && (
                  <>
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
                          <span className="fbt-price">₹{fbtItem2.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Bundle Summary Card */}
          <div className="fbt-summary-card">
            <span className="fbt-bundle-label-new">BUNDLE PRICE</span>
            <span className="fbt-bundle-price-new">₹{fbtTotalPrice.toLocaleString()}</span>
            <span className="fbt-mrp-line">
              MRP <span className="fbt-mrp-striked">₹{fbtTotalMRP.toLocaleString()}</span>
            </span>
            {fbtSavings > 0 && (
              <div className="fbt-save-pill">
                <span>
                  You Save ₹{fbtSavings.toLocaleString()} ({fbtDiscountPercent}%)
                </span>
              </div>
            )}
            <button className="fbt-add-all-btn" onClick={handleFbtAddBundleToCart}>
              <span className="fbt-btn-row1">
                <ShoppingCart size={14} />
                <span>Add Bundle to</span>
              </span>
              <span className="fbt-btn-row2">Cart</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFBT;
