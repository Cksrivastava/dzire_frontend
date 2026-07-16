import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CustomerAccount.css';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Wallet, 
  Heart, 
  TicketPercent, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const CustomerAccount = () => {
  return (
    <>
      <Navbar />
      <div className="account-container">
        
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div className="account-sidebar-menu">
            <NavLink to="/account" className="account-sidebar-link active" end>
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
        <div className="account-content">
          <div className="account-header">
            <h1>Hello, John Doe!</h1>
            <p>Welcome back to your account dashboard.</p>
          </div>

          <div className="account-dashboard-cards">
            <div className="account-card" onClick={() => window.location.href='/account/orders'}>
              <div className="account-card-icon"><ShoppingBag size={24} /></div>
              <div className="account-card-value">12</div>
              <div className="account-card-label">Total Orders</div>
            </div>
            
            <div className="account-card" onClick={() => window.location.href='/account/wallet'}>
              <div className="account-card-icon"><Wallet size={24} /></div>
              <div className="account-card-value">₹1,250</div>
              <div className="account-card-label">Wallet Balance</div>
            </div>
            
            <div className="account-card">
              <div className="account-card-icon"><Heart size={24} /></div>
              <div className="account-card-value">8</div>
              <div className="account-card-label">Wishlist Items</div>
            </div>
            
            <div className="account-card" onClick={() => window.location.href='/account/wallet'}>
              <div className="account-card-icon" style={{backgroundColor: '#e3fcef', color: '#12b76a'}}><TicketPercent size={24} /></div>
              <div className="account-card-value">450</div>
              <div className="account-card-label">Loyalty Points</div>
            </div>
          </div>

          <div className="account-section">
            <h2>Recent Orders</h2>
            <div className="recent-orders-list">
              <div className="recent-order-item">
                <div className="order-info">
                  <h3>Order #DZ-10045</h3>
                  <p>Placed on Oct 24, 2026 • ₹4,999</p>
                </div>
                <div className="order-status">Delivered</div>
                <a href="/order-details" className="view-btn">View Details</a>
              </div>
              
              <div className="recent-order-item">
                <div className="order-info">
                  <h3>Order #DZ-10042</h3>
                  <p>Placed on Oct 10, 2026 • ₹1,299</p>
                </div>
                <div className="order-status" style={{backgroundColor: '#fff4ed', color: '#ff6600'}}>Processing</div>
                <a href="/order-details" className="view-btn">View Details</a>
              </div>
            </div>
          </div>

          <div className="account-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Profile Details</h2>
              <button style={{ color: '#ff6600', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ color: '#667085', fontSize: '14px', marginBottom: '4px' }}>Full Name</p>
                <p style={{ fontWeight: '500', margin: 0 }}>John Doe</p>
              </div>
              <div>
                <p style={{ color: '#667085', fontSize: '14px', marginBottom: '4px' }}>Email Address</p>
                <p style={{ fontWeight: '500', margin: 0 }}>john.doe@example.com</p>
              </div>
              <div>
                <p style={{ color: '#667085', fontSize: '14px', marginBottom: '4px' }}>Phone Number</p>
                <p style={{ fontWeight: '500', margin: 0 }}>+91 9876543210</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustomerAccount;
