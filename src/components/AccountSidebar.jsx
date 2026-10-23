import React, { useContext } from 'react';
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
  Check
} from 'lucide-react';
import '../pages/CustomerAccount.css';

const AccountSidebar = () => {
  const { user, logoutUser, deleteAccount } = useContext(ShopContext);
  const navigate = useNavigate();
  const avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
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
    <aside className="profile-sidebar">
      {/* User Profile Mini Header in Sidebar */}
      <div className="sidebar-user-card">
        <div className="sidebar-avatar-wrapper">
          <img src={avatarUrl} alt={user?.name || "User"} className="sidebar-avatar" />
        </div>
        <h3 className="sidebar-user-name">{user?.name || "User"}</h3>
        <p className="sidebar-user-email">{user?.email || user?.phone || "member@dzire.com"}</p>
        <div className="sidebar-verified-badge">
          <Check size={11} strokeWidth={3} /> Verified
        </div>
      </div>

      {/* Sidebar Navigation Items */}
      <div className="sidebar-nav">
        <NavLink
          to="/account"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <User size={18} className="sidebar-icon" />
          <span>My Profile</span>
        </NavLink>

        <NavLink
          to="/account/orders"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <ShoppingBag size={18} className="sidebar-icon" />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/wishlist"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <Heart size={18} className="sidebar-icon" />
          <span>Wishlist</span>
        </NavLink>

        <NavLink
          to="/account/addresses"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <MapPin size={18} className="sidebar-icon" />
          <span>Addresses</span>
        </NavLink>

        <NavLink
          to="/account/wallet"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <Wallet size={18} className="sidebar-icon" />
          <span>Dzire Credit</span>
        </NavLink>

        <NavLink
          to="/support"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <HelpCircle size={18} className="sidebar-icon" />
          <span>Help Center</span>
        </NavLink>

        <button type="button" onClick={handleLogout} className="sidebar-nav-item logout-btn">
          <LogOut size={18} className="sidebar-icon" />
          <span>Logout</span>
        </button>

        <button
          type="button"
          onClick={handleDeleteAccount}
          className="sidebar-nav-item delete-account-sidebar-btn"
        >
          <Trash2 size={18} className="sidebar-icon" />
          <span>Delete Account</span>
        </button>
      </div>
    </aside>
  );
};

export default AccountSidebar;
