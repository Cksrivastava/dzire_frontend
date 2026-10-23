import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { featuredProducts } from "../data/products";
import CompareHeader from "../components/compare/CompareHeader";
import CompareEmptyState from "../components/compare/CompareEmptyState";
import CompareTable from "../components/compare/CompareTable";
import "./Compare.css";

const Compare = () => {
  const { user, compareItems, removeFromCompare, addToCart, setCompareItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirectTo=/compare");
    }
  }, [user, navigate]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const itemsParam = searchParams.get("items");
    if (itemsParam) {
      const ids = itemsParam.split(",").map(id => id.trim());
      const matchedProducts = ids
        .map(id => featuredProducts.find(p => String(p.id) === String(id)))
        .filter(Boolean);

      if (matchedProducts.length > 0) {
        setCompareItems(matchedProducts);
      }
    }
  }, [setCompareItems]);

  const handleShare = () => {
    const productIds = compareItems.map(item => item.id).join(",");
    const shareUrl = `${window.location.origin}${window.location.pathname}?items=${productIds}`;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Could not copy link to clipboard: ", err);
      });
  };

  const handleAddToCart = (product) => {
    // Generate simple standard size and color for cart item if not specified
    const cartProduct = {
      ...product,
      selectedSize: "8",
      selectedColor: "Default",
    };
    addToCart(cartProduct);
    navigate("/cart");
  };

  const handleProductClick = (product) => {
    const slug =
      product?.seoSlug ||
      product?.slug ||
      (product?.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : (product?.originalId || product?.id));
    navigate(`/product/${slug}`);
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    if (product.thumb) return product.thumb;
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80";
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      {copied && (
        <div className="compare-toast-notification">
          <span>Comparison link copied to clipboard!</span>
        </div>
      )}
      <div className="compare-page-wrapper">
        <div className="compare-container">
          <CompareHeader
            compareCount={compareItems.length}
            onShare={handleShare}
          />

          {compareItems.length === 0 ? (
            <CompareEmptyState />
          ) : (
            <CompareTable
              compareItems={compareItems}
              onRemove={removeFromCompare}
              onAddToCart={handleAddToCart}
              onProductClick={handleProductClick}
              getProductImage={getProductImage}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Compare;
