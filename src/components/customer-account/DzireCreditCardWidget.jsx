import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { ShopContext } from "../../context/ShopContext";

const DzireCreditCardWidget = () => {
  const { user } = useContext(ShopContext);
  const navigate = useNavigate();
  const credits = user?.credits ?? 500;

  return (
    <div className="profile-card credit-widget-card">
      <div className="credit-card-top">
        <div className="credit-header-left">
          <div className="credit-icon-wrapper">
            <Wallet size={20} />
          </div>
          <h3>Dzire Credit</h3>
        </div>
        <button
          type="button"
          className="btn-view-details"
          onClick={() => navigate("/account/wallet")}
        >
          View Details
        </button>
      </div>

      <div className="credit-card-body">
        <span className="balance-label">Available Points / Balance</span>
        <div className="balance-amount">{credits} pts (₹{credits})</div>
        <div className="score-row">
          <span>Dzire Score: </span>
          <span className="score-value">785/900 (EXCELLENT)</span>
        </div>
      </div>
    </div>
  );
};

export default DzireCreditCardWidget;
