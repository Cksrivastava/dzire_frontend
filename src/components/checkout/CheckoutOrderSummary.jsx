import React from "react";
import { AlertCircle } from "lucide-react";

const CheckoutOrderSummary = ({
  cartItems = [],
  subtotal = 7498,
  gst = 1144,
  shipping = 50,
  discount = 0,
  total = 7548,
  paymentMethod,
  setPaymentMethod,
  onPlaceOrder,
  isPlacingOrder,
}) => {
  const displayItems =
    cartItems.length > 0
      ? cartItems
      : [
          {
            id: 1,
            name: "Premium Hiking Backpack",
            quantity: 1,
            price: 2499,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80",
          },
          {
            id: 2,
            name: "Camping Tent (2 Person)",
            quantity: 1,
            price: 4999,
            image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=300&q=80",
          },
        ];

  return (
    <div className="checkout-right">
      <div className="checkout-section">
        <h2>Order Summary</h2>

        <div style={{ marginBottom: "20px" }}>
          {displayItems.map((item, index) => (
            <div
              key={item.id || index}
              style={{ display: "flex", gap: "12px", marginBottom: "16px" }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.image || item.img ? (
                  <img
                    src={item.image || item.img}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : null}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: "500", margin: "0 0 4px 0" }}>
                  {item.name}
                </p>
                <p style={{ fontSize: "13px", color: "#667085", margin: "0" }}>
                  Qty: {item.quantity || 1}
                </p>
              </div>
              <p style={{ fontSize: "14px", fontWeight: "600" }}>
                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        <div className="form-group" style={{ display: "flex", gap: "10px" }}>
          <input type="text" placeholder="Coupon Code" style={{ flex: 1 }} />
          <button
            type="button"
            style={{
              padding: "0 16px",
              backgroundColor: "#111111",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Apply
          </button>
        </div>

        <div className="order-summary-item">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="order-summary-item">
          <span>Estimated GST (18% Incl.)</span>
          <span style={{ color: "#3b82f6" }}>₹{gst.toLocaleString("en-IN")}</span>
        </div>
        <div className="order-summary-item">
          <span>Shipping</span>
          <span>₹{shipping.toLocaleString("en-IN")}</span>
        </div>
        <div className="order-summary-item" style={{ color: "#12b76a" }}>
          <span>Discount</span>
          <span>-₹{discount.toLocaleString("en-IN")}</span>
        </div>
        <div className="order-summary-item" style={{ color: "#ff6600" }}>
          <span>Dzire Credit Points (Available: 500 = ₹500)</span>
          <span style={{ cursor: "pointer", textDecoration: "underline" }}>Redeem</span>
        </div>

        <div className="order-summary-total">
          <span>Total</span>
          <span style={{ color: "#ff6600" }}>₹{total.toLocaleString("en-IN")}</span>
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
            Payment Method
          </p>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "razorpay"}
                onChange={() => setPaymentMethod && setPaymentMethod("razorpay")}
              />
              Credit/Debit Card, UPI (Razorpay)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod && setPaymentMethod("cod")}
              />
              Cash on Delivery (COD)
            </label>
          </div>
        </div>

        <button
          className="checkout-btn"
          type="button"
          onClick={onPlaceOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>
        <div className="checkout-note">
          <AlertCircle size={14} />
          <span>Stock will be deducted only after successful payment.</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
