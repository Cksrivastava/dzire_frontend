import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Wallet,
  HelpCircle,
  LogOut,
  Trash2,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import '../pages/CustomerAccount.css';

const AccountHeader = ({ title, subtitle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logoutUser, deleteAccount } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logoutUser();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setIsMobileMenuOpen(false);
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your Dzire account? All your personal details, order records, saved addresses, and Dzire Credit points will be removed. This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteAccount();
      alert("Your account has been permanently deleted.");
      navigate("/login");
    } catch (err) {
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="profile-main-header-wrapper">
      <div className="profile-main-header">
        {/* Mobile Header Toggle Button */}
        <button
          type="button"
          className="header-mobile-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="header-titles">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      {/* Collapsible Navigation Menu on Mobile (Dropdown right under main header) */}
      {isMobileMenuOpen && (
        <div className="mobile-header-nav-dropdown">
          <NavLink
            to="/account"
            className={({ isActive }) => `mobile-nav-dropdown-item ${isActive ? 'active' : ''}`}
            end
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User size={18} />
            <span>My Profile</span>
          </NavLink>

          <NavLink
            to="/account/orders"
            className={({ isActive }) => `mobile-nav-dropdown-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) => `mobile-nav-dropdown-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Heart size={18} />
            <span>Wishlist</span>
          </NavLink>

          <NavLink
            to="/account/addresses"
            className={({ isActive }) => `mobile-nav-dropdown-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <MapPin size={18} />
            <span>Addresses</span>
          </NavLink>

          <NavLink
            to="/account/wallet"
            className={({ isActive }) => `mobile-nav-dropdown-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Wallet size={18} />
            <span>Dzire Credit</span>
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) => `mobile-nav-dropdown-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <HelpCircle size={18} />
            <span>Help Center</span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="mobile-nav-dropdown-item logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="mobile-nav-dropdown-item delete"
          >
            <Trash2 size={18} />
            <span>Delete Account</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountHeader;
