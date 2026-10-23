import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Tag,
  UploadCloud,
  Upload,
  Loader2,
  Layers
} from "lucide-react";

export const CATEGORIES_STORAGE_KEY = "dzire_all_categories_data";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [categoryType, setCategoryType] = useState("outdoor");
  const [categoryStatus, setCategoryStatus] = useState("Active");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState("");

  const fileInputRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage("");
    setCategoryType("outdoor");
    setCategoryStatus("Active");
    setImageFile(null);
    setImagePreview("");
    setIsUploading(false);
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name || "");
    setCategoryImage(cat.image || "");
    setCategoryType(cat.type || "outdoor");
    setCategoryStatus(cat.status || "Active");
    setImageFile(null);
    setImagePreview(cat.image || "");
    setIsUploading(false);
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("Image file size exceeds 15MB. Please choose a smaller image file.");
      return;
    }

    setImageFile(file);

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    // Upload immediately via Multer endpoint
    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      showToast("Uploading category image via Multer...");
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/categories/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setCategoryImage(data.imageUrl);
        setImagePreview(data.imageUrl);
        showToast("Category image uploaded via Multer!");
      } else {
        showToast(data.message || "Failed to upload image via Multer");
      }
    } catch (err) {
      console.error("Multer upload error:", err);
      showToast("Upload failed; image will be uploaded on save.");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setCategoryImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));
      fetch(`https://dzire-backend.onrender.com/api/admin/categories/${id}`, { method: "DELETE" }).catch(() => { });
      showToast(`Category "${name}" deleted successfully!`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = categoryName.trim();
    if (!trimmed) {
      alert("Please enter a category name.");
      return;
    }

    setIsSubmitting(true);

    let finalImageUrl = categoryImage;

    // Fallback: If user selected a file and clicked Save before background upload finished
    if (imageFile && (!finalImageUrl || finalImageUrl.startsWith("blob:") || finalImageUrl.startsWith("data:"))) {
      try {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        const upRes = await fetch("https://dzire-backend.onrender.com/api/admin/categories/upload", {
          method: "POST",
          body: uploadData,
        });
        const upJson = await upRes.json();
        if (upJson.success && upJson.imageUrl) {
          finalImageUrl = upJson.imageUrl;
        }
      } catch (err) {
        console.warn("Fallback multer upload failed:", err);
      }
    }

    if (!finalImageUrl) {
      finalImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";
    }

    if (editingCategory) {
      const targetId = editingCategory.id || editingCategory._id;
      const payload = {
        name: trimmed,
        image: finalImageUrl,
        type: categoryType,
        status: categoryStatus,
      };

      try {
        const res = await fetch(`https://dzire-backend.onrender.com/api/admin/categories/${targetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.category) {
          setCategories((prev) =>
            prev.map((c) => (c.id === targetId || c._id === targetId ? data.category : c))
          );
        } else {
          setCategories((prev) =>
            prev.map((c) => (c.id === targetId || c._id === targetId ? { ...c, ...payload } : c))
          );
        }
        showToast(`Category "${trimmed}" updated successfully!`);
      } catch (err) {
        console.error("Update error:", err);
        setCategories((prev) =>
          prev.map((c) => (c.id === targetId || c._id === targetId ? { ...c, ...payload } : c))
        );
        showToast(`Category "${trimmed}" updated!`);
      }
    } else {
      const slug = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const newCat = {
        id: `${slug}-${Date.now().toString().slice(-4)}`,
        name: trimmed,
        slug,
        image: finalImageUrl,
        type: categoryType,
        status: categoryStatus,
      };

      try {
        const res = await fetch("https://dzire-backend.onrender.com/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCat),
        });
        const data = await res.json();
        if (data.success && data.category) {
          setCategories((prev) => [data.category, ...prev]);
        } else {
          setCategories((prev) => [newCat, ...prev]);
        }
        showToast(`Category "${trimmed}" created successfully!`);
      } catch (err) {
        console.error("Create error:", err);
        setCategories((prev) => [newCat, ...prev]);
        showToast(`Category "${trimmed}" created!`);
      }
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const filteredCategories = categories.filter((c) =>
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ padding: "24px 32px 48px 32px", width: "100%", boxSizing: "border-box" }}>

        <style>{`
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin-animation {
            animation: spinSlow 1s linear infinite;
          }
        `}</style>

        {notification && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              backgroundColor: "#10b981",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              fontSize: "14px"
            }}
          >
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              Categories Catalog
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>
              Add, edit, or delete catalog categories with section type (Outdoor / Product) and image upload.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            type="button"
            style={{
              backgroundColor: "#ff6600",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(255, 102, 0, 0.25)"
            }}
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Main Card */}
        <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>

          {/* Search bar */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", minWidth: "260px", flex: 1 }}>
              <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search categories by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 14px 9px 38px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: "#f8fafc"
                }}
              />
            </div>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
              Total Categories: <strong>{filteredCategories.length}</strong>
            </span>
          </div>

          {/* Categories Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: "700", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "14px 20px", width: "60px" }}>#</th>
                  <th style={{ padding: "14px 20px" }}>Category</th>
                  <th style={{ padding: "14px 20px", width: "190px" }}>Section / Type</th>
                  <th style={{ padding: "14px 20px", width: "140px" }}>Status</th>
                  <th style={{ padding: "14px 20px", width: "120px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat, index) => {
                  const isOutdoor = (cat.type || "").toLowerCase().includes("outdoor");
                  return (
                    <tr
                      key={cat.id || cat._id || index}
                      style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fcfcfc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                    >
                      <td style={{ padding: "14px 20px", color: "#94a3b8", fontWeight: "600" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "10px",
                              overflow: "hidden",
                              backgroundColor: "#f1f5f9",
                              border: "1px solid #e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0
                            }}
                          >
                            {cat.image ? (
                              <img
                                src={cat.image}
                                alt={cat.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display = "flex";
                                  }
                                }}
                              />
                            ) : null}
                            <div style={{ display: cat.image ? "none" : "flex", color: "#ff6600" }}>
                              <Tag size={20} />
                            </div>
                          </div>
                          <div>
                            <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "15px" }}>
                              {cat.name}
                            </div>
                            {/* <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                              Slug: <span style={{ fontFamily: "monospace", color: "#475569" }}>{cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</span>
                            </div> */}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                            backgroundColor: isOutdoor ? "#fff7ed" : "#f0f9ff",
                            color: isOutdoor ? "#ff6600" : "#0284c7",
                            border: `1px solid ${isOutdoor ? "#fed7aa" : "#bae6fd"}`
                          }}
                        >
                          <Layers size={13} />
                          {isOutdoor ? "Outdoor Categories" : "Product Categories"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: cat.status === "Inactive" ? "#fee2e2" : "#ecfdf5",
                            color: cat.status === "Inactive" ? "#dc2626" : "#059669"
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: "currentColor"
                            }}
                          />
                          {cat.status || "Active"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          <button
                            onClick={() => handleOpenEditModal(cat)}
                            type="button"
                            title="Edit Category"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              background: "#ffffff",
                              color: "#0f172a",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#ff6600";
                              e.currentTarget.style.color = "#ff6600";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#cbd5e1";
                              e.currentTarget.style.color = "#0f172a";
                            }}
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(cat.id || cat._id, cat.name)}
                            type="button"
                            title="Delete Category"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: "1px solid #fee2e2",
                              background: "#fff1f2",
                              color: "#e11d48",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#e11d48";
                              e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#fff1f2";
                              e.currentTarget.style.color = "#e11d48";
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: "48px 20px", textAlign: "center", color: "#64748b" }}>
                      <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#f1f5f9", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", color: "#94a3b8" }}>
                          <Tag size={24} />
                        </div>
                        <div style={{ fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>No categories found</div>
                        <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
                          Click <strong>"+ Add Category"</strong> above to upload and create a category.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add / Edit Category */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px"
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "520px",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Header */}
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                    {editingCategory ? "Edit Category" : "Add Category"}
                  </h2>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                    Category name, section type, and image uploaded via Multer
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ padding: "24px", overflowY: "auto" }}>

                {/* Category Name */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                    Category Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Running, Camping, Footwear, Bags"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    autoFocus
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

                {/* Category Type Option */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                    Category Type / Section <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                      boxSizing: "border-box",
                      fontWeight: "600",
                      color: "#0f172a"
                    }}
                  >
                    <option value="outdoor">Outdoor Categories</option>
                    <option value="product">Product Categories</option>
                  </select>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                    Choose whether this category is displayed under <strong>"Outdoor Categories"</strong> or <strong>"Product Categories"</strong> on the website.
                  </div>
                </div>

                {/* Category Image Upload (Multer) */}
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>
                      Category Image <span style={{ fontSize: "11px", fontWeight: "600", color: "#ff6600" }}>(Multer Upload)</span>
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{ fontSize: "12px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,.avif,.webp,.png,.jpg,.jpeg,.svg,.gif"
                    onChange={handleImageFileChange}
                    style={{ display: "none" }}
                  />

                  {/* Upload Box / Preview */}
                  {imagePreview ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "12px 14px",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1"
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid #e2e8f0",
                          backgroundColor: "#ffffff"
                        }}
                        onError={(e) => {
                          if (!e.target.dataset.failed) {
                            e.target.dataset.failed = "true";
                            e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";
                          }
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          {isUploading ? (
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "#ff6600", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Loader2 size={14} className="spin-animation" /> Uploading to server via Multer...
                            </span>
                          ) : (
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle2 size={14} /> Image Ready
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "8px" }}>
                          {categoryImage ? categoryImage.split("/").pop() : "Local photo selected"}
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            background: "#ffffff",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#334155",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px"
                          }}
                        >
                          <Upload size={13} /> Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      style={{
                        border: "2px dashed #cbd5e1",
                        borderRadius: "10px",
                        padding: "24px 16px",
                        textAlign: "center",
                        cursor: isUploading ? "wait" : "pointer",
                        backgroundColor: "#f8fafc",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#ff6600";
                        e.currentTarget.style.backgroundColor = "#fffaf5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "#fff7ed",
                          color: "#ff6600",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "8px"
                        }}
                      >
                        {isUploading ? (
                          <Loader2 size={22} className="spin-animation" />
                        ) : (
                          <UploadCloud size={22} />
                        )}
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "2px" }}>
                        {isUploading ? "Uploading image via Multer..." : "Click to browse & upload category image"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        PNG, JPG, JPEG, WEBP, AVIF or SVG up to 15MB • Uploaded through Multer
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Selection */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                    Status
                  </label>
                  <select
                    value={categoryStatus}
                    onChange={(e) => setCategoryStatus(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting || isUploading}
                    style={{
                      padding: "9px 16px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#ffffff",
                      color: "#475569",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    style={{
                      padding: "9px 22px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: isSubmitting || isUploading ? "#fdba74" : "#ff6600",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "700",
                      cursor: isSubmitting || isUploading ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(255, 102, 0, 0.25)"
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="spin-animation" /> Saving...
                      </>
                    ) : editingCategory ? (
                      "Update Category"
                    ) : (
                      "Add Category"
                    )}
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

export default AdminCategories;
