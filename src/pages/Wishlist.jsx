import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { X, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShopContext } from "../context/ShopContext";
import "./Wishlist.css";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems = [], removeFromWishlist, addToCart } = useContext(ShopContext);

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      <Navbar />

      <div className="wishlist-page">
        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <img
              src="https://cdn-icons-png.flaticon.com/512/679/679720.png"
              alt="Empty wishlist"
              className="wishlist-empty-img"
            />
            <h2>Your Wishlist is Empty</h2>
            <p>Save your favourite products here to buy later</p>
            <button
              className="wishlist-continue-btn"
              onClick={() => navigate("/shop")}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <>
            <div className="wishlist-header">
              <h1>
                Wishlist <span>{wishlistItems.length} items</span>
              </h1>
            </div>

            <div className="wishlist-grid">
              {wishlistItems.map((item) => (
                <div className="wishlist-card" key={item.id}>
                  <button
                    className="wishlist-remove-btn"
                    onClick={() => removeFromWishlist(item.id)}
                    aria-label="Remove from wishlist"
                    type="button"
                  >
                    <X size={22} />
                  </button>

                  <div
                    className="wishlist-image-wrap"
                    onClick={() => handleProductClick(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="wishlist-image"
                    />

                    <div className="wishlist-rating">
                      <Star size={14} fill="currentColor" />
                      <span>{item.rating || "4.5"}</span>
                      <span>|</span>
                      <span>{item.reviews || "3.4k"}</span>
                    </div>
                  </div>

                  <div className="wishlist-info">
                    <h3 className="wishlist-brand">{item.brand || "DOMYOS"}</h3>

                    <p
                      className="wishlist-name"
                      onClick={() => handleProductClick(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.name}
                    </p>

                    <div className="wishlist-price-row">
                      <span className="wishlist-price">₹ {item.price}</span>
                      {item.oldPrice && (
                        <span className="wishlist-old-price">₹ {item.oldPrice}</span>
                      )}
                    </div>
                  </div>

                  <button
                    className="wishlist-cart-btn"
                    onClick={() => handleMoveToCart(item)}
                  >
                    MOVE TO CART
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Wishlist;