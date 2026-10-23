import React from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";

const CompareHeader = ({ compareCount, onShare }) => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="compare-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <strong>Compare</strong>
      </div>

      <div className="compare-header">
        <div className="compare-header-top">
          <h1 className="compare-title">Product Comparison</h1>
          {compareCount > 0 && (
            <button className="compare-share-btn" onClick={onShare}>
              <Share2 size={16} />
              <span>Share Comparison</span>
            </button>
          )}
        </div>
        <p className="compare-subtitle">
          Analyze specifications side-by-side to choose the right gear for your adventure.
        </p>
      </div>
    </>
  );
};

export default CompareHeader;
