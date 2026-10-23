import React, { useState, useMemo, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import ExportDropdown from "../components/ExportDropdown";
import {
  Users2,
  UserPlus,
  Search,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  Ban,
  Edit2,
  CheckCircle2,
  X,
  Copy,
  UserCheck,
  Eye,
  MapPin,
  Calendar,
  ShoppingBag,
  IndianRupee,
  BadgePercent
} from "lucide-react";

export const USERS_STORAGE_KEY = "dzire_admin_users_list";

const INITIAL_USERS = [];

const USERS_PER_PAGE = 8;

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const AdminUsers = () => {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USERS;
  });

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState("");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer",
    gender: "Male",
    city: "",
    status: "Active"
  });

  useEffect(() => {
    let mounted = true;
    fetch("https://dzire-backend.onrender.com/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success && Array.isArray(d.users)) {
          const mapped = d.users.map((u) => ({
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || "+91 98765 43210",
            role: u.role || "customer",
            gender: u.gender || "Other",
            city: u.city || "Pune",
            status: u.status || "Active",
            emailVerified: u.emailVerified !== undefined ? u.emailVerified : true,
            phoneVerified: u.phoneVerified !== undefined ? u.phoneVerified : true,
            ordersCount: u.ordersCount || 0,
            totalSpent: u.totalSpent || "₹ 0",
            createdAt: u.createdAt || new Date().toISOString(),
            updatedAt: u.updatedAt || new Date().toISOString(),
          }));
          setUsers(mapped);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  // KPI Metrics
  const metrics = useMemo(() => {
    const total = users.length;
    const customers = users.filter((u) => u.role === "customer").length;
    const active = users.filter((u) => u.status === "Active").length;
    const pending = users.filter((u) => u.status === "Pending").length;
    const blocked = users.filter((u) => u.status === "Blocked").length;
    const staff = users.filter((u) => u.role === "admin" || u.role === "manager").length;
    return { total, customers, active, pending, blocked, staff };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter((u) => {
      // Tab filter
      if (activeTab === "active" && u.status !== "Active") return false;
      if (activeTab === "pending" && u.status !== "Pending") return false;
      if (activeTab === "blocked" && u.status !== "Blocked") return false;
      if (activeTab === "staff" && u.role !== "admin" && u.role !== "manager") return false;
      if (activeTab === "customers" && u.role !== "customer") return false;

      // Search query
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q)) ||
        u.id.toLowerCase().includes(q);

      // Dropdown role filter
      const matchesRole =
        roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesQuery && matchesRole;
    });
  }, [users, activeTab, searchQuery, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "customer",
      gender: "Male",
      city: "",
      status: "Active"
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "customer",
      gender: user.gender || "Male",
      city: user.city || "",
      status: user.status || "Active"
    });
    setIsFormModalOpen(true);
  };

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      fetch(`https://dzire-backend.onrender.com/api/admin/users/${id}`, { method: "DELETE" }).catch(() => {});
      showToast(`User "${name}" deleted successfully!`);
    }
  };

  const handleToggleBlock = (id, currentStatus) => {
    const nextStatus = currentStatus === "Blocked" ? "Active" : "Blocked";
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );
    fetch(`https://dzire-backend.onrender.com/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    }).catch(() => {});
    showToast(`User status changed to ${nextStatus}!`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in required fields (Name & Email).");
      return;
    }

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                ...formData,
                updatedAt: new Date().toISOString()
              }
            : u
        )
      );
      fetch(`https://dzire-backend.onrender.com/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => {});
      showToast(`User "${formData.name}" updated successfully!`);
    } else {
      const newUser = {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        ...formData,
        emailVerified: true,
        phoneVerified: Boolean(formData.phone),
        ordersCount: 0,
        totalSpent: "₹ 0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUsers((prev) => [newUser, ...prev]);
      fetch("https://dzire-backend.onrender.com/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.user) {
            setUsers((prev) =>
              prev.map((u) => (u.id === newUser.id ? { ...u, ...data.user, id: data.user.id || data.user._id } : u))
            );
          }
        })
        .catch(() => {});
      showToast(`New user "${formData.name}" created!`);
    }

    setIsFormModalOpen(false);
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11.5px",
              fontWeight: "700",
              background: "#fff0e6",
              color: "#ea580c",
              border: "1px solid #ffedd5",
              display: "inline-block"
            }}
          >
            Admin
          </span>
        );
      case "manager":
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11.5px",
              fontWeight: "700",
              background: "#f3e8ff",
              color: "#9333ea",
              border: "1px solid #e9d5ff",
              display: "inline-block"
            }}
          >
            Manager
          </span>
        );
      default:
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11.5px",
              fontWeight: "700",
              background: "#f1f5f9",
              color: "#475569",
              border: "1px solid #e2e8f0",
              display: "inline-block"
            }}
          >
            Customer
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11.5px",
              fontWeight: "700",
              background: "#dcfce7",
              color: "#15803d",
              border: "1px solid #bbf7d0",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a" }}></span>
            Active
          </span>
        );
      case "Pending":
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11.5px",
              fontWeight: "700",
              background: "#fef9c3",
              color: "#854d0e",
              border: "1px solid #fef08a",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ca8a04" }}></span>
            Pending
          </span>
        );
      case "Blocked":
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11.5px",
              fontWeight: "700",
              background: "#fee2e2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626" }}></span>
            Blocked
          </span>
        );
      default:
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11.5px",
              fontWeight: "700",
              background: "#f1f5f9",
              color: "#64748b"
            }}
          >
            {status}
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: "16px 20px", width: "100%", boxSizing: "border-box" }}>
        
        {/* Floating Toast Notification */}
        {notification && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              backgroundColor: "#10b981",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "10px",
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              fontSize: "14px",
              animation: "fadeIn 0.2s ease"
            }}
          >
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "14px"
          }}
        >
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
              User & Customer Directory
            </h1>
            <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
              Manage registered customers, admins, staff permissions, and contact details.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <ExportDropdown
              fileName="Users_Customer_Directory"
              title="Users & Customer Directory"
              headers={["ID", "Full Name", "Email", "Phone", "Role", "City", "Status", "Registered Date"]}
              rows={filteredUsers.map((u) => [
                u.id,
                u.name,
                u.email,
                u.phone || "-",
                u.role,
                u.city || "-",
                u.status,
                formatDate(u.createdAt)
              ])}
            />

            <button
              onClick={handleOpenAddModal}
              type="button"
              style={{
                backgroundColor: "#ff6600",
                color: "#ffffff",
                border: "none",
                padding: "9px 18px",
                borderRadius: "8px",
                fontSize: "13.5px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(255, 102, 0, 0.25)",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e05a00")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff6600")}
            >
              <UserPlus size={16} />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "14px",
            marginBottom: "20px"
          }}
        >
          <div
            onClick={() => setActiveTab("all")}
            style={{
              background: "#ffffff",
              padding: "16px 18px",
              borderRadius: "12px",
              border: activeTab === "all" ? "2px solid #ff6600" : "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              transition: "transform 0.15s, border-color 0.15s"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#fff7ed",
                color: "#ea580c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <Users2 size={20} />
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Total Accounts</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
                {metrics.total}
              </h3>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("customers")}
            style={{
              background: "#ffffff",
              padding: "16px 18px",
              borderRadius: "12px",
              border: activeTab === "customers" ? "2px solid #ff6600" : "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              transition: "transform 0.15s, border-color 0.15s"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#f0fdf4",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <UserCheck size={20} />
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Customers</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#16a34a" }}>
                {metrics.customers}
              </h3>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("active")}
            style={{
              background: "#ffffff",
              padding: "16px 18px",
              borderRadius: "12px",
              border: activeTab === "active" ? "2px solid #ff6600" : "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              transition: "transform 0.15s, border-color 0.15s"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#f5f3ff",
                color: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Active Accounts</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#7c3aed" }}>
                {metrics.active}
              </h3>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("blocked")}
            style={{
              background: "#ffffff",
              padding: "16px 18px",
              borderRadius: "12px",
              border: activeTab === "blocked" ? "2px solid #ff6600" : "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              transition: "transform 0.15s, border-color 0.15s"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#fef2f2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <Ban size={20} />
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Blocked / Inactive</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#dc2626" }}>
                {metrics.blocked}
              </h3>
            </div>
          </div>
        </div>

        {/* Main Directory Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
          }}
        >
          {/* Quick Segment Tabs Bar */}
          <div
            style={{
              padding: "0 16px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              background: "#fafbfc"
            }}
          >
            {[
              { id: "all", label: "All Users", count: metrics.total },
              { id: "customers", label: "Customers", count: metrics.customers },
              { id: "active", label: "Active", count: metrics.active },
              { id: "pending", label: "Pending", count: metrics.pending },
              { id: "blocked", label: "Blocked", count: metrics.blocked },
              { id: "staff", label: "Staff & Admins", count: metrics.staff }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                type="button"
                style={{
                  padding: "12px 14px",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "2.5px solid #ff6600" : "2.5px solid transparent",
                  background: "transparent",
                  color: activeTab === tab.id ? "#ff6600" : "#64748b",
                  fontWeight: activeTab === tab.id ? "700" : "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap"
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "1px 6px",
                    borderRadius: "10px",
                    background: activeTab === tab.id ? "#ffedd5" : "#e2e8f0",
                    color: activeTab === tab.id ? "#ea580c" : "#64748b",
                    fontWeight: "700"
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search and Filters Bar */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              background: "#ffffff"
            }}
          >
            {/* Search Input */}
            <div style={{ position: "relative", minWidth: "260px", flex: "1 1 280px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8"
                }}
              />
              <input
                type="text"
                placeholder="Search by name, email, phone, city, or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  height: "38px",
                  padding: "0 12px 0 36px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13.5px",
                  outline: "none",
                  backgroundColor: "#f8fafc",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Dropdown Filters */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  height: "38px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#334155",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="all">Filter Role: All</option>
                <option value="customer">Customers</option>
                <option value="admin">Admins</option>
                <option value="manager">Managers</option>
              </select>

              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", whiteSpace: "nowrap" }}>
                Found: <strong>{filteredUsers.length}</strong>
              </span>
            </div>
          </div>

          {/* User Table */}
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    color: "#475569",
                    fontWeight: "700",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  <th style={{ padding: "12px 16px", width: "80px" }}>ID</th>
                  <th style={{ padding: "12px 16px", minWidth: "190px" }}>User / Customer</th>
                  <th style={{ padding: "12px 16px", minWidth: "200px" }}>Email</th>
                  <th style={{ padding: "12px 16px", minWidth: "140px" }}>Phone</th>
                  <th style={{ padding: "12px 16px", width: "100px" }}>Role</th>
                  <th style={{ padding: "12px 16px", width: "110px" }}>City</th>
                  <th style={{ padding: "12px 16px", width: "110px" }}>Status</th>
                  <th style={{ padding: "12px 16px", width: "120px" }}>Joined</th>
                  <th style={{ padding: "12px 16px", width: "130px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                  >
                    {/* User ID */}
                    <td style={{ padding: "12px 16px", color: "#ea580c", fontWeight: "700", fontSize: "12.5px" }}>
                      {user.id}
                    </td>

                    {/* Name + Avatar */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: user.role === "admin" ? "#fff0e6" : "#e0f2fe",
                            color: user.role === "admin" ? "#ea580c" : "#0284c7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "800",
                            fontSize: "14px",
                            flexShrink: 0
                          }}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <span style={{ fontWeight: "700", color: "#0f172a", display: "block" }}>
                            {user.name}
                          </span>
                          <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                            {user.ordersCount ? `${user.ordersCount} Orders (${user.totalSpent})` : "New User"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#334155", fontWeight: "500" }}>{user.email}</span>
                        <button
                          onClick={() => copyToClipboard(user.email, "Email")}
                          type="button"
                          title="Copy Email"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#94a3b8",
                            cursor: "pointer",
                            padding: "2px",
                            display: "inline-flex"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6600")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </td>

                    {/* Phone */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#334155", fontWeight: "500" }}>{user.phone || "-"}</span>
                        {user.phone && (
                          <button
                            onClick={() => copyToClipboard(user.phone, "Phone")}
                            type="button"
                            title="Copy Phone"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#94a3b8",
                              cursor: "pointer",
                              padding: "2px",
                              display: "inline-flex"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6600")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                          >
                            <Copy size={13} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: "12px 16px" }}>
                      {getRoleBadge(user.role)}
                    </td>

                    {/* City */}
                    <td style={{ padding: "12px 16px", color: "#475569" }}>
                      {user.city || "-"}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 16px" }}>
                      {getStatusBadge(user.status)}
                    </td>

                    {/* Joined Date */}
                    <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "12.5px" }}>
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        
                        {/* View Profile Details */}
                        <button
                          onClick={() => setViewingUser(user)}
                          type="button"
                          title="View Profile Details"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            background: "#ffffff",
                            color: "#334155",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#3b82f6";
                            e.currentTarget.style.color = "#3b82f6";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#cbd5e1";
                            e.currentTarget.style.color = "#334155";
                          }}
                        >
                          <Eye size={13} />
                        </button>

                        {/* Edit User */}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          type="button"
                          title="Edit User"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            background: "#ffffff",
                            color: "#334155",
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
                            e.currentTarget.style.color = "#334155";
                          }}
                        >
                          <Edit2 size={13} />
                        </button>

                        {/* Block / Unblock User */}
                        <button
                          onClick={() => handleToggleBlock(user.id, user.status)}
                          type="button"
                          title={user.status === "Blocked" ? "Unblock User" : "Block User"}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "6px",
                            border: "1px solid #fde68a",
                            background: user.status === "Blocked" ? "#dcfce7" : "#fffbeb",
                            color: user.status === "Blocked" ? "#16a34a" : "#b45309",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer"
                          }}
                        >
                          <Ban size={13} />
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          type="button"
                          title="Delete User"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "6px",
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
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      No users match the search and filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div
            style={{
              padding: "14px 18px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              background: "#ffffff"
            }}
          >
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              Showing <strong>{currentUsers.length}</strong> of <strong>{filteredUsers.length}</strong> users
            </span>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                type="button"
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: "13px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  type="button"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    border: currentPage === idx + 1 ? "none" : "1px solid #cbd5e1",
                    background: currentPage === idx + 1 ? "#ff6600" : "#ffffff",
                    color: currentPage === idx + 1 ? "#ffffff" : "#334155",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                type="button"
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: "13px",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modal: Add or Edit User */}
        {isFormModalOpen && (
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
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              <div
                style={{
                  padding: "18px 22px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                  {editingUser ? "Edit User Account" : "Add New User"}
                </h2>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  type="button"
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ padding: "22px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  
                  {/* Name */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Full Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Email Address <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      User Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", backgroundColor: "#ffffff", boxSizing: "border-box" }}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Account Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", backgroundColor: "#ffffff", boxSizing: "border-box" }}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", backgroundColor: "#ffffff", boxSizing: "border-box" }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", color: "#475569", fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={{ padding: "9px 20px", borderRadius: "8px", border: "none", backgroundColor: "#ff6600", color: "#ffffff", fontSize: "13.5px", fontWeight: "700", cursor: "pointer" }}
                  >
                    {editingUser ? "Save Changes" : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: View User Profile Details */}
        {viewingUser && (
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
                maxWidth: "500px",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              <div
                style={{
                  padding: "20px",
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "50%",
                      background: viewingUser.role === "admin" ? "#fff0e6" : "#e0f2fe",
                      color: viewingUser.role === "admin" ? "#ea580c" : "#0284c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "800",
                      fontSize: "18px"
                    }}
                  >
                    {viewingUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#0f172a" }}>
                      {viewingUser.name}
                    </h3>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      ID: {viewingUser.id} • {viewingUser.gender || "Customer"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewingUser(null)}
                  type="button"
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "13.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Email Address</span>
                  <strong style={{ color: "#0f172a" }}>{viewingUser.email}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Phone Number</span>
                  <strong style={{ color: "#0f172a" }}>{viewingUser.phone || "-"}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>User Role</span>
                  {getRoleBadge(viewingUser.role)}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Account Status</span>
                  {getStatusBadge(viewingUser.status)}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>City / Location</span>
                  <strong style={{ color: "#0f172a" }}>{viewingUser.city || "-"}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Total Orders</span>
                  <strong style={{ color: "#0f172a" }}>{viewingUser.ordersCount || 0} Orders</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Total Spent</span>
                  <strong style={{ color: "#16a34a" }}>{viewingUser.totalSpent || "₹ 0"}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                  <span style={{ color: "#64748b" }}>Registered Date</span>
                  <span style={{ color: "#0f172a", fontWeight: "600" }}>{formatDate(viewingUser.createdAt)}</span>
                </div>
              </div>

              <div style={{ padding: "14px 20px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setViewingUser(null)}
                  style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

