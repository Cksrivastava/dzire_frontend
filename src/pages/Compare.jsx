import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RefreshCw, Trash2, ShoppingCart, ArrowLeft, Star, Share2 } from "lucide-react";
import { featuredProducts } from "../data/products";
import "./Compare.css";

const Compare = () => {
  const { compareItems, removeFromCompare, addToCart, setCompareItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const itemsParam = searchParams.get("items");
    if (itemsParam) {
      const ids = itemsParam.split(",").map(id => id.trim());
      const matchedProducts = ids
        .map(id => featuredProducts.find(p => String(p.id) === String(id)))
        .filter(Boolean);

      if (matchedProducts.length > 0) {
        setCompareItems(matchedProducts);
      }
    }
  }, [setCompareItems]);

  const handleShare = () => {
    const productIds = compareItems.map(item => item.id).join(",");
    const shareUrl = `${window.location.origin}${window.location.pathname}?items=${productIds}`;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Could not copy link to clipboard: ", err);
      });
  };

  const handleAddToCart = (product) => {
    // Generate simple standard size and color for cart item if not specified
    const cartProduct = {
      ...product,
      selectedSize: "8",
      selectedColor: "Default",
    };
    addToCart(cartProduct);
    navigate("/cart");
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    if (product.thumb) return product.thumb;
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80";
  };

  return (
    <>
      <Navbar />
      {copied && (
        <div className="compare-toast-notification">
          <span>Comparison link copied to clipboard!</span>
        </div>
      )}
      <div className="compare-page-wrapper">
        <div className="compare-container">
          {/* Breadcrumb */}
          <div className="compare-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <strong>Compare</strong>
          </div>

          <div className="compare-header">
            <div className="compare-header-top">
              <h1 className="compare-title">Product Comparison</h1>
              {compareItems.length > 0 && (
                <button className="compare-share-btn" onClick={handleShare}>
                  <Share2 size={16} />
                  <span>Share Comparison</span>
                </button>
              )}
            </div>
            <p className="compare-subtitle">
              Analyze specifications side-by-side to choose the right gear for your adventure.
            </p>
          </div>

          {compareItems.length === 0 ? (
            <div className="compare-empty-state">
              <div className="empty-icon-wrap">
                <RefreshCw size={48} className="empty-compare-icon" />
              </div>
              <h2>Your comparison list is empty</h2>
              <p>Add products from our shop page to compare their specs side-by-side.</p>
              <button onClick={() => navigate("/shop")} className="compare-empty-btn">
                <ArrowLeft size={16} />
                <span>Back to Shop</span>
              </button>
            </div>
          ) : (
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
                            onClick={() => removeFromCompare(product.id)}
                            title="Remove from comparison"
                          >
                            <Trash2 size={16} />
                          </button>

                          <div className="compare-img-container" onClick={() => navigate(`/product/${product.originalId || product.id}`)}>
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
                              onClick={() => navigate(`/product/${product.originalId || product.id}`)}
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
                              onClick={() => handleAddToCart(product)}
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
                          onClick={() => removeFromCompare(product.id)}
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
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Compare;
