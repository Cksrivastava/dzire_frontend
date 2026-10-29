import React, { useState, useMemo, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import ExportDropdown from "../components/ExportDropdown";
import DateRangeFilter from "../components/DateRangeFilter";
import "./AdminDashboard.css";
import {
  ShoppingBag,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Copy,
  Printer,
  X,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  RefreshCcw,
  ArrowUpRight,
  Filter
} from "lucide-react";

export const ORDERS_STORAGE_KEY = "dzire_admin_orders_list";

const INITIAL_ORDERS = [];

const ORDERS_PER_PAGE = 8;

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

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const AdminOrders = () => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("https://dzire-backend.onrender.com/api/admin/orders")
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success && Array.isArray(d.orders)) {
          const mapped = d.orders.map((o) => ({
            id: o.orderId || o.orderNumber || o.id || "ORD-9821",
            orderNumber: o.orderNumber || o.orderId || o.id || "ORD-9821",
            customer: {
              name: o.userName || o.customer?.name || o.shippingAddress?.fullName || "Customer",
              email: o.userEmail || o.customer?.email || "customer@example.com",
              phone: o.userPhone || o.customer?.phone || "+91 98765 43210",
              address: o.shippingAddress?.address || o.customer?.address || "Main Street",
              city: o.shippingAddress?.city || o.customer?.city || "Pune",
              state: o.shippingAddress?.state || o.customer?.state || "Maharashtra",
              pincode: o.shippingAddress?.pincode || o.customer?.pincode || "411001",
            },
            items: (o.items && o.items.length > 0) ? o.items.map((i) => ({
              id: i.id || i.sku || "item-1",
              name: i.name || "Product",
              sku: i.sku || "DZR-01",
              price: Number(i.price) || 0,
              quantity: Number(i.quantity) || 1,
              image: i.image || i.img || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
            })) : [
              {
                id: "item-1",
                name: o.product || "Hiking Boots",
                sku: "DZR-SHOE-01",
                price: Number(o.price || o.total) || 1499,
                quantity: 1,
                image: o.img || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
              }
            ],
            totalAmount: Number(o.total || o.totalAmount) || 0,
            paymentMethod: o.paymentMethod || "UPI / Online",
            paymentStatus: o.paymentStatus || "Paid",
            status: o.status || "Confirmed",
            createdAt: o.createdAt || new Date().toISOString(),
            deliveredAt: o.status === "Delivered" ? (o.deliveredAt || new Date().toISOString()) : null,
            trackingNumber: o.trackingNumber || "DEL-84729102",
          }));
          setOrders(mapped);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Modals state
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // New Order Form state
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    productName: "",
    sku: "",
    price: "",
    quantity: "1",
    paymentMethod: "UPI / Online",
    paymentStatus: "Paid",
    status: "Confirmed"
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
    activePreset: "all",
    label: "All Time",
    isFiltered: false
  });

  // Orders within date range
  const ordersInDateRange = useMemo(() => {
    if (!dateRange.isFiltered) return orders;
    return orders.filter((order) => {
      const orderDateStr = order.createdAt || order.date;
      if (!orderDateStr) return false;
      const d = new Date(orderDateStr);
      if (isNaN(d.getTime())) return false;
      if (dateRange.fromDate) {
        const parts = dateRange.fromDate.split("-");
        const fromObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0, 0);
        if (d < fromObj) return false;
      }
      if (dateRange.toDate) {
        const parts = dateRange.toDate.split("-");
        const toObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 23, 59, 59, 999);
        if (d > toObj) return false;
      }
      return true;
    });
  }, [orders, dateRange]);

  // KPI Metrics calculation
  const metrics = useMemo(() => {
    const total = ordersInDateRange.length;
    const totalRevenue = ordersInDateRange
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const pending = ordersInDateRange.filter((o) => o.status === "Pending" || o.status === "Confirmed").length;
    const shipped = ordersInDateRange.filter((o) => o.status === "Shipped" || o.status === "Packed").length;
    const delivered = ordersInDateRange.filter((o) => o.status === "Delivered").length;
    const cancelled = ordersInDateRange.filter((o) => o.status === "Cancelled").length;

    return { total, totalRevenue, pending, shipped, delivered, cancelled };
  }, [ordersInDateRange]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ordersInDateRange.filter((order) => {
      // Tab filter
      if (activeTab === "pending" && order.status !== "Pending" && order.status !== "Confirmed") return false;
      if (activeTab === "packed" && order.status !== "Packed") return false;
      if (activeTab === "shipped" && order.status !== "Shipped") return false;
      if (activeTab === "delivered" && order.status !== "Delivered") return false;
      if (activeTab === "cancelled" && order.status !== "Cancelled") return false;

      // Search Query
      const matchesQuery =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.email.toLowerCase().includes(q) ||
        order.customer.phone.toLowerCase().includes(q) ||
        order.customer.city.toLowerCase().includes(q) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q)) ||
        order.items.some((i) => i.name.toLowerCase().includes(q));

      // Payment Filter
      const matchesPayment =
        paymentFilter === "all" || order.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();

      return matchesQuery && matchesPayment;
    });
  }, [ordersInDateRange, activeTab, searchQuery, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  // Status Change Handler
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder((prev) => ({ ...prev, status: newStatus }));
    }
    fetch(`https://dzire-backend.onrender.com/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
    showToast(`Order status updated to "${newStatus}"!`);
  };

  // Payment Status Handler
  const handleUpdatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o))
    );
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder((prev) => ({ ...prev, paymentStatus: newPaymentStatus }));
    }
    fetch(`https://dzire-backend.onrender.com/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: newPaymentStatus }),
    }).catch(() => {});
    showToast(`Payment status updated to "${newPaymentStatus}"!`);
  };

  // Delete Order
  const handleDeleteOrder = (id, orderNumber) => {
    if (window.confirm(`Are you sure you want to delete order "${orderNumber}"?`)) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (viewingOrder && viewingOrder.id === id) setViewingOrder(null);
      fetch(`https://dzire-backend.onrender.com/api/admin/orders/${id}`, {
        method: "DELETE",
      }).catch(() => {});
      showToast(`Order "${orderNumber}" deleted!`);
    }
  };

  // Add Manual Order Form Submit
  const handleCreateOrderSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.productName || !formData.price) {
      alert("Please fill in required fields (Customer Name, Product, and Price).");
      return;
    }

    const priceNum = parseFloat(formData.price) || 0;
    const qtyNum = parseInt(formData.quantity, 10) || 1;
    const total = priceNum * qtyNum;
    const newOrdNum = `ORD-${Math.floor(9830 + Math.random() * 900)}`;

    const newOrder = {
      id: newOrdNum,
      orderNumber: newOrdNum,
      customer: {
        name: formData.customerName,
        email: formData.email || "customer@example.com",
        phone: formData.phone || "+91 98000 00000",
        address: formData.address || "Main Street",
        city: formData.city || "New Delhi",
        state: formData.state || "Delhi",
        pincode: formData.pincode || "110001"
      },
      items: [
        {
          id: `item-${Date.now()}`,
          name: formData.productName,
          sku: formData.sku || "DZR-NEW-01",
          price: priceNum,
          quantity: qtyNum,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80"
        }
      ],
      totalAmount: total,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      status: formData.status,
      createdAt: new Date().toISOString(),
      deliveredAt: formData.status === "Delivered" ? new Date().toISOString() : null,
      trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    setOrders((prev) => [newOrder, ...prev]);
    fetch("https://dzire-backend.onrender.com/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    }).catch(() => {});
    showToast(`Order ${newOrdNum} created successfully!`);
    setIsAddModalOpen(false);
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
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
            Delivered
          </span>
        );
      case "Shipped":
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11.5px",
              fontWeight: "700",
              background: "#e0f2fe",
              color: "#0369a1",
              border: "1px solid #bae6fd",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0284c7" }}></span>
            Shipped
          </span>
        );
      case "Packed":
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11.5px",
              fontWeight: "700",
              background: "#f3e8ff",
              color: "#7e22ce",
              border: "1px solid #e9d5ff",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#9333ea" }}></span>
            Packed
          </span>
        );
      case "Confirmed":
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11.5px",
              fontWeight: "700",
              background: "#ffedd5",
              color: "#c2410c",
              border: "1px solid #fed7aa",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ea580c" }}></span>
            Confirmed
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
      case "Cancelled":
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
            Cancelled
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

  const getPaymentBadge = (status) => {
    switch (status) {
      case "Paid":
        return (
          <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: "#dcfce7", color: "#16a34a" }}>
            Paid
          </span>
        );
      case "Pending":
        return (
          <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: "#fef9c3", color: "#a16207" }}>
            Pending
          </span>
        );
      case "Failed":
      case "Refunded":
        return (
          <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: "#fee2e2", color: "#dc2626" }}>
            {status}
          </span>
        );
      default:
        return (
          <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: "#f1f5f9", color: "#64748b" }}>
            {status}
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: "24px 32px 48px 32px", width: "100%", boxSizing: "border-box" }}>
        
        {/* Floating Notification */}
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

        {/* Header Bar */}
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
              Orders & Fulfillment Hub
            </h1>
            <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
              Track customer orders, manage shipments, print invoices, and update delivery status.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <ExportDropdown
              fileName="Dzire_Orders_Report"
              title="Orders & Shipments Report"
              headers={["Order No", "Customer Name", "Phone", "City", "Items Qty", "Amount", "Payment Method", "Payment Status", "Order Status", "Date"]}
              rows={filteredOrders.map((o) => [
                o.orderNumber,
                o.customer.name,
                o.customer.phone,
                o.customer.city,
                o.items.reduce((s, i) => s + i.quantity, 0),
                `₹${o.totalAmount.toLocaleString()}`,
                o.paymentMethod,
                o.paymentStatus,
                o.status,
                formatDate(o.createdAt)
              ])}
            />

            <button
              onClick={() => {
                setFormData({
                  customerName: "",
                  email: "",
                  phone: "",
                  address: "",
                  city: "",
                  state: "",
                  pincode: "",
                  productName: "",
                  sku: "",
                  price: "",
                  quantity: "1",
                  paymentMethod: "UPI / Online",
                  paymentStatus: "Paid",
                  status: "Confirmed"
                });
                setIsAddModalOpen(true);
              }}
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
              <Plus size={16} />
              <span>Create Order</span>
            </button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div style={{ marginBottom: "20px" }}>
          <DateRangeFilter
            title="Orders Date Filter"
            idPrefix="orders-date-filter"
            onFilterChange={(filter) => {
              setDateRange(filter);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* 4 Summary Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "14px",
            marginBottom: "20px"
          }}
        >
          {/* Total Revenue */}
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
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
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
              <ShoppingBag size={20} />
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Total Orders / Revenue</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "19px", fontWeight: "800", color: "#0f172a" }}>
                {metrics.total} <span style={{ fontSize: "13px", fontWeight: "600", color: "#16a34a" }}>(₹{metrics.totalRevenue.toLocaleString()})</span>
              </h3>
            </div>
          </div>

          {/* Pending / Confirmed */}
          <div
            onClick={() => setActiveTab("pending")}
            style={{
              background: "#ffffff",
              padding: "16px 18px",
              borderRadius: "12px",
              border: activeTab === "pending" ? "2px solid #ff6600" : "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#fef9c3",
                color: "#ca8a04",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Processing / Pending</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "19px", fontWeight: "800", color: "#854d0e" }}>
                {metrics.pending} Orders
              </h3>
            </div>
          </div>

          {/* Shipped */}
          <div
            onClick={() => setActiveTab("shipped")}
            style={{
              background: "#ffffff",
              padding: "16px 18px",
              borderRadius: "12px",
              border: activeTab === "shipped" ? "2px solid #ff6600" : "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#e0f2fe",
                color: "#0284c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <Truck size={20} />
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Shipped & In Transit</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "19px", fontWeight: "800", color: "#0369a1" }}>
                {metrics.shipped} Orders
              </h3>
            </div>
          </div>

          {/* Delivered */}
          <div
            onClick={() => setActiveTab("delivered")}
            style={{
              background: "#ffffff",
              padding: "16px 18px",
              borderRadius: "12px",
              border: activeTab === "delivered" ? "2px solid #ff6600" : "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
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
              <PackageCheck size={20} />
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Delivered Successfully</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "19px", fontWeight: "800", color: "#15803d" }}>
                {metrics.delivered} Orders
              </h3>
            </div>
          </div>
        </div>

        {/* Main Orders Table Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
          }}
        >
          {/* Quick Segment Tabs */}
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
              { id: "all", label: "All Orders", count: metrics.total },
              { id: "pending", label: "Pending & Confirmed", count: metrics.pending },
              { id: "packed", label: "Packed", count: orders.filter((o) => o.status === "Packed").length },
              { id: "shipped", label: "Shipped", count: orders.filter((o) => o.status === "Shipped").length },
              { id: "delivered", label: "Delivered", count: metrics.delivered },
              { id: "cancelled", label: "Cancelled", count: metrics.cancelled }
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

          {/* Search & Filter Bar */}
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
                placeholder="Search by order #, customer, phone, city, or product..."
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

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
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
                <option value="all">Payment: All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed / Refunded</option>
              </select>

              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", whiteSpace: "nowrap" }}>
                Found: <strong>{filteredOrders.length}</strong>
              </span>
            </div>
          </div>

          {/* Table */}
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
              <thead>
                <tr
                  style={{
                    background: "#ff6600",
                    borderBottom: "1px solid #ff6600",
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  <th style={{ padding: "12px 16px", width: "100px", color: "#ffffff" }}>Order ID</th>
                  <th style={{ padding: "12px 16px", minWidth: "160px", color: "#ffffff" }}>Date & Time</th>
                  <th style={{ padding: "12px 16px", minWidth: "180px", color: "#ffffff" }}>Customer</th>
                  <th style={{ padding: "12px 16px", minWidth: "220px", color: "#ffffff" }}>Product Summary</th>
                  <th style={{ padding: "12px 16px", width: "110px", color: "#ffffff" }}>Amount</th>
                  <th style={{ padding: "12px 16px", minWidth: "140px", color: "#ffffff" }}>Payment</th>
                  <th style={{ padding: "12px 16px", minWidth: "150px", color: "#ffffff" }}>Order Status</th>
                  <th style={{ padding: "12px 16px", width: "120px", textAlign: "right", color: "#ffffff" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => {
                  const firstItem = order.items[0];
                  const otherItemsCount = order.items.length - 1;

                  return (
                    <tr
                      key={order.id}
                      style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                    >
                      {/* Order ID */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: "#ea580c", fontWeight: "700", fontSize: "13px" }}>
                            {order.orderNumber}
                          </span>
                          <button
                            onClick={() => copyToClipboard(order.orderNumber, "Order ID")}
                            type="button"
                            title="Copy Order #"
                            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "2px" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6600")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>
                        <div style={{ fontWeight: "600", color: "#334155" }}>{formatDate(order.createdAt)}</div>
                        <div style={{ fontSize: "11.5px" }}>{formatTime(order.createdAt)}</div>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: "700", color: "#0f172a" }}>{order.customer.name}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          {order.customer.city} • {order.customer.phone}
                        </div>
                      </td>

                      {/* Product Summary */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {firstItem?.image ? (
                            <img
                              src={firstItem.image}
                              alt={firstItem.name}
                              style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                            />
                          ) : (
                            <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ShoppingBag size={18} color="#94a3b8" />
                            </div>
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: "600", color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
                              {firstItem?.name || "Order Item"}
                            </div>
                            <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                              Qty: {firstItem?.quantity || 1} {otherItemsCount > 0 ? `+ ${otherItemsCount} more item(s)` : ""}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: "12px 16px", fontWeight: "800", color: "#0f172a", fontSize: "14px" }}>
                        ₹{order.totalAmount.toLocaleString()}
                      </td>

                      {/* Payment */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "12px", color: "#475569", fontWeight: "500" }}>{order.paymentMethod}</span>
                          <div>{getPaymentBadge(order.paymentStatus)}</div>
                        </div>
                      </td>

                      {/* Order Status with Quick Change */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div>{getOrderStatusBadge(order.status)}</div>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            style={{
                              fontSize: "11.5px",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              background: "#ffffff",
                              color: "#475569",
                              cursor: "pointer",
                              outline: "none"
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                          {/* View Order Modal */}
                          <button
                            onClick={() => setViewingOrder(order)}
                            type="button"
                            title="View Full Order Details"
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
                            <Eye size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                            type="button"
                            title="Delete Order"
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
                  );
                })}

                {currentOrders.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      No orders match the search and filter criteria.
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
              Showing <strong>{currentOrders.length}</strong> of <strong>{filteredOrders.length}</strong> orders
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

        {/* Modal: View Full Order Details */}
        {viewingOrder && (
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
                maxWidth: "680px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "20px 24px",
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h2 style={{ margin: 0, fontSize: "19px", fontWeight: "800", color: "#0f172a" }}>
                      Order #{viewingOrder.orderNumber}
                    </h2>
                    {getOrderStatusBadge(viewingOrder.status)}
                  </div>
                  <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                    Placed on {formatDate(viewingOrder.createdAt)} at {formatTime(viewingOrder.createdAt)}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    onClick={() => window.print()}
                    type="button"
                    title="Print Invoice"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "7px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#334155",
                      fontSize: "12.5px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    <Printer size={14} />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={() => setViewingOrder(null)}
                    type="button"
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Order Content */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* 2-Column Info Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {/* Customer & Shipping */}
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                      Customer & Delivery
                    </span>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
                      {viewingOrder.customer.name}
                    </h4>
                    <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#475569" }}>
                      {viewingOrder.customer.address}, {viewingOrder.customer.city}, {viewingOrder.customer.state} - {viewingOrder.customer.pincode}
                    </p>
                    <p style={{ margin: "0", fontSize: "13px", color: "#475569" }}>
                      📞 {viewingOrder.customer.phone} | ✉️ {viewingOrder.customer.email}
                    </p>
                  </div>

                  {/* Payment & Tracking */}
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                      Payment & Tracking
                    </span>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                      <span style={{ color: "#64748b" }}>Payment Method:</span>
                      <strong>{viewingOrder.paymentMethod}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                      <span style={{ color: "#64748b" }}>Payment Status:</span>
                      <div>{getPaymentBadge(viewingOrder.paymentStatus)}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "#64748b" }}>Tracking #:</span>
                      <strong>{viewingOrder.trackingNumber || "Not Assigned"}</strong>
                    </div>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                    Ordered Products ({viewingOrder.items.length})
                  </h4>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                    {viewingOrder.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          borderBottom: idx < viewingOrder.items.length - 1 ? "1px solid #f1f5f9" : "none",
                          background: "#ffffff"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "13.5px" }}>{item.name}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>
                              SKU: {item.sku} | Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontWeight: "800", color: "#0f172a", fontSize: "14px" }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary Total */}
                <div style={{ background: "#f8fafc", padding: "16px 20px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>Total Order Amount</span>
                  <span style={{ fontSize: "20px", fontWeight: "800", color: "#ea580c" }}>
                    ₹{viewingOrder.totalAmount.toLocaleString()}
                  </span>
                </div>

                {/* Quick Status Control Inside Modal */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Change Status:</span>
                  {["Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(viewingOrder.id, st)}
                      type="button"
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        border: viewingOrder.status === st ? "1.5px solid #ff6600" : "1px solid #cbd5e1",
                        background: viewingOrder.status === st ? "#fff7ed" : "#ffffff",
                        color: viewingOrder.status === st ? "#ea580c" : "#475569"
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  style={{ padding: "8px 20px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Create Manual Order */}
        {isAddModalOpen && (
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
                maxWidth: "560px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                  Create Manual Customer Order
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  type="button"
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateOrderSubmit} style={{ padding: "22px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  
                  {/* Customer Info */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Customer Full Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

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

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Product Details */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Product Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pro Waterproof Hiking Boots"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Price (₹) <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4999"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* City & Address */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Payment Method
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", backgroundColor: "#ffffff", boxSizing: "border-box" }}
                    >
                      <option value="UPI / Online">UPI / Online</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", color: "#475569", fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={{ padding: "9px 20px", borderRadius: "8px", border: "none", backgroundColor: "#ff6600", color: "#ffffff", fontSize: "13.5px", fontWeight: "700", cursor: "pointer" }}
                  >
                    Create Order
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

export default AdminOrders;
