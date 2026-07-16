import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CustomerAccount.css'; 
import './SavedAddresses.css';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Wallet, 
  Heart, 
  TicketPercent, 
  LogOut,
  Plus,
  X
} from 'lucide-react';

const SavedAddresses = () => {
  const [showModal, setShowModal] = useState(false);

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
            <NavLink to="/account/addresses" className="account-sidebar-link active">
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
        <div className="addresses-content">
          <div className="account-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1>Saved Addresses</h1>
              <p>Manage your delivery addresses for quick checkout.</p>
            </div>
            <button className="btn-primary-small" onClick={() => setShowModal(true)}>
              <Plus size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Add New Address
            </button>
          </div>

          <div className="addresses-grid">
            
            {/* Default Address */}
            <div className="address-card default">
              <span className="address-default-badge">Default</span>
              <h3 className="address-name">John Doe (Home)</h3>
              <p className="address-details">
                123 Main St, Apt 4B<br />
                Near Central Park<br />
                Pune, Maharashtra 411001<br />
                India<br /><br />
                Phone: +91 9876543210
              </p>
              <div className="address-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-delete">Delete</button>
              </div>
            </div>

            {/* Other Address */}
            <div className="address-card">
              <h3 className="address-name">John Doe (Office)</h3>
              <p className="address-details">
                Tech Park Building 5, 3rd Floor<br />
                Hinjewadi Phase 1<br />
                Pune, Maharashtra 411057<br />
                India<br /><br />
                Phone: +91 9876543210
              </p>
              <div className="address-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-delete">Delete</button>
                <button className="btn-set-default">Set as Default</button>
              </div>
            </div>

            {/* Add New Button Card */}
            <div className="address-card add-new-address-card" onClick={() => setShowModal(true)}>
              <div className="add-new-icon">
                <Plus size={24} />
              </div>
              <span className="add-new-text">Add New Address</span>
            </div>

          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div className="address-modal-overlay">
          <div className="address-modal">
            <div className="address-modal-header">
              <h2>Add New Address</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="address-modal-body">
              <div className="form-group">
                <label>Address Title (e.g., Home, Office)</label>
                <input type="text" placeholder="Home" />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input type="text" placeholder="+91" />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <textarea rows="2" placeholder="House/Flat No., Building Name, Street"></textarea>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>City</label>
                  <input type="text" placeholder="City" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Pincode</label>
                  <input type="text" placeholder="Pincode" />
                </div>
              </div>
              <div className="form-group">
                <label>State</label>
                <select>
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                  <option>Karnataka</option>
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#ff6600' }} />
                Make this my default address
              </label>
              <button className="btn-primary-small" style={{ width: '100%', marginTop: '24px', padding: '12px' }} onClick={() => setShowModal(false)}>
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default SavedAddresses;
