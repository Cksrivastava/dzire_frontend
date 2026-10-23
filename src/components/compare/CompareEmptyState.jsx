import React from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, ArrowLeft } from "lucide-react";

const CompareEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="compare-empty-state">
      <div className="empty-icon-wrap">
        <RefreshCw size={48} className="empty-compare-icon" />
      </div>
      <h2>Your comparison list is empty</h2>
      <p>Add products from our shop page to compare their specs side-by-side.</p>
      <button onClick={() => navigate("/shop")} className="compare-empty-btn">
        <ArrowLeft size={16} />
        <span>Back to Shop</span>
      </button>
    </div>
  );
};

export default CompareEmptyState;
