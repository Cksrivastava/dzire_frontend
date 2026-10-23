import React from "react";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Info,
  Star,
  Sparkles,
  Check,
  Activity,
  Award,
  Shield,
  MessageSquare,
} from "lucide-react";

export const ProductTabs = ({
  product,
  allProductImages,
  activeTab,
  setActiveTab,
  overviewTitle,
  overviewDesc,
  reviewsList,
  filteredReviews,
  reviewFilter,
  setReviewFilter,
  setShowReviewModal,
}) => {
  const tabsList = [
    { key: "Overview", icon: <LayoutDashboard size={13} /> },
    { key: "Description", icon: <FileText size={13} /> },
    { key: "Specifications", icon: <ClipboardList size={13} /> },
    { key: "Additional Info", icon: <Info size={13} /> },
    { key: "Reviews", icon: <Star size={13} /> },
  ];

  const [helpfulMap, setHelpfulMap] = React.useState({});
  const handleHelpfulClick = (id) => {
    setHelpfulMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const ratingStats = React.useMemo(() => {
    const total = reviewsList?.length || 0;
    const totalCount = Number(product.reviews) || total;
    if (total === 0) {
      const avg = product.rating ? parseFloat(product.rating).toFixed(1) : "0.0";
      return {
        5: { count: 0, pct: 0 },
        4: { count: 0, pct: 0 },
        3: { count: 0, pct: 0 },
        2: { count: 0, pct: 0 },
        1: { count: 0, pct: 0 },
        avg,
        total: totalCount,
      };
    }
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    reviewsList.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
      sum += Number(r.rating) || 5;
    });
    return {
      5: { count: counts[5], pct: Math.round((counts[5] / total) * 100) },
      4: { count: counts[4], pct: Math.round((counts[4] / total) * 100) },
      3: { count: counts[3], pct: Math.round((counts[3] / total) * 100) },
      2: { count: counts[2], pct: Math.round((counts[2] / total) * 100) },
      1: { count: counts[1], pct: Math.round((counts[1] / total) * 100) },
      avg: product.rating ? parseFloat(product.rating).toFixed(1) : (sum / total).toFixed(1),
      total: totalCount,
    };
  }, [reviewsList, product.rating, product.reviews]);

  const handleTabClick = (key, e) => {
    setActiveTab(key);

    // 1. Horizontal scroll to bring clicked tab to the starting position
    const btn = e.currentTarget;
    const container = btn.parentElement;
    if (container) {
      const btnLeft = btn.offsetLeft;
      container.scrollTo({
        left: Math.max(0, btnLeft - 16),
        behavior: "smooth",
      });
    }

    // 2. Vertical page scroll to align tabs bar just below the sticky navbar
    const tabsBar = document.querySelector(".product-section-tabs-bar");
    if (tabsBar) {
      const nav = document.querySelector(".header-wrapper") || document.querySelector(".navbar");
      const offset = nav ? nav.offsetHeight : window.innerWidth <= 480 ? 116 : 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = tabsBar.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="product-lower-content wildcraft-lower">
      <div className="product-section-tabs-bar wildcraft-tabs">
        {tabsList.map(({ key, icon }) => (
          <button
            key={key}
            className={`product-section-tab ${activeTab === key ? "active" : ""}`}
            onClick={(e) => handleTabClick(key, e)}
          >
            <span className="tab-icon">{icon}</span>
            {key === "Reviews"
              ? `Reviews (${ratingStats.total})`
              : key}
          </button>
        ))}
      </div>

      <div className="wildcraft-tab-content">
        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <div className="overview-scroll-container">
            <div className="overview-tab-pane">
              <h3 className="overview-title">{overviewTitle}</h3>
              <p className="overview-desc">{overviewDesc}</p>

              {/* Banners */}
              <div className="wildcraft-banners-grid">
                <div
                  className="wildcraft-banner-card"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${allProductImages[1] || allProductImages[0]
                      })`,
                  }}
                >
                  <h4>{product.brand || product.name}</h4>
                  <p>{product.shortDesc || product.category || "Official Collection"}</p>
                </div>
                <div
                  className="wildcraft-banner-card"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${allProductImages[2] || allProductImages[0]
                      })`,
                  }}
                >
                  <h4>{product.category || "Quality Assured"}</h4>
                  <p>{product.name}</p>
                </div>
              </div>

              {/* Additional Details / Key Highlights */}
              {((Array.isArray(product.additionalInfo) && product.additionalInfo.length > 0) ||
                (Array.isArray(product.specifications) && product.specifications.length > 0)) && (
                  <div className="overview-extra-content">
                    <h4 className="overview-extra-title">Key Highlights & Features</h4>
                    <ul className="overview-features-list">
                      {Array.isArray(product.additionalInfo) && product.additionalInfo.length > 0 ? (
                        product.additionalInfo.map((item, idx) => (
                          <li key={idx}>
                            <span>
                              <strong>{item.title}:</strong> {item.content}
                            </span>
                          </li>
                        ))
                      ) : (
                        product.specifications.map((s, idx) => (
                          <li key={idx}>
                            <span>
                              <strong>{s.key}:</strong> {s.value}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Description Tab */}
        {activeTab === "Description" && (
          <div className="tab-pane-box desc-tab-grid">
            <div className="desc-story-column">
              <h4 className="desc-pane-title">Craftsmanship & Design Philosophy</h4>
              {product.shortDesc && (
                <p className="desc-para-lead">{product.shortDesc}</p>
              )}
              <p className={product.shortDesc ? "desc-para-body" : "desc-para-lead"}>
                {product.longDesc || product.description || product.shortDesc || "Detailed product information will be updated soon."}
              </p>
              <div className="desc-highlight-box">
                <Sparkles className="highlight-box-icon" size={18} />
                <p className="highlight-text">
                  "{product.name} — Quality assured by {product.brand || "DZIRE"}."
                </p>
              </div>
            </div>

            <div className="desc-metrics-column">
              <h4 className="desc-pane-title">Product Details</h4>
              <div className="performance-metrics-list">
                {product.brand && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eef2f6' }}>
                    <span style={{ fontWeight: '600', color: '#64748b', fontSize: '13px' }}>Brand</span>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>{product.brand}</span>
                  </div>
                )}
                {product.category && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eef2f6' }}>
                    <span style={{ fontWeight: '600', color: '#64748b', fontSize: '13px' }}>Category</span>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>{product.category}</span>
                  </div>
                )}
                {product.sku && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eef2f6' }}>
                    <span style={{ fontWeight: '600', color: '#64748b', fontSize: '13px' }}>SKU Code</span>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>{product.sku}</span>
                  </div>
                )}
                {Array.isArray(product.specifications) && product.specifications.slice(0, 4).map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eef2f6' }}>
                    <span style={{ fontWeight: '600', color: '#64748b', fontSize: '13px' }}>{s.key}</span>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>{s.value}</span>
                  </div>
                ))}
              </div>

              {Array.isArray(product.additionalInfo) && product.additionalInfo.length > 0 && (
                <div className="why-choose-list-wrap" style={{ marginTop: '20px' }}>
                  <h5 className="why-choose-title">Highlights</h5>
                  <ul className="why-choose-bullets">
                    {product.additionalInfo.map((item, idx) => (
                      <li key={idx}>
                        <Check className="bullet-icon" size={14} />{" "}
                        <span><strong>{item.title}:</strong> {item.content}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "Specifications" && (
          <div className="tab-pane-box specs-group-grid">
            <div className="specs-card">
              <div className="specs-card-header">
                <Activity className="specs-icon" size={18} />
                <h4>General Details</h4>
              </div>
              <div className="specs-card-body">
                <div className="spec-row">
                  <span className="label">Brand</span>
                  <span className="val">{product.brand || "DZIRE"}</span>
                </div>
                <div className="spec-row">
                  <span className="label">Category</span>
                  <span className="val">{product.category || "General"}</span>
                </div>
                {product.sku && (
                  <div className="spec-row">
                    <span className="label">Product Code / SKU</span>
                    <span className="val">{product.sku}</span>
                  </div>
                )}
                {product.productChannel && (
                  <div className="spec-row">
                    <span className="label">Sales Channel</span>
                    <span className="val">{product.productChannel}</span>
                  </div>
                )}
                {(product.specs?.["Ideal For"] || product.specifications?.find((s) => s.key?.toLowerCase() === "ideal for")?.value) && (
                  <div className="spec-row">
                    <span className="label">Ideal For</span>
                    <span className="val">
                      {product.specs?.["Ideal For"] || product.specifications?.find((s) => s.key?.toLowerCase() === "ideal for")?.value}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="specs-card">
              <div className="specs-card-header">
                <Award className="specs-icon" size={18} />
                <h4>Material & Technical Details</h4>
              </div>
              <div className="specs-card-body">
                {Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                  product.specifications.map((s, idx) => (
                    <div className="spec-row" key={idx}>
                      <span className="label">{s.key}</span>
                      <span className="val">{s.value}</span>
                    </div>
                  ))
                ) : product.specs && Object.keys(product.specs).length > 0 ? (
                  Object.entries(product.specs).map(([key, val], idx) => (
                    <div className="spec-row" key={idx}>
                      <span className="label">{key}</span>
                      <span className="val">{String(val)}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "14px 0", color: "#64748b", fontSize: "13px", fontStyle: "italic" }}>
                    No custom technical specifications configured for this product.
                  </div>
                )}
              </div>
            </div>

            <div className="specs-card">
              <div className="specs-card-header">
                <Shield className="specs-icon" size={18} />
                <h4>Warranty & Services</h4>
              </div>
              <div className="specs-card-body">
                <div className="spec-row">
                  <span className="label">Warranty</span>
                  <span className="val">
                    {product.warranty ||
                      product.specs?.["Warranty"] ||
                      product.specifications?.find((s) => s.key?.toLowerCase() === "warranty")?.value ||
                      "Standard Brand Warranty"}
                  </span>
                </div>
                <div className="spec-row">
                  <span className="label">Availability</span>
                  <span className="val">
                    {product.stock !== undefined
                      ? (product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock")
                      : (product.inStock !== false ? "In Stock" : "Out of Stock")}
                  </span>
                </div>
                <div className="spec-row">
                  <span className="label">Delivery</span>
                  <span className="val">Standard shipping across all serviceable pin codes</span>
                </div>
                <div className="spec-row">
                  <span className="label">Authenticity</span>
                  <span className="val">100% Genuine {product.brand || "DZIRE"} Product</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info Tab */}
        {activeTab === "Additional Info" && (
          <div className="tab-pane-box info-cards-grid">
            {Array.isArray(product.additionalInfo) && product.additionalInfo.length > 0 ? (
              product.additionalInfo.map((info, idx) => (
                <div className="info-card" key={`dyn-${idx}`}>
                  <div className="info-card-header">
                    <div className="info-card-icon-wrapper">
                      <Sparkles size={20} />
                    </div>
                    <h4>{info.title || "Information"}</h4>
                  </div>
                  <p className="info-card-desc" style={{ whiteSpace: "pre-line" }}>
                    {info.content}
                  </p>
                </div>
              ))
            ) : (
              <div
                className="info-card"
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "40px 20px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <div className="info-card-header" style={{ justifyContent: "center" }}>
                  <div className="info-card-icon-wrapper">
                    <Info size={20} />
                  </div>
                  <h4>No Additional Information</h4>
                </div>
                <p
                  className="info-card-desc"
                  style={{ margin: "10px auto 0", maxWidth: "450px" }}
                >
                  No supplementary details, care guidelines, or extra notes have been added for this product yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "Reviews" && (
          <div className="tab-pane-box reviews-pane-grid">
            {/* Review Summary Panel */}
            <div className="reviews-summary-card">
              <h4 className="reviews-summary-title">Customer Ratings</h4>
              <div className="rating-big-row">
                <span className="rating-big-num">{ratingStats.avg}</span>
                <div className="rating-big-details">
                  <div className="stars-row-big">
                    {Array.from({ length: 5 }, (_, i) => {
                      const ratingVal = parseFloat(ratingStats.avg) || 0;
                      const isFilled = ratingVal > 0 && i < Math.round(ratingVal);
                      return (
                        <Star
                          key={i}
                          size={18}
                          fill={isFilled ? "#ffa41c" : "transparent"}
                          color={isFilled ? "#ffa41c" : "#d1d5db"}
                        />
                      );
                    })}
                  </div>
                  <span className="total-ratings-count">
                    {ratingStats.total} Verified Review{ratingStats.total === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="rating-bars-list">
                {[5, 4, 3, 2, 1].map((starNum) => (
                  <div className="rating-bar-row" key={starNum}>
                    <span className="star-num">{starNum} ★</span>
                    <div className="rating-bar-track">
                      <div className="rating-bar-fill" style={{ width: `${ratingStats[starNum].pct}%` }}></div>
                    </div>
                    <span className="rating-percent">{ratingStats[starNum].pct}%</span>
                  </div>
                ))}
              </div>

              <button className="write-review-btn" onClick={() => setShowReviewModal(true)}>
                <MessageSquare size={16} /> WRITE A REVIEW
              </button>
            </div>

            {/* Review List Panel */}
            <div className="reviews-list-card">
              {reviewsList.length > 0 && (
                <div className="reviews-filter-tags">
                  <button
                    className={`filter-tag ${reviewFilter === "All" ? "active" : ""}`}
                    onClick={() => setReviewFilter("All")}
                  >
                    All ({reviewsList.length})
                  </button>
                  {(() => {
                    const tagSet = new Set();
                    reviewsList.forEach((r) => {
                      if (Array.isArray(r.tags)) {
                        r.tags.forEach((t) => t && tagSet.add(t));
                      }
                    });
                    const tags = Array.from(tagSet);
                    return tags.map((t) => (
                      <button
                        key={t}
                        className={`filter-tag ${reviewFilter === t ? "active" : ""}`}
                        onClick={() => setReviewFilter(t)}
                      >
                        {t} ({reviewsList.filter((r) => r.tags?.includes(t)).length})
                      </button>
                    ));
                  })()}
                </div>
              )}

              <div className="review-cards-column">
                {reviewsList.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "48px 24px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      border: "1px dashed #cbd5e1",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <MessageSquare
                      size={36}
                      style={{ color: "#94a3b8", margin: "0 auto 12px auto", display: "block" }}
                    />
                    <h4
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1e293b",
                      }}
                    >
                      No Reviews Yet
                    </h4>
                    <p style={{ margin: "0 0 18px 0", fontSize: "13.5px", color: "#64748b" }}>
                      Be the first to review {product.name}! Share your thoughts with other customers.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(true)}
                      style={{
                        background: "#ff6600",
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        boxShadow: "0 2px 5px rgba(255, 102, 0, 0.25)",
                      }}
                    >
                      Write the First Review
                    </button>
                  </div>
                ) : (
                  (filteredReviews.length > 0 ? filteredReviews : reviewsList).map((rev) => {
                    const avatarInitials =
                      rev.initials ||
                      (rev.name
                        ? rev.name
                          .trim()
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                        : "U");
                    return (
                      <div className="review-card-item" key={rev.id || rev._id}>
                        <div className="review-card-top">
                          <div
                            className={`user-avatar-badge ${(typeof rev.id === "number" ? rev.id : rev.name?.length || 0) % 2 === 0
                                ? "dark-avatar"
                                : ""
                              }`}
                            style={rev.avatarColor ? { background: rev.avatarColor, color: '#fff' } : {}}
                          >
                            {avatarInitials}
                          </div>
                          <div className="user-meta-info">
                            <strong>{rev.name}</strong>
                            {rev.verified !== false && <span className="verified-badge">Verified Buyer</span>}
                          </div>
                          <div
                            className="review-stars-wrap"
                            style={{ display: "flex", gap: "2px", alignItems: "center" }}
                          >
                            {Array.from({ length: 5 }, (_, i) => {
                              const isFilled = i < Math.round(Number(rev.rating) || 5);
                              return (
                                <Star
                                  key={i}
                                  size={13}
                                  fill={isFilled ? "#ffa41c" : "transparent"}
                                  color={isFilled ? "#ffa41c" : "#d1d5db"}
                                />
                              );
                            })}
                          </div>
                        </div>
                        {rev.title && (
                          <h5 style={{ margin: "6px 0 3px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                            {rev.title}
                          </h5>
                        )}
                        <p className="review-comment">"{rev.comment}"</p>
                        <div className="review-helpful-row">
                          <span className="review-date">{rev.date || "Reviewed recently"}</span>
                          {/* <button
                            className="helpful-btn"
                            type="button"
                            onClick={() => handleHelpfulClick(rev.id || rev._id)}
                          >
                            Helpful ({(rev.helpful ?? 0) + (helpfulMap[rev.id || rev._id] || 0)})
                          </button> */}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductTabs;
