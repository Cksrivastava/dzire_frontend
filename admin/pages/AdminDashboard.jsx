import React from "react";
import AdminLayout from "./AdminLayout";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Store,
  CreditCard,
  AlertTriangle,
  PackageX,
  Plus,
  FileText,
  Truck,
  Users,
  Tag,
  MessageSquare,
  BarChart,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Calendar,
  Filter,
  RefreshCw,
  X
} from "lucide-react";
import ExportDropdown from "../components/ExportDropdown";
import { apiUrl } from "../AdminShims";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = React.useState(null);
  const [storeInfo, setStoreInfo] = React.useState(null);
  const [recentOrders, setRecentOrders] = React.useState([]);
  const [recentPurchases, setRecentPurchases] = React.useState([]);
  const [recentReturns, setRecentReturns] = React.useState([]);
  const [topSellingProducts, setTopSellingProducts] = React.useState([]);
  const [lowStockProducts, setLowStockProducts] = React.useState([]);

  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [appliedFrom, setAppliedFrom] = React.useState("");
  const [appliedTo, setAppliedTo] = React.useState("");
  const [activePreset, setActivePreset] = React.useState("all");
  const [loading, setLoading] = React.useState(false);

  const formatDateYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getTimeframeRange = (key) => {
    if (!key || key === "all") return { from: "", to: "" };
    const now = new Date();
    const to = formatDateYMD(now);
    const past = new Date();
    if (key === "1m") past.setMonth(past.getMonth() - 1);
    else if (key === "2m") past.setMonth(past.getMonth() - 2);
    else if (key === "3m") past.setMonth(past.getMonth() - 3);
    else if (key === "6m") past.setMonth(past.getMonth() - 6);
    else if (key === "1y") past.setFullYear(past.getFullYear() - 1);
    const from = formatDateYMD(past);
    return { from, to };
  };

  const fetchTimeframeMetrics = React.useCallback(async (key) => {
    if (metricsCache[key]) return metricsCache[key];
    const { from, to } = getTimeframeRange(key);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString() ? `?${params.toString()}` : "";

    try {
      const res = await fetch(apiUrl(`/admin/overview${qs}`));
      const d = await res.json();
      if (d && d.success) {
        setMetricsCache((prev) => ({ ...prev, [key]: d }));
        if (key === "all") {
          if (d.metrics) setMetrics(d.metrics);
          if (d.storeInfo) setStoreInfo(d.storeInfo);
          if (d.recentOrders) setRecentOrders(d.recentOrders);
          if (d.recentPurchases) setRecentPurchases(d.recentPurchases);
          if (d.recentReturns) setRecentReturns(d.recentReturns);
          if (d.topSellingProducts) setTopSellingProducts(d.topSellingProducts);
          if (d.lowStockProducts) setLowStockProducts(d.lowStockProducts);
        }
        return d;
      }
    } catch (err) {
      console.error(`Failed to load overview for ${key}:`, err);
    }
    return null;
  }, [metricsCache]);

  React.useEffect(() => {
    setLoading(true);
    fetchTimeframeMetrics("all").finally(() => setLoading(false));
  }, []);

  const handleCardTimeframeChange = (cardKey, newTf) => {
    setCardTimeframes((prev) => ({ ...prev, [cardKey]: newTf }));
    if (!metricsCache[newTf]) {
      fetchTimeframeMetrics(newTf);
    }
  };

  const getCardMetrics = (cardKey) => {
    const tf = cardTimeframes[cardKey] || "all";
    return metricsCache[tf]?.metrics || metrics || {};
  };

  const salesMetrics = getCardMetrics("totalSales");
  const onlineMetrics = getCardMetrics("onlineOrders");
  const instoreMetrics = getCardMetrics("instoreOrders");
  const purchaseMetrics = getCardMetrics("totalPurchases");
  const lowStockMetrics = getCardMetrics("lowStock");
  const outOfStockMetrics = getCardMetrics("outOfStock");
  const overviewMetrics = getCardMetrics("salesOverview");

  const totalSalesVal = `₹${(salesMetrics.totalSales || 0).toLocaleString("en-IN")}`;
  const salesGrowth = salesMetrics.salesGrowth || "0.0%";
  const salesGrowthTrend = salesMetrics.salesGrowthTrend || "pos";

  const totalOrdersVal = (onlineMetrics.totalOrders || 0).toLocaleString("en-IN");
  const ordersGrowth = onlineMetrics.ordersGrowth || "0.0%";
  const ordersGrowthTrend = onlineMetrics.ordersGrowthTrend || "pos";

  const instoreOrdersVal = (instoreMetrics.instoreOrders || 0).toLocaleString("en-IN");

  const totalPurchasesVal = `₹${(purchaseMetrics.totalPurchases || 0).toLocaleString("en-IN")}`;

  const lowStockVal = lowStockMetrics.lowStockCount || 0;
  const outOfStockVal = outOfStockMetrics.outOfStockCount || 0;

  const overviewSalesVal = `₹${(overviewMetrics.totalSales || 0).toLocaleString("en-IN")}`;
  const overviewChartPaths = overviewMetrics.chartPaths;

  const inStockVal = metrics ? (metrics.inStockCount || 0) : 0;
  const totalProductsVal = metrics ? (metrics.totalProducts || 0).toLocaleString("en-IN") : "0";
  const totalStockValueVal = metrics ? `₹${(metrics.totalStockValue || 0).toLocaleString("en-IN")}` : "₹0";
  const totalCustomersVal = metrics ? (metrics.totalCustomers || 0).toLocaleString("en-IN") : "0";
  const activeCustomersVal = metrics ? (metrics.activeCustomers || 0).toLocaleString("en-IN") : "0";
  const creditsIssuedVal = metrics ? (metrics.totalCreditsIssued || 0).toLocaleString("en-IN") : "0";
  const creditsRedeemedVal = metrics ? (metrics.totalCreditsRedeemed || 0).toLocaleString("en-IN") : "0";
  const creditsExpiringVal = metrics ? (metrics.creditsExpiring || 0).toLocaleString("en-IN") : "0";

  const totalSalesNum = metrics?.totalSales || 0;
  const instoreSalesNum = metrics?.instoreSales || 0;
  const onlineSalesNum = metrics?.onlineSales || 0;

  const onlineSalesVal = `₹${onlineSalesNum.toLocaleString("en-IN")}`;
  const instoreSalesVal = `₹${instoreSalesNum.toLocaleString("en-IN")}`;

  const instorePct = totalSalesNum > 0 ? ((instoreSalesNum / totalSalesNum) * 100).toFixed(1) : "0.0";
  const onlinePct = totalSalesNum > 0 ? ((onlineSalesNum / totalSalesNum) * 100).toFixed(1) : "0.0";

  const kpiData = [
    [`Total Sales (${TIMEFRAME_LABELS[cardTimeframes.totalSales]})`, totalSalesVal, `${salesGrowth} Growth`],
    [`Total Orders (Online - ${TIMEFRAME_LABELS[cardTimeframes.onlineOrders]})`, `${totalOrdersVal} Orders`, `${ordersGrowth} Growth`],
    [`Total Orders (Instore - ${TIMEFRAME_LABELS[cardTimeframes.instoreOrders]})`, `${instoreOrdersVal} Orders`, 'POS Offline'],
    [`Total Purchase (${TIMEFRAME_LABELS[cardTimeframes.totalPurchases]})`, totalPurchasesVal, 'Vendor Invoices'],
    [`Low Stock Products (${TIMEFRAME_LABELS[cardTimeframes.lowStock]})`, `${lowStockVal} SKUs`, 'Needs Restock'],
    [`Out of Stock Products (${TIMEFRAME_LABELS[cardTimeframes.outOfStock]})`, `${outOfStockVal} SKUs`, 'Needs Restock']
  ];

  return (
    <AdminLayout>
      <div className={`dashboard-wrapper ${loading ? "is-loading" : ""}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 2px 0', color: '#0f172a' }}>Overview & Key Performance</h2>
            <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>Real-time summary of store performance, sales, orders, and stock alerts.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ExportDropdown
              fileName="Dashboard_KPI_Summary"
              title="Executive Dashboard KPI Summary"
              headers={['Metric Name', 'Value / Volume', 'Performance / Status']}
              rows={kpiData}
            />
          </div>
        </div>

        {/* Top Summary Cards with Individual Timeframe Filters */}
        <div className="dashboard-top-row">
          <div className="dash-card">
            <div className="dash-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <span className="dash-card-icon bg-orange-100 text-orange-600"><CreditCard size={18} /></span>
                <span className="dash-card-title">Total Sales ({TIMEFRAME_LABELS[cardTimeframes.totalSales]})</span>
              </div>
              <select
                value={cardTimeframes.totalSales}
                onChange={(e) => handleCardTimeframeChange("totalSales", e.target.value)}
                className="dash-timeframe-select"
                aria-label="Filter timeframe for Total Sales"
              >
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="dash-card-body">
              <h3 className="dash-card-value">{totalSalesVal}</h3>
              <p className={`dash-card-trend ${salesGrowthTrend}`}>
                {salesGrowthTrend === "neg" ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />} {salesGrowth} <span>vs previous cycle</span>
              </p>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <span className="dash-card-icon bg-blue-100 text-blue-600"><ShoppingCart size={18} /></span>
                <span className="dash-card-title">Total Orders (Online - {TIMEFRAME_LABELS[cardTimeframes.onlineOrders]})</span>
              </div>
              <select
                value={cardTimeframes.onlineOrders}
                onChange={(e) => handleCardTimeframeChange("onlineOrders", e.target.value)}
                className="dash-timeframe-select"
                aria-label="Filter timeframe for Online Orders"
              >
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="dash-card-body">
              <h3 className="dash-card-value">{totalOrdersVal}</h3>
              <p className={`dash-card-trend ${ordersGrowthTrend}`}>
                {ordersGrowthTrend === "neg" ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />} {ordersGrowth} <span>vs previous cycle</span>
              </p>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <span className="dash-card-icon bg-orange-100 text-orange-600"><Store size={18} /></span>
                <span className="dash-card-title">Total Orders (Instore - {TIMEFRAME_LABELS[cardTimeframes.instoreOrders]})</span>
              </div>
              <select
                value={cardTimeframes.instoreOrders}
                onChange={(e) => handleCardTimeframeChange("instoreOrders", e.target.value)}
                className="dash-timeframe-select"
                aria-label="Filter timeframe for Instore Orders"
              >
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="dash-card-body">
              <h3 className="dash-card-value">{instoreOrdersVal}</h3>
              <p className="dash-card-trend pos"><ArrowUpRight size={14} /> POS Offline</p>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <span className="dash-card-icon bg-purple-100 text-purple-600"><ShoppingCart size={18} /></span>
                <span className="dash-card-title">Total Purchase ({TIMEFRAME_LABELS[cardTimeframes.totalPurchases]})</span>
              </div>
              <select
                value={cardTimeframes.totalPurchases}
                onChange={(e) => handleCardTimeframeChange("totalPurchases", e.target.value)}
                className="dash-timeframe-select"
                aria-label="Filter timeframe for Total Purchases"
              >
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="dash-card-body">
              <h3 className="dash-card-value">{totalPurchasesVal}</h3>
              <p className="dash-card-trend pos"><ArrowUpRight size={14} /> Vendor Invoices</p>
            </div>
          </div>

          <div className="dash-card alert-card warning" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <div className="alert-card-content">
                <AlertTriangle size={24} style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600" }}>Low Stock Products</p>
                  <span style={{ fontSize: "11px", color: "#b45309", fontWeight: "600" }}>
                    ({TIMEFRAME_LABELS[cardTimeframes.lowStock]})
                  </span>
                </div>
              </div>
              <select
                value={cardTimeframes.lowStock}
                onChange={(e) => handleCardTimeframeChange("lowStock", e.target.value)}
                className="dash-timeframe-select"
                aria-label="Filter timeframe for Low Stock"
              >
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <h4 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>{lowStockVal}</h4>
              <Link to="/admin/inventory" className="view-all">View details</Link>
            </div>
          </div>

          <div className="dash-card alert-card danger" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <div className="alert-card-content">
                <PackageX size={24} style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600" }}>Out of Stock Products</p>
                  <span style={{ fontSize: "11px", color: "#b91c1c", fontWeight: "600" }}>
                    ({TIMEFRAME_LABELS[cardTimeframes.outOfStock]})
                  </span>
                </div>
              </div>
              <select
                value={cardTimeframes.outOfStock}
                onChange={(e) => handleCardTimeframeChange("outOfStock", e.target.value)}
                className="dash-timeframe-select"
                aria-label="Filter timeframe for Out of Stock"
              >
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <h4 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>{outOfStockVal}</h4>
              <Link to="/admin/out-of-stock" className="view-all">View details</Link>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="dashboard-grid row-2">
          <div className="dash-panel span-2">
            <div className="dash-panel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <h4>Sales Overview ({TIMEFRAME_LABELS[cardTimeframes.salesOverview]})</h4>
              <div className="timeframe-pill-group">
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`timeframe-pill-btn ${cardTimeframes.salesOverview === opt.value ? "active" : ""}`}
                    onClick={() => handleCardTimeframeChange("salesOverview", opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="dash-panel-body">
              <div className="sales-overview-stats">
                <p>Total Sales: <strong>{overviewSalesVal}</strong> <span className="pos"><ArrowUpRight size={14} /> Live Total</span></p>
                <div className="legend">
                  <span><span className="dot bg-orange"></span> Instore Sales</span>
                  <span><span className="dot bg-green"></span> Online Sales</span>
                </div>
              </div>
              <div className="chart-placeholder">
                <svg viewBox="0 0 400 150" className="mock-chart">
                  <path
                    d={overviewChartPaths?.instorePath || "M0,130 L400,130"}
                    fill="none"
                    stroke="#ff6600"
                    strokeWidth="3"
                  />
                  <path
                    d={overviewChartPaths?.onlinePath || "M0,130 L400,130"}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="dash-panel span-2">
            <div className="dash-panel-header">
              <h4>Top Selling Products</h4>
              <Link to="/admin/products" className="view-all">View All</Link>
            </div>
            <div className="table-responsive">
              <table className="dash-table">
                <thead><tr><th>Product</th><th>Sold</th><th>Revenue</th></tr></thead>
                <tbody>
                  {topSellingProducts && topSellingProducts.length > 0 ? (
                    topSellingProducts.map((p, idx) => (
                      <tr key={idx}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.sold}</td>
                        <td style={{ fontWeight: '600' }}>₹{Number(p.revenue || 0).toLocaleString("en-IN")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" style={{ textAlign: "center", color: "#94a3b8", padding: "16px" }}>No sales data yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-header">
              <h4>Inventory Summary</h4>
              <Link to="/admin/inventory" className="view-all">View All</Link>
            </div>
            <ul className="summary-list">
              <li><span>Total Products</span> <strong>{totalProductsVal}</strong></li>
              <li><span>In Stock</span> <strong className="text-green-600">{inStockVal}</strong></li>
              <li><span>Low Stock</span> <strong className="text-orange-600">{lowStockVal}</strong></li>
              <li><span>Out of Stock</span> <strong className="text-red-600">{outOfStockVal}</strong></li>
              <li className="total-value"><span>Total Stock Value</span> <strong>{totalStockValueVal}</strong></li>
            </ul>
          </div>
        </div>

        {/* Row 3 */}
        <div className="dashboard-grid cols-4">
          <div className="dash-panel span-2">
            <div className="dash-panel-header">
              <h4>Low Stock Products</h4>
              <Link to="/admin/inventory" className="view-all">View All</Link>
            </div>
            <div className="table-responsive">
              <table className="dash-table">
                <thead><tr><th>Product</th><th>SKU</th><th>Stock</th><th>Status</th></tr></thead>
                <tbody>
                  {lowStockProducts && lowStockProducts.length > 0 ? (
                    lowStockProducts.map((p, idx) => (
                      <tr key={idx}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.sku}</td>
                        <td>{p.stock}</td>
                        <td><span className={`badge ${p.stock <= 0 ? "danger" : "warning"}`}>{p.status}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" style={{ textAlign: "center", color: "#94a3b8", padding: "16px" }}>No low stock alerts</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dash-panel span-1">
            <div className="dash-panel-header">
              <h4>Sales Channel Overview</h4>
              <span className="admin-mode-pill" style={{ fontSize: '11px' }}>Live Overview</span>
            </div>
            <div className="donut-chart-mock">
              <div
                className="donut-circle"
                style={
                  totalSalesNum > 0
                    ? {
                        background: `radial-gradient(circle closest-side, white 68%, transparent 69% 100%), conic-gradient(#ff6600 0% ${instorePct}%, #16a34a ${instorePct}% 100%)`,
                        border: "none",
                      }
                    : {
                        border: "16px solid #eef2f6",
                      }
                }
              >
                <span>{totalSalesVal}<br /><small>Total Sales</small></span>
              </div>
              <ul className="donut-legend">
                <li><span className="dot bg-orange"></span> Instore Sales <strong>{instoreSalesVal} ({instorePct}%)</strong></li>
                <li><span className="dot bg-green"></span> Online Sales <strong>{onlineSalesVal} ({onlinePct}%)</strong></li>
                <li><span className="dot bg-blue"></span> Other Income <strong>₹0 (0.0%)</strong></li>
              </ul>
            </div>
          </div>

          <div className="dash-panel span-1">
            <div className="dash-panel-header">
              <h4>Dzire Credits Overview (Online)</h4>
              <Link to="/admin/loyalty" className="view-all">View All</Link>
            </div>
            <ul className="summary-list">
              <li><span>Total Members</span> <strong>{totalCustomersVal}</strong></li>
              <li><span>Active Members</span> <strong>{activeCustomersVal}</strong></li>
              <li><span>Total Credits Issued</span> <strong>{creditsIssuedVal}</strong></li>
              <li><span>Total Credits Redeemed</span> <strong>{creditsRedeemedVal}</strong></li>
              <li><span>Credits Expiring (Next 30 Days)</span> <strong>{creditsExpiringVal}</strong></li>
            </ul>
          </div>
        </div>

        {/* Row 4 */}
        <div className="dashboard-grid row-4">
          <div className="dash-panel span-2">
            <div className="dash-panel-header">
              <h4>Recent Orders</h4>
              <Link to="/admin/orders" className="view-all">View All</Link>
            </div>
            <div className="table-responsive">
              <table className="dash-table small">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((ro) => (
                      <tr key={ro.orderId || ro.id || ro._id}>
                        <td>{ro.orderId || ro.id || ro.orderNumber}</td>
                        <td>{ro.userName || ro.shippingAddress?.fullName || "Customer"}</td>
                        <td>₹{(ro.total || ro.totalAmount || 0).toLocaleString("en-IN")}</td>
                        <td>
                          <span
                            className={`badge ${
                              ro.status === "Delivered"
                                ? "success"
                                : ro.status === "In Transit" || ro.status === "Shipped"
                                ? "info"
                                : ro.status === "Confirmed"
                                ? "success"
                                : "warning"
                            }`}
                          >
                            {ro.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" style={{ textAlign: "center", color: "#94a3b8", padding: "16px" }}>No recent orders</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dash-panel span-3">
            <div className="dash-panel-header">
              <h4>Recent Purchase</h4>
              <Link to="/admin/purchase-invoices" className="view-all">View All</Link>
            </div>
            <div className="table-responsive">
              <table className="dash-table">
                <thead><tr><th>Invoice No</th><th>Vendor</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {recentPurchases && recentPurchases.length > 0 ? (
                    recentPurchases.map((rp, idx) => (
                      <tr key={idx}>
                        <td>{rp.invoiceNumber}</td>
                        <td>{rp.vendor}</td>
                        <td>₹{Number(rp.amount || 0).toLocaleString("en-IN")}</td>
                        <td>{rp.date}</td>
                        <td><span className="badge success">{rp.status}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" style={{ textAlign: "center", color: "#94a3b8", padding: "16px" }}>No purchase invoices yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Row 5 */}
        <div className="dashboard-grid row-4">
          <div className="dash-panel span-3">
            <div className="dash-panel-header">
              <h4>Recent Returns</h4>
              <Link to="/admin/returns/list" className="view-all">View All</Link>
            </div>
            <div className="table-responsive">
              <table className="dash-table">
                <thead><tr><th>Return ID</th><th>Type</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {recentReturns && recentReturns.length > 0 ? (
                    recentReturns.map((rr, idx) => (
                      <tr key={idx}>
                        <td>{rr.id}</td>
                        <td>{rr.type}</td>
                        <td>{typeof rr.amount === 'number' ? `₹${rr.amount.toLocaleString("en-IN")}` : rr.amount}</td>
                        <td>{rr.date}</td>
                        <td>
                          <span className={`badge ${rr.status === "Approved" || rr.status === "Completed" ? "success" : "warning"}`}>
                            {rr.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" style={{ textAlign: "center", color: "#94a3b8", padding: "16px" }}>No return requests yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dash-panel span-2">
            <div className="dash-panel-header">
              <h4>Quick Actions</h4>
            </div>
            <div className="quick-actions-grid">
              <button onClick={() => navigate("/admin/products/add")}><Plus size={20} /><span>Add Product</span></button>
              <button onClick={() => navigate("/admin/pos")}><FileText size={20} /><span>Sales Invoice</span></button>
              <button onClick={() => navigate("/admin/purchase-invoices/add")}><FileCheck size={20} /><span>Purchase Invoice</span></button>
              <button onClick={() => navigate("/admin/purchase-orders")}><Truck size={20} /><span>Purchase Order</span></button>
              <button onClick={() => navigate("/admin/users")}><Users size={20} /><span>Add Customer</span></button>
              <button onClick={() => navigate("/admin/marketing")}><Tag size={20} /><span>New Coupon</span></button>
              <button onClick={() => navigate("/admin/marketing")}><MessageSquare size={20} /><span>Send SMS</span></button>
              <button onClick={() => navigate("/admin/reports")}><BarChart size={20} /><span>View Reports</span></button>
            </div>
          </div>
        </div>

        {/* Store Information Footer */}
        <div className="store-info-footer">
          <h4>Store Information</h4>
          <div className="store-info-cards">
            <div className="info-item">
              <Store size={20} />
              <div>
                <strong>{storeInfo?.name || "Dzire Store"}</strong>
                <span>{storeInfo?.category || "Outdoor Equipment Store"}</span>
              </div>
            </div>
            <div className="info-item">
              <Phone size={20} />
              <div>
                <strong>{storeInfo?.phone || "+91 98765 43210"}</strong>
                <span>Mobile</span>
              </div>
            </div>
            <div className="info-item">
              <Mail size={20} />
              <div>
                <strong>{storeInfo?.email || "support@dzirestore.in"}</strong>
                <span>Email</span>
              </div>
            </div>
            <div className="info-item">
              <FileText size={20} />
              <div>
                <strong>{storeInfo?.gstin || "27ABCDE1234F1Z5"}</strong>
                <span>GSTIN</span>
              </div>
            </div>
            <div className="info-item">
              <MapPin size={20} />
              <div>
                <strong>{storeInfo?.location || "Pune, Maharashtra"}</strong>
                <span>Store Location</span>
              </div>
            </div>
            <button className="view-profile-btn" onClick={() => navigate("/admin/settings")}>View Store Profile</button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
