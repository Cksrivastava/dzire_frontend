import React, { useState, useMemo, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  X,
  Tag,
  IndianRupee,
  Filter,
  Eye,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Check,
  AlertCircle,
  Copy
} from "lucide-react";
import { rentalProducts } from "../../src/data/rentalCatalogData";

export const RENTALS_STORAGE_KEY = "dzire_admin_rentals_list";
export const RENTALS_UPDATE_EVENT = "dzire_rentals_updated";

const BRAND_ORANGE = "#FF6600";

const CATEGORIES = [
  "All",
  "Camping",
  "Trouser",
  "Jacket",
  "Rainwear",
  "Trek Bag",
  "Shoes",
  "Climbing",
  "Accessories"
];

const PRESET_RENTAL_IMAGES = [
  { label: "Quechua Tent", url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80" },
  { label: "Hiking Trouser", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" },
  { label: "Weather Jacket", url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80" },
  { label: "Rainwear Shield", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80" },
  { label: "Camp in Forest", url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80" },
  { label: "Rucksack 60L", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" }
];

const AdminRentals = () => {
  const [rentals, setRentals] = useState(() => {
    try {
      const saved = localStorage.getItem(RENTALS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return rentalProducts || [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [toastMessage, setToastMessage] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRental, setCurrentRental] = useState(null);
  const [imageMode, setImageMode] = useState("url"); // "url" | "upload"
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Camping",
    capacity: "3 Person",
    status: "Available",
    badge: "TOP PICK",
    price: 249,
    deposit: "2,000",
    pickup: "Self Pickup Available",
    sanitized: "Sanitized & Checked",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
    description: "High quality gear tested and sanitized for peak outdoor treks."
  });

  // Sync to localStorage
  const saveToStorage = (updatedList) => {
    setRentals(updatedList);
    try {
      localStorage.setItem(RENTALS_STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent(RENTALS_UPDATE_EVENT, { detail: updatedList }));
    } catch (e) {
      console.error("Failed to save rentals:", e);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentRental(null);
    setImageMode("url");
    setFormData({
      name: "",
      category: "Camping",
      capacity: "Standard Fit",
      status: "Available",
      badge: "NEW",
      price: 199,
      deposit: "1,500",
      pickup: "Self Pickup Available",
      sanitized: "Sanitized & Checked",
      image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
      description: "Sanitized and checked outdoor adventure gear."
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentRental(item);
    setImageMode(item.image?.startsWith("data:") ? "upload" : "url");
    setFormData({
      name: item.name || "",
      category: item.category || "Camping",
      capacity: item.capacity || "Standard Fit",
      status: item.status || "Available",
      badge: item.badge || "POPULAR",
      price: item.price || 199,
      deposit: item.deposit || "1,500",
      pickup: item.pickup || "Self Pickup Available",
      sanitized: item.sanitized || "Sanitized & Checked",
      image: item.image || "",
      description: item.description || "Sanitized and checked outdoor adventure gear."
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Kya aap sach me is rental item ko delete karna chahte hain?")) {
      const updated = rentals.filter((r) => r.id !== id);
      saveToStorage(updated);
      showToast("Rental item delete ho gaya!");
    }
  };

  const handleDuplicate = (item) => {
    const copy = {
      ...item,
      id: Date.now(),
      name: `${item.name} (Copy)`
    };
    const updated = [copy, ...rentals];
    saveToStorage(updated);
    showToast(`"${item.name}" ki copy create ho gayi!`);
  };

  const handleToggleStatus = (id) => {
    const updated = rentals.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: r.status === "Available" ? "Rented Out" : "Available"
        };
      }
      return r;
    });
    saveToStorage(updated);
    showToast("Status update ho gaya!");
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Kya aap catalog ko original default rentals par reset karna chahte hain?")) {
      saveToStorage(rentalProducts);
      showToast("Rentals catalog initial defaults par reset ho gaya!");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Kripya valid image file (JPG, PNG, WebP) upload karein.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        image: event.target.result
      }));
      showToast("Image upload complete!");
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Kripya rental gear ka naam enter karein.");
      return;
    }

    if (isEditing && currentRental) {
      const updated = rentals.map((r) => {
        if (r.id === currentRental.id) {
          return {
            ...r,
            ...formData,
            id: currentRental.id
          };
        }
        return r;
      });
      saveToStorage(updated);
      showToast(`"${formData.name}" successfully update ho gaya!`);
    } else {
      const newItem = {
        ...formData,
        id: Date.now()
      };
      saveToStorage([newItem, ...rentals]);
      showToast(`"${formData.name}" catalog me add ho gaya!`);
    }
    setIsModalOpen(false);
  };

  // Filter & Search Logic
  const filteredRentals = useMemo(() => {
    return rentals.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.capacity && item.capacity.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [rentals, searchQuery, selectedCategory, selectedStatus]);

  // Stats
  const totalCount = rentals.length;
  const availableCount = rentals.filter((r) => r.status === "Available").length;
  const rentedCount = rentals.filter((r) => r.status === "Rented Out").length;
  const categoriesCount = new Set(rentals.map((r) => r.category)).size;

  return (
    <AdminLayout>
      <div style={{ padding: "24px 32px 60px 32px", width: "100%", boxSizing: "border-box" }}>
        {/* Floating Toast Notification */}
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
              <Layers size={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#1e293b" }}>
                  Rentals Catalog Management
                </h1>
                <span
                  style={{
                    backgroundColor: BRAND_ORANGE,
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 8px",
                    borderRadius: "4px"
                  }}
                >
                  Website Management
                </span>
              </div>
              <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                Manage gear rentals, daily rates, deposit amounts, and stock availability on /rental.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a
              href="/rental"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 14px",
                fontSize: "13px",
                fontWeight: "600",
                color: BRAND_ORANGE,
                backgroundColor: "#fff7ed",
                border: `1px solid ${BRAND_ORANGE}40`,
                borderRadius: "8px",
                textDecoration: "none"
              }}
            >
              <span>View Live Rentals</span>
              <ExternalLink size={14} />
            </a>

            <button
              type="button"
              onClick={handleResetToDefaults}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 14px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#64748b",
                backgroundColor: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              <RotateCcw size={14} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: "700",
                color: "#ffffff",
                backgroundColor: BRAND_ORANGE,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(255, 102, 0, 0.3)"
              }}
            >
              <Plus size={16} />
              Add Rental Item
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px"
          }}
        >
          <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Total Rental Gear</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>{totalCount}</div>
          </div>
          <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a" }}>Available for Rent</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#16a34a", marginTop: "4px" }}>{availableCount}</div>
          </div>
          <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#ea580c" }}>Currently Rented</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#ea580c", marginTop: "4px" }}>{rentedCount}</div>
          </div>
          <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#6366f1" }}>Gear Categories</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#6366f1", marginTop: "4px" }}>{categoriesCount}</div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            padding: "16px 20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px"
          }}
        >
          {/* Search Box */}
          <div style={{ position: "relative", minWidth: "280px", flex: "1 1 280px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gear name, category, capacity..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                fontSize: "13px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: "8px 12px",
                  fontSize: "13px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff"
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: "8px 12px",
                  fontSize: "13px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff"
                }}
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Rented Out">Rented Out</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rentals Table */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                  <th style={{ padding: "12px 18px", fontWeight: "700" }}>Gear Item</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Category</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Daily Rent</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Security Deposit</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Status</th>
                  <th style={{ padding: "12px 18px", fontWeight: "700", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRentals.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#64748b" }}>
                      <Layers size={32} color="#cbd5e1" style={{ margin: "0 auto 8px auto", display: "block" }} />
                      <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>Koi rental items nahi mile</p>
                      <span style={{ fontSize: "12px" }}>Search filter clear karein ya "Add Rental Item" par click karein.</span>
                    </td>
                  </tr>
                ) : (
                  filteredRentals.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background 0.15s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {/* Image & Name */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80"}
                            alt={item.name}
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "8px",
                              objectFit: "cover",
                              border: "1px solid #e2e8f0"
                            }}
                          />
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>{item.name}</span>
                              {item.badge && (
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: "800",
                                    backgroundColor: "#fff7ed",
                                    color: BRAND_ORANGE,
                                    padding: "2px 6px",
                                    borderRadius: "4px"
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>{item.capacity || "Standard"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            backgroundColor: "#f1f5f9",
                            color: "#334155",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}
                        >
                          {item.category}
                        </span>
                      </td>

                      {/* Daily Rent */}
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontWeight: "700", color: BRAND_ORANGE, fontSize: "14px" }}>
                          ₹{item.price}
                        </span>
                        <span style={{ fontSize: "11px", color: "#64748b" }}> / day</span>
                      </td>

                      {/* Security Deposit */}
                      <td style={{ padding: "14px 16px", color: "#334155", fontWeight: "600" }}>
                        ₹{item.deposit}
                      </td>

                      {/* Status Toggle */}
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            border: "none",
                            fontSize: "11px",
                            fontWeight: "700",
                            cursor: "pointer",
                            backgroundColor: item.status === "Available" ? "#dcfce7" : "#fee2e2",
                            color: item.status === "Available" ? "#15803d" : "#b91c1c"
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: item.status === "Available" ? "#16a34a" : "#dc2626"
                            }}
                          />
                          <span>{item.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(item)}
                            title="Duplicate"
                            style={{
                              background: "#f1f5f9",
                              border: "none",
                              color: "#475569",
                              padding: "6px",
                              borderRadius: "6px",
                              cursor: "pointer"
                            }}
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Item"
                            style={{
                              background: "#fff7ed",
                              border: "none",
                              color: BRAND_ORANGE,
                              padding: "6px",
                              borderRadius: "6px",
                              cursor: "pointer"
                            }}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Delete Item"
                            style={{
                              background: "#fee2e2",
                              border: "none",
                              color: "#dc2626",
                              padding: "6px",
                              borderRadius: "6px",
                              cursor: "pointer"
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add / Edit Rental Item */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              padding: "20px"
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                maxWidth: "640px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                boxSizing: "border-box"
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#fff7ed"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Layers size={20} color={BRAND_ORANGE} />
                  <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#1e293b" }}>
                    {isEditing ? "Edit Rental Gear Item" : "Add New Rental Gear Item"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleFormSubmit} style={{ padding: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                      Gear Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Quechua 3-Person Waterproof Tent"
                      style={{ width: "100%", padding: "9px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Category & Badge */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                      >
                        {CATEGORIES.filter((c) => c !== "All").map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                        Badge (e.g. TOP PICK, POPULAR)
                      </label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Price & Deposit */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                        Daily Rent Price (₹ / day)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        style={{ width: "100%", padding: "9px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                        Security Deposit (₹)
                      </label>
                      <input
                        type="text"
                        value={formData.deposit}
                        onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                        placeholder="e.g. 2,000"
                        style={{ width: "100%", padding: "9px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Capacity & Status */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                        Capacity / Fit
                      </label>
                      <input
                        type="text"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="e.g. 3 Person / Standard Fit"
                        style={{ width: "100%", padding: "9px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                        Availability Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                      >
                        <option value="Available">Available</option>
                        <option value="Rented Out">Rented Out</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Selector: Upload or URL */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>
                      Item Image
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        backgroundColor: "#f8fafc",
                        padding: "4px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        marginBottom: "10px"
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setImageMode("url")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "8px",
                          fontSize: "12px",
                          fontWeight: imageMode === "url" ? "700" : "500",
                          color: imageMode === "url" ? "#ffffff" : "#475569",
                          backgroundColor: imageMode === "url" ? BRAND_ORANGE : "transparent",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        <LinkIcon size={14} />
                        <span>Image URL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode("upload")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "8px",
                          fontSize: "12px",
                          fontWeight: imageMode === "upload" ? "700" : "500",
                          color: imageMode === "upload" ? "#ffffff" : "#475569",
                          backgroundColor: imageMode === "upload" ? BRAND_ORANGE : "transparent",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        <Upload size={14} />
                        <span>Upload Image</span>
                      </button>
                    </div>

                    {imageMode === "url" ? (
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Paste image URL..."
                        style={{ width: "100%", padding: "9px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                      />
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleFileUpload}
                        />
                        <div
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{
                            border: `2px dashed ${BRAND_ORANGE}`,
                            backgroundColor: "#fff7ed",
                            borderRadius: "8px",
                            padding: "16px",
                            textAlign: "center",
                            cursor: "pointer"
                          }}
                        >
                          <Upload size={22} color={BRAND_ORANGE} style={{ margin: "0 auto 6px auto", display: "block" }} />
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>Click to select image file</span>
                        </div>
                      </div>
                    )}

                    {/* Image Preview & Presets */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "10px" }}>
                      {formData.image && (
                        <img
                          src={formData.image}
                          alt="preview"
                          style={{ width: "44px", height: "44px", borderRadius: "6px", objectFit: "cover", border: "1px solid #cbd5e1" }}
                        />
                      )}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {PRESET_RENTAL_IMAGES.slice(0, 4).map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: preset.url })}
                            style={{ fontSize: "11px", padding: "3px 8px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "24px",
                    paddingTop: "16px",
                    borderTop: "1px solid #e2e8f0"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: "9px 16px",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#64748b",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "9px 22px",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#ffffff",
                      backgroundColor: BRAND_ORANGE,
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(255, 102, 0, 0.25)"
                    }}
                  >
                    {isEditing ? "Save Changes" : "Create Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRentals;
