import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Checkout.css';
import { AlertCircle } from 'lucide-react';

const Checkout = () => {
  return (
    <>
      <Navbar />
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
        </div>
        
        <div className="checkout-content">
          <div className="checkout-left">
            <div className="checkout-section">
              <h2>Contact Details</h2>
              <div className="form-group">
                <label>Email Address or Phone Number</label>
                <input type="text" placeholder="Enter email or phone" />
              </div>
            </div>

            <div className="checkout-section">
              <h2>Shipping Address</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" placeholder="123 Main St, Apt 4B" />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>City</label>
                  <input type="text" placeholder="Pune" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>State</label>
                  <input type="text" placeholder="Maharashtra" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Pincode</label>
                  <input type="text" placeholder="411001" />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h2>Delivery Method</h2>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="delivery" defaultChecked />
                  Standard Home Delivery (3-5 Days) - ₹50
                </label>
                <label className="radio-label">
                  <input type="radio" name="delivery" />
                  Store Pickup (Pune Hub) - Free
                </label>
              </div>
            </div>
            
            <div className="checkout-section">
              <h2>Order Notes (Optional)</h2>
              <div className="form-group">
                <textarea rows="3" placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
              </div>
            </div>
          </div>

          <div className="checkout-right">
            <div className="checkout-section">
              <h2>Order Summary</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>Premium Hiking Backpack</p>
                    <p style={{ fontSize: '13px', color: '#667085', margin: '0' }}>Qty: 1</p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>₹2,499</p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>Camping Tent (2 Person)</p>
                    <p style={{ fontSize: '13px', color: '#667085', margin: '0' }}>Qty: 1</p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>₹4,999</p>
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Coupon Code" style={{ flex: 1 }} />
                <button style={{ padding: '0 16px', backgroundColor: '#111111', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Apply</button>
              </div>

              <div className="order-summary-item">
                <span>Subtotal</span>
                <span>₹7,498</span>
              </div>
              <div className="order-summary-item">
                <span>Shipping</span>
                <span>₹50</span>
              </div>
              <div className="order-summary-item" style={{ color: '#12b76a' }}>
                <span>Discount</span>
                <span>-₹0</span>
              </div>
              <div className="order-summary-item" style={{ color: '#ff6600' }}>
                <span>Loyalty Points (Available: 500 = ₹500)</span>
                <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Redeem</span>
              </div>
              
              <div className="order-summary-total">
                <span>Total</span>
                <span style={{ color: '#ff6600' }}>₹7,548</span>
              </div>

              <div style={{ marginTop: '24px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Payment Method</p>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="payment" defaultChecked />
                    Credit/Debit Card, UPI (Razorpay)
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="payment" />
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>

              <button className="checkout-btn">Place Order</button>
              <div className="checkout-note">
                <AlertCircle size={14} />
                <span>Stock will be deducted only after successful payment.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
