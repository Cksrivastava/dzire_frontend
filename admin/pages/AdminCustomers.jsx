import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  Users,
  ShoppingCart,
  IndianRupee,
  Star,
  Upload,
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Crown,
  FileText,
  CreditCard,
  CheckCircle2,
  PlusCircle,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  UserCheck,
  Eye,
  Trash2,
  Phone,
  Mail,
  Tag,
  AlertTriangle,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import "./AdminCustomers.css";

const initialCustomers = [];

const getPageNumbers = (current, total) => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }
  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const r = await fetch("https://dzire-backend.onrender.com/api/admin/users");
      const d = await r.json();
      if (d.success && Array.isArray(d.users)) {
        const mapped = d.users.map((u, idx) => ({
          id: u._id || u.id || ("CUST" + (1001 + idx)),
          name: u.name || "Customer",
          initials: (u.name || "C").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
          phone: u.phone || "—",
          email: u.email || "—",
          dob: u.dob || "—",
          gender: u.gender || "Other",
          type: u.type || "Regular",
          channel: u.channel || "Online",
          totalOrders: u.ordersCount || u.totalOrders || 0,
          totalSpent: u.totalSpent || 0,
          credits: typeof u.credits === "number" ? u.credits : 0,
          earnedCredits: typeof u.earnedCredits === "number" ? u.earnedCredits : (u.credits || 0),
          usedCredits: typeof u.usedCredits === "number" ? u.usedCredits : 0,
          lastPurchase: u.lastPurchase || "Never",
          status: u.status || "Active",
          since: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—",
          avgOrderValue: (u.ordersCount > 0 ? Math.round(u.totalSpent / u.ordersCount) : 0),
          notes: u.notes || "",
          tags: u.tags || ["Customer"],
          addresses: u.addresses || [],
          recentOrders: u.recentOrders || []
        }));
        setCustomers(mapped);
        setSelectedCustomerId((prev) => {
          if (prev && mapped.some(c => c.id === prev)) return prev;
          return mapped.length > 0 ? mapped[0].id : null;
        });
      }
    } catch (e) {
      console.error("Failed to fetch customers:", e);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  const [activeTab, setActiveTab] = useState("all"); // "all", "new", "repeat", "vip"
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Action Menu State
  const [actionDropdownId, setActionDropdownId] = useState(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteCustomer, setDeleteCustomer] = useState(null);

  // Close action dropdown on outside click
  useEffect(() => {
    const handleDocumentClick = () => {
      setActionDropdownId(null);
    };
    if (actionDropdownId) {
      document.addEventListener("click", handleDocumentClick);
    }
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [actionDropdownId]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, channelFilter, locationFilter, typeFilter, activeTab, rowsPerPage]);

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    type: "Regular",
    channel: "Online",
    notes: "",
    address: ""
  });

  // Credit Add/Deduct Form State
  const [creditAdjustment, setCreditAdjustment] = useState({
    amount: 100,
    type: "add", // "add" or "deduct"
    reason: "Loyalty Bonus / Store Credit Adjustment"
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Dynamic Tab Counts
  const allCount = customers.length;
  const newCount = customers.filter(c => c.totalOrders <= 1).length;
  const repeatCount = customers.filter(c => c.totalOrders > 1).length;
  const vipCount = customers.filter(c => c.type === "VIP").length;

  // Filtering
  const filteredCustomers = customers.filter(c => {
    // Tab filter
    if (activeTab === "new" && c.totalOrders > 1) return false;
    if (activeTab === "repeat" && c.totalOrders <= 1) return false;
    if (activeTab === "vip" && c.type !== "VIP") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.replace(/\s+/g, "").includes(q.replace(/\s+/g, "")) ||
        c.channel.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        (c.addresses && c.addresses.some(a => a.address.toLowerCase().includes(q))) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(q))) ||
        (c.notes && c.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Dropdown filters
    if (channelFilter !== "all" && c.channel.toLowerCase() !== channelFilter.toLowerCase()) return false;
    if (typeFilter !== "all" && c.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
    if (locationFilter !== "all") {
      const loc = locationFilter.toLowerCase();
      const matchLoc =
        (c.addresses && c.addresses.some(a => a.address.toLowerCase().includes(loc))) ||
        (c.notes && c.notes.toLowerCase().includes(loc)) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(loc)));
      if (!matchLoc) return false;
    }

    return true;
  });

  // Pagination Slice
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + rowsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredCustomers.map(c => c.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id, e) => {
    e.stopPropagation();
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter(item => item !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setChannelFilter("all");
    setLocationFilter("all");
    setTypeFilter("all");
    setActiveTab("all");
  };

  // Add Customer
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      alert("Please provide customer name and phone number");
      return;
    }
    try {
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCustomers();
        if (data.user && data.user.id) {
          setSelectedCustomerId(data.user.id);
        }
        setShowAddModal(false);
        setNewCustomer({ name: "", phone: "", email: "", type: "Regular", channel: "Online", notes: "", address: "" });
      } else {
        alert(data.message || "Failed to create customer");
      }
    } catch (err) {
      alert("Error creating customer: " + err.message);
    }
  };

  // Save Edit Customer
  const handleSaveEditCustomer = async (e) => {
    e.preventDefault();
    if (!editCustomer) return;

    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/users/${editCustomer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCustomer),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCustomers();
        if (viewCustomer && viewCustomer.id === editCustomer.id) {
          setViewCustomer({ ...viewCustomer, ...editCustomer });
        }
        setEditCustomer(null);
      } else {
        alert(data.message || "Failed to update customer");
      }
    } catch (err) {
      alert("Error updating customer: " + err.message);
    }
  };

  // Confirm Delete Customer
  const handleConfirmDeleteCustomer = async () => {
    if (!deleteCustomer) return;
    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/users/${deleteCustomer.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchCustomers();
        setSelectedRowIds((prev) => prev.filter((id) => id !== deleteCustomer.id));
        if (viewCustomer && viewCustomer.id === deleteCustomer.id) {
          setViewCustomer(null);
        }
        setDeleteCustomer(null);
      } else {
        alert(data.message || "Failed to delete customer");
      }
    } catch (err) {
      alert("Error deleting customer: " + err.message);
    }
  };

  // Credit Adjustment
  const handleAdjustCreditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/users/${selectedCustomer.id}/credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creditAdjustment),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCustomers();
        setShowCreditModal(false);
      } else {
        alert(data.message || "Failed to adjust credits");
      }
    } catch (err) {
      alert("Error adjusting credits: " + err.message);
    }
  };

  // Import Customers State & Handler
  const [importFile, setImportFile] = useState(null);
  const handleImportCustomers = async () => {
    if (!importFile) {
      alert("Please select a CSV or Excel file to import.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length <= 1) {
          alert("File appears to be empty or contains only headers.");
          return;
        }
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const customersToImport = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ""));
          if (!cols[0]) continue;
          const cust = {
            name: cols[headers.indexOf("name")] || cols[0],
            phone: cols[headers.indexOf("phone")] || cols[1] || "",
            email: cols[headers.indexOf("email")] || cols[2] || "",
            type: cols[headers.indexOf("type")] || "Regular",
            channel: cols[headers.indexOf("channel")] || "Online",
            address: cols[headers.indexOf("address")] || "",
            credits: Number(cols[headers.indexOf("credits")]) || 0,
          };
          customersToImport.push(cust);
        }

        const res = await fetch("https://dzire-backend.onrender.com/api/admin/users/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customers: customersToImport }),
        });
        const data = await res.json();
        if (data.success) {
          alert(`Successfully imported ${data.count} customers!`);
          await fetchCustomers();
          setShowImportModal(false);
          setImportFile(null);
        } else {
          alert(data.message || "Failed to import customers");
        }
      } catch (err) {
        alert("Error parsing or uploading file: " + err.message);
      }
    };
    reader.readAsText(importFile);
  };

  const totalRevenue = customers.reduce((sum, c) => sum + (Number(c.totalSpent) || 0), 0);
  const avgLifetimeSpend = customers.length > 0 ? Math.round(totalRevenue / customers.length) : 0;

  return (
    <AdminLayout>
      <div className="cust-page-container">
        {/* Header Row */}
        <div className="cust-header-row">
          <div>
            <h1 className="cust-header-title">Customers</h1>
            <p className="cust-header-subtitle">
              Manage your customers, view purchase history, credits and more.
            </p>
          </div>
          <div className="cust-header-actions">
            <button
              type="button"
              className="cust-btn cust-btn-secondary"
              onClick={() => setShowImportModal(true)}
            >
              <Upload size={16} />
              <span>Import Customers</span>
            </button>
            <button
              type="button"
              className="cust-btn cust-btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="cust-kpi-grid">
          {/* Card 1 */}
          <div className="cust-kpi-card">
            <div className="cust-kpi-icon-box" style={{ background: "#ffeae4", color: "#ff5722" }}>
              <Users size={22} />
            </div>
            <div className="cust-kpi-info">
              <h3 className="cust-kpi-val">{customers.length.toLocaleString()}</h3>
              <div className="cust-kpi-label">Total Customers</div>
              <div className="cust-kpi-trend cust-trend-up">
                <span>↑ 12%</span>
                <span className="cust-trend-neutral">vs last month</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="cust-kpi-card">
            <div className="cust-kpi-icon-box" style={{ background: "#e0f7f6", color: "#00a8a8" }}>
              <ShoppingCart size={22} />
            </div>
            <div className="cust-kpi-info">
              <h3 className="cust-kpi-val">{repeatCount}</h3>
              <div className="cust-kpi-label">Repeat Customers</div>
              <div className="cust-kpi-trend cust-trend-up">
                <span>↑ 8%</span>
                <span className="cust-trend-neutral">vs last month</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="cust-kpi-card">
            <div className="cust-kpi-icon-box" style={{ background: "#fef3c7", color: "#d97706" }}>
              <IndianRupee size={22} />
            </div>
            <div className="cust-kpi-info">
              <h3 className="cust-kpi-val">₹{avgLifetimeSpend.toLocaleString("en-IN")}</h3>
              <div className="cust-kpi-label">Avg. Lifetime Spend</div>
              <div className="cust-kpi-trend cust-trend-up">
                <span>↑ 16%</span>
                <span className="cust-trend-neutral">vs last month</span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="cust-kpi-card">
            <div className="cust-kpi-icon-box" style={{ background: "#ecfdf5", color: "#059669" }}>
              <Star size={22} />
            </div>
            <div className="cust-kpi-info">
              <h3 className="cust-kpi-val">4.6</h3>
              <div className="cust-kpi-label">Avg. Rating</div>
              <div className="cust-kpi-trend cust-trend-up">
                <span>↑ 0.3</span>
                <span className="cust-trend-neutral">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Category Tabs */}
        <div className="cust-tabs-container">
          <button
            type="button"
            className={`cust-tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Customers ({allCount})
          </button>
          <button
            type="button"
            className={`cust-tab-btn ${activeTab === "new" ? "active" : ""}`}
            onClick={() => setActiveTab("new")}
          >
            New ({newCount})
          </button>
          <button
            type="button"
            className={`cust-tab-btn ${activeTab === "repeat" ? "active" : ""}`}
            onClick={() => setActiveTab("repeat")}
          >
            Repeat ({repeatCount})
          </button>
          <button
            type="button"
            className={`cust-tab-btn ${activeTab === "vip" ? "active" : ""}`}
            onClick={() => setActiveTab("vip")}
          >
            VIP ({vipCount})
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="cust-filter-bar">
          <div className="cust-search-box">
            <Search size={16} className="cust-search-icon" />
            <input
              type="text"
              placeholder="Search by name, phone, email, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="cust-dropdown-group">
            <div className="cust-filter-select-wrap">
              <span>Channel</span>
              <select
                className="cust-filter-select"
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="online">Online</option>
                <option value="store">Store</option>
              </select>
            </div>

            <div className="cust-filter-select-wrap">
              <span>Location</span>
              <select
                className="cust-filter-select"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pune">Pune</option>
                <option value="mumbai">Mumbai</option>
                <option value="bangalore">Bangalore</option>
              </select>
            </div>

            <div className="cust-filter-select-wrap">
              <span>Customer Type</span>
              <select
                className="cust-filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="regular">Regular</option>
                <option value="vip">VIP</option>
              </select>
            </div>

            <button
              type="button"
              className="cust-btn cust-btn-outline"
              style={{ padding: "7px 12px", fontSize: "12.5px" }}
              onClick={handleClearFilters}
            >
              <SlidersHorizontal size={14} />
              <span>Reset</span>
            </button>

            {(searchQuery || channelFilter !== "all" || locationFilter !== "all" || typeFilter !== "all" || activeTab !== "all") && (
              <button
                type="button"
                onClick={handleClearFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff5722",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  padding: "4px 8px"
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Main Content: Customer Table */}
        <div className="cust-main-split">
          <div className="cust-table-area">
            <div className="cust-table-wrapper">
              <table className="cust-table">
                <thead>
                  <tr>
                    <th style={{ width: "36px", minWidth: "36px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                        onChange={handleSelectAll}
                        style={{ cursor: "pointer", accentColor: "#ff5722" }}
                      />
                    </th>
                    <th style={{ minWidth: "180px" }}>Customer</th>
                    <th style={{ minWidth: "150px" }}>Contact</th>
                    <th style={{ minWidth: "90px" }}>Type</th>
                    <th style={{ minWidth: "95px" }}>Channel</th>
                    <th style={{ minWidth: "105px", textAlign: "center" }}>Total Orders</th>
                    <th style={{ minWidth: "110px" }}>Total Spent</th>
                    <th style={{ minWidth: "90px", textAlign: "center" }}>Credits</th>
                    <th style={{ minWidth: "120px" }}>Last Purchase</th>
                    <th style={{ minWidth: "90px" }}>Status</th>
                    <th style={{ minWidth: "70px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: "center", padding: "40px 16px", color: "#64748b" }}>
                        <div className="cust-empty-state-wrap">
                          <Users size={34} style={{ color: "#94a3b8" }} />
                          <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#334155" }}>
                            No customers found matching your filters
                          </p>
                          <button
                            type="button"
                            className="cust-btn cust-btn-secondary"
                            onClick={handleClearFilters}
                            style={{ marginTop: "4px", fontSize: "12px", padding: "6px 14px" }}
                          >
                            Clear Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((cust) => {
                      const isSelected = selectedCustomerId === cust.id;
                      const isChecked = selectedRowIds.includes(cust.id);
                      const isActionOpen = actionDropdownId === cust.id;

                      return (
                        <tr
                          key={cust.id}
                          className={isSelected ? "selected-row" : ""}
                          onClick={() => setSelectedCustomerId(cust.id)}
                        >
                          <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleSelectRow(cust.id, e)}
                              style={{ cursor: "pointer", accentColor: "#ff5722" }}
                            />
                          </td>
                          <td>
                            <div className="cust-user-cell">
                              <div
                                className="cust-avatar-badge"
                                style={{
                                  background: isSelected ? "#ff5722" : "#e2e8f0",
                                  color: isSelected ? "#ffffff" : "#1e293b"
                                }}
                              >
                                {cust.initials}
                              </div>
                              <div>
                                <p className="cust-user-name">{cust.name}</p>
                                <p className="cust-user-id">{cust.id}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: "12.5px" }}>
                              <div style={{ fontWeight: "500", color: "#1e293b" }}>{cust.phone}</div>
                              <div style={{ color: "#94a3b8", fontSize: "11.5px" }}>{cust.email}</div>
                            </div>
                          </td>
                          <td>
                            {cust.type === "VIP" ? (
                              <span className="cust-pill cust-pill-vip">
                                <Crown size={12} /> VIP
                              </span>
                            ) : (
                              <span className="cust-pill cust-pill-regular">Regular</span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`cust-pill ${
                                cust.channel === "Online" ? "cust-pill-online" : "cust-pill-store"
                              }`}
                            >
                              {cust.channel}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", fontWeight: "600" }}>{cust.totalOrders}</td>
                          <td style={{ fontWeight: "700", color: "#0f172a" }}>
                            ₹{cust.totalSpent.toLocaleString()}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: "600", color: "#ff5722" }}>
                            {cust.credits}
                          </td>
                          <td style={{ whiteSpace: "nowrap", color: "#64748b" }}>{cust.lastPurchase}</td>
                          <td>
                            <span
                              className={`cust-pill ${
                                cust.status === "Active" ? "cust-pill-active" : "cust-pill-inactive"
                              }`}
                            >
                              {cust.status}
                            </span>
                          </td>
                          <td
                            className="cust-action-cell"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              title="Customer Actions"
                              className={`cust-action-btn ${isActionOpen ? "active" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActionDropdownId(isActionOpen ? null : cust.id);
                              }}
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {isActionOpen && (
                              <div
                                className="cust-action-dropdown"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  className="cust-action-item view"
                                  onClick={() => {
                                    setViewCustomer(cust);
                                    setActionDropdownId(null);
                                  }}
                                >
                                  <Eye size={14} />
                                  <span>View Details</span>
                                </button>
                                <button
                                  type="button"
                                  className="cust-action-item edit"
                                  onClick={() => {
                                    setEditCustomer({ ...cust });
                                    setActionDropdownId(null);
                                  }}
                                >
                                  <Edit2 size={14} />
                                  <span>Edit Customer</span>
                                </button>
                                <button
                                  type="button"
                                  className="cust-action-item credit"
                                  onClick={() => {
                                    setSelectedCustomerId(cust.id);
                                    setShowCreditModal(true);
                                    setActionDropdownId(null);
                                  }}
                                >
                                  <CreditCard size={14} />
                                  <span>Adjust Credits</span>
                                </button>
                                <div style={{ height: "1px", background: "#f1f5f9", margin: "2px 0" }} />
                                <button
                                  type="button"
                                  className="cust-action-item delete"
                                  onClick={() => {
                                    setDeleteCustomer(cust);
                                    setActionDropdownId(null);
                                  }}
                                >
                                  <Trash2 size={14} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="cust-pagination">
              <div className="cust-pagination-info">
                Showing {filteredCustomers.length === 0 ? 0 : startIndex + 1} -{" "}
                {Math.min(startIndex + rowsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
              </div>
              <div className="cust-page-nav">
                <button
                  type="button"
                  className="cust-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  title="Previous Page"
                >
                  <ChevronLeft size={14} />
                </button>
                {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                  p === "..." ? (
                    <span key={`dots-${idx}`} style={{ padding: "0 4px", color: "#94a3b8", fontSize: "12px" }}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className={`cust-page-btn ${currentPage === p ? "active" : ""}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  type="button"
                  className="cust-page-btn"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  title="Next Page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <div className="cust-pagination-size">
                <select
                  className="cust-filter-select"
                  style={{ padding: "6px 26px 6px 10px", fontSize: "12px" }}
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: View Customer Details */}
      {viewCustomer && (
        <div className="cust-modal-overlay" onClick={() => setViewCustomer(null)}>
          <div
            className="cust-modal-dialog"
            style={{ maxWidth: "620px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #edf2f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  className="cust-avatar-badge"
                  style={{ background: "#ff5722", color: "#ffffff", width: "40px", height: "40px", fontSize: "14px" }}
                >
                  {viewCustomer.initials}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                    {viewCustomer.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "11.5px", color: "#64748b" }}>
                    ID: {viewCustomer.id} • Member Since: {viewCustomer.since}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  className="cust-btn cust-btn-outline"
                  style={{ padding: "5px 10px", fontSize: "12px" }}
                  onClick={() => {
                    setEditCustomer({ ...viewCustomer });
                    setViewCustomer(null);
                  }}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewCustomer(null)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "20px", overflowY: "auto", display: "grid", gap: "16px" }}>
              {/* Quick Stats Grid */}
              <div
                className="cust-modal-grid-4"
                style={{
                  background: "#f8fafc",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0"
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Total Orders</div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>
                    {viewCustomer.totalOrders}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Total Spent</div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>
                    ₹{viewCustomer.totalSpent.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Credits Balance</div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#ff5722", marginTop: "2px" }}>
                    {viewCustomer.credits}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Status</div>
                  <div style={{ marginTop: "4px" }}>
                    <span
                      className={`cust-pill ${
                        viewCustomer.status === "Active" ? "cust-pill-active" : "cust-pill-inactive"
                      }`}
                    >
                      {viewCustomer.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="cust-info-card">
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
                  Contact Information
                </div>
                <div className="cust-modal-grid-2" style={{ gap: "10px", fontSize: "12.5px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}>
                    <Phone size={14} style={{ color: "#ff5722" }} />
                    <span>{viewCustomer.phone}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}>
                    <Mail size={14} style={{ color: "#ff5722" }} />
                    <span>{viewCustomer.email}</span>
                  </div>
                  <div style={{ color: "#64748b" }}>
                    Channel: <strong>{viewCustomer.channel}</strong>
                  </div>
                  <div style={{ color: "#64748b" }}>
                    Type: <strong>{viewCustomer.type}</strong>
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              {viewCustomer.addresses && viewCustomer.addresses.length > 0 && (
                <div className="cust-info-card">
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
                    Saved Addresses ({viewCustomer.addresses.length})
                  </div>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {viewCustomer.addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "8px 10px",
                          background: "#f8fafc",
                          borderRadius: "8px",
                          border: "1px solid #f1f5f9",
                          fontSize: "12px"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>
                            {addr.type} {addr.isDefault && <span style={{ color: "#ff5722", fontSize: "10px" }}>(Default)</span>}
                          </span>
                          <span style={{ color: "#64748b" }}>{addr.phone}</span>
                        </div>
                        <p style={{ margin: 0, color: "#475569", lineHeight: "1.35" }}>{addr.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Orders */}
              {viewCustomer.recentOrders && viewCustomer.recentOrders.length > 0 && (
                <div className="cust-info-card">
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
                    Recent Orders
                  </div>
                  <div style={{ display: "grid", gap: "6px" }}>
                    {viewCustomer.recentOrders.map((ord, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 8px",
                          background: "#f8fafc",
                          borderRadius: "6px",
                          fontSize: "12px"
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>{ord.id}</span>
                          <span style={{ color: "#94a3b8", marginLeft: "8px" }}>{ord.date}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontWeight: "600", color: "#0f172a" }}>{ord.amount}</span>
                          <span
                            className="cust-pill cust-pill-active"
                            style={{ fontSize: "10px", padding: "2px 6px" }}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {viewCustomer.notes && (
                <div className="cust-info-card">
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                    Customer Notes
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
                    {viewCustomer.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #edf2f7",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                background: "#f8fafc"
              }}
            >
              <button
                type="button"
                className="cust-btn cust-btn-secondary"
                onClick={() => setViewCustomer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Customer */}
      {editCustomer && (
        <div className="cust-modal-overlay" onClick={() => setEditCustomer(null)}>
          <div className="cust-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #edf2f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
                  Edit Customer
                </h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>ID: {editCustomer.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditCustomer(null)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEditCustomer} style={{ padding: "20px 24px", display: "grid", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editCustomer.name}
                  onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div className="cust-modal-grid-2">
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editCustomer.phone}
                    onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editCustomer.email}
                    onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                  />
                </div>
              </div>

              <div className="cust-modal-grid-3">
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Customer Type
                  </label>
                  <select
                    className="cust-filter-select"
                    value={editCustomer.type}
                    onChange={(e) => setEditCustomer({ ...editCustomer, type: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Channel
                  </label>
                  <select
                    className="cust-filter-select"
                    value={editCustomer.channel}
                    onChange={(e) => setEditCustomer({ ...editCustomer, channel: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    <option value="Online">Online</option>
                    <option value="Store">Store</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Status
                  </label>
                  <select
                    className="cust-filter-select"
                    value={editCustomer.status}
                    onChange={(e) => setEditCustomer({ ...editCustomer, status: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                  Customer Notes
                </label>
                <textarea
                  rows={3}
                  value={editCustomer.notes}
                  onChange={(e) => setEditCustomer({ ...editCustomer, notes: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="cust-btn cust-btn-secondary"
                  onClick={() => setEditCustomer(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="cust-btn cust-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteCustomer && (
        <div className="cust-modal-overlay" onClick={() => setDeleteCustomer(null)}>
          <div className="cust-modal-dialog" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "24px", textAlign: "center", display: "grid", gap: "14px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#fef2f2",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto"
                }}
              >
                <AlertTriangle size={26} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px 0", fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
                  Delete Customer?
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: "1.4" }}>
                  Are you sure you want to delete <strong>{deleteCustomer.name}</strong> ({deleteCustomer.id})? This action cannot be undone.
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  className="cust-btn cust-btn-secondary"
                  onClick={() => setDeleteCustomer(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="cust-btn"
                  style={{ background: "#ef4444", color: "#ffffff", borderColor: "#ef4444" }}
                  onClick={handleConfirmDeleteCustomer}
                >
                  Delete Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Customer */}
      {showAddModal && (
        <div className="cust-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="cust-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #edf2f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>Add New Customer</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} style={{ padding: "20px 24px", display: "grid", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div className="cust-modal-grid-2">
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                  />
                </div>
              </div>

              <div className="cust-modal-grid-2">
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Customer Type
                  </label>
                  <select
                    className="cust-filter-select"
                    value={newCustomer.type}
                    onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value })}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      height: "38px"
                    }}
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Preferred Channel
                  </label>
                  <select
                    className="cust-filter-select"
                    value={newCustomer.channel}
                    onChange={(e) => setNewCustomer({ ...newCustomer, channel: e.target.value })}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      height: "38px"
                    }}
                  >
                    <option value="Online">Online</option>
                    <option value="Store">Store</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                  Primary Address (City / Street)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Baner, Pune - 411045"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                  Customer Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Preferences, interests, tags..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="cust-btn cust-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cust-btn cust-btn-primary">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adjust Credits */}
      {showCreditModal && selectedCustomer && (
        <div className="cust-modal-overlay" onClick={() => setShowCreditModal(false)}>
          <div className="cust-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #edf2f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
                Add / Adjust Dzire Credits
              </h3>
              <button
                type="button"
                onClick={() => setShowCreditModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdjustCreditSubmit} style={{ padding: "20px 24px", display: "grid", gap: "14px" }}>
              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Target Customer</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                  {selectedCustomer.name} ({selectedCustomer.id})
                </div>
                <div style={{ fontSize: "12px", color: "#ff5722", fontWeight: "600", marginTop: "2px" }}>
                  Current Balance: {selectedCustomer.credits} Credits
                </div>
              </div>

              <div className="cust-modal-grid-2">
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Action
                  </label>
                  <select
                    className="cust-filter-select"
                    value={creditAdjustment.type}
                    onChange={(e) => setCreditAdjustment({ ...creditAdjustment, type: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    <option value="add">+ Add / Award Credits</option>
                    <option value="deduct">- Deduct / Reverse Credits</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                    Credits Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={creditAdjustment.amount}
                    onChange={(e) => setCreditAdjustment({ ...creditAdjustment, amount: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                  Reason / Remarks
                </label>
                <input
                  type="text"
                  value={creditAdjustment.reason}
                  onChange={(e) => setCreditAdjustment({ ...creditAdjustment, reason: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="cust-btn cust-btn-secondary"
                  onClick={() => setShowCreditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cust-btn cust-btn-primary">
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import Customers */}
      {showImportModal && (
        <div className="cust-modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="cust-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #edf2f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>Import Customers</h3>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: "24px", display: "grid", gap: "16px", textAlign: "center" }}>
              <div
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "12px",
                  padding: "30px 20px",
                  background: "#f8fafc"
                }}
              >
                <Upload size={36} style={{ color: "#ff5722", margin: "0 auto 10px" }} />
                <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                  Choose CSV / Excel File
                </h4>
                <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#64748b" }}>
                  Drag & drop your customer file here or browse.
                </p>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  style={{ fontSize: "12px" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImportFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  className="cust-btn cust-btn-secondary"
                  onClick={() => setShowImportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="cust-btn cust-btn-primary"
                  onClick={handleImportCustomers}
                >
                  Upload & Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomers;
