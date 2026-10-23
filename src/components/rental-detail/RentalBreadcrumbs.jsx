import React from "react";
import { useNavigate } from "react-router-dom";

const RentalBreadcrumbs = ({ category, name }) => {
  const navigate = useNavigate();

  const crumbs = (
    <>
      <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</span>
      <span className="separator">&gt;</span>
      <span onClick={() => navigate("/rental")} style={{ cursor: "pointer" }}>Rentals</span>
      <span className="separator">&gt;</span>
      <span onClick={() => navigate("/rental")} style={{ cursor: "pointer" }}>{category}</span>
      <span className="separator">&gt;</span>
      <span className="current-crumb">{name}</span>
    </>
  );

  return (
    <>
      {/* Mobile Header Breadcrumbs */}
      <div className="product-mobile-header">
        <div className="product-mobile-breadcrumb">
          {crumbs}
        </div>
      </div>

      {/* Desktop Breadcrumb */}
      <div className="product-breadcrumb wildcraft-breadcrumb product-desktop-only">
        {crumbs}
      </div>
    </>
  );
};

export default RentalBreadcrumbs;
