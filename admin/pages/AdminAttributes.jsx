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
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: toastMessage.type === "error" ? "#dc2626" : "#10b981",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: "600",
            animation: "fadeIn 0.2s ease-out"
          }}
        >
          <CheckCircle2 size={18} />
          {toastMessage.msg}
        </div>
      )}

      <div className="dashboard-wrapper">
        {/* Main Unified Card Container matching Inventory page */}
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          
          {/* Tabs & Top Actions Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f6', padding: '0 20px', flexWrap: 'wrap', gap: '12px' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '32px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100%', scrollbarWidth: 'none' }}>
              <button
                onClick={() => setFilterType("all")}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '18px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  color: filterType === 'all' ? '#ff6600' : '#000000',
                  borderBottom: filterType === 'all' ? '3px solid #ff6600' : '3px solid transparent'
                }}
              >
                All Attributes ({attributes.length})
              </button>
              <button
                onClick={() => setFilterType("preset")}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '18px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  color: filterType === 'preset' ? '#ff6600' : '#000000',
                  borderBottom: filterType === 'preset' ? '3px solid #ff6600' : '3px solid transparent'
                }}
              >
                System Presets ({attributes.filter(a => a.isPreset).length})
              </button>
              <button
                onClick={() => setFilterType("custom")}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '18px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  color: filterType === 'custom' ? '#ff6600' : '#000000',
                  borderBottom: filterType === 'custom' ? '3px solid #ff6600' : '3px solid transparent'
                }}
              >
                Custom Added ({customAttributesCount})
              </button>
            </div>

            {/* Top Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleResetToDefaults}
                title="Reset to default system presets"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#e2e8f0')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#f8fafc')}
              >
                <RefreshCcw size={14} /> Reset Defaults
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
                style={{
                  background: '#ff6600',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(255, 102, 0, 0.25)',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#e65c00')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ff6600')}
              >
                <Plus size={16} /> Add Attribute
              </button>
            </div>
          </div>

          {/* Metric Summary Bar (Scrollable horizontally in responsive view) */}
          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', gap: '1px', background: '#eef2f6', minWidth: '680px' }}>
              <div style={{ padding: '16px 24px', background: '#fff', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Total Attributes</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#111' }}>{attributes.length}</h3>
              </div>
              <div style={{ padding: '16px 24px', background: '#fff', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '500' }}>System Presets</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#2563eb' }}>{attributes.filter(a => a.isPreset).length}</h3>
              </div>
              <div style={{ padding: '16px 24px', background: '#fff', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500' }}>Custom Added</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#16a34a' }}>{customAttributesCount}</h3>
              </div>
              <div style={{ padding: '16px 24px', background: '#fff', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '12px', color: '#9333ea', fontWeight: '500' }}>Configured Values</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#9333ea' }}>{totalValuesCount}</h3>
              </div>
            </div>
          </div>

          {/* Search & Action Sub-Bar */}
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderBottom: '1px solid #eef2f6', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
              {/* Search Box */}
              <div style={{ position: 'relative', width: '350px', maxWidth: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search attribute name or value..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#fff',
                    boxSizing: 'border-box'
                  }}
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
                style={{
                  background: showAdvancedFilters ? '#fff0e6' : '#fff',
                  border: showAdvancedFilters ? '1px solid #ff6600' : '1px solid #cbd5e1',
                  color: showAdvancedFilters ? '#ff6600' : '#334155',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s ease'
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
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
              Showing <strong style={{ color: '#0f172a' }}>{filteredAttributes.length}</strong> of {attributes.length} attributes
            </div>
          </div>

          {/* Advanced Filters Expandable Drawer/Panel */}
          {showAdvancedFilters && (
            <div style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Attribute Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="all">All Types</option>
                  <option value="text">Text</option>
                  <option value="color">Color</option>
                  <option value="size">Size</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Values Status</label>
                <select
                  value={valueCountFilter}
                  onChange={(e) => setValueCountFilter(e.target.value)}
                  style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', cursor: 'pointer' }}
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
                style={{
                  background: "#ff6600",
                  color: "#fff",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                + Create New Attribute
              </button>
            </div>
          ) : (
            /* ==================== TABLE VIEW ONLY ==================== */
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
                    <th style={{ padding: "14px 16px", width: "40px" }}>#</th>
                    <th style={{ padding: "14px 16px", width: "220px" }}>Attribute Name</th>
                    <th style={{ padding: "14px 16px", width: "120px" }}>Type</th>
                    <th style={{ padding: "14px 16px" }}>Configured Values</th>
                    <th style={{ padding: "14px 16px", width: "130px" }}>Source</th>
                    <th style={{ padding: "14px 16px", width: "160px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttributes.map((attr, idx) => (
                    <tr
                      key={attr.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fcfdfd")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px", color: "#94a3b8", fontWeight: "600" }}>
                        {idx + 1}
                      </td>

                      <td style={{ padding: "14px 16px" }}>
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
                              fontWeight: "700"
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

                      <td style={{ padding: "14px 16px" }}>
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

                      <td style={{ padding: "14px 16px" }}>
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

                      <td style={{ padding: "14px 16px" }}>
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

                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
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
          )}
        </div>
      </div>

      {/* ==================== ADD / EDIT ATTRIBUTE MODAL ==================== */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: "100%",
              maxWidth: "520px",
              borderRadius: "12px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden"
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc"
              }}
            >
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
            <form onSubmit={handleSaveModal}>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
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
              <div
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px"
                }}
              >
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: "100%",
              maxWidth: "440px",
              borderRadius: "12px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden"
            }}
          >
            <div style={{ padding: "24px", textAlign: "center" }}>
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

            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #f1f5f9",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "center",
                gap: "12px"
              }}
            >
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
