import React, { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Flame,
  ClipboardList,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Info,
  Tag,
  Calendar,
  BookOpen,
  Compass,
  ArrowRight,
  Plus,
  Trash2
} from "lucide-react";
import {
  getSectionSettings,
  saveSectionSettings,
  resetSectionSettings,
  DEFAULT_SECTION_SETTINGS
} from "../../src/services/sectionSettings";

const AdminSectionTitlesView = ({ showToast }) => {
  const [settings, setSettings] = useState(() => getSectionSettings());
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState("budget"); // default to "budget" as user just requested it

  useEffect(() => {
    setSettings(getSectionSettings());
    try {
      const params = new URLSearchParams(window.location.search);
      const subTab = params.get("section") || params.get("tab");
      if (subTab && ["budget", "waysToSave", "events", "blogs", "outdoor", "trending"].includes(subTab)) {
        setActiveSectionTab(subTab);
      }
    } catch (_) {}
  }, []);

  // Update handlers
  const handleOutdoorChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      outdoor: { ...prev.outdoor, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleBudgetHeaderChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      budget: { ...prev.budget, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleBudgetCardChange = (index, field, value) => {
    setSettings((prev) => {
      const nextCards = [...(prev.budget?.cards || [])];
      nextCards[index] = { ...nextCards[index], [field]: value };
      return {
        ...prev,
        budget: { ...prev.budget, cards: nextCards }
      };
    });
    setHasChanges(true);
  };

  const handleWaysToSaveTitleChange = (value) => {
    setSettings((prev) => ({
      ...prev,
      waysToSave: { ...prev.waysToSave, title: value }
    }));
    setHasChanges(true);
  };

  const handleWaysToSaveCardChange = (index, field, value) => {
    setSettings((prev) => {
      const nextCards = [...(prev.waysToSave?.cards || [])];
      nextCards[index] = { ...nextCards[index], [field]: value };
      return {
        ...prev,
        waysToSave: { ...prev.waysToSave, cards: nextCards }
      };
    });
    setHasChanges(true);
  };

  const handleEventsChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      events: { ...prev.events, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleBlogsChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      blogs: { ...prev.blogs, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleTrendingChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      trending: { ...prev.trending, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleNewArrivalsChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      newArrivals: { ...prev.newArrivals, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const success = saveSectionSettings(settings);
    if (success) {
      setHasChanges(false);
      if (showToast) {
        showToast("Homepage section titles & cards saved successfully! Changes are live.");
      }
    } else {
      alert("Failed to save section settings. Please try again.");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to restore all section titles and cards to initial defaults?")) {
      resetSectionSettings();
      setSettings(DEFAULT_SECTION_SETTINGS);
      setHasChanges(false);
      if (showToast) {
        showToast("Restored all section titles and cards to defaults!");
      }
    }
  };

  const outdoor = settings?.outdoor || DEFAULT_SECTION_SETTINGS.outdoor || {};
  const trending = settings?.trending || DEFAULT_SECTION_SETTINGS.trending || {};
  const newArrivals = settings?.newArrivals || DEFAULT_SECTION_SETTINGS.newArrivals || {};
  const budget = settings?.budget || DEFAULT_SECTION_SETTINGS.budget || { cards: [] };
  const waysToSave = settings?.waysToSave || DEFAULT_SECTION_SETTINGS.waysToSave || { cards: [] };
  const events = settings?.events || DEFAULT_SECTION_SETTINGS.events || {};
  const blogs = settings?.blogs || DEFAULT_SECTION_SETTINGS.blogs || {};

  const tabs = [
    {
      id: "budget",
      label: "Gear for Every Budget",
      icon: Tag,
      badge: "Budget Friendly",
      color: "#FF6600"
    },
    {
      id: "waysToSave",
      label: "Outdoor Adventures",
      icon: Compass,
      badge: "Ways To Save",
      color: "#FF6600"
    },
    {
      id: "events",
      label: "Join Experiences",
      icon: Calendar,
      badge: "Events",
      color: "#FF6600"
    },
    {
      id: "blogs",
      label: "Stories & Guides",
      icon: BookOpen,
      badge: "From The Blog",
      color: "#FF6600"
    },
    {
      id: "outdoor",
      label: "Outdoor Collection",
      icon: ClipboardList,
      color: "#FF6600"
    },
    {
      id: "trending",
      label: "Trending & New Arrivals",
      icon: Flame,
      color: "#FF6600"
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Banner & Actions */}
      <div
        style={{
          background: "linear-gradient(135deg, #fff7f2 0%, #ffffff 100%)",
          borderRadius: "16px",
          border: "1px solid #fed7aa",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          boxShadow: "0 4px 14px rgba(255, 102, 0, 0.05)"
        }}
      >
        <div style={{ maxWidth: "680px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: "#ffeedd",
                color: "#ff6600",
                fontSize: "12px",
                fontWeight: "700",
                padding: "4px 10px",
                borderRadius: "20px",
                letterSpacing: "0.03em"
              }}
            >
              <Sliders size={13} />
              DYNAMIC HOMEPAGE CONTROLS
            </span>
            <span style={{ fontSize: "12px", color: "#FF6600", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#FF6600", display: "inline-block" }}></span>
              Live Sync Active
            </span>
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px 0" }}>
            Homepage Sections & Dynamic Content Management
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>
            Easily customize headings, descriptions, badges, and card content for "Gear for Every Budget", "Outdoor Adventures", "Join Experiences", "Stories & Guides", and "Outdoor Collection".
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#334155",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <ExternalLink size={15} />
            <span>View Live Website</span>
          </a>

          <button
            type="button"
            onClick={handleReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <RotateCcw size={15} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#ff6600",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(255, 102, 0, 0.35)",
              transition: "all 0.2s"
            }}
          >
            <Save size={16} />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Section Sub-Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "12px",
          overflowX: "auto"
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSectionTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSectionTab(tab.id)}
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                fontSize: "14px",
                fontWeight: isActive ? "700" : "600",
                color: isActive ? "#ffffff" : "#64748b",
                backgroundColor: isActive ? tab.color : "#ffffff",
                boxShadow: isActive ? `0 4px 12px ${tab.color}35` : "0 1px 3px rgba(0,0,0,0.04)",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap"
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "#fff3e0",
                    color: isActive ? "#ffffff" : "#ff6600"
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: GEAR FOR EVERY BUDGET (User's image request) */}
      {activeSectionTab === "budget" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header & Subtitle Settings */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "24px"
            }}
          >
            {/* Header Form */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "24px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    backgroundColor: "#fff2e8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ff6600"
                  }}
                >
                  <Tag size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                    Section Left Header & Subtitle
                  </h3>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>
                    Configure the main title, badge pill, and descriptive text.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                    Badge Tag (e.g. BUDGET FRIENDLY)
                  </label>
                  <input
                    type="text"
                    value={budget.badge || ""}
                    onChange={(e) => handleBudgetHeaderChange("badge", e.target.value)}
                    placeholder="BUDGET FRIENDLY"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      fontWeight: "600",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                      Title Line 1 (Dark)
                    </label>
                    <input
                      type="text"
                      value={budget.titleLine1 || ""}
                      onChange={(e) => handleBudgetHeaderChange("titleLine1", e.target.value)}
                      placeholder="Gear for"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        fontWeight: "700",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#FF6600", marginBottom: "4px" }}>
                      Title Line 2 (Orange Highlight)
                    </label>
                    <input
                      type="text"
                      value={budget.titleLine2 || ""}
                      onChange={(e) => handleBudgetHeaderChange("titleLine2", e.target.value)}
                      placeholder="Every Budget!"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#FF6600",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                    Subtitle Description
                  </label>
                  <textarea
                    rows={2}
                    value={budget.subtitle || ""}
                    onChange={(e) => handleBudgetHeaderChange("subtitle", e.target.value)}
                    placeholder="Quality products at prices that don't break the bank."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Live Visual Preview Frame */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "24px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Eye size={18} color="#FF6600" />
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                    Live Preview: Header Look
                  </h3>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "700", backgroundColor: "#fff2e8", color: "#FF6600", padding: "2px 8px", borderRadius: "6px" }}>
                  Instant
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "#fafafa",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "12px",
                  padding: "20px"
                }}
              >
                {budget.badge && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      backgroundColor: "#fff3eb",
                      color: "#ff6600",
                      fontSize: "11px",
                      fontWeight: "700",
                      marginBottom: "10px"
                    }}
                  >
                    <Tag size={12} />
                    <span>{budget.badge}</span>
                  </div>
                )}
                <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#111111", margin: "0 0 8px 0", lineHeight: "1.2" }}>
                  {budget.titleLine1 || "Gear for"} <br />
                  <span style={{ color: "#ff6600" }}>{budget.titleLine2 || "Every Budget!"}</span>
                </h2>
                {budget.subtitle && (
                  <p style={{ fontSize: "13px", color: "#666666", margin: 0, lineHeight: "1.4" }}>
                    {budget.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 4 Price Cards Editor ("inke ander ka bhi dynamic") */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "24px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Customize the 4 Price Cards Inside This Section
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
                  Modify badge tag, title, price ceiling (₹), and button label for each card.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                style={{
                  backgroundColor: "#ff6600",
                  color: "#ffffff",
                  border: "none",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(255, 102, 0, 0.25)"
                }}
              >
                <Save size={15} /> Save Changes
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "16px"
              }}
            >
              {(budget.cards || []).map((card, idx) => (
                <div
                  key={card.id || idx}
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    padding: "16px",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "#64748b" }}>
                      CARD #{idx + 1}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: "#fff2e8",
                        color: "#FF6600"
                      }}
                    >
                      {card.badge || "BADGE"}
                    </span>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>
                      Top Badge Pill
                    </label>
                    <input
                      type="text"
                      value={card.badge || ""}
                      onChange={(e) => handleBudgetCardChange(idx, "badge", e.target.value)}
                      placeholder="BEST VALUE"
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        fontWeight: "600",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={card.title || ""}
                      onChange={(e) => handleBudgetCardChange(idx, "title", e.target.value)}
                      placeholder="STARTER PICKS"
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        fontWeight: "700",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>
                      Price (₹)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "10px", top: "7px", fontSize: "14px", fontWeight: "bold", color: "#64748b" }}>
                        ₹
                      </span>
                      <input
                        type="text"
                        value={card.price || ""}
                        onChange={(e) => handleBudgetCardChange(idx, "price", e.target.value)}
                        placeholder="499"
                        style={{
                          width: "100%",
                          padding: "7px 10px 7px 24px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          fontWeight: "800",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={card.btnText || "SHOP NOW"}
                      onChange={(e) => handleBudgetCardChange(idx, "btnText", e.target.value)}
                      placeholder="SHOP NOW"
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px",
                        fontWeight: "600",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Visual card mockup preview */}
                  <div
                    style={{
                      marginTop: "6px",
                      padding: "12px",
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#ff6600", textTransform: "uppercase" }}>
                      {card.badge}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "800", color: "#111827", marginTop: "2px" }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: "10px", color: "#9ca3af" }}>BELOW</div>
                    <div style={{ fontSize: "20px", fontWeight: "900", color: "#111827", margin: "2px 0" }}>
                      ₹{card.price}
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#111111",
                        border: "1px solid #d5d5d5",
                        padding: "4px 10px",
                        borderRadius: "6px"
                      }}
                    >
                      {card.btnText || "SHOP NOW"} →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OUTDOOR ADVENTURES (Ways to Save) */}
      {activeSectionTab === "waysToSave" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "24px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  backgroundColor: "#fff2e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FF6600"
                }}
              >
                <Compass size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Section Main Headline
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>
                  Outdoor adventures, offbeat escapes, and curated journeys for the explorer in you.
                </p>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                Main Title Text
              </label>
              <textarea
                rows={2}
                value={waysToSave.title || ""}
                onChange={(e) => handleWaysToSaveTitleChange(e.target.value)}
                placeholder="Outdoor adventures, offbeat escapes, and curated journeys for the explorer in you."
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  fontWeight: "600",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }}
              />
            </div>
          </div>

          {/* Cards Inside Ways To Save */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "24px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Cards Inside This Section (Images, Titles, Descriptions & Links)
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
                  Each adventure showcase card can have a custom tag, heading, description, image, and button.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                style={{
                  backgroundColor: "#FF6600",
                  color: "#ffffff",
                  border: "none",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(255, 102, 0, 0.25)"
                }}
              >
                <Save size={15} /> Save Changes
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px"
              }}
            >
              {(waysToSave.cards || []).map((card, idx) => (
                <div
                  key={card.id || idx}
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    padding: "18px",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#FF6600" }}>
                    ADVENTURE CARD #{idx + 1}
                  </span>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>
                      Tag Pill
                    </label>
                    <input
                      type="text"
                      value={card.tag || ""}
                      onChange={(e) => handleWaysToSaveCardChange(idx, "tag", e.target.value)}
                      placeholder="Save More on Outlet"
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>
                      Heading Title
                    </label>
                    <input
                      type="text"
                      value={card.heading || ""}
                      onChange={(e) => handleWaysToSaveCardChange(idx, "heading", e.target.value)}
                      placeholder="The gear you love, for less"
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "13px",
                        fontWeight: "700",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={card.desc || ""}
                      onChange={(e) => handleWaysToSaveCardChange(idx, "desc", e.target.value)}
                      placeholder="Card description..."
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px",
                        boxSizing: "border-box",
                        fontFamily: "inherit"
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={card.btnText || ""}
                        onChange={(e) => handleWaysToSaveCardChange(idx, "btnText", e.target.value)}
                        placeholder="Shop Now"
                        style={{
                          width: "100%",
                          padding: "7px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>
                        Target Link
                      </label>
                      <input
                        type="text"
                        value={card.btnLink || ""}
                        onChange={(e) => handleWaysToSaveCardChange(idx, "btnLink", e.target.value)}
                        placeholder="/shop"
                        style={{
                          width: "100%",
                          padding: "7px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={card.image || ""}
                      onChange={(e) => handleWaysToSaveCardChange(idx, "image", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {card.image && (
                    <div style={{ height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                      <img src={card.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JOIN EXPERIENCES (Events Section) */}
      {activeSectionTab === "events" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "24px",
            alignItems: "start"
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "28px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "#fff2e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FF6600"
                }}
              >
                <Calendar size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Edit "Join Experiences. Learn. Connect."
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
                  Customize header titles for the homepage events section.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                  Subtitle Tag (Uppercase)
                </label>
                <input
                  type="text"
                  value={events.subtitle || ""}
                  onChange={(e) => handleEventsChange("subtitle", e.target.value)}
                  placeholder="UPCOMING EVENTS"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                  Main Title
                </label>
                <input
                  type="text"
                  value={events.title || ""}
                  onChange={(e) => handleEventsChange("title", e.target.value)}
                  placeholder="Join Experiences. Learn. Connect."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    fontWeight: "700",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                  Description Text
                </label>
                <textarea
                  rows={2}
                  value={events.description || ""}
                  onChange={(e) => handleEventsChange("description", e.target.value)}
                  placeholder="Workshops, treks, and meetups for adventurers and explorers."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#FF6600",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "700",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(255, 102, 0, 0.25)"
                  }}
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "28px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Eye size={18} color="#FF6600" />
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                Live Events Header Preview
              </h3>
            </div>

            <div
              style={{
                backgroundColor: "#fafafa",
                border: "2px dashed #cbd5e1",
                borderRadius: "12px",
                padding: "24px"
              }}
            >
              {events.subtitle && (
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#FF6600", letterSpacing: "0.08em", display: "block", marginBottom: "4px" }}>
                  {events.subtitle}
                </span>
              )}
              <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#111827", margin: "0 0 6px 0" }}>
                {events.title || "Join Experiences. Learn. Connect."}
              </h2>
              {events.description && (
                <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                  {events.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORIES & GUIDES (Blogs Section) */}
      {activeSectionTab === "blogs" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "24px",
            alignItems: "start"
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "28px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "#fff2e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FF6600"
                }}
              >
                <BookOpen size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Edit "Stories, Tips & Adventure Guides"
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
                  Customize header titles for the homepage blog section.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                  Subtitle Tag (Uppercase)
                </label>
                <input
                  type="text"
                  value={blogs.subtitle || ""}
                  onChange={(e) => handleBlogsChange("subtitle", e.target.value)}
                  placeholder="FROM THE BLOG"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                  Main Title
                </label>
                <input
                  type="text"
                  value={blogs.title || ""}
                  onChange={(e) => handleBlogsChange("title", e.target.value)}
                  placeholder="Stories, Tips & Adventure Guides"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    fontWeight: "700",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                  Description Text
                </label>
                <textarea
                  rows={2}
                  value={blogs.description || ""}
                  onChange={(e) => handleBlogsChange("description", e.target.value)}
                  placeholder="Inspiration to help you explore more and travel better."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#FF6600",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "700",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(255, 102, 0, 0.25)"
                  }}
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "28px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Eye size={18} color="#FF6600" />
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                Live Blog Header Preview
              </h3>
            </div>

            <div
              style={{
                backgroundColor: "#fafafa",
                border: "2px dashed #cbd5e1",
                borderRadius: "12px",
                padding: "24px"
              }}
            >
              {blogs.subtitle && (
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#ff6600", letterSpacing: "0.08em", display: "block", marginBottom: "4px" }}>
                  {blogs.subtitle}
                </span>
              )}
              <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#111827", margin: "0 0 6px 0" }}>
                {blogs.title || "Stories, Tips & Adventure Guides"}
              </h2>
              {blogs.description && (
                <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                  {blogs.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OUTDOOR COLLECTION */}
      {activeSectionTab === "outdoor" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "24px",
            alignItems: "start"
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "28px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "#fff2e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ff6600"
                }}
              >
                <ClipboardList size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Edit Outdoor Collection Heading
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
                  This title appears at the very top of your homepage product checklist.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ backgroundColor: "#fffbf7", border: "1px dashed #fed7aa", borderRadius: "12px", padding: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#FF6600", marginBottom: "4px" }}>
                  Orange Accent Subtitle (Top Left Part)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Line 1</label>
                    <input
                      type="text"
                      value={outdoor.prefixLine1 || ""}
                      onChange={(e) => handleOutdoorChange("prefixLine1", e.target.value)}
                      placeholder="Shop"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", fontWeight: "600", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Line 2 (optional)</label>
                    <input
                      type="text"
                      value={outdoor.prefixLine2 || ""}
                      onChange={(e) => handleOutdoorChange("prefixLine2", e.target.value)}
                      placeholder="your"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", fontWeight: "600", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                  Main Section Title (Dark Bold Part)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Line 1</label>
                    <input
                      type="text"
                      value={outdoor.titleLine1 || ""}
                      onChange={(e) => handleOutdoorChange("titleLine1", e.target.value)}
                      placeholder="Outdoor"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", fontWeight: "700", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Line 2 (optional)</label>
                    <input
                      type="text"
                      value={outdoor.titleLine2 || ""}
                      onChange={(e) => handleOutdoorChange("titleLine2", e.target.value)}
                      placeholder="Collection"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", fontWeight: "700", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "10px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>Show Clipboard Icon</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>Displays orange icon next to subtitle</div>
                </div>
                <input
                  type="checkbox"
                  checked={outdoor.showIcon !== false}
                  onChange={(e) => handleOutdoorChange("showIcon", e.target.checked)}
                  style={{ width: "20px", height: "20px", accentColor: "#ff6600", cursor: "pointer" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#ff6600",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "700",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(255, 102, 0, 0.25)"
                  }}
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "28px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Eye size={18} color="#ff6600" />
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                Live Preview
              </h3>
            </div>

            <div
              style={{
                backgroundColor: "#f9fafb",
                border: "2px dashed #cbd5e1",
                borderRadius: "12px",
                padding: "24px"
              }}
            >
              <h2 style={{ fontFamily: '"Rubik", sans-serif', fontSize: "28px", fontWeight: "900", margin: 0, color: "#111111", lineHeight: "1.2" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", verticalAlign: "middle", marginRight: "6px" }}>
                  {outdoor.showIcon !== false && <ClipboardList size={26} style={{ color: "#ff6600", flexShrink: 0 }} />}
                  <span style={{ color: "#ff6600", fontSize: "26px", fontWeight: "bold" }}>
                    {outdoor.prefixLine1 || "Shop"} {outdoor.prefixLine2 ? <><br />{outdoor.prefixLine2}</> : null}
                  </span>
                </span>
                <span style={{ display: "inline-block", verticalAlign: "middle", marginTop: "4px", fontWeight: "bold" }}>
                  {outdoor.titleLine1 || "Outdoor"} {outdoor.titleLine2 ? <><br />{outdoor.titleLine2}</> : null}
                </span>
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TRENDING & NEW ARRIVALS */}
      {activeSectionTab === "trending" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "24px",
            alignItems: "start"
          }}
        >
          {/* Trending Gear */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "24px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <Flame size={22} color="#FF6600" />
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                Trending Gear Section
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>Title</label>
                <input
                  type="text"
                  value={trending.title || ""}
                  onChange={(e) => handleTrendingChange("title", e.target.value)}
                  placeholder="Trending Gear"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>Badge</label>
                <input
                  type="text"
                  value={trending.badge || ""}
                  onChange={(e) => handleTrendingChange("badge", e.target.value)}
                  placeholder="200+ Products"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>Description</label>
                <textarea
                  rows={2}
                  value={trending.description || ""}
                  onChange={(e) => handleTrendingChange("description", e.target.value)}
                  placeholder="Description..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{ backgroundColor: "#FF6600", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(255, 102, 0, 0.25)" }}
                >
                  Save Trending
                </button>
              </div>
            </div>
          </div>

          {/* New Arrivals */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "24px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <Sparkles size={22} color="#FF6600" />
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                New Arrivals Section
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>Title</label>
                <input
                  type="text"
                  value={newArrivals.title || ""}
                  onChange={(e) => handleNewArrivalsChange("title", e.target.value)}
                  placeholder="New Arrivals"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>Badge</label>
                <input
                  type="text"
                  value={newArrivals.badge || ""}
                  onChange={(e) => handleNewArrivalsChange("badge", e.target.value)}
                  placeholder="10+ Products"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>Description</label>
                <textarea
                  rows={2}
                  value={newArrivals.description || ""}
                  onChange={(e) => handleNewArrivalsChange("description", e.target.value)}
                  placeholder="Description..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{ backgroundColor: "#FF6600", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(255, 102, 0, 0.25)" }}
                >
                  Save New Arrivals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSectionTitlesView;
