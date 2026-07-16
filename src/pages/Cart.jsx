import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, addToCart, decreaseCartQuantity } =
    useContext(ShopContext);

  const [couponCode, setCouponCode] = useState("");
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false);
  const [deliveryType, setDeliveryType] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingFee =
    deliveryType === "store" ? 0 : deliveryType === "home" ? 50 : 0;

  const grandTotal = total + shippingFee;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      alert("Please enter a coupon code");
      return;
    }
    alert(`Coupon "${couponCode}" applied`);
  };

  const handleProceedCheckout = () => {
    setShowCheckoutOptions(true);
  };

  const handlePlaceOrder = () => {
  if (!deliveryType) {
    alert("Please select delivery option");
    return;
  }

  if (!paymentMode) {
    alert("Please select payment mode");
    return;
  }

  const firstItem = cartItems[0];

  navigate("/order-details", {
    state: {
      orderId: "OD" + Date.now(),
      productName: firstItem?.name || "Dzire Store Product",
      color: firstItem?.color || "Multicolor",
      price: grandTotal,
      image: firstItem?.image || "https://picsum.photos/120/120",
      deliveryType:
        deliveryType === "store" ? "Pickup from Store" : "Home Delivery",
      paymentMode: paymentMode === "cash" ? "Cash" : "Online",
    },
  });
};

  return (
    <>
      <Navbar />

      <div className="cart-container">
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-content">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your Cart is Empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <Link to="/shop" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-header">
              <h1 className="cart-title">Shopping Cart</h1>
              <p className="cart-subtitle">
                {cartItems.length} items in your cart
              </p>
            </div>

            <div className="cart-wrapper">
              <div className="cart-items-section">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price">
                        ₹{item.price.toLocaleString()}
                      </p>

                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() => decreaseCartQuantity(item.id)}
                          >
                            -
                          </button>

                          <span className="qty-number">{item.quantity}</span>

                          <button
                            className="qty-btn"
                            onClick={() => addToCart(item)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      <span className="item-total-label">Total</span>
                      <span className="item-total-price">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="coupon-box">
                  <h4 className="coupon-title">Apply Coupon</h4>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="coupon-input"
                    />
                    <button
                      className="apply-coupon-btn"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="rewards-box">
                  <div className="reward-row">
                    <span>Sporty Rewards:</span>
                    <span>₹0</span>
                  </div>
                  <div className="reward-row">
                    <span>Available Balance:</span>
                    <span>₹0</span>
                  </div>
                </div>

                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping Fee</span>
                  <span>
                    {deliveryType === ""
                      ? "Select delivery option"
                      : shippingFee === 0
                      ? "FREE"
                      : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="summary-row shipping-info">
                  
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>

                <button className="checkout-btn" onClick={handleProceedCheckout}>
                  Proceed to Checkout
                </button>

                {showCheckoutOptions && (
                  <div className="checkout-dropdown">
                    <h4 className="checkout-option-title">Select Delivery Type</h4>

                    <div className="delivery-options">
                      <label className="option-label">
                        <input
                          type="radio"
                          name="deliveryType"
                          value="store"
                          checked={deliveryType === "store"}
                          onChange={(e) => {
                            setDeliveryType(e.target.value);
                            setPaymentMode("");
                          }}
                        />
                        Pickup from Store (Shipping Free)
                      </label>

                      <label className="option-label">
                        <input
                          type="radio"
                          name="deliveryType"
                          value="home"
                          checked={deliveryType === "home"}
                          onChange={(e) => {
                            setDeliveryType(e.target.value);
                            setPaymentMode("");
                          }}
                        />
                        Home Delivery (Shipping ₹50)
                      </label>
                    </div>

                    {deliveryType && (
                      <>
                        <h4 className="checkout-option-title payment-title">
                          Select Payment Mode
                        </h4>

                        <div className="payment-options">
                          <label className="option-label">
                            <input
                              type="radio"
                              name="paymentMode"
                              value="cash"
                              checked={paymentMode === "cash"}
                              onChange={(e) => setPaymentMode(e.target.value)}
                            />
                            Cash
                          </label>

                          <label className="option-label">
                            <input
                              type="radio"
                              name="paymentMode"
                              value="online"
                              checked={paymentMode === "online"}
                              onChange={(e) => setPaymentMode(e.target.value)}
                            />
                            Online (Card / UPI)
                          </label>
                        </div>
                      </>
                    )}

                    {deliveryType && paymentMode && (
                      <button
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                      >
                        Confirm Order
                      </button>
                    )}
                  </div>
                )}

                <Link to="/shop" className="continue-shop-link">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Cart;