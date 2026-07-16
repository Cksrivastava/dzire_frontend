import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CustomerAccount.css'; 
import './OffersCoupons.css';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Wallet, 
  Heart, 
  TicketPercent, 
  LogOut,
  Info
} from 'lucide-react';

const OffersCoupons = () => {
  return (
    <>
      <Navbar />
      <div className="account-container">
        
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div className="account-sidebar-menu">
            <NavLink to="/account" className="account-sidebar-link" end>
              <User size={18} /> My Profile
            </NavLink>
            <NavLink to="/account/orders" className="account-sidebar-link">
              <ShoppingBag size={18} /> Order History
            </NavLink>
            <NavLink to="/account/addresses" className="account-sidebar-link">
              <MapPin size={18} /> Saved Addresses
            </NavLink>
            <NavLink to="/account/wallet" className="account-sidebar-link">
              <Wallet size={18} /> Wallet & Loyalty
            </NavLink>
            <NavLink to="/offers" className="account-sidebar-link active">
              <TicketPercent size={18} /> Offers & Coupons
            </NavLink>
            <NavLink to="/wishlist" className="account-sidebar-link">
              <Heart size={18} /> Wishlist
            </NavLink>
            <button className="account-sidebar-link logout" style={{width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit'}}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="offers-content">
          <div className="account-header">
            <h1>Offers & Coupons</h1>
            <p>Exclusive deals and discounts just for you.</p>
          </div>

          <div className="offers-grid">
            
            {/* Coupon 1 */}
            <div className="coupon-card">
              <div className="coupon-left">
                <span className="coupon-value">20%</span>
                <span className="coupon-type">OFF</span>
              </div>
              <div className="coupon-right">
                <h3 className="coupon-title">Winter Collection Sale</h3>
                <p className="coupon-desc">Get 20% off on all winter sports and camping gear. Min order value ₹2000.</p>
                <div className="coupon-footer">
                  <div className="coupon-code-box" onClick={() => alert('Code copied!')}>WINTER20</div>
                  <span className="coupon-expiry">Expires in 3 days</span>
                </div>
              </div>
            </div>

            {/* Coupon 2 */}
            <div className="coupon-card">
              <div className="coupon-left" style={{ backgroundColor: '#e3fcef', borderRightColor: '#a6f4c5' }}>
                <span className="coupon-value" style={{ color: '#12b76a' }}>₹500</span>
                <span className="coupon-type" style={{ color: '#027a48' }}>FLAT</span>
              </div>
              <div className="coupon-right">
                <h3 className="coupon-title">Welcome Bonus</h3>
                <p className="coupon-desc">Flat ₹500 discount on your first order of premium hiking backpacks.</p>
                <div className="coupon-footer">
                  <div className="coupon-code-box" onClick={() => alert('Code copied!')}>NEWBIE500</div>
                  <span className="coupon-expiry" style={{ color: '#111111' }}>Valid till Dec 31</span>
                </div>
              </div>
            </div>

            {/* Coupon 3 */}
            <div className="coupon-card">
              <div className="coupon-left" style={{ backgroundColor: '#f9fafb', borderRightColor: '#d1d5db' }}>
                <span className="coupon-value" style={{ color: '#111111' }}>FREE</span>
                <span className="coupon-type" style={{ color: '#667085' }}>SHIPPING</span>
              </div>
              <div className="coupon-right">
                <h3 className="coupon-title">Free Delivery</h3>
                <p className="coupon-desc">Enjoy free standard delivery on all orders above ₹999 across India.</p>
                <div className="coupon-footer">
                  <div className="coupon-code-box" onClick={() => alert('Code copied!')}>FREESHIP</div>
                  <span className="coupon-expiry" style={{ color: '#111111' }}>Ongoing</span>
                </div>
              </div>
            </div>

            {/* Expired Coupon */}
            <div className="coupon-card expired">
              <div className="coupon-left">
                <span className="coupon-value">15%</span>
                <span className="coupon-type">OFF</span>
              </div>
              <div className="coupon-right">
                <h3 className="coupon-title">Diwali Special</h3>
                <p className="coupon-desc">Festive season discount on all camping tents.</p>
                <div className="coupon-footer">
                  <div className="coupon-code-box">DIWALI15</div>
                  <span className="coupon-expiry">Expired on Oct 10</span>
                </div>
              </div>
            </div>

          </div>

          <div className="coupon-note">
            <Info size={20} color="#ff6600" />
            <span><strong>Note:</strong> Coupons can be applied during checkout. Only one coupon can be used per order.</span>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default OffersCoupons;
