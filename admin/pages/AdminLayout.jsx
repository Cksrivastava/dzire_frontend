import { useState, useEffect, useRef } from "react";

// Persists sidebar scroll position across navigations
let _sidebarScrollTop = 0;
import {
  BarChart3,
  Bell,
  Boxes,
  CreditCard,
  LayoutDashboard,
  Menu,
  ShoppingBag,
  Users2,
  X,
  Undo2,
  Truck,
  FileText,
  Terminal,
  TrendingUp,
  TicketPercent,
  Tag,
  UploadCloud,
  ScanBarcode,
  LogOut,
  Gift,
  History,
  Settings,
  ChevronDown,
  FolderOpen,
  Sliders,
  Bookmark,
  Package2,
  Archive,
  ShoppingCart,
  ClipboardCheck,
  Search,
  Calculator,
  Activity,
  Shield,
  ChevronRight
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo2.png";
import { useAuth } from "../AdminShims";
import "./AdminDashboard.css";
import "../AdminCommon.css";

import { moduleCards, subRouteMap } from "./adminNavigation";

const navigationItems = moduleCards.map(card => {
  const label = card.title.split(" (")[0];
  return {
    to: card.to,
    label: label,
    icon: card.icon,
    subItems: card.items.map(item => {
      const mappedRoute = subRouteMap[item];
      return {
        to: mappedRoute || card.to,
        label: item
      };
    })
  };
});


const pageCopy = {
  "/admin/dashboard": {
    title: "Dashboard",
    subtitle: "Real-time insights into your sales, inventory, and customer activity.",
  },
  "/admin/products": {
    title: "Products & Catalog",
    subtitle: "Manage product descriptions, SKU pricing, and restrict purchase quantities.",
  },
  "/admin/brands": {
    title: "Brands",
    subtitle: "Organize and manage product brands.",
  },
  "/admin/out-of-stock": {
    title: "Out of Stock",
    subtitle: "View and manage products with zero inventory.",
  },
  "/admin/stock-alerts": {
    title: "Stock Alerts",
    subtitle: "Customer notifications for restocked items.",
  },
  "/admin/orders": {
    title: "Orders & Fulfillment",
    subtitle: "Process customer order shipments and review invoice logs.",
  },
  "/admin/payments": {
    title: "Payments",
    subtitle: "Monitor transaction status and payment methods.",
  },
  "/admin/users": {
    title: "Users & Roles",
    subtitle: "Define admin permissions: Super Admin, Store Manager, Accountant, Cashier.",
  },
  "/admin/users/all": {
    title: "All Users",
    subtitle: "List of all backend team members and store administrators.",
  },
  "/admin/users/add": {
    title: "Invite Admin User",
    subtitle: "Create new employee credentials and define store permissions.",
  },
  "/admin/users/roles": {
    title: "Authorization Roles",
    subtitle: "Review operational tiers and access hierarchy groups.",
  },
  "/admin/users/permissions": {
    title: "Global Permission Matrix",
    subtitle: "Configure modular read/write permissions per role group.",
  },
  "/admin/users/role-management": {
    title: "Role & Group Management",
    subtitle: "Define new custom authorization groups and scopes.",
  },
  "/admin/users/login-activity": {
    title: "Login Activity Log",
    subtitle: "Track login times, browsers, and active sessions.",
  },
  "/admin/loyalty": {
    title: "Dzire Credits Loyalty",
    subtitle: "Configure Rs 1000 spend = 50 credits rule (Max redemption: 10% of cart).",
  },
  "/admin/marketing": {
    title: "Marketing & Campaigns",
    subtitle: "Manage Flat/Percentage coupons, catalog offers, and email/WhatsApp campaigns.",
  },
  "/admin/audit-logs": {
    title: "Audit Logs",
    subtitle: "Security tracking logs for price changes, stock updates, and admin actions.",
  },
  "/admin/audit-logs/all": {
    title: "All Audit Logs",
    subtitle: "Security tracking logs for price changes, stock updates, and admin actions.",
  },
  "/admin/audit-logs/user-activity": {
    title: "User Activity Logs",
    subtitle: "Audits of administrator, manager, and cashier activity logs.",
  },
  "/admin/audit-logs/data-change": {
    title: "Data Change Logs",
    subtitle: "Detailed log of database catalog modifications and parameter values.",
  },
  "/admin/audit-logs/login": {
    title: "Login Logs",
    subtitle: "Monitor success and failure history of admin authentication attempts.",
  },
  "/admin/audit-logs/ip-logs": {
    title: "IP Tracking Logs",
    subtitle: "Track source IP addresses, geolocation data, and route origins.",
  },
  "/admin/audit-logs/actions": {
    title: "Critical Administrative Actions",
    subtitle: "Record of sensitive actions: db exports, permissions updates, and config modifications.",
  },
  "/admin/settings": {
    title: "System Settings",
    subtitle: "Setup GST company info, Razorpay keys, and manual data backups.",
  },
  "/admin/settings/store": {
    title: "Store Settings",
    subtitle: "Manage company metadata, contact information, and address.",
  },
  "/admin/settings/gst": {
    title: "GST & Tax Settings",
    subtitle: "Configure business PAN, GSTIN, and default tax rates.",
  },
  "/admin/settings/payments": {
    title: "Payment Gateway Settings",
    subtitle: "Integrate Razorpay keys, webhook secrets, and checkout modes.",
  },
  "/admin/settings/shipping": {
    title: "Shipping & Fulfillment Settings",
    subtitle: "Configure logistics partnerships, free shipping limits, and shipping rates.",
  },
  "/admin/settings/loyalty": {
    title: "Loyalty Credit Settings",
    subtitle: "Configure spend conversion rates and cash valuation ratios.",
  },
  "/admin/settings/invoices": {
    title: "Invoice Style Templates",
    subtitle: "Pick printable PDF and POS receipt thermal layouts.",
  },
  "/admin/settings/email": {
    title: "Email SMTP Configurations",
    subtitle: "Configure mail gateway SMTP host server URL and credentials.",
  },
  "/admin/settings/sms-whatsapp": {
    title: "SMS & WhatsApp Settings",
    subtitle: "Integrate Twilio API tokens, verified sender phone, and alerts.",
  },
  "/admin/settings/backup": {
    title: "Backup & Restore Vault",
    subtitle: "Download SQL database archives, media assets zip, and recovery tools.",
  },
  "/admin/settings/system": {
    title: "System Parameters",
    subtitle: "Manage maintenance mode status, session timeouts, and limits.",
  },
  "/admin/notifications": {
    title: "Notifications Hub",
    subtitle: "Failed payments, expiring coupons, low stock alerts, and customer notifications.",
  },
  "/admin/bulk-upload": {
    title: "Bulk Operations",
    subtitle: "Import and export Products, Inventory, Vendors, and Loyalty wallets via Excel/CSV.",
  },
  "/admin/bulk-upload/products": {
    title: "Bulk Products Import",
    subtitle: "Import catalog items, descriptions, pricing matrices, and tags.",
  },
  "/admin/bulk-upload/inventory": {
    title: "Bulk Inventory Import",
    subtitle: "Update SKU stock levels and warehousing storage coordinates.",
  },
  "/admin/bulk-upload/customers": {
    title: "Bulk Customers Import",
    subtitle: "Onboard customer registries, phone contact numbers, and loyalty wallets.",
  },
  "/admin/bulk-upload/vendors": {
    title: "Bulk Vendors Import",
    subtitle: "Onboard supplier directories, registered GST numbers, and payment terms.",
  },
  "/admin/bulk-upload/seo": {
    title: "Bulk SEO Import",
    subtitle: "Import search metadata, meta titles, descriptions, and open graph keywords.",
  },
  "/admin/bulk-upload/images": {
    title: "Bulk Image Zip Upload",
    subtitle: "Upload and extract a ZIP package containing product pictures named by SKU codes.",
  },
  "/admin/bulk-upload/background-jobs": {
    title: "Background Processing Jobs",
    subtitle: "Monitor active, completed, and failed data compilation threads.",
  },
  "/admin/bulk-upload/history": {
    title: "Import Audit History Logs",
    subtitle: "Review logs of parsed spreadsheets and download parsing reports.",
  },
  "/admin/seo/dashboard": {
    title: "SEO Dashboard",
    subtitle: "Overview of your site's SEO performance, indexation, crawling status, and search visibility.",
  },
  "/admin/seo/meta": {
    title: "Meta Titles & Descriptions",
    subtitle: "Batch update, analyze, and optimize meta titles and descriptions for all site routes.",
  },
  "/admin/seo/slugs": {
    title: "URL Slugs",
    subtitle: "Ensure clean, optimized, and lowercase slug routes for products, categories, and custom pages.",
  },
  "/admin/seo/canonical": {
    title: "Canonical URLs",
    subtitle: "Manage canonical link tags to establish page authority and prevent duplicate indexation.",
  },
  "/admin/seo/open-graph": {
    title: "Open Graph Management",
    subtitle: "Manage OG and social meta tags, and preview how pages look when shared online.",
  },
  "/admin/seo/schema": {
    title: "Schema Markup Management",
    subtitle: "Inject JSON-LD structured schema data for products, breadcrumbs, and organizations.",
  },
  "/admin/seo/redirects": {
    title: "URL Redirect Manager",
    subtitle: "Manage 301 permanent and 302 temporary redirects to preserve SEO juice.",
  },
  "/admin/seo/sitemap": {
    title: "Sitemap XML Generator",
    subtitle: "Generate, preview, and auto-submit clean Googlebot indexable sitemaps.",
  },
  "/admin/seo/audit": {
    title: "SEO Code Audit",
    subtitle: "Run a site-wide search optimization quality scan for quick code and tagging recommendations.",
  },
  "/admin/seo/search-console": {
    title: "Search Console Integration",
    subtitle: "Review search click stats, verify domain properties, and configure API integrations.",
  },
  "/admin/reports": {
    title: "Reports Central Hub",
    subtitle: "Central intelligence dashboard for sales, inventory, product catalogs, and business margins.",
  },
  "/admin/reports/sales": {
    title: "Sales & Orders Reports",
    subtitle: "Analyze channel sales performance, online vs POS ratios, and growth trends.",
  },
  "/admin/reports/inventory": {
    title: "Inventory Analytics Reports",
    subtitle: "Monitor inventory levels, restock frequency, stock valuations, and shelf velocity.",
  },
  "/admin/reports/products": {
    title: "Product Performance Reports",
    subtitle: "Identify top-selling products, slow-moving items, and dead stock categories.",
  },
  "/admin/reports/customers": {
    title: "Customer Intelligence Reports",
    subtitle: "Analyze customer demographics, average order values, and repeat purchase ratios.",
  },
  "/admin/reports/vendors": {
    title: "Vendor Performance Reports",
    subtitle: "Track supplier response time, return-to-vendor (RTV) logs, and commission payouts.",
  },
  "/admin/reports/profit": {
    title: "Profitability Reports",
    subtitle: "Review operational net margins, cost of goods sold (COGS), and product markups.",
  },
  "/admin/reports/loyalty": {
    title: "Loyalty & Credits Reports",
    subtitle: "Monitor customer reward points, credits issued, and points redemptions.",
  },
  "/admin/reports/financial": {
    title: "Financial Ledger Reports",
    subtitle: "GST liabilities log, platform fees, payouts, and financial settlement summaries.",
  },
  "/admin/reports/export": {
    title: "Export Dataset Console",
    subtitle: "Compile and download raw database spreadsheets in CSV or Excel layouts.",
  },
  "/admin/sales-invoices": {
    title: "Sales Invoices",
    subtitle: "Customer-facing invoices generated for all online and POS transactions.",
  },
  "/admin/gst-invoices": {
    title: "GST Invoices",
    subtitle: "Statutory GST tax invoices with CGST / SGST / IGST breakdown for GSTR filing.",
  },
  "/admin/online-sales": {
    title: "Online Sales",
    subtitle: "All orders placed via online storefront website and mobile app.",
  },
  "/admin/store-pickup-sales": {
    title: "Store Pickup Sales",
    subtitle: "Orders reserved by customers for local click & collect pickup.",
  },
  "/admin/credit-notes": {
    title: "Credit Notes",
    subtitle: "Vouchers issued to customer wallets or accounts for return claims.",
  },
  "/admin/debit-notes": {
    title: "Debit Notes",
    subtitle: "Notes raised for return of purchase inventory to suppliers.",
  },
  "/admin/payment-transactions": {
    title: "Payment Transactions",
    subtitle: "Ledger of transaction attempt status, payments gateway logs and methods.",
  },
  "/admin/sales-returns": {
    title: "Sales Returns",
    subtitle: "Track standard consumer product return requests and credit refunds.",
  },
  "/admin/returns/requests": {
    title: "Return Requests",
    subtitle: "Manage and authorize customer product returns and exchange tickets.",
  },
  "/admin/returns/normal": {
    title: "Normal Returns",
    subtitle: "Standard product returns under buyer standard satisfaction guarantee policies.",
  },
  "/admin/returns/defective": {
    title: "Defective Returns",
    subtitle: "Returns flagged due to damaged, defective, or incorrect items.",
  },
  "/admin/returns/partial": {
    title: "Partial Returns",
    subtitle: "Order returns where only a portion of the original package is sent back.",
  },
  "/admin/returns/refund-options": {
    title: "Refund Options",
    subtitle: "Configure bank gateway reversals and store credit loyalty wallets.",
  },
  "/admin/returns/history": {
    title: "Return History Log",
    subtitle: "Archived and completed return cases registry.",
  },
  "/admin/returns/analytics": {
    title: "Return Analytics Dashboard",
    subtitle: "Insights into top return categories, defect rates, and intake trends.",
  },
  "/admin/returns/credit-reversal": {
    title: "Credit Reversal Registry",
    subtitle: "Audit log of reversed loyalty credits for returned packages.",
  },
  "/admin/accounting/gst-reports": {
    title: "GST Reports",
    subtitle: "Monthly GST outward/inward tax summary and filing history.",
  },
  "/admin/accounting/sales-register": {
    title: "Sales Register Ledger",
    subtitle: "Daily chronological sales invoices registry totals.",
  },
  "/admin/accounting/purchase-register": {
    title: "Purchase Register Ledger",
    subtitle: "Daily inward trade purchase invoices registry.",
  },
  "/admin/accounting/hsn-summary": {
    title: "HSN Summary Report",
    subtitle: "Harmonized System of Nomenclature wise tax distribution breakdown.",
  },
  "/admin/accounting/credit-notes": {
    title: "Credit Notes Registry",
    subtitle: "Financial audit ledger of issued customer credit adjustments.",
  },
  "/admin/accounting/debit-notes": {
    title: "Debit Notes Registry",
    subtitle: "Financial audit ledger of raised supplier debit adjustments.",
  },
  "/admin/accounting/profit-loss": {
    title: "Profit & Loss Statement",
    subtitle: "Calculated operational gross income and net profit summaries.",
  },
  "/admin/notifications/system-alerts": {
    title: "System Alerts Dashboard",
    subtitle: "Real-time active system warnings, database locks and API latency logs.",
  },
  "/admin/notifications/low-stock": {
    title: "Low Stock Alert Queue",
    subtitle: "Catalog items whose remaining inventory is below standard safety margin.",
  },
  "/admin/notifications/out-of-stock": {
    title: "Out of Stock Stockouts",
    subtitle: "Items with exactly zero quantity left, backlogs and notify counters.",
  },
  "/admin/notifications/pending-returns": {
    title: "Pending Returns Queue",
    subtitle: "Customer packages received by warehouse waiting for verification.",
  },
  "/admin/notifications/failed-payments": {
    title: "Failed PG Checkout Logs",
    subtitle: "Razorpay/POS transaction drop-offs, authentication failures and timeouts.",
  },
  "/admin/notifications/expiring-coupons": {
    title: "Expiring Coupon Rules",
    subtitle: "Marketing discount codes approaching validity dates or usage caps.",
  },
  "/admin/notifications/expiring-credits": {
    title: "Expiring Credits Ledger",
    subtitle: "List of loyalty point credit balances scheduled to lapse within 30 days.",
  },
  "/admin/notifications/back-in-stock": {
    title: "Restock Notification Logs",
    subtitle: "Dispatched automated emails sent to notify waiting customers.",
  },
  "/admin/notifications/notify-me": {
    title: "Notify-Me Queue",
    subtitle: "Customer requests queue waiting for products to restock.",
  },
  "/admin/activity-feed/all": {
    title: "All Activities Feed",
    subtitle: "Chronological security and operations event log registry.",
  },
  "/admin/activity-feed/products": {
    title: "Product Changes Log",
    subtitle: "Track catalog price updates, text modifications and visibility rules.",
  },
  "/admin/activity-feed/inventory": {
    title: "Inventory Changes Log",
    subtitle: "Track physical stock adjustments, manual overrides and warehouse arrivals.",
  },
  "/admin/activity-feed/orders": {
    title: "Order Activities Log",
    subtitle: "Track new checkouts, PG callbacks, packaging statuses and delivery updates.",
  },
  "/admin/activity-feed/returns": {
    title: "Return Activities Log",
    subtitle: "Track return requests verification status, inspections and refunds payouts.",
  },
  "/admin/activity-feed/other": {
    title: "Other Activities Log",
    subtitle: "Track loyalty credit adjustments, marketing rules changes and general audits.",
  },
  "/admin/activity-feed/users": {
    title: "User Activities Log",
    subtitle: "Track employee authorization level modifications, invitations and login logs.",
  },
  "/admin/activity-feed/filter-search": {
    title: "Advanced Activity Search",
    subtitle: "Query the security audit ledger by user roles, actors and time intervals.",
  },
};

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const navRef = useRef(null);

  const searchParams = new URLSearchParams(location.search);
  const activeMenuParam = searchParams.get("menu");
  const activeSubParam = searchParams.get("sub");

  const [openMenus, setOpenMenus] = useState(() => {
    const initial = {};
    if (activeMenuParam) {
      initial[activeMenuParam] = true;
    }
    return initial;
  });

  // Automatically open the menu of the active route when activeMenuParam changes
  useEffect(() => {
    if (activeMenuParam) {
      setOpenMenus(prev => ({ ...prev, [activeMenuParam]: true }));
    }
  }, [activeMenuParam]);

  // Restore sidebar scroll position after every navigation
  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = _sidebarScrollTop;
    }
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout("admin");
      navigate("/admin/login");
    }
  };

  const toggleMenu = (label, e) => {
    e.preventDefault();
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const activePage = pageCopy[location.pathname] || pageCopy["/admin/dashboard"];

  const sidebar = (
    <aside className="admin-sidebar">
      <style>{`
        .admin-nav::-webkit-scrollbar {
          width: 4px;
        }
        .admin-nav::-webkit-scrollbar-track {
          background: transparent;
        }
        .admin-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
        }
        .admin-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 40px;
          padding: 8px 12px;
          border-radius: 8px;
          color: #b3b3b3 !important;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .admin-nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ff6600 !important;
        }
        .admin-nav-link:hover .sidebar-chevron {
          color: inherit;
        }
        .admin-nav-link.active {
          background: #ff6600 !important;
          color: #ffffff !important;
          font-weight: 600;
        }
        .admin-nav-link.active:hover {
          color: #ffffff !important;
        }
        .admin-nav-link-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sidebar-chevron {
          color: #888888;
          transition: transform 0.15s ease;
        }
        .admin-nav-link.active .sidebar-chevron {
          color: #ffffff;
        }
        .admin-sub-items {
          margin-left: 24px;
          border-left: 1px solid #2d2d2d;
          padding-left: 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 3px;
        }
        .admin-sub-link {
          font-size: 12px;
          font-weight: 500;
          color: #888888 !important;
          text-decoration: none;
          padding: 5px 8px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .admin-sub-link:hover, .admin-sub-link.active {
          color: #ff6600 !important;
          background-color: rgba(255, 102, 0, 0.05);
        }
      `}</style>

      <div className="admin-brand" style={{ background: '#151515', borderBottom: '1px solid #222222', padding: '8px 8px 18px 8px' }}>
        <a href="/admin/dashboard" style={{ display: 'block' }}>
          <img src={logo} alt="Dzire" className="admin-brand-logo" style={{ maxWidth: '180px' }} />
        </a>
      </div>

      <nav
        ref={navRef}
        className="admin-nav"
        style={{ overflowY: 'auto', flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '3px' }}
        onScroll={(e) => { _sidebarScrollTop = e.currentTarget.scrollTop; }}
      >
        {navigationItems.map((item) => {
          const hasSub = !!item.subItems;
          const isOpen = !!openMenus[item.label];
          const isItemActive = activeMenuParam
            ? (item.label === activeMenuParam)
            : (location.pathname === item.to && item.label !== "Dashboard");

          return (
            <div key={item.label}>
              {hasSub ? (
                <div
                  className={`admin-nav-link ${isItemActive ? "active" : ""}`}
                  onClick={(e) => toggleMenu(item.label, e)}
                >
                  <div className="admin-nav-link-left">
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown size={13} className="sidebar-chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                </div>
              ) : (
                <Link
                  to={`${item.to}?menu=${encodeURIComponent(item.label)}`}
                  onClick={() => setMobileOpen(false)}
                  className={`admin-nav-link ${isItemActive ? "active" : ""}`}
                >
                  <div className="admin-nav-link-left">
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )}
              {hasSub && isOpen && (
                <div className="admin-sub-items">
                  {item.subItems.map((sub) => {
                    const isSubActive = activeSubParam
                      ? (sub.label === activeSubParam && item.label === activeMenuParam)
                      : (location.pathname === sub.to && (
                          location.pathname === "/admin/dashboard"
                            ? sub.label === "Business KPI Overview"
                            : item.subItems.find(s => s.to === sub.to)?.label === sub.label
                        ));
                    return (
                      <Link
                        key={sub.label}
                        to={`${sub.to}?menu=${encodeURIComponent(item.label)}&sub=${encodeURIComponent(sub.label)}`}
                        onClick={() => setMobileOpen(false)}
                        className={`admin-sub-link ${isSubActive ? "active" : ""}`}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', border: '1px solid #222222', borderRadius: '8px', background: '#1c1c1c', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div className="admin-profile-avatar" style={{ background: '#ff6600', color: '#ffffff', width: '32px', height: '32px', display: 'grid', placeItems: 'center', borderRadius: '50%', fontWeight: '700', fontSize: '13px' }}>A</div>
          <div className="admin-profile-info" style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '12.5px', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin User</p>
            <span style={{ fontSize: '10.5px', color: '#888888', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@dzire.in</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{ background: 'none', border: 'none', color: '#f04438', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'background 0.2s', display: 'grid', placeItems: 'center' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#2c1e1e'}
          onMouseOut={(e) => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-shell">
      {mobileOpen ? <button className="admin-overlay" type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" /> : null}

      <div className={`admin-mobile-panel ${mobileOpen ? "open" : ""}`} style={{ background: '#151515' }}>
        <button className="admin-close" type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" style={{ background: '#1c1c1c', color: '#ffffff', border: '1px solid #22' }}>
          <X size={20} />
        </button>
        {sidebar}
      </div>

      <div className="admin-desktop-sidebar" style={{ background: '#151515', borderRight: '1px solid #1c1c1c' }}>{sidebar}</div>

      <div className="admin-main" style={{ height: '100vh', overflowY: 'auto', background: '#f8fafc' }}>
        <header className="admin-topbar" style={{ background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid #eef2f6' }}>
          <button className="admin-menu-button" type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h1 className="admin-page-title" style={{ fontSize: '18px', fontWeight: '800', color: '#111111' }}>{activePage.title}</h1>
            <span className="admin-page-subtitle" style={{ fontSize: '12px', color: '#666666' }}>{activePage.subtitle}</span>
          </div>
          <span className="admin-mode-pill">No backend</span>
        </header>

        <main className="admin-content" style={{ padding: '24px', background: '#f8fafc' }}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
