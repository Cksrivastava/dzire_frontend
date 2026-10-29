import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import {
  Tag, Plus, Search, Trash2, Edit3, Check, X, Filter,
  Layers, ArrowLeft, RefreshCcw, Sparkles, Box, CheckCircle2,
  Sliders, PlusCircle, AlertTriangle, ChevronRight, Hash,
  Palette, Type, ListFilter, Eye, MoreVertical
} from 'lucide-react';
import './AdminDashboard.css';
import './AdminAttributes.css';

export const INITIAL_PRESET_ATTRIBUTES = [];

export const STORAGE_KEY = "dzire_admin_attributes";

export const loadStoredAttributes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load attributes from localStorage:", err);
  }
  return INITIAL_PRESET_ATTRIBUTES;
};

export const saveStoredAttributes = (attributes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attributes));
    window.dispatchEvent(new CustomEvent("dzire_attributes_updated", { detail: attributes }));
  } catch (err) {
    console.error("Failed to save attributes to localStorage:", err);
  }
};

const AdminAttributes = () => {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState(loadStoredAttributes);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'preset' | 'custom'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'text' | 'color' | 'size'
  const [valueCountFilter, setValueCountFilter] = useState("all"); // 'all' | 'has_values' | 'no_values'

  // Modal State for Add / Edit Attribute
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState(null);
  const [modalName, setModalName] = useState("");
  const [modalType, setModalType] = useState("text");
  const [modalDescription, setModalDescription] = useState("");
  const [modalValues, setModalValues] = useState([]);
  const [modalValueInput, setModalValueInput] = useState("");
  const [modalError, setModalError] = useState("");

  // Delete Confirmation Modal
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);

  // Quick Inline Value Add State (key: attr.id, value: string)
  const [inlineValueInputs, setInlineValueInputs] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync state with storage and fetch from backend on mount
  useEffect(() => {
    let mounted = true;
    fetch("https://dzire-backend.onrender.com/api/admin/attributes")
      .then(res => res.json())
      .then(data => {
        if (mounted && data.success && Array.isArray(data.attributes)) {
          setAttributes(data.attributes);
          saveStoredAttributes(data.attributes);
        }
      })
      .catch(() => {});

    const handleSync = (e) => {
      if (e.detail) {
        setAttributes(e.detail);
      } else {
        setAttributes(loadStoredAttributes());
      }
    };
    window.addEventListener("dzire_attributes_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      mounted = false;
      window.removeEventListener("dzire_attributes_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingAttr(null);
    setModalName("");
    setModalType("text");
    setModalDescription("");
    setModalValues([]);
    setModalValueInput("");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (attr) => {
    setEditingAttr(attr);
    setModalName(attr.name);
    setModalType(attr.type || "text");
    setModalDescription(attr.description || "");
    setModalValues([...(attr.values || [])]);
    setModalValueInput("");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleAddTagToModal = () => {
    const val = modalValueInput.trim();
    if (!val) return;
    if (modalValues.some((v) => v.toLowerCase() === val.toLowerCase())) {
      setModalError(`Value "${val}" already exists in this attribute.`);
      return;
    }
    setModalValues([...modalValues, val]);
    setModalValueInput("");
    setModalError("");
  };

  const handleRemoveTagFromModal = (valToRemove) => {
    setModalValues(modalValues.filter((v) => v !== valToRemove));
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    const cleanName = modalName.trim();
    if (!cleanName) {
      setModalError("Attribute name cannot be empty.");
      return;
    }

    // Check duplicate name
    const isDuplicate = attributes.some(
      (a) => a.name.toLowerCase() === cleanName.toLowerCase() && (!editingAttr || a.id !== editingAttr.id)
    );
    if (isDuplicate) {
      setModalError(`An attribute with the name "${cleanName}" already exists.`);
      return;
    }

    let updatedList;
    if (editingAttr) {
      // Update existing
      updatedList = attributes.map((a) => {
        if (a.id === editingAttr.id) {
          return {
            ...a,
            name: cleanName,
            type: modalType,
            description: modalDescription.trim(),
            values: modalValues
          };
        }
        return a;
      });
      showToast(`Attribute "${cleanName}" updated successfully!`);

      // Persist to backend
      fetch(`https://dzire-backend.onrender.com/api/admin/attributes/${editingAttr.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          type: modalType,
          description: modalDescription.trim(),
          values: modalValues
        })
      }).catch(() => {});
    } else {
      // Create new attribute
      const newAttr = {
        id: "attr_" + Date.now(),
        name: cleanName,
        type: modalType,
        isPreset: false,
        description: modalDescription.trim() || `Custom ${cleanName} variation attribute`,
        values: modalValues,
        createdAt: new Date().toISOString().split("T")[0]
      };
      updatedList = [...attributes, newAttr];
      showToast(`New attribute "${cleanName}" added successfully!`);

      // Persist to backend
      fetch("https://dzire-backend.onrender.com/api/admin/attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAttr)
      }).catch(() => {});
    }

    setAttributes(updatedList);
    saveStoredAttributes(updatedList);
    setIsModalOpen(false);
  };

  const handleDeleteAttribute = (target) => {
    const updatedList = attributes.filter((a) => a.id !== target.id);
    setAttributes(updatedList);
    saveStoredAttributes(updatedList);
    setDeleteConfirmTarget(null);
    showToast(`Attribute "${target.name}" deleted successfully!`, "error");

    fetch(`https://dzire-backend.onrender.com/api/admin/attributes/${target.id}`, {
      method: "DELETE"
    }).catch(() => {});
  };

  const handleAddInlineValue = (attrId) => {
    const text = (inlineValueInputs[attrId] || "").trim();
    if (!text) return;

    const targetAttr = attributes.find((a) => a.id === attrId);
    if (!targetAttr) return;

    if (targetAttr.values.some((v) => v.toLowerCase() === text.toLowerCase())) {
      showToast(`Value "${text}" already exists in ${targetAttr.name}!`, "error");
      return;
    }

    const updatedValues = [...targetAttr.values, text];
    const updatedList = attributes.map((a) => {
      if (a.id === attrId) {
        return {
          ...a,
          values: updatedValues
        };
      }
      return a;
    });

    setAttributes(updatedList);
    saveStoredAttributes(updatedList);
    setInlineValueInputs((prev) => ({ ...prev, [attrId]: "" }));
    showToast(`Added "${text}" to ${targetAttr.name}`);

    fetch(`https://dzire-backend.onrender.com/api/admin/attributes/${attrId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: updatedValues })
    }).catch(() => {});
  };

  const handleRemoveSingleValue = (attrId, valueToRemove) => {
    const targetAttr = attributes.find((a) => a.id === attrId);
    const updatedValues = targetAttr ? targetAttr.values.filter((v) => v !== valueToRemove) : [];
    const updatedList = attributes.map((a) => {
      if (a.id === attrId) {
        return {
          ...a,
          values: updatedValues
        };
      }
      return a;
    });
    setAttributes(updatedList);
    saveStoredAttributes(updatedList);
    showToast(`Removed value "${valueToRemove}"`);

    fetch(`https://dzire-backend.onrender.com/api/admin/attributes/${attrId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: updatedValues })
    }).catch(() => {});
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset attributes to default system presets? Custom attributes will be removed.")) {
      setAttributes(INITIAL_PRESET_ATTRIBUTES);
      saveStoredAttributes(INITIAL_PRESET_ATTRIBUTES);
      showToast("Reset to default system attributes!");

      fetch("https://dzire-backend.onrender.com/api/admin/attributes/reset", {
        method: "POST"
      }).catch(() => {});
    }
  };

  // Filtered & Searched attributes
  const filteredAttributes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return attributes.filter((attr) => {
      // Tab filter
      if (filterType === "preset" && !attr.isPreset) return false;
      if (filterType === "custom" && attr.isPreset) return false;

      // Advanced filter: Type
      if (typeFilter !== "all" && (attr.type || "text").toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      // Advanced filter: Values count
      if (valueCountFilter === "has_values" && (!attr.values || attr.values.length === 0)) return false;
      if (valueCountFilter === "no_values" && attr.values && attr.values.length > 0) return false;

      // Query search
      if (!query) return true;
      const matchName = attr.name.toLowerCase().includes(query);
      const matchDesc = (attr.description || "").toLowerCase().includes(query);
      const matchValues = (attr.values || []).some((v) => v.toLowerCase().includes(query));
      return matchName || matchDesc || matchValues;
    });
  }, [attributes, searchQuery, filterType, typeFilter, valueCountFilter]);

  const totalValuesCount = useMemo(() => {
    return attributes.reduce((acc, curr) => acc + (curr.values ? curr.values.length : 0), 0);
  }, [attributes]);

  const customAttributesCount = useMemo(() => {
    return attributes.filter((a) => !a.isPreset).length;
  }, [attributes]);

  return (
    <AdminLayout>
      {/* Notification Toast */}
      {toastMessage && (
        <div
          className="attr-toast"
          style={{
            background: toastMessage.type === "error" ? "#dc2626" : "#10b981"
          }}
        >
          <CheckCircle2 size={18} />
          {toastMessage.msg}
        </div>
      )}

      <div className="dashboard-wrapper">
        {/* Main Unified Card Container */}
        <div className="attr-card-container">
          
          {/* Tabs & Top Actions Header Bar */}
          <div className="attr-header-bar">
            {/* Tabs */}
            <div className="attr-tabs">
              <button
                onClick={() => setFilterType("all")}
                className="attr-tab-btn"
                style={{
                  color: filterType === 'all' ? '#ff6600' : '#000000',
                  borderBottom: filterType === 'all' ? '3px solid #ff6600' : '3px solid transparent'
                }}
              >
                All Attributes ({attributes.length})
              </button>
              <button
                onClick={() => setFilterType("preset")}
                className="attr-tab-btn"
                style={{
                  color: filterType === 'preset' ? '#ff6600' : '#000000',
                  borderBottom: filterType === 'preset' ? '3px solid #ff6600' : '3px solid transparent'
                }}
              >
                System Presets ({attributes.filter(a => a.isPreset).length})
              </button>
              <button
                onClick={() => setFilterType("custom")}
                className="attr-tab-btn"
                style={{
                  color: filterType === 'custom' ? '#ff6600' : '#000000',
                  borderBottom: filterType === 'custom' ? '3px solid #ff6600' : '3px solid transparent'
                }}
              >
                Custom Added ({customAttributesCount})
              </button>
            </div>

            {/* Top Action Buttons */}
            <div className="attr-top-actions">
              <button
                onClick={handleResetToDefaults}
                title="Reset to default system presets"
                className="attr-btn-reset"
              >
                <RefreshCcw size={14} />
                <span>Reset Defaults</span>
              </button>
              <ExportDropdown
                data={attributes.map((a, i) => ({
                  ID: a.id,
                  Name: a.name,
                  Type: a.type || "Text",
                  Source: a.isPreset ? "Preset" : "Custom",
                  ValuesCount: a.values?.length || 0,
                  ValuesList: (a.values || []).join(", "),
                  Description: a.description || "",
                  CreatedAt: a.createdAt || "-"
                }))}
                filename="dzire_product_attributes"
              />
              <button
                onClick={handleOpenAddModal}
                className="attr-btn-primary"
              >
                <Plus size={16} />
                <span>Add Attribute</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Bar (Responsive grid: 4 on desktop, 2x2 on mobile) */}
          <div className="attr-metrics-container">
            <div className="attr-metrics-grid">
              <div className="attr-metric-card">
                <span className="attr-metric-label">Total Attributes</span>
                <h3 className="attr-metric-value" style={{ color: '#111' }}>{attributes.length}</h3>
              </div>
              <div className="attr-metric-card">
                <span className="attr-metric-label" style={{ color: '#2563eb' }}>System Presets</span>
                <h3 className="attr-metric-value" style={{ color: '#2563eb' }}>{attributes.filter(a => a.isPreset).length}</h3>
              </div>
              <div className="attr-metric-card">
                <span className="attr-metric-label" style={{ color: '#16a34a' }}>Custom Added</span>
                <h3 className="attr-metric-value" style={{ color: '#16a34a' }}>{customAttributesCount}</h3>
              </div>
              <div className="attr-metric-card">
                <span className="attr-metric-label" style={{ color: '#9333ea' }}>Configured Values</span>
                <h3 className="attr-metric-value" style={{ color: '#9333ea' }}>{totalValuesCount}</h3>
              </div>
            </div>
          </div>

          {/* Search & Action Sub-Bar */}
          <div className="attr-subbar">
            <div className="attr-subbar-controls">
              {/* Search Box */}
              <div className="attr-search-wrap">
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search attribute name or value..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="attr-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Advanced Filters Button */}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="attr-btn-filter"
                style={{
                  background: showAdvancedFilters ? '#fff0e6' : '#fff',
                  border: showAdvancedFilters ? '1px solid #ff6600' : '1px solid #cbd5e1',
                  color: showAdvancedFilters ? '#ff6600' : '#334155'
                }}
              >
                <Filter size={14} color={showAdvancedFilters ? "#ff6600" : "#64748b"} /> Advanced Filters
                {(typeFilter !== "all" || valueCountFilter !== "all") && (
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6600' }} />
                )}
              </button>

              {(typeFilter !== "all" || valueCountFilter !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setTypeFilter("all");
                    setValueCountFilter("all");
                    setSearchQuery("");
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <X size={13} /> Reset Filters
                </button>
              )}
            </div>

            {/* Total Count Display */}
            <div className="attr-counter-text">
              Showing <strong style={{ color: '#0f172a' }}>{filteredAttributes.length}</strong> of {attributes.length} attributes
            </div>
          </div>

          {/* Advanced Filters Expandable Drawer/Panel */}
          {showAdvancedFilters && (
            <div className="attr-advanced-panel">
              <div className="attr-filter-group">
                <label className="attr-filter-label">Attribute Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="attr-filter-select"
                >
                  <option value="all">All Types</option>
                  <option value="text">Text</option>
                  <option value="color">Color</option>
                  <option value="size">Size</option>
                </select>
              </div>

              <div className="attr-filter-group">
                <label className="attr-filter-label">Values Status</label>
                <select
                  value={valueCountFilter}
                  onChange={(e) => setValueCountFilter(e.target.value)}
                  className="attr-filter-select"
                >
                  <option value="all">All Values</option>
                  <option value="has_values">Has Configured Values</option>
                  <option value="no_values">No Values Configured</option>
                </select>
              </div>
            </div>
          )}

          {/* Content Section */}
          {filteredAttributes.length === 0 ? (
            <div style={{ background: "#ffffff", padding: "48px 20px", textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#f1f5f9", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Tag size={28} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0" }}>No Attributes Found</h3>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
                {searchQuery ? `No attributes match your query "${searchQuery}".` : "No attributes available in this category."}
              </p>
              <button
                onClick={handleOpenAddModal}
                className="attr-btn-primary"
                style={{ margin: "0 auto" }}
              >
                <Plus size={16} /> Create New Attribute
              </button>
            </div>
          ) : (
            <>
              {/* ==================== DESKTOP TABLE VIEW (>= 768px) ==================== */}
              <div className="attr-desktop-view">
                <table className="attr-table">
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }}>#</th>
                      <th style={{ width: "220px" }}>Attribute Name</th>
                      <th style={{ width: "120px" }}>Type</th>
                      <th>Configured Values</th>
                      <th style={{ width: "130px" }}>Source</th>
                      <th style={{ width: "160px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttributes.map((attr, idx) => (
                      <tr key={attr.id}>
                        <td style={{ color: "#94a3b8", fontWeight: "600" }}>
                          {idx + 1}
                        </td>

                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "8px",
                                background: attr.name.toLowerCase() === "color" ? "linear-gradient(135deg, #ffedd5, #fed7aa)" : "#f1f5f9",
                                color: attr.name.toLowerCase() === "color" ? "#ea580c" : "#334155",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "700",
                                flexShrink: 0
                              }}
                            >
                              {attr.type === "color" ? <Palette size={16} /> : <Type size={16} />}
                            </div>
                            <div>
                              <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>
                                {attr.name}
                              </div>
                              {attr.description && (
                                <div style={{ fontSize: "11px", color: "#64748b", maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {attr.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            style={{
                              background: "#f1f5f9",
                              color: "#475569",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "600",
                              textTransform: "capitalize"
                            }}
                          >
                            {attr.type || "Text"}
                          </span>
                        </td>

                        <td>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", maxWidth: "480px" }}>
                            {(attr.values || []).map((val) => (
                              <span
                                key={val}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  background: "#f8fafc",
                                  border: "1px solid #e2e8f0",
                                  color: "#1e293b",
                                  padding: "2px 8px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "500"
                                }}
                              >
                                {attr.type === "color" && (
                                  <span
                                    style={{
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "50%",
                                      background: val.toLowerCase(),
                                      border: "1px solid rgba(0,0,0,0.15)",
                                      display: "inline-block"
                                    }}
                                  />
                                )}
                                {val}
                                <button
                                  onClick={() => handleRemoveSingleValue(attr.id, val)}
                                  title={`Remove ${val}`}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#94a3b8",
                                    padding: 0,
                                    display: "flex",
                                    alignItems: "center"
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}

                            {/* Quick Add Inline Form */}
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <input
                                type="text"
                                placeholder="+ Add value..."
                                value={inlineValueInputs[attr.id] || ""}
                                onChange={(e) =>
                                  setInlineValueInputs({ ...inlineValueInputs, [attr.id]: e.target.value })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddInlineValue(attr.id);
                                  }
                                }}
                                style={{
                                  width: "95px",
                                  padding: "2px 6px",
                                  fontSize: "11px",
                                  border: "1px dashed #cbd5e1",
                                  borderRadius: "6px",
                                  outline: "none",
                                  background: "#ffffff"
                                }}
                              />
                              {(inlineValueInputs[attr.id] || "").trim() && (
                                <button
                                  onClick={() => handleAddInlineValue(attr.id)}
                                  style={{
                                    background: "#10b981",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                    fontSize: "11px",
                                    cursor: "pointer",
                                    fontWeight: "700"
                                  }}
                                >
                                  +
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          {attr.isPreset ? (
                            <span
                              style={{
                                background: "rgba(37, 99, 235, 0.1)",
                                color: "#2563eb",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <Box size={12} /> System
                            </span>
                          ) : (
                            <span
                              style={{
                                background: "rgba(16, 185, 129, 0.1)",
                                color: "#10b981",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <Sparkles size={12} /> Custom
                            </span>
                          )}
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <button
                              onClick={() => handleOpenEditModal(attr)}
                              title="Edit attribute"
                              style={{
                                background: "#f1f5f9",
                                border: "1px solid #e2e8f0",
                                color: "#334155",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#e2e8f0";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#f1f5f9";
                              }}
                            >
                              <Edit3 size={13} /> Edit
                            </button>

                            <button
                              onClick={() => setDeleteConfirmTarget(attr)}
                              title="Delete attribute"
                              style={{
                                background: "#fef2f2",
                                border: "1px solid #fee2e2",
                                color: "#ef4444",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#fee2e2";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#fef2f2";
                              }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ==================== MOBILE CARDS VIEW (< 768px) ==================== */}
              <div className="attr-mobile-view">
                {filteredAttributes.map((attr, idx) => (
                  <div key={attr.id} className="attr-mobile-card">
                    {/* Card Top: Icon, Name, Type & Source Badges */}
                    <div className="attr-mobile-card-header">
                      <div className="attr-mobile-card-title-group">
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            background: attr.name.toLowerCase() === "color" ? "linear-gradient(135deg, #ffedd5, #fed7aa)" : "#f1f5f9",
                            color: attr.name.toLowerCase() === "color" ? "#ea580c" : "#334155",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            flexShrink: 0
                          }}
                        >
                          {attr.type === "color" ? <Palette size={18} /> : <Type size={18} />}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="attr-mobile-card-name">
                            {attr.name}
                          </div>
                          {attr.description && (
                            <div className="attr-mobile-card-desc">
                              {attr.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="attr-mobile-badges">
                        <span
                          style={{
                            background: "#f1f5f9",
                            color: "#475569",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            textTransform: "capitalize"
                          }}
                        >
                          {attr.type || "Text"}
                        </span>
                        {attr.isPreset ? (
                          <span
                            style={{
                              background: "rgba(37, 99, 235, 0.1)",
                              color: "#2563eb",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px"
                            }}
                          >
                            <Box size={11} /> System
                          </span>
                        ) : (
                          <span
                            style={{
                              background: "rgba(16, 185, 129, 0.1)",
                              color: "#10b981",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px"
                            }}
                          >
                            <Sparkles size={11} /> Custom
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Values Section */}
                    <div className="attr-mobile-values-section">
                      <div className="attr-mobile-values-title">
                        <span>Configured Values ({attr.values?.length || 0})</span>
                      </div>

                      <div className="attr-mobile-values-chips">
                        {(attr.values || []).map((val) => (
                          <span
                            key={val}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              color: "#1e293b",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "500"
                            }}
                          >
                            {attr.type === "color" && (
                              <span
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  background: val.toLowerCase(),
                                  border: "1px solid rgba(0,0,0,0.15)",
                                  display: "inline-block"
                                }}
                              />
                            )}
                            {val}
                            <button
                              onClick={() => handleRemoveSingleValue(attr.id, val)}
                              title={`Remove ${val}`}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#94a3b8",
                                padding: 0,
                                display: "flex",
                                alignItems: "center"
                              }}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}

                        {/* Quick Add Inline Form */}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <input
                            type="text"
                            placeholder="+ Add value..."
                            value={inlineValueInputs[attr.id] || ""}
                            onChange={(e) =>
                              setInlineValueInputs({ ...inlineValueInputs, [attr.id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddInlineValue(attr.id);
                              }
                            }}
                            style={{
                              width: "105px",
                              padding: "4px 8px",
                              fontSize: "12px",
                              border: "1px dashed #cbd5e1",
                              borderRadius: "6px",
                              outline: "none",
                              background: "#ffffff"
                            }}
                          />
                          {(inlineValueInputs[attr.id] || "").trim() && (
                            <button
                              onClick={() => handleAddInlineValue(attr.id)}
                              style={{
                                background: "#10b981",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: "700"
                              }}
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="attr-mobile-actions-row">
                      <button
                        onClick={() => handleOpenEditModal(attr)}
                        className="attr-btn-card-action"
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #cbd5e1",
                          color: "#334155"
                        }}
                      >
                        <Edit3 size={14} /> Edit Attribute
                      </button>

                      <button
                        onClick={() => setDeleteConfirmTarget(attr)}
                        className="attr-btn-card-action"
                        style={{
                          background: "#fef2f2",
                          border: "1px solid #fee2e2",
                          color: "#dc2626"
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ==================== ADD / EDIT ATTRIBUTE MODAL ==================== */}
      {isModalOpen && (
        <div className="attr-modal-overlay">
          <div className="attr-modal-content">
            {/* Modal Header */}
            <div className="attr-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(255, 102, 0, 0.12)",
                    color: "#ff6600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Tag size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                  {editingAttr ? `Edit Attribute: ${editingAttr.name}` : "Add New Attribute Name"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModal} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
              <div className="attr-modal-body">
                {modalError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fee2e2",
                      color: "#dc2626",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <AlertTriangle size={16} />
                    {modalError}
                  </div>
                )}

                {/* Attribute Name */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>
                    Attribute Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Size, Color, Sleeve, RAM, Voltage..."
                    value={modalName}
                    onChange={(e) => {
                      setModalName(e.target.value);
                      if (modalError) setModalError("");
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
                    This name will appear in the Attribute Name dropdown when adding products.
                  </span>
                </div>

                {/* Attribute Type */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>
                    Attribute Type
                  </label>
                  <select
                    value={modalType}
                    onChange={(e) => setModalType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "13px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      background: "#ffffff",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="text">Text / General (Default)</option>
                    <option value="size">Size / Dimensions</option>
                    <option value="color">Color / Swatch</option>
                    <option value="select">Dropdown / Choice</option>
                  </select>
                </div>

                {/* Default Values Tag Input */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>
                    Pre-configured Values (Optional)
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      minHeight: "44px",
                      padding: "6px 10px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      background: "#ffffff"
                    }}
                  >
                    {modalValues.map((val) => (
                      <span
                        key={val}
                        style={{
                          background: "#f1f5f9",
                          border: "1px solid #e2e8f0",
                          color: "#1e293b",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        {val}
                        <button
                          type="button"
                          onClick={() => handleRemoveTagFromModal(val)}
                          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={modalValues.length === 0 ? "Type a value & press Enter (e.g. Small, Medium)..." : "+ add more..."}
                      value={modalValueInput}
                      onChange={(e) => setModalValueInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTagToModal();
                        }
                      }}
                      style={{
                        flex: 1,
                        minWidth: "140px",
                        border: "none",
                        outline: "none",
                        fontSize: "13px",
                        padding: "4px 0"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", flexWrap: "wrap", gap: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      Press Enter or click Add to append a value.
                    </span>
                    {modalValueInput.trim() && (
                      <button
                        type="button"
                        onClick={handleAddTagToModal}
                        style={{
                          background: "#f1f5f9",
                          border: "1px solid #cbd5e1",
                          color: "#334155",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        + Add "{modalValueInput.trim()}"
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>
                    Description / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short note about what this attribute represents..."
                    value={modalDescription}
                    onChange={(e) => setModalDescription(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      fontSize: "13px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="attr-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#334155",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ff6600",
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(255, 102, 0, 0.3)"
                  }}
                >
                  {editingAttr ? "Save Changes" : "Create Attribute"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      {deleteConfirmTarget && (
        <div className="attr-modal-overlay">
          <div className="attr-modal-content" style={{ maxWidth: "440px" }}>
            <div style={{ padding: "24px 20px", textAlign: "center", overflowY: "auto" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#fee2e2",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px"
                }}
              >
                <Trash2 size={24} />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
                Delete Attribute "{deleteConfirmTarget.name}"?
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>
                Are you sure you want to remove <strong>{deleteConfirmTarget.name}</strong>?
                This will delete its configured values and remove it from product creation attribute choices.
              </p>
            </div>

            <div className="attr-modal-footer" style={{ justifyContent: "center" }}>
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#334155",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAttribute(deleteConfirmTarget)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc2626",
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Yes, Delete Attribute
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAttributes;
