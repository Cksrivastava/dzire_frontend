import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CustomerAccount.css'; // Reuse sidebar styles
import './OrderHistory.css';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Wallet, 
  Heart, 
  TicketPercent, 
  LogOut,
  Search,
  Truck
} from 'lucide-react';

const OrderHistory = () => {
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
            <NavLink to="/account/orders" className="account-sidebar-link active">
              <ShoppingBag size={18} /> Order History
            </NavLink>
            <NavLink to="/account/addresses" className="account-sidebar-link">
              <MapPin size={18} /> Saved Addresses
            </NavLink>
            <NavLink to="/account/wallet" className="account-sidebar-link">
              <Wallet size={18} /> Wallet & Loyalty
            </NavLink>
            <NavLink to="/offers" className="account-sidebar-link">
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
        <div className="order-history-content">
          <div className="account-header">
            <h1>Order History</h1>
            <p>View and track all your previous orders.</p>
          </div>

          <div className="orders-filter-bar">
            <div className="orders-search">
              <Search size={18} color="#667085" />
              <input type="text" placeholder="Search orders by ID or product name..." />
            </div>
            <select className="orders-filter-select">
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="order-history-list">
            
            {/* Order 1 */}
            <div className="order-history-card">
              <div className="order-history-header">
                <div className="order-history-header-left">
                  <div>
                    <span className="order-history-meta-label">Order Placed</span>
                    <span className="order-history-meta-value">Oct 24, 2026</span>
                  </div>
                  <div>
                    <span className="order-history-meta-label">Total</span>
                    <span className="order-history-meta-value">₹4,999</span>
                  </div>
                  <div>
                    <span className="order-history-meta-label">Ship To</span>
                    <span className="order-history-meta-value">John Doe</span>
                  </div>
                </div>
                <div>
                  <span className="order-history-meta-label">Order #</span>
                  <span className="order-history-meta-value">DZ-10045</span>
                </div>
              </div>
              
              <div className="order-history-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#12b76a', borderRadius: '50%', display: 'inline-block' }}></span>
                    Delivered on Oct 27
                  </h3>
                </div>

                <div className="order-history-product">
                  <div className="order-history-product-img"></div>
                  <div className="order-history-product-info">
                    <h4 className="order-history-product-name">Premium Hiking Backpack (45L)</h4>
                    <p className="order-history-product-desc">Color: Orange / Blue | Qty: 1</p>
                  </div>
                  <div className="order-history-product-price">₹4,999</div>
                </div>
              </div>

              <div className="order-history-actions">
                <a href="/return-request/DZ-10045" className="btn-outline">Return Item</a>
                <a href="/order-details" className="btn-outline">View Order Details</a>
                <button className="btn-primary-small">Write a Review</button>
              </div>
            </div>

            {/* Order 2 */}
            <div className="order-history-card">
              <div className="order-history-header">
                <div className="order-history-header-left">
                  <div>
                    <span className="order-history-meta-label">Order Placed</span>
                    <span className="order-history-meta-value">Oct 10, 2026</span>
                  </div>
                  <div>
                    <span className="order-history-meta-label">Total</span>
                    <span className="order-history-meta-value">₹1,299</span>
                  </div>
                  <div>
                    <span className="order-history-meta-label">Ship To</span>
                    <span className="order-history-meta-value">John Doe</span>
                  </div>
                </div>
                <div>
                  <span className="order-history-meta-label">Order #</span>
                  <span className="order-history-meta-value">DZ-10042</span>
                </div>
              </div>
              
              <div className="order-history-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#f79009', borderRadius: '50%', display: 'inline-block' }}></span>
                    In Transit
                  </h3>
                  <p style={{ margin: 0, color: '#667085', fontSize: '14px' }}>Expected delivery: Oct 14</p>
                </div>

                <div className="order-history-product">
                  <div className="order-history-product-img"></div>
                  <div className="order-history-product-info">
                    <h4 className="order-history-product-name">Camping Headlamp LED</h4>
                    <p className="order-history-product-desc">Qty: 1</p>
                  </div>
                  <div className="order-history-product-price">₹1,299</div>
                </div>
              </div>

              <div className="order-history-actions">
                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={16} /> Track Package
                </button>
                <a href="/order-details" className="btn-outline">View Order Details</a>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
