import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CustomerAccount.css'; 
import './WalletLoyalty.css';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Wallet, 
  Heart, 
  TicketPercent, 
  LogOut,
  ArrowDownLeft,
  ArrowUpRight,
  Info,
  Gift,
  Coins,
  RefreshCcw
} from 'lucide-react';

const WalletLoyalty = () => {
  const [activeTab, setActiveTab] = useState('wallet');

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
            <NavLink to="/account/wallet" className="account-sidebar-link active">
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
        <div className="wallet-content">
          <div className="account-header">
            <h1>Wallet & Loyalty</h1>
            <p>Manage your wallet balance and loyalty points.</p>
          </div>

          <div className="wallet-loyalty-header">
            {/* Wallet Card */}
            <div className="balance-card wallet">
              <div className="balance-title">
                <Wallet size={20} color="#ff6600" />
                Wallet Balance
              </div>
              <div className="balance-amount">₹1,250</div>
              <div className="balance-subtitle">Use your wallet balance for fast checkouts.</div>
              <div className="wallet-actions">
                <button className="btn-primary-small">Add Money</button>
              </div>
            </div>

            {/* Loyalty Card */}
            <div className="balance-card loyalty">
              <div className="balance-title">
                <TicketPercent size={20} color="#12b76a" />
                Loyalty Points
              </div>
              <div className="balance-amount">450 <span style={{fontSize: '20px', color: '#667085'}}>pts</span></div>
              <div className="balance-subtitle">Equivalent to ₹450. Valid till Dec 31, 2026.</div>
              <div className="wallet-actions">
                <button className="btn-outline" style={{ borderColor: '#12b76a', color: '#12b76a' }}>Redeem Now</button>
              </div>
            </div>
          </div>

          {/* Loyalty How it works */}
          <div className="how-it-works">
            <h3><Info size={18} /> How Loyalty Points Work</h3>
            <div className="how-it-works-grid">
              <div className="how-step">
                <div className="how-step-icon"><ShoppingBag size={24} /></div>
                <p>Shop on Dzire Store and earn points on every eligible order.</p>
              </div>
              <div className="how-step">
                <div className="how-step-icon"><Coins size={24} /></div>
                <p><strong>₹100 spent = 1 Point earned.</strong></p>
              </div>
              <div className="how-step">
                <div className="how-step-icon"><RefreshCcw size={24} /></div>
                <p><strong>1 Point = ₹1.</strong> Redeem them on your next purchase.</p>
              </div>
            </div>
          </div>

          <div className="transactions-section" style={{ marginTop: '32px' }}>
            <div className="transactions-header">
              <h2>Transaction History</h2>
            </div>
            <div className="transaction-tabs">
              <div 
                className={`transaction-tab ${activeTab === 'wallet' ? 'active' : ''}`}
                onClick={() => setActiveTab('wallet')}
              >
                Wallet Transactions
              </div>
              <div 
                className={`transaction-tab ${activeTab === 'loyalty' ? 'active' : ''}`}
                onClick={() => setActiveTab('loyalty')}
              >
                Loyalty Points History
              </div>
            </div>

            <div className="transaction-list">
              {activeTab === 'wallet' ? (
                <>
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-icon credit">
                        <ArrowDownLeft size={20} />
                      </div>
                      <div className="transaction-details">
                        <h4>Refund from Order #DZ-10020</h4>
                        <p>Oct 15, 2026 • 10:30 AM</p>
                      </div>
                    </div>
                    <div className="transaction-amount credit">
                      <h4>+₹1,250</h4>
                      <p>Success</p>
                    </div>
                  </div>
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-icon debit">
                        <ArrowUpRight size={20} />
                      </div>
                      <div className="transaction-details">
                        <h4>Paid for Order #DZ-10015</h4>
                        <p>Sep 28, 2026 • 02:15 PM</p>
                      </div>
                    </div>
                    <div className="transaction-amount debit">
                      <h4>-₹500</h4>
                      <p>Success</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-icon credit">
                        <Gift size={20} />
                      </div>
                      <div className="transaction-details">
                        <h4>Earned from Order #DZ-10045</h4>
                        <p>Oct 24, 2026 • 11:20 AM</p>
                      </div>
                    </div>
                    <div className="transaction-amount credit">
                      <h4>+50 pts</h4>
                      <p>Valid till Oct 2027</p>
                    </div>
                  </div>
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-icon debit">
                        <RefreshCcw size={20} />
                      </div>
                      <div className="transaction-details">
                        <h4>Redeemed on Order #DZ-10042</h4>
                        <p>Oct 10, 2026 • 09:10 AM</p>
                      </div>
                    </div>
                    <div className="transaction-amount debit">
                      <h4>-100 pts</h4>
                      <p>Success</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WalletLoyalty;
