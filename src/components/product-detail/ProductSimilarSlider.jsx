import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard";

export const ProductSimilarSlider = ({
  similarProducts,
  similarSliderRef,
  similarCanScrollLeft,
  similarCanScrollRight,
  handleSimilarPrev,
  handleSimilarNext,
  checkSimilarScrollBounds,
}) => {
  const navigate = useNavigate();

  if (!similarProducts || similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="similar-products-fullwidth-wrapper">
      <section className="similar-products-section">
        <div className="section-head">
          <h3 className="section-title">Similar Products</h3>
          <span className="view-all-link" onClick={() => navigate("/shop")}>
            View All <span className="arrow">›</span>
          </span>
        </div>

        <div className="similar-slider-wrap" style={{ position: "relative" }}>
          <button
            className="slider-arrow-new"
            onClick={handleSimilarPrev}
            disabled={!similarCanScrollLeft}
            type="button"
            style={{
              position: "absolute",
              left: "-18px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid #ddd",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: similarCanScrollLeft ? "pointer" : "not-allowed",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              padding: 0,
              zIndex: 10,
              opacity: similarCanScrollLeft ? 1 : 0.4,
              transition: "all 0.2s",
            }}
          >
            <ChevronLeft size={18} color="#333" />
          </button>

          <div
            ref={similarSliderRef}
            className="similar-products-slider"
            onScroll={checkSimilarScrollBounds}
          >
            {similarProducts.map((p) => (
              <ProductCard key={p.id} item={p} sectionKey="similar" isHomePage={true} />
            ))}
          </div>

          <button
            className="slider-arrow-new"
            onClick={handleSimilarNext}
            disabled={!similarCanScrollRight}
            type="button"
            style={{
              position: "absolute",
              right: "-18px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid #ddd",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: similarCanScrollRight ? "pointer" : "not-allowed",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              padding: 0,
              zIndex: 10,
              opacity: similarCanScrollRight ? 1 : 0.4,
              transition: "all 0.2s",
            }}
          >
            <ChevronRight size={18} color="#333" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductSimilarSlider;
