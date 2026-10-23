import React from "react";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import TrendingProductCard from "./TrendingProductCard";
import InteractiveMarquee from "../InteractiveMarquee";

export const CommunityFavoritesSection = ({
  products,
  bestSellersRef,
  handleBestSellersPrev,
  handleBestSellersNext,
  isWishlisted,
  isCompared,
  handleCardClick,
  handleWishlist,
  handleCompare,
  handleAddToCart,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="trending-showcase-section" id="best-sellers">
      <div className="trending-header-modern">
        <div className="trending-header-content">
          <span className="trending-header-badge">
            {products.length > 5 ? `${products.length}+ Products` : `${products.length} Products`}
          </span>

          <div className="trending-header-main-row">
            <div className="trending-header-left-side">
              <h2
                className="trending-header-title"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Trophy size={24} style={{ color: "#ffa41c" }} /> Community Favorites
              </h2>
              <p className="trending-header-subtitle">
                The outdoor essentials our adventure community keeps coming back to.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "2px" }}>
              <div className="trending-controls" style={{ display: "flex", gap: "8px" }}>
                <button
                  className="slider-arrow-new"
                  onClick={handleBestSellersPrev}
                  type="button"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "6px",
                    border: "1px solid #d5d5d5",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    opacity: 1,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    padding: 0,
                    color: "#111111",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#ff6600";
                    e.currentTarget.style.color = "#ff6600";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d5d5d5";
                    e.currentTarget.style.color = "#111111";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <ChevronLeft size={20} color="currentColor" />
                </button>

                <button
                  className="slider-arrow-new"
                  onClick={handleBestSellersNext}
                  type="button"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "6px",
                    border: "1px solid #d5d5d5",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    opacity: 1,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    padding: 0,
                    color: "#111111",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#ff6600";
                    e.currentTarget.style.color = "#ff6600";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d5d5d5";
                    e.currentTarget.style.color = "#111111";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <ChevronRight size={20} color="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="trending-main-layout"
        style={{
          overflow: "hidden",
          width: "100%",
          paddingTop: "12px",
          paddingBottom: "12px",
          marginTop: "-12px",
          marginBottom: "-12px",
        }}
      >
        <InteractiveMarquee
          items={products}
          speed={0}
          direction="left"
          containerRef={bestSellersRef}
          renderItem={(item, idx, ipv) => {
            const isActive = isWishlisted(item.id);
            const count = ipv || 4;
            return (
              <div
                key={`trending-wrapper-${item.id}-${idx}`}
                className="marquee-card-wrapper"
                style={{
                  flex: `0 0 calc((100% - (${count} - 1) * 10px) / ${count})`,
                  width: `calc((100% - (${count} - 1) * 10px) / ${count})`,
                  scrollSnapAlign: "start",
                }}
              >
                <TrendingProductCard
                  key={`${item.id}-${idx}`}
                  item={item}
                  isActive={isActive}
                  isCompared={isCompared(item.id)}
                  onCardClick={handleCardClick}
                  onWishlist={handleWishlist}
                  onCompare={handleCompare}
                  onAddToCart={handleAddToCart}
                />
              </div>
            );
          }}
        />
      </div>
    </section>
  );
};

export default CommunityFavoritesSection;
