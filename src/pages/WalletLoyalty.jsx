import React, { useState, useContext, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShopContext } from '../context/ShopContext';
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
  RefreshCcw,
  ChevronRight
} from 'lucide-react';

import AccountSidebar from '../components/AccountSidebar';
import AccountHeader from '../components/AccountHeader';
import { userAPI } from '../services/api';

const WalletLoyalty = () => {
  const { user } = useContext(ShopContext);
  const navigate = useNavigate();

  const [creditData, setCreditData] = useState({
    credits: user?.credits ?? 500,
    earnedCredits: user?.earnedCredits ?? 500,
    usedCredits: user?.usedCredits ?? 0,
    activities: [],
  });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirectTo=/account/wallet');
    }
  }, [user, navigate]);

  useEffect(() => {
    let mounted = true;
    userAPI
      .getCredits()
      .then((res) => {
        if (mounted && res && res.success) {
          setCreditData(res);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [user]);

  if (!user) {
    return null;
  }

  const currentPoints = creditData.credits ?? (user?.credits ?? 500);

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        {/* Top Breadcrumb Bar (Below BROWSE CATEGORIES) */}
        <div className="profile-top-breadcrumb-bar">
          <div className="profile-top-breadcrumb">
            <Link to="/" className="breadcrumb-home">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-active">Dzire Credit Points</span>
          </div>
        </div>

        <div className="profile-page-container">

          {/* Reusable Left Sidebar Navigation */}
          <AccountSidebar />

          {/* Main Content Area */}
          <main className="profile-main-content">
            <AccountHeader
              title="Dzire Credit Points"
              subtitle="Manage and redeem your Dzire Credit points."
            />

            <div className="wallet-loyalty-header">
              {/* Dzire Credit Points Card */}
              <div className="balance-card loyalty">
                <div className="balance-title">
                  <TicketPercent size={20} color="#12b76a" />
                  Dzire Credit Points
                </div>
                <div className="balance-amount">{currentPoints} <span style={{ fontSize: '20px', color: '#667085' }}>pts</span></div>
                <div className="balance-subtitle">Equivalent to ₹{currentPoints}.</div>
                <div className="wallet-actions">
                  <button
                    className="btn-outline"
                    style={{ borderColor: '#12b76a', color: '#12b76a' }}
                    onClick={() => navigate('/shop')}
                  >
                    Redeem Now
                  </button>
                </div>
              </div>
            </div>

            {/* How Dzire Credit Points work */}
            <div className="how-it-works">
              <h3><Info size={18} /> How Dzire Credit Points Work</h3>
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
                <h2>Credit Points History</h2>
              </div>

              <div className="transaction-list">
                {creditData.activities && creditData.activities.length > 0 ? (
                  creditData.activities.map((act, index) => {
                    const isDebit = act.type === "deducted" || act.type === "redeemed";
                    return (
                      <div className="transaction-item" key={act.id || act._id || index}>
                        <div className="transaction-info">
                          <div className={`transaction-icon ${isDebit ? "debit" : "credit"}`}>
                            {isDebit ? <RefreshCcw size={20} /> : <Gift size={20} />}
                          </div>
                          <div className="transaction-details">
                            <h4>{act.ref || (isDebit ? "Redeemed Points" : "Earned Points")}</h4>
                            <p>{act.date || "Recent"}</p>
                          </div>
                        </div>
                        <div className={`transaction-amount ${isDebit ? "debit" : "credit"}`}>
                          <h4>{isDebit ? `-${act.amount}` : `+${act.amount}`} pts</h4>
                          {isDebit && <p>Success</p>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-icon credit">
                        <Gift size={20} />
                      </div>
                      <div className="transaction-details">
                        <h4>Welcome Bonus Credit Points</h4>
                        <p>{new Date(user?.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </div>
                    <div className="transaction-amount credit">
                      <h4>+{currentPoints} pts</h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WalletLoyalty;
