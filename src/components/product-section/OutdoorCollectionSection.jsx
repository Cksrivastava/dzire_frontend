import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import ProductCard from "../ProductCard";
import { getSectionSettings, SECTION_SETTINGS_EVENT } from "../../services/sectionSettings";

export const OutdoorCollectionSection = ({
  topProducts,
  topItemsPerView,
  checklistRef,
  canScrollLeft,
  canScrollRight,
  handleTopPrev,
  handleTopNext,
  checkScrollBounds,
}) => {
  const [sectionConfig, setSectionConfig] = useState(() => getSectionSettings().outdoor);

  useEffect(() => {
    const handleSettingsUpdate = (e) => {
      if (e.detail?.outdoor) {
        setSectionConfig(e.detail.outdoor);
      } else {
        setSectionConfig(getSectionSettings().outdoor);
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
    prefixLine1 = "Shop",
    prefixLine2 = "your",
    titleLine1 = "Outdoor",
    titleLine2 = "Collection",
    showIcon = true,
  } = sectionConfig || {};

  return (
    <section className="workout-section" id="product-checklist">
      <div className="workout-left">
        <div className="workout-left-content">
          <h2
            className="trending-header-title"
            style={{
              fontFamily: '"Rubik", sans-serif',
              fontSize: "34px",
              fontWeight: "900",
              margin: "0 0 24px 0",
              color: "#111111",
              lineHeight: "1.2",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                verticalAlign: "middle",
                marginRight: "6px",
              }}
            >
              {showIcon && (
                <ClipboardList size={28} style={{ color: "#ff6600", flexShrink: 0 }} />
              )}
              <span
                className="workout-subtitle"
                style={{
                  fontFamily: '"Rubik", sans-serif',
                  color: "#ff6600",
                  margin: 0,
                  textAlign: "left",
                  lineHeight: "1.2",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                {prefixLine1 || "Shop"}{" "}
                {prefixLine2 ? (
                  <>
                    <br className="desktop-break" />
                    {prefixLine2}
                  </>
                ) : null}
              </span>
            </span>
            <span
              style={{
                fontFamily: '"Rubik", sans-serif',
                display: "inline-block",
                verticalAlign: "middle",
                marginTop: "4px",
                fontWeight: "bold",
              }}
            >
              {titleLine1 || "Outdoor"}{" "}
              {titleLine2 ? (
                <>
                  <br className="desktop-break" />
                  {titleLine2}
                </>
              ) : null}
            </span>
          </h2>

          <div
            className="workout-controls"
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "12px",
              marginLeft: "-4px",
              padding: "4px",
            }}
          >
            <button
              className="slider-arrow-new"
              onClick={handleTopPrev}
              disabled={!canScrollLeft}
              type="button"
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "6px",
                border: "1px solid #d5d5d5",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                opacity: !canScrollLeft ? 0.45 : 1,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                if (canScrollLeft) {
                  e.currentTarget.style.borderColor = "#111111";
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d5d5d5";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <ChevronLeft size={22} color="#111111" />
            </button>

            <button
              className="slider-arrow-new"
              onClick={handleTopNext}
              disabled={!canScrollRight}
              type="button"
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "6px",
                border: "1px solid #d5d5d5",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                opacity: !canScrollRight ? 0.45 : 1,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                if (canScrollRight) {
                  e.currentTarget.style.borderColor = "#111111";
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d5d5d5";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <ChevronRight size={22} color="#111111" />
            </button>
          </div>
        </div>
      </div>

      <div className="workout-right">
        <div
          className="top-slider-wrapper"
          style={{
            overflow: "hidden",
            width: "100%",
            paddingTop: "12px",
            paddingBottom: "12px",
            marginTop: "-12px",
            marginBottom: "-12px",
          }}
        >
          <div
            ref={checklistRef}
            className="workout-grid"
            onScroll={checkScrollBounds}
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              scrollBehavior: "smooth",
              userSelect: "none",
              cursor: "grab",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              width: "100%",
              paddingTop: "10px",
              paddingBottom: "10px",
              marginTop: "-10px",
              marginBottom: "-10px",
              scrollSnapType: "x mandatory",
            }}
          >
            {topProducts.map((item) => (
              <div
                className="product-card-wrapper"
                key={`top-wrapper-${item.id}`}
                style={{
                  flex: `0 0 calc((100% - (${topItemsPerView} - 1) * 12px) / ${topItemsPerView})`,
                  width: `calc((100% - (${topItemsPerView} - 1) * 12px) / ${topItemsPerView})`,
                  scrollSnapAlign: "start",
                }}
              >
                <ProductCard
                  key={`top-${item.id}`}
                  item={item}
                  sectionKey="top"
                  isHomePage={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutdoorCollectionSection;
