import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  Coins,
  Gift,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  Calendar,
  Undo2,
  Ticket,
  ChevronDown,
  Plus,
  Edit2,
  FileSpreadsheet,
  Download,
  Mail,
  Receipt,
  FileText
} from "lucide-react";
import "./AdminCustomers.css";

const monthlyChartData = [
  { month: "Jan", issued: 0, redeemed: 0 },
  { month: "Feb", issued: 0, redeemed: 0 },
  { month: "Mar", issued: 0, redeemed: 0 },
  { month: "Apr", issued: 0, redeemed: 0 },
  { month: "May", issued: 0, redeemed: 0 },
  { month: "Jun", issued: 0, redeemed: 0 },
  { month: "Jul", issued: 0, redeemed: 0 },
  { month: "Aug", issued: 0, redeemed: 0 },
  { month: "Sep", issued: 0, redeemed: 0 }
];

const initialMembers = [];

const AdminDzireCredits = () => {
  const [members, setMembers] = useState(initialMembers);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all", "with", "none", "expiring"
  const [drawerTab, setDrawerTab] = useState("activity"); // "activity", "orders", "details", "notes"
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [balanceFilter, setBalanceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Credit adjustment state
  const [adjustment, setAdjustment] = useState({
    customerId: "",
    type: "add", // "add" or "deduct"
    amount: 100,
    reason: "Manual Loyalty Adjustment"
  });

  const fetchMembers = async () => {
    try {
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/users");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        const mapped = data.users.map((u, idx) => ({
          id: u._id || u.id || ("CUST" + (1001 + idx)),
          name: u.name || "Customer",
          initials: (u.name || "C").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
          phone: u.phone || "—",
          email: u.email || "—",
          type: u.type || "Regular",
          totalOrders: u.ordersCount || u.totalOrders || 0,
          totalSpent: u.totalSpent || 0,
          creditsEarned: typeof u.earnedCredits === "number" ? u.earnedCredits : (u.credits || 0),
          creditsUsed: typeof u.usedCredits === "number" ? u.usedCredits : 0,
          currentBalance: typeof u.credits === "number" ? u.credits : 0,
          status: u.status || "Active",
          validityMonths: 12,
          activities: Array.isArray(u.activities) ? u.activities : []
        }));
        setMembers(mapped);
        setSelectedMemberId((prev) => {
          if (prev && mapped.some(m => m.id === prev)) return prev;
          return mapped.length > 0 ? mapped[0].id : null;
        });
      }
    } catch (err) {
      console.error("Error fetching credit members:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const selectedMember = members.find(m => m.id === selectedMemberId) || members[0];

  // Dynamic Metrics
  const totalCreditsIssued = members.reduce((sum, m) => sum + (Number(m.creditsEarned) || 0), 0);
  const totalCreditsRedeemed = members.reduce((sum, m) => sum + (Number(m.creditsUsed) || 0), 0);
  const outstandingCredits = members.reduce((sum, m) => sum + (Number(m.currentBalance) || 0), 0);
  const activeMembersCount = members.filter(m => m.status === "Active").length;

  // Filtering
  const filteredMembers = members.filter(m => {
    if (activeTab === "with" && m.currentBalance <= 0) return false;
    if (activeTab === "none" && m.currentBalance > 0) return false;
    if (activeTab === "expiring" && m.validityMonths > 3) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = m.name.toLowerCase().includes(q) ||
                    m.id.toLowerCase().includes(q) ||
                    m.email.toLowerCase().includes(q) ||
                    m.phone.includes(q);
      if (!match) return false;
    }

    if (typeFilter !== "all" && m.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
    if (statusFilter !== "all" && m.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (balanceFilter === "gt100" && m.currentBalance <= 100) return false;
    if (balanceFilter === "gt500" && m.currentBalance <= 500) return false;
    if (balanceFilter === "zero" && m.currentBalance !== 0) return false;

    return true;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredMembers.map(m => m.id));
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
    setTypeFilter("all");
    setBalanceFilter("all");
    setStatusFilter("all");
    setActiveTab("all");
  };

  const handleAdjustCredits = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    const amountNum = Number(adjustment.amount) || 0;
    const isAdd = adjustment.type === "add";

    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/users/${selectedMember.id}/credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adjustment),
      });
      const data = await res.json();
      if (data.success) {
        await fetchMembers();
        setShowCreditModal(false);
        alert(`Successfully ${isAdd ? "added" : "deducted"} ${amountNum} credits for ${selectedMember.name}`);
      } else {
        alert(data.message || "Failed to adjust credits");
      }
    } catch (err) {
      alert("Error adjusting credits: " + err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Customer ID", "Name", "Phone", "Email", "Customer Type", "Total Orders", "Total Spent", "Credits Earned", "Credits Used", "Current Balance", "Status"];
    const rows = filteredMembers.map(m => [
      `"${m.id}"`,
      `"${m.name}"`,
      `"${m.phone}"`,
      `"${m.email}"`,
      `"${m.type}"`,
      m.totalOrders,
      m.totalSpent,
      m.creditsEarned,
      m.creditsUsed,
      m.currentBalance,
      `"${m.status}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dzire_credits_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  return (
    <AdminLayout>
      <div className="cust-page-container">

        {/* Top Header Row */}
        <div className="cust-header-row">
          <div>
            <h1 className="cust-header-title">Dzire Credits</h1>
            <p className="cust-header-subtitle">
              Manage customer loyalty credits, track usage and create manual adjustments.
            </p>
          </div>
          <div className="cust-header-actions">
            <button
              type="button"
              className="cust-btn cust-btn-secondary"
              onClick={() => setShowExportModal(true)}
            >
              <span>Export</span>
              <ChevronDown size={14} />
            </button>
            <button
              type="button"
              className="cust-btn cust-btn-primary"
              onClick={() => {
                if (selectedMember) setAdjustment({ ...adjustment, customerId: selectedMember.id });
                setShowCreditModal(true);
              }}
            >
              <Plus size={16} />
              <span>Add / Adjust Credits</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="cust-kpi-grid">
          {/* Card 1 */}
          <div className="cust-kpi-card">
            <div className="cust-kpi-icon-box" style={{ background: "#fff7ed", color: "#ea580c" }}>
              <Coins size={22} />
            </div>
            <div className="cust-kpi-info">
              <h3 className="cust-kpi-val">{totalCreditsIssued.toLocaleString("en-IN")}</h3>
              <div className="cust-kpi-label">Total Credits Issued</div>
              <div className="cust-kpi-trend cust-trend-up">
                <span>↑ 18%</span>
                <span className="cust-trend-neutral">vs last month</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="cust-kpi-card">
            <div className="cust-kpi-icon-box" style={{ background: "#e0f7f6", color: "#00a8a8" }}>
              <Gift size={22} />
            </div>
            <div className="cust-kpi-info">
              <h3 className="cust-kpi-val">{totalCreditsRedeemed.toLocaleString("en-IN")}</h3>
              <div className="cust-kpi-label">Total Credits Redeemed</div>
              <div className="cust-kpi-trend cust-trend-up">
                <span>↑ 22%</span>
                <span className="cust-trend-neutral">vs last month</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="cust-kpi-card">
            <div className="cust-kpi-icon-box" style={{ background: "#fef3c7", color: "#d97706" }}>
              <Coins size={22} />
            </div>
            <div className="cust-kpi-info">
              <h3 className="cust-kpi-val">{outstandingCredits.toLocaleString("en-IN")}</h3>
              <div className="cust-kpi-label">Outstanding Credits</div>
              <div className="cust-kpi-trend cust-trend-up">
                <span>↑ 12%</span>
                <span className="cust-trend-neutral">vs last month</span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="cust-kpi-card">
            <div className="cust-kpi-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
              <Users size={22} />
            </div>
            <div className="cust-kpi-info">
              <h3 className="cust-kpi-val">{activeMembersCount.toLocaleString("en-IN")}</h3>
              <div className="cust-kpi-label">Active Members</div>
              <div className="cust-kpi-trend cust-trend-up">
                <span>↑ 14%</span>
                <span className="cust-trend-neutral">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Charts & Loyalty Policy Rules */}
        <div className="cust-charts-row">
          
          {/* Bar Chart: Credits Issued vs Redeemed */}
          <div className="cust-card-box">
            <div className="cust-card-head">
              <h3 className="cust-card-title">Credits Issued vs Redeemed</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11.5px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff5722" }} /> Issued
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00a8a8" }} /> Redeemed
                </span>
              </div>
            </div>

            <div className="cust-barchart-container">
              {monthlyChartData.map((item, idx) => {
                const maxVal = 25000;
                const issuedH = (item.issued / maxVal) * 120;
                const redH = (item.redeemed / maxVal) * 120;
                return (
                  <div key={idx} className="cust-bar-group">
                    <div className="cust-bars">
                      <div className="cust-bar-issued" style={{ height: `${issuedH}px` }} title={`Issued: ${item.issued.toLocaleString()}`} />
                      <div className="cust-bar-redeemed" style={{ height: `${redH}px` }} title={`Redeemed: ${item.redeemed.toLocaleString()}`} />
                    </div>
                    <span className="cust-bar-label">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Donut Chart: Credits by Source */}
          <div className="cust-card-box">
            <div className="cust-card-head">
              <h3 className="cust-card-title">Credits by Source</h3>
            </div>

            <div className="cust-donut-wrap">
              <div className="cust-donut-svg-box">
                <svg width="130" height="130" viewBox="0 0 130 130">
                  {/* Purchases 86% -> #ff5722 */}
                  <circle
                    cx="65"
                    cy="65"
                    r="46"
                    fill="transparent"
                    stroke="#ff5722"
                    strokeWidth="18"
                    strokeDasharray="248 40"
                    strokeDashoffset="0"
                    transform="rotate(-90 65 65)"
                  />
                  {/* Manual 8% -> #00a8a8 */}
                  <circle
                    cx="65"
                    cy="65"
                    r="46"
                    fill="transparent"
                    stroke="#00a8a8"
                    strokeWidth="18"
                    strokeDasharray="23 265"
                    strokeDashoffset="-248"
                    transform="rotate(-90 65 65)"
                  />
                  {/* Promotional 6% -> #38bdf8 */}
                  <circle
                    cx="65"
                    cy="65"
                    r="46"
                    fill="transparent"
                    stroke="#38bdf8"
                    strokeWidth="18"
                    strokeDasharray="17 271"
                    strokeDashoffset="-271"
                    transform="rotate(-90 65 65)"
                  />
                </svg>
                <div className="cust-donut-center-text">
                  <span className="cust-donut-center-val">{totalCreditsIssued.toLocaleString("en-IN")}</span>
                  <span className="cust-donut-center-sub">Credits Issued</span>
                </div>
              </div>

              <div className="cust-donut-legend">
                <div className="cust-legend-item">
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <span className="cust-legend-dot" style={{ background: "#ff5722" }} /> Purchases
                  </span>
                  <strong>86%</strong>
                </div>
                <div className="cust-legend-item">
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <span className="cust-legend-dot" style={{ background: "#00a8a8" }} /> Manual Adjustments
                  </span>
                  <strong>8%</strong>
                </div>
                <div className="cust-legend-item">
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <span className="cust-legend-dot" style={{ background: "#38bdf8" }} /> Promotional
                  </span>
                  <strong>6%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Dzire Credits Rules Policy */}
          <div className="cust-card-box">
            <div className="cust-card-head">
              <h3 className="cust-card-title">Dzire Credits Rules</h3>
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Edit2 size={13} /> Edit
              </button>
            </div>

            <div className="cust-rules-list">
              <div className="cust-rule-item">
                <div className="cust-rule-icon">
                  <Coins size={16} />
                </div>
                <div>
                  <p className="cust-rule-title">Earn Credits</p>
                  <p className="cust-rule-desc">
                    100 credits for every ₹1,000 spent. (Minimum order value: ₹1,000)
                  </p>
                </div>
              </div>

              <div className="cust-rule-item">
                <div className="cust-rule-icon">
                  <Gift size={16} />
                </div>
                <div>
                  <p className="cust-rule-title">Redeem Credits</p>
                  <p className="cust-rule-desc">
                    Can redeem up to 10% of cart value. (Minimum order value: ₹1,000)
                  </p>
                </div>
              </div>

              <div className="cust-rule-item">
                <div className="cust-rule-icon">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="cust-rule-title">Validity</p>
                  <p className="cust-rule-desc">
                    Credits are valid for 12 months from the date of issue.
                  </p>
                </div>
              </div>

              <div className="cust-rule-item">
                <div className="cust-rule-icon">
                  <Undo2 size={16} />
                </div>
                <div>
                  <p className="cust-rule-title">Returns & Cancellations</p>
                  <p className="cust-rule-desc">
                    Credits earned from a returned order will be deducted.
                  </p>
                </div>
              </div>

              <div className="cust-rule-item">
                <div className="cust-rule-icon">
                  <Ticket size={16} />
                </div>
                <div>
                  <p className="cust-rule-title">Offers & Coupons</p>
                  <p className="cust-rule-desc">
                    Either an offer coupon or credits can be used (not both).
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "12px", textAlign: "right" }}>
              <a
                href="#policy"
                onClick={(e) => { e.preventDefault(); setShowRulesModal(true); }}
                style={{ color: "#2563eb", fontSize: "11.5px", fontWeight: "600", textDecoration: "none" }}
              >
                View Full Policy →
              </a>
            </div>
          </div>

        </div>

        {/* Tabs */}
        <div className="cust-tabs-container">
          <button
            type="button"
            className={`cust-tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Members ({members.length})
          </button>
          <button
            type="button"
            className={`cust-tab-btn ${activeTab === "with" ? "active" : ""}`}
            onClick={() => setActiveTab("with")}
          >
            With Credits ({members.filter(m => m.currentBalance > 0).length})
          </button>
          <button
            type="button"
            className={`cust-tab-btn ${activeTab === "none" ? "active" : ""}`}
            onClick={() => setActiveTab("none")}
          >
            No Credits ({members.filter(m => m.currentBalance <= 0).length})
          </button>
          <button
            type="button"
            className={`cust-tab-btn ${activeTab === "expiring" ? "active" : ""}`}
            onClick={() => setActiveTab("expiring")}
          >
            Expiring Soon ({members.filter(m => m.validityMonths <= 3).length})
          </button>
        </div>

        {/* Filter Bar */}
        <div className="cust-filter-bar">
          <div className="cust-search-box">
            <Search size={16} className="cust-search-icon" />
            <input
              type="text"
              placeholder="Search by name, phone, email or customer ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="cust-dropdown-group">
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

            <div className="cust-filter-select-wrap">
              <span>Credit Balance</span>
              <select
                className="cust-filter-select"
                value={balanceFilter}
                onChange={(e) => setBalanceFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="gt100">&gt; 100 Credits</option>
                <option value="gt500">&gt; 500 Credits</option>
                <option value="zero">0 Balance</option>
              </select>
            </div>

            <div className="cust-filter-select-wrap">
              <span>Status</span>
              <select
                className="cust-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                padding: "4px 8px"
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Main Content Split: Credits Table + Customer Detail Drawer */}
        <div className="cust-main-split">
          
          {/* Table Container */}
          <div className="cust-table-area">
            <div style={{ overflowX: "auto" }}>
              <table className="cust-table">
                <thead>
                  <tr>
                    <th style={{ width: "36px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.length === filteredMembers.length && filteredMembers.length > 0}
                        onChange={handleSelectAll}
                        style={{ cursor: "pointer", accentColor: "#ff5722" }}
                      />
                    </th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th style={{ textAlign: "center" }}>Total Orders</th>
                    <th>Total Spent</th>
                    <th style={{ textAlign: "center" }}>Credits Earned</th>
                    <th style={{ textAlign: "center" }}>Credits Used</th>
                    <th style={{ textAlign: "center" }}>Current Balance</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: "center", padding: "36px 16px", color: "#64748b" }}>
                        No loyalty credit records found matching current criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => {
                    const isSelected = selectedMemberId === m.id;
                    const isChecked = selectedRowIds.includes(m.id);
                    return (
                      <tr
                        key={m.id}
                        className={isSelected ? "selected-row" : ""}
                        onClick={() => setSelectedMemberId(m.id)}
                      >
                        <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleSelectRow(m.id, e)}
                            style={{ cursor: "pointer", accentColor: "#ff5722" }}
                          />
                        </td>
                        <td>
                          <div className="cust-user-cell">
                            <div className="cust-avatar-badge" style={{ background: isSelected ? "#ff5722" : "#e2e8f0", color: isSelected ? "#ffffff" : "#1e293b" }}>
                              {m.initials}
                            </div>
                            <div>
                              <p className="cust-user-name">{m.name}</p>
                              <p className="cust-user-id">{m.id}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ whiteSpace: "nowrap", color: "#334155" }}>
                          {m.phone}
                        </td>
                        <td style={{ color: "#64748b", fontSize: "12px" }}>
                          {m.email}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "600" }}>
                          {m.totalOrders}
                        </td>
                        <td style={{ fontWeight: "600", color: "#0f172a" }}>
                          ₹{m.totalSpent.toLocaleString()}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "600", color: "#059669" }}>
                          {m.creditsEarned}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "600", color: "#dc2626" }}>
                          {m.creditsUsed}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "700", color: "#ff5722", fontSize: "14px" }}>
                          {m.currentBalance}
                        </td>
                        <td>
                          <span className={`cust-pill ${m.status === "Active" ? "cust-pill-active" : "cust-pill-inactive"}`}>
                            {m.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            title="Actions"
                            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="cust-pagination">
              <div>
                Showing {filteredMembers.length === 0 ? 0 : 1}-{filteredMembers.length} of {members.length} customers
              </div>
              <div className="cust-page-nav">
                <button
                  type="button"
                  className="cust-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  <ChevronLeft size={14} />
                </button>
                <button type="button" className={`cust-page-btn ${currentPage === 1 ? "active" : ""}`} onClick={() => setCurrentPage(1)}>1</button>
                <button type="button" className={`cust-page-btn ${currentPage === 2 ? "active" : ""}`} onClick={() => setCurrentPage(2)}>2</button>
                <button type="button" className={`cust-page-btn ${currentPage === 3 ? "active" : ""}`} onClick={() => setCurrentPage(3)}>3</button>
                <button type="button" className={`cust-page-btn ${currentPage === 4 ? "active" : ""}`} onClick={() => setCurrentPage(4)}>4</button>
                <button type="button" className={`cust-page-btn ${currentPage === 5 ? "active" : ""}`} onClick={() => setCurrentPage(5)}>5</button>
                <span style={{ padding: "0 4px", color: "#94a3b8" }}>...</span>
                <button type="button" className="cust-page-btn" onClick={() => setCurrentPage(429)}>429</button>
                <button
                  type="button"
                  className="cust-page-btn"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <select
                  className="cust-filter-select"
                  style={{ padding: "5px 24px 5px 8px", fontSize: "12px" }}
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Add / Adjust Credits */}
      {showCreditModal && selectedMember && (
        <div className="cust-modal-overlay" onClick={() => setShowCreditModal(false)}>
          <div className="cust-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #edf2f7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
                Add / Adjust Dzire Credits
              </h3>
              <button type="button" onClick={() => setShowCreditModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdjustCredits} style={{ padding: "20px 24px", display: "grid", gap: "14px" }}>
              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Customer</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{selectedMember.name} ({selectedMember.id})</div>
                <div style={{ fontSize: "12px", color: "#ff5722", fontWeight: "600", marginTop: "2px" }}>Current Balance: {selectedMember.currentBalance} Credits</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>Action</label>
                  <select
                    value={adjustment.type}
                    onChange={(e) => setAdjustment({ ...adjustment, type: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", background: "#ffffff" }}
                  >
                    <option value="add">+ Add / Award Credits</option>
                    <option value="deduct">- Deduct / Reverse Credits</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>Credits Amount</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={adjustment.amount}
                    onChange={(e) => setAdjustment({ ...adjustment, amount: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>Reason / Order Reference</label>
                <input
                  type="text"
                  value={adjustment.reason}
                  onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
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
                <button
                  type="submit"
                  className="cust-btn cust-btn-primary"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Export */}
      {showExportModal && (
        <div className="cust-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="cust-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #edf2f7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Export Credits Report</h3>
              <button type="button" onClick={() => setShowExportModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: "20px", display: "grid", gap: "12px" }}>
              <button
                type="button"
                className="cust-btn cust-btn-secondary"
                style={{ justifyContent: "flex-start", padding: "12px" }}
                onClick={handleExportCSV}
              >
                <FileSpreadsheet size={18} style={{ color: "#16a34a" }} />
                <span>Export as Microsoft Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                className="cust-btn cust-btn-secondary"
                style={{ justifyContent: "flex-start", padding: "12px" }}
                onClick={handleExportCSV}
              >
                <FileText size={18} style={{ color: "#2563eb" }} />
                <span>Export as CSV File (.csv)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Rules */}
      {showRulesModal && (
        <div className="cust-modal-overlay" onClick={() => setShowRulesModal(false)}>
          <div className="cust-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #edf2f7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>Edit Dzire Credits Policy</h3>
              <button type="button" onClick={() => setShowRulesModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert("Loyalty rules updated successfully!"); setShowRulesModal(false); }} style={{ padding: "20px 24px", display: "grid", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>Earning Rate (Credits per ₹1,000)</label>
                <input type="number" defaultValue={100} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>Max Cart Redemption (%)</label>
                <input type="number" defaultValue={10} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>Validity Period (Months)</label>
                <input type="number" defaultValue={12} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" className="cust-btn cust-btn-secondary" onClick={() => setShowRulesModal(false)}>Cancel</button>
                <button type="submit" className="cust-btn cust-btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminDzireCredits;
