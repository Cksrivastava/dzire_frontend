import React, { useState, useContext, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShopContext } from '../context/ShopContext';
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
  X,
  ChevronRight
} from 'lucide-react';

import AccountSidebar from '../components/AccountSidebar';
import AccountHeader from '../components/AccountHeader';
import { userAPI } from '../services/api';

const DEFAULT_ADDRESSES = [
  {
    id: "addr_1",
    title: "Home",
    fullName: "John Doe",
    street: "123 Main St, Apt 4B\nNear Central Park",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    country: "India",
    phone: "+91 9876543210",
    isDefault: true,
  },
  {
    id: "addr_2",
    title: "Office",
    fullName: "John Doe",
    street: "Tech Park Building 5, 3rd Floor\nHinjewadi Phase 1",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411057",
    country: "India",
    phone: "+91 9876543210",
    isDefault: false,
  },
];

const SavedAddresses = () => {
  const { user } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirectTo=/account/addresses');
    }
  }, [user, navigate]);

  const [addresses, setAddresses] = useState(() => (Array.isArray(user?.addresses) && user.addresses.length > 0 ? user.addresses : []));
  const [showModal, setShowModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    title: "Home",
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    pincode: "",
    state: "Maharashtra",
    isDefault: false,
  });

  useEffect(() => {
    let mounted = true;
    userAPI.getAddresses()
      .then((res) => {
        if (mounted && Array.isArray(res.addresses)) {
          setAddresses(res.addresses);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSaveAddress = async () => {
    if (!newAddr.street.trim() && !newAddr.city.trim()) {
      setShowModal(false);
      return;
    }
    const created = {
      title: newAddr.title || "Home",
      fullName: newAddr.fullName || user?.name || "Customer",
      phone: newAddr.phone || user?.phone || "",
      street: newAddr.street.trim(),
      city: newAddr.city.trim(),
      state: newAddr.state || "Maharashtra",
      pincode: newAddr.pincode.trim(),
      country: "India",
      isDefault: Boolean(newAddr.isDefault),
    };

    setShowModal(false);

    try {
      const res = await userAPI.addAddress(created);
      if (res && Array.isArray(res.addresses)) {
        setAddresses(res.addresses);
      } else {
        setAddresses((prev) => [...prev, created]);
      }
    } catch (err) {
      console.warn("Backend address sync fallback:", err);
    }
  };

  const handleDeleteAddress = async (id) => {
    setAddresses((prev) => prev.filter((a) => (a._id || a.id) !== id));
    try {
      const res = await userAPI.deleteAddress(id);
      if (res && Array.isArray(res.addresses)) {
        setAddresses(res.addresses);
      }
    } catch (err) {
      console.warn("Backend address delete fallback:", err);
    }
  };

  const handleSetDefault = async (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: (a._id || a.id) === id,
      }))
    );
    try {
      const res = await userAPI.setDefaultAddress(id);
      if (res && Array.isArray(res.addresses)) {
        setAddresses(res.addresses);
      }
    } catch (err) {
      console.warn("Backend address set default fallback:", err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        {/* Top Breadcrumb Bar (Below BROWSE CATEGORIES) */}
        <div className="profile-top-breadcrumb-bar">
          <div className="profile-top-breadcrumb">
            <Link to="/" className="breadcrumb-home">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-active">Saved Addresses</span>
          </div>
        </div>

        <div className="profile-page-container">
          
          {/* Reusable Left Sidebar Navigation */}
          <AccountSidebar />

          {/* Main Content Area */}
          <main className="profile-main-content">
            <AccountHeader
              title="Saved Addresses"
              subtitle="Manage your delivery addresses for quick checkout."
            />
            <div className="addresses-top-action-bar">
              <button className="btn-primary-small" onClick={() => setShowModal(true)}>
                <Plus size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Add New Address
              </button>
            </div>

          <div className="addresses-grid">
            {addresses.map((addr) => {
              const addrId = addr._id || addr.id;
              return (
                <div key={addrId} className={`address-card ${addr.isDefault ? "default" : ""}`}>
                  {addr.isDefault && <span className="address-default-badge">Default</span>}
                  <h3 className="address-name">
                    {addr.fullName || addr.name || "Customer"} ({addr.title || addr.type || "Home"})
                  </h3>
                  <p className="address-details">
                    {addr.street}<br />
                    {addr.city}, {addr.state} {addr.pincode}<br />
                    {addr.country || "India"}<br /><br />
                    Phone: {addr.phone}
                  </p>
                  <div className="address-actions">
                    <button className="btn-edit" onClick={() => setShowModal(true)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDeleteAddress(addrId)}>Delete</button>
                    {!addr.isDefault && (
                      <button className="btn-set-default" onClick={() => handleSetDefault(addrId)}>
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add New Button Card */}
            <div className="address-card add-new-address-card" onClick={() => setShowModal(true)}>
              <div className="add-new-icon">
                <Plus size={24} />
              </div>
              <span className="add-new-text">Add New Address</span>
            </div>

          </div>
          </main>
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
                <input
                  type="text"
                  placeholder="Home"
                  value={newAddr.title}
                  onChange={(e) => setNewAddr({ ...newAddr, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  placeholder="+91"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <textarea
                  rows="2"
                  placeholder="House/Flat No., Building Name, Street"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Pincode</label>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>State</label>
                <select
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                >
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                  <option>Karnataka</option>
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ accentColor: '#ff6600' }}
                  checked={newAddr.isDefault}
                  onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                />
                Make this my default address
              </label>
              <button
                className="btn-primary-small"
                style={{ width: '100%', marginTop: '24px', padding: '12px' }}
                onClick={handleSaveAddress}
              >
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
