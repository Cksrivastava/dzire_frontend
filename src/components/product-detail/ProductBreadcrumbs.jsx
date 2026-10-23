import React from "react";
import { useNavigate } from "react-router-dom";

export const ProductBreadcrumbs = ({ product, isMobile = false }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const cat = product.category || "Shop";
  let subcat = "Product";
  const catLower = cat.toLowerCase();
  if (catLower.includes("bag") || catLower.includes("backpack")) {
    subcat = "Rucksack";
  } else if (catLower.includes("foot-wear") || catLower.includes("shoes")) {
    subcat = "Trekking Shoes";
  } else if (catLower.includes("tops") || catLower.includes("apparel") || catLower.includes("clothing")) {
    subcat = "Tops";
  } else if (catLower.includes("camping") || catLower.includes("tent")) {
    subcat = "Camping Gear";
  } else if (catLower.includes("fitness") || catLower.includes("gym")) {
    subcat = "Fitness Gear";
  } else if (catLower.includes("cycling") || catLower.includes("cycle")) {
    subcat = "Bicycles";
  }

  const showSubcat = subcat && subcat !== "Product" && subcat.toLowerCase() !== cat.toLowerCase();

  const breadcrumbsContent = (
    <>
      <span onClick={() => navigate("/")}>Home</span>
      <span className="separator">&gt;</span>
      <span onClick={() => navigate("/shop")}>{cat}</span>
      {showSubcat && (
        <>
          <span className="separator">&gt;</span>
          <span onClick={() => navigate(`/shop?category=${cat}`)}>{subcat}</span>
        </>
      )}
      <span className="separator">&gt;</span>
      <span className="current-crumb" style={{ cursor: "default" }}>
        {product.name}
      </span>
    </>
  );

  if (isMobile) {
    return (
      <div className="product-mobile-header">
        <div className="product-mobile-breadcrumb">{breadcrumbsContent}</div>
      </div>
    );
  }

  return (
    <div className="product-breadcrumb wildcraft-breadcrumb product-desktop-only">
      {breadcrumbsContent}
    </div>
  );
};

export default ProductBreadcrumbs;
