import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import ProductCard from "../ProductCard";
import InteractiveMarquee from "../InteractiveMarquee";
import { getSectionSettings, SECTION_SETTINGS_EVENT } from "../../services/sectionSettings";

export const TrendingGearSection = ({
  bottomProducts,
  popularRef,
  handlePopularPrev,
  handlePopularNext,
}) => {
  const [sectionConfig, setSectionConfig] = useState(() => getSectionSettings().trending);

  useEffect(() => {
    const handleSettingsUpdate = (e) => {
      if (e.detail?.trending) {
        setSectionConfig(e.detail.trending);
      } else {
        setSectionConfig(getSectionSettings().trending);
      }
    };

    window.addEventListener(SECTION_SETTINGS_EVENT, handleSettingsUpdate);
    window.addEventListener("storage", handleSettingsUpdate);
    return () => {
      window.removeEventListener(SECTION_SETTINGS_EVENT, handleSettingsUpdate);
      window.removeEventListener("storage", handleSettingsUpdate);
    };
  }, []);

  const {
    title = "Trending Gear",
    badge = "200+ Products",
    description = "Discover the products outdoor enthusiasts are exploring the most.",
    showIcon = true,
  } = sectionConfig || {};

  return (
    <section className="popular-section">
      <div className="trending-header-modern" style={{ paddingBottom: "14px" }}>
        <div className="trending-header-content">
          {badge && <span className="trending-header-badge">{badge}</span>}

          <div className="trending-header-main-row" style={{ alignItems: "center" }}>
            <div className="trending-header-left-side">
              <h2
                className="trending-header-title"
                style={{ fontSize: "24px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                {showIcon && <Flame size={24} style={{ color: "#ff3333" }} />} {title}
              </h2>
              {description && (
                <p className="trending-header-description">
                  {description}
                </p>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div className="popular-controls" style={{ display: "flex", gap: "8px" }}>
                <button
                  className="slider-arrow-new"
                  onClick={handlePopularPrev}
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
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#111111";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d5d5d5";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <ChevronLeft size={20} color="#111111" />
                </button>

                <button
                  className="slider-arrow-new"
                  onClick={handlePopularNext}
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
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#111111";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d5d5d5";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <ChevronRight size={20} color="#111111" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="popular-main-layout"
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
          items={bottomProducts}
          speed={0}
          direction="left"
          containerRef={popularRef}
          renderItem={(item, idx, ipv) => {
            const count = ipv || 4;
            return (
              <div
                key={`popular-wrapper-${item.id}-${idx}`}
                className="marquee-card-wrapper"
                style={{
                  flex: `0 0 calc((100% - (${count} - 1) * 10px) / ${count})`,
                  width: `calc((100% - (${count} - 1) * 10px) / ${count})`,
                  scrollSnapAlign: "start",
                }}
              >
                <ProductCard
                  key={`popular-${item.id}-${idx}`}
                  item={item}
                  sectionKey="popular"
                  isHomePage={true}
                />
              </div>
            );
          }}
        />
      </div>
    </section>
  );
};

export default TrendingGearSection;
