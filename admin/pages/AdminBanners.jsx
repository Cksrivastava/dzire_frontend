import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import {
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Eye,
  Calendar,
  Layers,
  BookOpen,
  Home,
  Info,
  Phone
} from "lucide-react";
import {
  getBannerSettings,
  saveBannerSettings,
  resetBannerSettings,
} from "../../src/services/bannerSettings";

const BRAND_ORANGE = "#FF6600";

const AdminBanners = () => {
  const [settings, setSettings] = useState(() => getBannerSettings());
  const [activeTab, setActiveTab] = useState("event");
  const [toastMessage, setToastMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSettings(getBannerSettings());
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") || params.get("page");
      if (tabParam && ["event", "rental", "blog", "home", "about", "contact"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    } catch (_) {}
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSave = () => {
    const success = saveBannerSettings(settings);
    if (success) {
      setHasUnsavedChanges(false);
      showToast("Banner image aur text successfully save ho gaya!");
    } else {
      showToast("Error saving banner settings.");
    }
  };

  const handleReset = () => {
    if (window.confirm("Kya aap sabhi page banners ko initial default par reset karna chahte hain?")) {
      const reset = resetBannerSettings();
      setSettings(reset);
      setHasUnsavedChanges(false);
      showToast("Banners factory defaults par restore ho gaye!");
    }
  };

  // Field Updater
  const updateField = (pageKey, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Local File Upload Handler -> converts file to Data URL
  const handleFileUpload = (e, pageKey) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Kripya image file (JPG, PNG, WebP) select karein.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setSettings((prev) => ({
        ...prev,
        [pageKey]: {
          ...prev[pageKey],
          image: dataUrl,
          imageMode: "upload"
        }
      }));
      setHasUnsavedChanges(true);
      showToast("Image upload ho gayi! Save button click karke confirm karein.");
    };
    reader.readAsDataURL(file);
  };

  const pages = [
    { id: "event", name: "Events Page", route: "/event", icon: Calendar },
    { id: "rental", name: "Rentals Page", route: "/rental", icon: Layers },
    { id: "blog", name: "Blogs Page", route: "/blog", icon: BookOpen },
    { id: "home", name: "Home Page", route: "/", icon: Home },
    { id: "about", name: "About Us Page", route: "/about", icon: Info },
    { id: "contact", name: "Contact Us Page", route: "/contact", icon: Phone },
  ];

  const currentBanner = settings[activeTab] || {
    pageName: "Page Banner",
    pageRoute: "/",
    imageMode: "url",
    image: "",
    title: "",
    subtitle: ""
  };

  return (
    <AdminLayout>
      <div style={{ padding: "24px 32px 60px 32px", width: "100%", boxSizing: "border-box" }}>
        {/* Floating Success Toast */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              backgroundColor: BRAND_ORANGE,
              color: "#ffffff",
              padding: "12px 22px",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(255, 102, 0, 0.4)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "600",
              fontSize: "14px"
            }}
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "24px",
            backgroundColor: "#ffffff",
            padding: "20px 24px",
            borderRadius: "12px",
            border: "1px solid #fee2e2",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "#fff7ed",
                color: BRAND_ORANGE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ImageIcon size={24} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#1e293b" }}>
                Website Banners & Images Management
              </h1>
              <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                Banner Image URL ya Image Upload select karein aur banner ke text ko customize karein.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {hasUnsavedChanges && (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: BRAND_ORANGE,
                  backgroundColor: "#fff7ed",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: `1px solid ${BRAND_ORANGE}40`
                }}
              >
                ● Unsaved Changes
              </span>
            )}
            <button
              type="button"
              onClick={handleReset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#64748b",
                backgroundColor: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <RotateCcw size={15} />
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                fontSize: "13px",
                fontWeight: "700",
                color: "#ffffff",
                backgroundColor: BRAND_ORANGE,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(255, 102, 0, 0.3)",
                transition: "all 0.2s"
              }}
            >
              <Save size={16} />
              Save All Changes
            </button>
          </div>
        </div>

        {/* Page Tabs in Orange Brand Palette */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px",
            marginBottom: "24px",
            borderBottom: "2px solid #fed7aa"
          }}
        >
          {pages.map((p) => {
            const Icon = p.icon;
            const isActive = activeTab === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(p.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  fontSize: "13px",
                  fontWeight: isActive ? "700" : "600",
                  color: isActive ? "#ffffff" : "#475569",
                  backgroundColor: isActive ? BRAND_ORANGE : "#ffffff",
                  border: isActive ? `1px solid ${BRAND_ORANGE}` : "1px solid #e2e8f0",
                  borderRadius: "8px 8px 0 0",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  boxShadow: isActive ? "0 4px 12px rgba(255, 102, 0, 0.25)" : "none"
                }}
              >
                <Icon size={16} />
                <span>{p.name}</span>
                <span
                  style={{
                    fontSize: "11px",
                    opacity: isActive ? 0.9 : 0.65,
                    fontWeight: "400"
                  }}
                >
                  ({p.route})
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Card for Selected Page */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Page Identity Header */}
          <div
            style={{
              backgroundColor: "#fff7ed",
              border: `1px solid #fed7aa`,
              borderRadius: "10px",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  backgroundColor: BRAND_ORANGE,
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "4px 10px",
                  borderRadius: "6px"
                }}
              >
                Page: {currentBanner.pageName || `${pages.find((p) => p.id === activeTab)?.name} (${pages.find((p) => p.id === activeTab)?.route})`}
              </span>
              <span style={{ fontSize: "13px", color: "#9a3412", fontWeight: "600" }}>
                Banner Image & Text Editor
              </span>
            </div>
            <a
              href={pages.find((p) => p.id === activeTab)?.route || "/"}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: "700",
                color: BRAND_ORANGE,
                textDecoration: "none"
              }}
            >
              <span>View Live Page</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Form & Live Preview Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "24px"
            }}
          >
            {/* Left Column: Image Selection (Upload OR URL) + Text Fields */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              {/* Option 1 or Option 2: Image Selection Toggle */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#1e293b",
                    marginBottom: "10px"
                  }}
                >
                  Banner Image Source (Choose One Option)
                </label>

                {/* Segmented Radio Button Toggle */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    backgroundColor: "#f8fafc",
                    padding: "4px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "14px"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => updateField(activeTab, "imageMode", "url")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "10px",
                      fontSize: "13px",
                      fontWeight: currentBanner.imageMode === "url" ? "700" : "500",
                      color: currentBanner.imageMode === "url" ? "#ffffff" : "#475569",
                      backgroundColor: currentBanner.imageMode === "url" ? BRAND_ORANGE : "transparent",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <LinkIcon size={15} />
                    <span>Background Image URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField(activeTab, "imageMode", "upload")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "10px",
                      fontSize: "13px",
                      fontWeight: currentBanner.imageMode === "upload" ? "700" : "500",
                      color: currentBanner.imageMode === "upload" ? "#ffffff" : "#475569",
                      backgroundColor: currentBanner.imageMode === "upload" ? BRAND_ORANGE : "transparent",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <Upload size={15} />
                    <span>Upload Image</span>
                  </button>
                </div>

                {/* Image URL Input (If URL mode selected) */}
                {currentBanner.imageMode === "url" && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#475569",
                        marginBottom: "6px"
                      }}
                    >
                      Image URL (Paste Link)
                    </label>
                    <input
                      type="text"
                      value={currentBanner.image || ""}
                      onChange={(e) => updateField(activeTab, "image", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "13px",
                        borderRadius: "6px",
                        border: `1px solid ${BRAND_ORANGE}`,
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                )}

                {/* File Upload Input (If Upload mode selected) */}
                {currentBanner.imageMode === "upload" && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => handleFileUpload(e, activeTab)}
                    />
                    <div
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      style={{
                        border: `2px dashed ${BRAND_ORANGE}`,
                        backgroundColor: "#fff7ed",
                        borderRadius: "8px",
                        padding: "24px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      <Upload size={28} color={BRAND_ORANGE} style={{ margin: "0 auto 8px auto", display: "block" }} />
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                        Click to select image from your device
                      </p>
                      <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
                        Supported formats: JPG, PNG, WEBP
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ONLY Text on Banner + Text under Banner */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#1e293b",
                      marginBottom: "6px"
                    }}
                  >
                    1. Banner Heading / Title (Text on Banner)
                  </label>
                  <input
                    type="text"
                    value={currentBanner.title || ""}
                    onChange={(e) => updateField(activeTab, "title", e.target.value)}
                    placeholder="Enter banner main title..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = BRAND_ORANGE)}
                    onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#1e293b",
                      marginBottom: "6px"
                    }}
                  >
                    2. Banner Subtitle / Description (Text under or on Banner)
                  </label>
                  <textarea
                    rows={3}
                    value={currentBanner.subtitle || ""}
                    onChange={(e) => updateField(activeTab, "subtitle", e.target.value)}
                    placeholder="Enter subtitle or description..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      boxSizing: "border-box",
                      resize: "vertical"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = BRAND_ORANGE)}
                    onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Visual Preview */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              <div
                style={{
                  padding: "14px 20px",
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                  <Eye size={16} color={BRAND_ORANGE} />
                  <span>Live Banner Visual Preview</span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    backgroundColor: "#fff7ed",
                    color: BRAND_ORANGE,
                    padding: "3px 8px",
                    borderRadius: "4px"
                  }}
                >
                  {currentBanner.imageMode === "upload" ? "Uploaded File" : "Image URL"}
                </span>
              </div>

              {/* Simulated Banner Preview */}
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "10px",
                    overflow: "hidden",
                    minHeight: "260px",
                    backgroundImage: `url(${currentBanner.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "24px",
                    boxSizing: "border-box",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  {/* Subtle Dark Gradient Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.75) 100%)",
                      zIndex: 1
                    }}
                  />

                  {/* Overlay Text */}
                  <div style={{ position: "relative", zIndex: 2, color: "#ffffff", maxWidth: "540px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: BRAND_ORANGE,
                        color: "#ffffff",
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        marginBottom: "8px"
                      }}
                    >
                      {currentBanner.pageName}
                    </span>
                    <h2
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "24px",
                        fontWeight: "800",
                        lineHeight: "1.2",
                        color: "#ffffff"
                      }}
                    >
                      {currentBanner.title || "Banner Title Here"}
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "rgba(255, 255, 255, 0.9)",
                        lineHeight: "1.4"
                      }}
                    >
                      {currentBanner.subtitle || "Banner subtitle or description text will appear here."}
                    </p>
                  </div>
                </div>

                {/* Subtitle Under Banner Preview */}
                <div
                  style={{
                    marginTop: "16px",
                    padding: "14px 16px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                    Text Under Banner:
                  </span>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                    {currentBanner.subtitle || "No subtitle provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
