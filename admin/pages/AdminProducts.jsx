import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import ExportDropdown from "../components/ExportDropdown";
import {
  Search,
  Plus,
  Printer,
  Upload,
  SlidersHorizontal,
  ChevronDown,
  MoreHorizontal,
  CheckCircle2,
  X,
  ExternalLink,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  Barcode,
  ArrowUpDown
} from "lucide-react";
import { toast } from "../AdminShims";

// Initial sample data matching exact items from the image
const INITIAL_PRODUCTS = [];

const AdminProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [selectedItems, setSelectedItems] = useState([]);
  const [createdToast, setCreatedToast] = useState(
    location.state?.created ? (location.state?.productName || "Product") : null
  );
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);

  // Auto hide created toast after 5s
  React.useEffect(() => {
    if (createdToast) {
      const timer = setTimeout(() => {
        setCreatedToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [createdToast]);

  useEffect(() => {
    let mounted = true;
    fetch("https://dzire-backend.onrender.com/api/admin/categories")
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success && Array.isArray(d.categories)) {
          setCategoriesList(d.categories.filter((c) => c.status !== "Inactive"));
        }
      })
      .catch(() => {});

    fetch("https://dzire-backend.onrender.com/api/admin/products")
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success && Array.isArray(d.products)) {
          const mapped = d.products.map((p) => ({
            id: p.id || p._id,
            name: p.name,
            image: p.image || p.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80",
            category: p.category || "General",
            brand: p.brand || "DZIRE",
            sku: p.sku || `DZR-${p.id}`,
            variationCount: p.variationCount || 4,
            mrp: (p.oldPrice || p.price || 4999).toLocaleString("en-IN"),
            sellingPrice: (p.price || 3999).toLocaleString("en-IN"),
            stock: String(p.stock !== undefined ? p.stock : 20),
            stockNum: Number(p.stock !== undefined ? p.stock : 20),
            status: p.status || (p.stock <= 0 ? "Out of Stock" : p.stock <= 5 ? "Low Stock" : "Active"),
            webStatus: p.webStatus || "view_on_web",
          }));
          setProducts(mapped);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === "All" ||
          p.category.toLowerCase() === selectedCategory.toLowerCase();

        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") {
          return parseFloat(a.sellingPrice.replace(/,/g, "")) - parseFloat(b.sellingPrice.replace(/,/g, ""));
        }
        if (sortBy === "price-high") {
          return parseFloat(b.sellingPrice.replace(/,/g, "")) - parseFloat(a.sellingPrice.replace(/,/g, ""));
        }
        if (sortBy === "stock-low") {
          return a.stockNum - b.stockNum;
        }
        if (sortBy === "stock-high") {
          return b.stockNum - a.stockNum;
        }
        if (sortBy === "name-az") {
          return a.name.localeCompare(b.name);
        }
        return a.id - b.id;
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Select all checkbox handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredProducts.map((p) => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleWebStatus = (id) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.webStatus === "add_to_web" ? "view_on_web" : "add_to_web";
          fetch(`https://dzire-backend.onrender.com/api/admin/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ webStatus: nextStatus }),
          }).catch(() => {});
          toast?.success?.(`Updated web catalog status for ${p.name}`) ||
            alert(`Updated web status`);
          return { ...p, webStatus: nextStatus };
        }
        return p;
      })
    );
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setActiveActionMenu(null);
      fetch(`https://dzire-backend.onrender.com/api/admin/products/${id}`, { method: "DELETE" }).catch(() => {});
      toast?.success?.("Product removed from inventory") || alert("Product deleted");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span
            style={{
              display: "inline-block",
              background: "#dcfce7",
              color: "#15803d",
              fontSize: "12px",
              fontWeight: "600",
              padding: "4px 12px",
              borderRadius: "14px"
            }}
          >
            Active
          </span>
        );
      case "Low Stock":
        return (
          <span
            style={{
              display: "inline-block",
              background: "#fef3c7",
              color: "#b45309",
              fontSize: "12px",
              fontWeight: "600",
              padding: "4px 12px",
              borderRadius: "14px"
            }}
          >
            Low Stock
          </span>
        );
      case "Out of Stock":
        return (
          <span
            style={{
              display: "inline-block",
              background: "#fee2e2",
              color: "#dc2626",
              fontSize: "12px",
              fontWeight: "600",
              padding: "4px 12px",
              borderRadius: "14px"
            }}
          >
            Out of Stock
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "12px 0 40px" }}>

        {/* Main Card Container */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #eef2f6",
            boxShadow: "0 2px 14px rgba(0, 0, 0, 0.04)",
            padding: "28px 32px"
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "24px",
              gap: "20px",
              flexWrap: "wrap"
            }}
          >
            {/* Title & Subtitle */}
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#111827",
                  margin: "0 0 6px 0",
                  fontFamily: "inherit"
                }}
              >
                All Products
              </h1>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "#6b7280",
                  margin: 0,
                  lineHeight: "1.4"
                }}
              >
                Manage all products in your inventory. Add to website, edit, or update details.
              </p>
            </div>

            {/* Dynamic Popup Notification - Only shown when product is newly created */}
            {createdToast && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  maxWidth: "380px",
                  boxShadow: "0 2px 8px rgba(22, 163, 74, 0.08)",
                  position: "relative",
                  animation: "fadeIn 0.3s ease"
                }}
              >
                <div style={{ background: "#16a34a", borderRadius: "50%", padding: "2px", color: "#fff", display: "flex", marginTop: "1px" }}>
                  <CheckCircle2 size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#15803d" }}>
                    Product created successfully!
                  </div>
                  <div style={{ fontSize: "12px", color: "#166534", marginTop: "2px", lineHeight: "1.3" }}>
                    {createdToast} has been added to your inventory.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCreatedToast(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#16a34a",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Action & Filter Controls Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "20px",
              flexWrap: "wrap"
            }}
          >
            {/* Left Controls (Category, Search, Filter, Sort) */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", flex: 1 }}>
              {/* Category Dropdown */}
              <div style={{ position: "relative", minWidth: "160px" }}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 34px 0 14px",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#374151",
                    background: "#ffffff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="All">All Categories</option>
                  {categoriesList.length > 0 ? (
                    categoriesList.map((cat) => (
                      <option key={cat.id || cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Backpacks">Backpacks</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Rainwear">Rainwear</option>
                      <option value="Camping">Camping</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Apparel">Apparel</option>
                    </>
                  )}
                </select>
                <ChevronDown
                  size={16}
                  color="#6b7280"
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                />
              </div>

              {/* Search Bar */}
              <div style={{ position: "relative", minWidth: "220px", flex: 1, maxWidth: "300px" }}>
                <Search
                  size={16}
                  color="#9ca3af"
                  style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px 0 36px",
                    fontSize: "13px",
                    color: "#111827",
                    background: "#ffffff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#ea580c")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              {/* Filter Button */}
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "40px",
                  padding: "0 14px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  background: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => (e.target.style.background = "#f9fafb")}
                onMouseOut={(e) => (e.target.style.background = "#ffffff")}
              >
                <SlidersHorizontal size={15} color="#475569" /> Filter
              </button>

              {/* Sort By Dropdown */}
              <div style={{ position: "relative", minWidth: "120px" }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 32px 0 12px",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#374151",
                    background: "#ffffff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="default">Sort By</option>
                  <option value="name-az">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock-high">Stock: Highest</option>
                  <option value="stock-low">Stock: Lowest</option>
                </select>
                <ChevronDown
                  size={16}
                  color="#6b7280"
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                />
              </div>
            </div>

            {/* Right Actions (Print Barcode, + Add Product, Import) */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Print Barcode Button */}
              <button
                type="button"
                onClick={() => setShowBarcodeModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  height: "40px",
                  padding: "0 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#ea580c",
                  background: "#ffffff",
                  border: "1px solid #fed7aa",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onMouseOver={(e) => (e.target.style.background = "#fff7ed")}
                onMouseOut={(e) => (e.target.style.background = "#ffffff")}
              >
                <Barcode size={17} color="#ea580c" /> Print Barcode
              </button>

              {/* + Add Product Button */}
              <Link
                to="/admin/products/add"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "40px",
                  padding: "0 18px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#ffffff",
                  background: "#ea580c",
                  border: "none",
                  borderRadius: "8px",
                  textDecoration: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(234, 88, 12, 0.25)",
                  transition: "background 0.15s ease"
                }}
                onMouseOver={(e) => (e.target.style.background = "#c2410c")}
                onMouseOut={(e) => (e.target.style.background = "#ea580c")}
              >
                <Plus size={16} /> Add Product
              </Link>

              {/* Export Dropdown */}
              <ExportDropdown
                fileName="All_Products_Catalog"
                title="All Products Catalog Report"
                buttonLabel="Export"
                headers={['Product Name', 'Category', 'Brand', 'SKU', 'Variations', 'MRP', 'Selling Price', 'Stock', 'Status']}
                rows={filteredProducts.map(p => [
                  p.name,
                  p.category,
                  p.brand,
                  p.sku,
                  p.variationCount,
                  p.mrp,
                  p.sellingPrice,
                  p.stock,
                  p.status
                ])}
              />

              {/* Import Button */}
              <button
                type="button"
                onClick={() => setShowImportModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  height: "40px",
                  padding: "0 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  background: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onMouseOver={(e) => (e.target.style.background = "#f9fafb")}
                onMouseOut={(e) => (e.target.style.background = "#ffffff")}
              >
                <Upload size={16} color="#475569" /> Import
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr
                    style={{
                      background: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                      color: "#1e293b",
                      fontSize: "12.5px",
                      fontWeight: "700"
                    }}
                  >
                    <th style={{ padding: "12px 14px", width: "36px" }}>
                      <input
                        type="checkbox"
                        checked={
                          filteredProducts.length > 0 &&
                          selectedItems.length === filteredProducts.length
                        }
                        onChange={handleSelectAll}
                        style={{ cursor: "pointer", accentColor: "#ea580c", width: "16px", height: "16px" }}
                      />
                    </th>
                    <th style={{ padding: "12px 14px", width: "64px" }}>Image</th>
                    <th style={{ padding: "12px 14px", minWidth: "200px" }}>Product Name</th>
                    <th style={{ padding: "12px 14px", width: "110px" }}>Category</th>
                    <th style={{ padding: "12px 14px", width: "110px" }}>Brand</th>
                    <th style={{ padding: "12px 14px", width: "130px" }}>SKU</th>
                    <th style={{ padding: "12px 14px", width: "95px" }}>MRP</th>
                    <th style={{ padding: "12px 14px", width: "110px" }}>Selling Price</th>
                    <th style={{ padding: "12px 14px", width: "80px" }}>Stock</th>
                    <th style={{ padding: "12px 14px", width: "110px" }}>Status</th>
                    <th style={{ padding: "12px 14px", width: "130px" }}>Web</th>
                    <th style={{ padding: "12px 14px", width: "60px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="12" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                        No products match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          fontSize: "13px",
                          transition: "background 0.1s ease"
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = "#fafafa")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "#ffffff")}
                      >
                        {/* Checkbox */}
                        <td style={{ padding: "12px 14px" }}>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(product.id)}
                            onChange={() => handleSelectItem(product.id)}
                            style={{ cursor: "pointer", accentColor: "#ea580c", width: "16px", height: "16px" }}
                          />
                        </td>

                        {/* Image */}
                        <td style={{ padding: "12px 14px" }}>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: "44px",
                              height: "44px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                              background: "#f8fafc"
                            }}
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&auto=format&fit=crop&q=80";
                            }}
                          />
                        </td>

                        {/* Product Name */}
                        <td style={{ padding: "12px 14px" }}>
                          <Link
                            to={`/admin/products/${product.id}`}
                            style={{
                              fontWeight: "700",
                              color: "#111827",
                              textDecoration: "none"
                            }}
                            onMouseOver={(e) => (e.target.style.color = "#ea580c")}
                            onMouseOut={(e) => (e.target.style.color = "#111827")}
                          >
                            {product.name}
                          </Link>
                        </td>

                        {/* Category */}
                        <td style={{ padding: "12px 14px", color: "#475569" }}>
                          {product.category}
                        </td>

                        {/* Brand */}
                        <td style={{ padding: "12px 14px", color: "#475569" }}>
                          {product.brand}
                        </td>

                        {/* SKU */}
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ color: "#111827", fontWeight: "500", fontSize: "12.5px" }}>
                            {product.sku}
                          </div>
                          {product.variationCount > 0 && (
                            <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "1px" }}>
                              +{product.variationCount} more
                            </div>
                          )}
                        </td>

                        {/* MRP */}
                        <td style={{ padding: "12px 14px", color: "#475569", whiteSpace: "nowrap" }}>
                          ₹ {product.mrp}
                        </td>

                        {/* Selling Price */}
                        <td style={{ padding: "12px 14px", color: "#111827", fontWeight: "600", whiteSpace: "nowrap" }}>
                          ₹ {product.sellingPrice}
                        </td>

                        {/* Stock */}
                        <td style={{ padding: "12px 14px", color: "#475569", fontWeight: "500" }}>
                          {product.stock}
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: "12px 14px" }}>
                          {getStatusBadge(product.status)}
                        </td>

                        {/* Web Action Button (Add to Web or View on Web) */}
                        <td style={{ padding: "12px 14px" }}>
                          {product.webStatus === "view_on_web" ? (
                            <button
                              type="button"
                              onClick={() => toggleWebStatus(product.id)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                background: "#ffffff",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#374151",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 0.15s ease"
                              }}
                              onMouseOver={(e) => (e.target.style.background = "#f8fafc")}
                              onMouseOut={(e) => (e.target.style.background = "#ffffff")}
                            >
                              <ExternalLink size={13} color="#475569" /> View on Web
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleWebStatus(product.id)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                background: "#ffffff",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#374151",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 0.15s ease"
                              }}
                              onMouseOver={(e) => (e.target.style.background = "#f8fafc")}
                              onMouseOut={(e) => (e.target.style.background = "#ffffff")}
                            >
                              <PlusCircle size={13} color="#ea580c" /> Add to Web
                            </button>
                          )}
                        </td>

                        {/* 3-Dots Action Menu */}
                        <td style={{ padding: "12px 14px", textAlign: "center", position: "relative" }}>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveActionMenu(activeActionMenu === product.id ? null : product.id)
                            }
                            style={{
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: "6px",
                              padding: "4px 8px",
                              color: "#64748b",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            onMouseOver={(e) => (e.target.style.background = "#f8fafc")}
                            onMouseOut={(e) => (e.target.style.background = "#ffffff")}
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {/* Popover Action Menu */}
                          {activeActionMenu === product.id && (
                            <div
                              style={{
                                position: "absolute",
                                right: "14px",
                                top: "42px",
                                background: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                                zIndex: 50,
                                minWidth: "150px",
                                padding: "4px 0"
                              }}
                            >
                              <Link
                                to={`/admin/products/edit/${product.id}`}
                                state={{ product, item: product, isEdit: true }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "8px 14px",
                                  fontSize: "12.5px",
                                  color: "#334155",
                                  textDecoration: "none",
                                  fontWeight: "500"
                                }}
                                onMouseOver={(e) => (e.target.style.background = "#f8fafc")}
                                onMouseOut={(e) => (e.target.style.background = "#ffffff")}
                              >
                                <Edit2 size={14} color="#64748b" /> Edit Product
                              </Link>
                              <Link
                                to={`/admin/products/${product.id}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "8px 14px",
                                  fontSize: "12.5px",
                                  color: "#334155",
                                  textDecoration: "none",
                                  fontWeight: "500"
                                }}
                                onMouseOver={(e) => (e.target.style.background = "#f8fafc")}
                                onMouseOut={(e) => (e.target.style.background = "#ffffff")}
                              >
                                <Eye size={14} color="#64748b" /> View Details
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "8px 14px",
                                  fontSize: "12.5px",
                                  color: "#ef4444",
                                  background: "none",
                                  border: "none",
                                  width: "100%",
                                  cursor: "pointer",
                                  fontWeight: "500",
                                  textAlign: "left"
                                }}
                                onMouseOver={(e) => (e.target.style.background = "#fef2f2")}
                                onMouseOut={(e) => (e.target.style.background = "none")}
                              >
                                <Trash2 size={14} color="#ef4444" /> Delete Product
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Barcode Print Modal */}
          {showBarcodeModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(15, 23, 42, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                backdropFilter: "blur(2px)"
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  width: "100%",
                  maxWidth: "460px",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>
                    Print Product Barcodes
                  </h3>
                  <button
                    onClick={() => setShowBarcodeModal(false)}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 16px 0" }}>
                  Generate and print thermal barcode labels (EAN-13 / Code 128) for all selected items.
                </p>
                <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "8px", padding: "20px", textAlign: "center", marginBottom: "20px" }}>
                  <Barcode size={64} color="#1e293b" style={{ margin: "0 auto" }} />
                  <div style={{ fontWeight: "700", letterSpacing: "3px", marginTop: "6px" }}>8901234567890</div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Tripole Walker 55L Backpack • ₹6,999</div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    onClick={() => setShowBarcodeModal(false)}
                    style={{ padding: "8px 16px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      toast?.success?.("Barcode sent to printer!");
                      setShowBarcodeModal(false);
                    }}
                    style={{ padding: "8px 20px", background: "#ea580c", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Print Labels
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Import Modal */}
          {showImportModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(15, 23, 42, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                backdropFilter: "blur(2px)"
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  width: "100%",
                  maxWidth: "460px",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>
                    Import Products
                  </h3>
                  <button
                    onClick={() => setShowImportModal(false)}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 16px 0" }}>
                  Upload Excel or CSV catalog file to import products in bulk.
                </p>
                <div style={{ border: "2px dashed #cbd5e1", borderRadius: "8px", padding: "28px 16px", textAlign: "center", background: "#f8fafc", marginBottom: "20px" }}>
                  <Upload size={32} color="#ea580c" style={{ margin: "0 auto 8px" }} />
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>Upload .xlsx or .csv spreadsheet</div>
                  <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>Maximum file size: 10MB</div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    onClick={() => setShowImportModal(false)}
                    style={{ padding: "8px 16px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      toast?.success?.("Sample products imported successfully!");
                      setShowImportModal(false);
                    }}
                    style={{ padding: "8px 20px", background: "#ea580c", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Import File
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
