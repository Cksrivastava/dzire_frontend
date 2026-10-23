import React from "react";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Info,
  Star,
} from "lucide-react";

const TAB_CONFIG = [
  { key: "Overview", icon: <LayoutDashboard size={13} /> },
  { key: "Description", icon: <FileText size={13} /> },
  { key: "Specifications", icon: <ClipboardList size={13} /> },
  { key: "Additional Info", icon: <Info size={13} /> },
  { key: "Reviews", icon: <Star size={13} /> },
];

const RentalTabs = ({ product, allProductImages, activeTab, onTabClick }) => {
  return (
    <section className="product-lower-content wildcraft-lower">
      <div className="product-section-tabs-bar wildcraft-tabs">
        {TAB_CONFIG.map(({ key, icon }) => (
          <button
            key={key}
            className={`product-section-tab ${activeTab === key ? "active" : ""}`}
            onClick={(e) => onTabClick(e, key)}
          >
            <span className="tab-icon">{icon}</span>
            {key === "Reviews"
              ? `Reviews (${product.reviewsCount || 110})`
              : key}
          </button>
        ))}
      </div>

      <div className="wildcraft-tab-content">
        {activeTab === "Overview" && (
          <div className="overview-scroll-container">
            <div className="overview-tab-pane">
              <h3 className="overview-title">
                Designed for performance. Made for you.
              </h3>
              <p className="overview-desc">
                The {product.name} is built to deliver unmatched comfort, style,
                and long-lasting durability. Engineered with premium materials, it
                offers high-performance specs that keep you ready for any
                activity, whether outdoors or in the city.
              </p>

              {/* 2 Banners Grid */}
              <div className="wildcraft-banners-grid">
                <div
                  className="wildcraft-banner-card"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${
                      allProductImages[1] || allProductImages[0]
                    })`,
                  }}
                >
                  <h4>Comfort System</h4>
                  <p>Keeps you cool, dry, and comfortable all day long.</p>
                </div>
                <div
                  className="wildcraft-banner-card"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${
                      allProductImages[2] || allProductImages[0]
                    })`,
                  }}
                >
                  <h4>Water Resistant Material</h4>
                  <p>Built to handle splashes and tough daily use.</p>
                </div>
              </div>

              {/* Highlights List */}
              <div className="overview-extra-content">
                <h4 className="overview-extra-title">Key Highlights & Features</h4>
                <ul className="overview-features-list">
                  <li>
                    <span>
                      <strong>Ergonomic Support:</strong> Reduces strain and optimizes
                      comfort for continuous long hours of usage.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>All-Weather Performance:</strong> Built with premium
                      materials to resist splashes, sweat, and unpredictable
                      conditions.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Smart Storage & Access:</strong> Multiple utility
                      segments designed for modern organization and fast retrieval.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Eco-Conscious Materials:</strong> Engineered
                      responsibly with durable, high-grade components built to last.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Maximum Breathability:</strong> Specialized airflow
                      patterns allow swift ventilation and heat dissipation.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "Overview" && (
          <div className="tab-pane-box">
            <h4 className="desc-pane-title">{activeTab} Details</h4>
            <p className="overview-desc">
              Detailed information, technical breakdown, and verified specifications
              for {product.name}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RentalTabs;
