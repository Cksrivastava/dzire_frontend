import React from "react";
import { Trash2, ShoppingCart, Star } from "lucide-react";

const CompareTable = ({
  compareItems,
  onRemove,
  onAddToCart,
  onProductClick,
  getProductImage,
}) => {
  return (
    <div className="compare-table-wrapper">
      <table className="compare-table">
        <thead>
          <tr>
            <th className="compare-feature-header">Features</th>
            {compareItems.map((product) => (
              <th key={product.id} className="compare-product-header">
                <div className="compare-product-top-card">
                  <button
                    className="remove-compare-btn"
                    onClick={() => onRemove(product.id)}
                    title="Remove from comparison"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div
                    className="compare-img-container"
                    onClick={() => onProductClick(product)}
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="compare-product-img"
                    />
                  </div>

                  <div className="compare-card-details">
                    <span className="compare-card-brand">{product.brand || "DZIRE"}</span>
                    <h3
                      className="compare-card-title"
                      onClick={() => onProductClick(product)}
                    >
                      {product.name}
                    </h3>

                    <div className="compare-card-price">
                      <span className="compare-new-price">₹{product.price}</span>
                      {product.oldPrice && (
                        <span className="compare-old-price">₹{product.oldPrice}</span>
                      )}
                    </div>

                    <button
                      className="compare-add-cart-btn"
                      onClick={() => onAddToCart(product)}
                    >
                      <ShoppingCart size={14} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="feature-label">Brand</td>
            {compareItems.map((product) => (
              <td key={`${product.id}-brand`} className="feature-value brand-value">
                {product.brand || "DZIRE"}
              </td>
            ))}
          </tr>
          <tr>
            <td className="feature-label">Price</td>
            {compareItems.map((product) => (
              <td key={`${product.id}-price`} className="feature-value">
                <div className="price-value">
                  <span className="current-price">₹{product.price}</span>
                  {product.oldPrice && <span className="slashed-price">₹{product.oldPrice}</span>}
                </div>
              </td>
            ))}
          </tr>
          <tr>
            <td className="feature-label">Rating</td>
            {compareItems.map((product) => (
              <td key={`${product.id}-rating`} className="feature-value rating-value">
                <div className="compare-rating-wrap">
                  <Star size={14} fill="#ffa41c" color="#ffa41c" />
                  <span className="rating-score">{product.rating || "4.6"}</span>
                  <span className="reviews-count">({product.reviews || "120"} reviews)</span>
                </div>
              </td>
            ))}
          </tr>
          <tr>
            <td className="feature-label">Category</td>
            {compareItems.map((product) => (
              <td key={`${product.id}-cat`} className="feature-value">
                {product.category || "Foot-Wear"}
              </td>
            ))}
          </tr>
          <tr>
            <td className="feature-label">Activity</td>
            {compareItems.map((product) => (
              <td key={`${product.id}-activity`} className="feature-value">
                Trekking, Outdoors, Sports
              </td>
            ))}
          </tr>
          <tr>
            <td className="feature-label">Ideal For</td>
            {compareItems.map((product) => (
              <td key={`${product.id}-ideal`} className="feature-value">
                Men & Women (Unisex)
              </td>
            ))}
          </tr>
          <tr>
            <td className="feature-label">Sizes Available</td>
            {compareItems.map((product) => (
              <td key={`${product.id}-sizes`} className="feature-value sizes-value">
                UK 6, 7, 8, 9, 10, 11
              </td>
            ))}
          </tr>
          <tr>
            <td className="feature-label">Availability</td>
            {compareItems.map((product) => (
              <td key={`${product.id}-stock`} className="feature-value stock-value in-stock">
                In Stock
              </td>
            ))}
          </tr>
          <tr>
            <td className="feature-label">Warranty</td>
            {compareItems.map((product) => (
              <td key={`${product.id}-warranty`} className="feature-value">
                1 Year Brand Warranty
              </td>
            ))}
          </tr>
          <tr>
            <td className="feature-label">Actions</td>
            {compareItems.map((product) => (
              <td key={`${product.id}-actions`} className="feature-value action-value">
                <button
                  className="compare-remove-row-btn"
                  onClick={() => onRemove(product.id)}
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CompareTable;
