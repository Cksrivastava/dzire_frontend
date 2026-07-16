import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './StorePickup.css';
import { Store, MapPin, Clock, Phone, AlertCircle } from 'lucide-react';

const StorePickup = () => {
  return (
    <>
      <Navbar />
      <div className="store-pickup-container">
        <div className="pickup-header">
          <h1>Store Pickup Setup</h1>
          <p>Collect your order from our flagship Pune hub.</p>
        </div>

        <div className="pickup-card">
          <div className="pickup-card-header">
            <Store size={28} />
            <h2>Dzire Store - Pune Hub</h2>
          </div>
          
          <div className="pickup-card-body">
            
            <div className="store-info-box">
              <div className="store-map-placeholder">
                <MapPin size={32} />
              </div>
              <div className="store-details">
                <h3>Main Warehouse & Experience Center</h3>
                <p>Ground Floor, Tech Park Alpha, Hinjewadi Phase 1, Pune, Maharashtra 411057</p>
                
                <div className="store-timing">
                  <Clock size={16} /> Open Today: 10:00 AM - 08:00 PM
                </div>
                
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} /> Get Directions
                  </button>
                  <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} /> Call Store
                  </button>
                </div>
              </div>
            </div>

            <div className="pickup-form">
              <h3>Who is picking up the order?</h3>
              
              <div className="form-row">
                <div className="pickup-form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="John" defaultValue="John" />
                </div>
                <div className="pickup-form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Doe" defaultValue="Doe" />
                </div>
              </div>

              <div className="form-row">
                <div className="pickup-form-group">
                  <label>Mobile Number (For pickup OTP)</label>
                  <input type="text" placeholder="+91 9876543210" defaultValue="+91 9876543210" />
                </div>
                <div className="pickup-form-group">
                  <label>Expected Pickup Date</label>
                  <select>
                    <option>Today (Oct 28)</option>
                    <option>Tomorrow (Oct 29)</option>
                    <option>Wednesday (Oct 30)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pickup-instructions">
              <h4><AlertCircle size={18} /> Important Pickup Instructions</h4>
              <ul>
                <li>Please wait for the "Ready for Pickup" email/SMS before heading to the store.</li>
                <li>Bring a valid Government ID (Aadhar, PAN, Driving License) matching the pickup person's name.</li>
                <li>Keep the Order ID and Pickup OTP ready at the counter.</li>
                <li>Orders not picked up within 7 days will be cancelled and refunded.</li>
              </ul>
            </div>

            <button className="btn-confirm-pickup" onClick={() => window.location.href='/checkout'}>
              Confirm Pickup Details & Proceed
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StorePickup;
