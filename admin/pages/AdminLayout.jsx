import { useState, useRef, useLayoutEffect } from "react";
import {
  BarChart3,
  BellRing,
  Boxes,
  CreditCard,
  LayoutDashboard,
  Menu,
  PackageSearch,
  ShoppingBag,
  Users2,
  X,
  Undo2,
  Store,
  Truck,
  FileText,
  FileDown,
  ArrowRightLeft,
  Terminal,
  TrendingUp,
  Receipt,
  LineChart,
  TicketPercent,
  Tag,
  UploadCloud,
  ScanBarcode,
  LogOut,
  Gift,
  History,
  Settings,
  Bell,
  ShieldCheck
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";
import { useAuth } from "../AdminShims";
import "./AdminDashboard.css";
import "../AdminCommon.css";

const navigationSections = [
  {
    title: "Operations",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        to: "/admin/inventory",
        label: "Inventory",
        icon: Boxes,
        subItems: [
          { to: "/admin/inventory", label: "Inventory Dashboard" },
          { to: "/admin/attributes", label: "Attribute Names" },
          { to: "/admin/products/add", label: "Add Product" }
        ]
      },
      {
        to: "/admin/vendors",
        label: "Vendor Management",
        icon: Store,
        subItems: [
          { to: "/admin/vendors", label: "Vendor Dashboard" }
        ]
      },
      {
        to: "/admin/pos/sales-invoice",
        label: "POS",
        icon: Terminal,
        subItems: [
          { to: "/admin/pos/sales-invoice", label: "Sales Invoice" },
          { to: "/admin/quotation", label: "Quotation" },
          { to: "/admin/credit-note", label: "Credit Note" },
          { to: "/admin/payment-in", label: "Payment In" }
        ]
      },
      {
        to: "/admin/customers",
        label: "Customer",
        icon: Users2,
        subItems: [
          { to: "/admin/customers", label: "Customer" },
          { to: "/admin/dzire-credits", label: "Dzire Credit" }
        ]
      },
      {
        to: "/admin/purchase/invoices",
        label: "Purchase",
        icon: ShoppingBag,
        subItems: [
          { to: "/admin/purchase/invoices", label: "Purchase Invoices" },
          { to: "/admin/purchase-return", label: "Purchase Return" },
          { to: "/admin/payment-out", label: "Payment Out" },
          { to: "/admin/debit-note", label: "Debit Note" },
          { to: "/admin/purchase-orders", label: "Purchase Order" }
        ]
      },
      {
        to: "/admin/instore-return",
        label: "Returns Management",
        icon: Undo2,
        subItems: [
          { to: "/admin/instore-return", label: "Instore Return" },
          { to: "/admin/returns/list", label: "Inventory Returns" },
          { to: "/admin/returns/defective", label: "Defective & Normal" }
        ]
      }
    ]
  },
  {
    title: "Marketing",
    items: [
      { to: "/admin/coupons", label: "Coupons", icon: TicketPercent },
      { to: "/admin/offers", label: "Offers", icon: Tag }
    ]
  },
  {
    title: "Management & CRM",
    items: [
      {
        to: "/admin/orders",
        label: "Website Management",
        icon: PackageSearch,
        subItems: [
          { to: "/admin/orders", label: "Orders" },
          { to: "/admin/categories", label: "Categories Catalog" },
          { to: "/admin/homepage-sections", label: "Section Headings" },
          { to: "/admin/banners", label: "Banners & Images" },
          { to: "/admin/rentals", label: "Rentals" },
          { to: "/admin/users", label: "User" },
          { to: "/admin/blogs", label: "Blogs" },
          { to: "/admin/events", label: "Events" }
        ]
      },
      /*
      {
        to: "/admin/customer-management",
        label: "Customer Management",
        icon: Users2,
        subItems: [
          { to: "/admin/customers/dashboard", label: "Dashboard" },
          { to: "/admin/customers/mapped", label: "Mapped Users" },
          { to: "/admin/customers/all", label: "All Users" }
        ]
      },
      */
      { to: "/admin/staff", label: "Staff Management", icon: Users2 },
      { to: "/admin/roles-permissions", label: "Roles & Permissions", icon: ShieldCheck },
      { to: "/admin/payments", label: "Payment", icon: CreditCard },
      {
        to: "/admin/reports/gst",
        label: "Reports",
        icon: FileText,
        subItems: [
          { to: "/admin/reports/gst", label: "GST" },
          { to: "/admin/reports/profit", label: "Profit" }
        ]
      }
    ]
  }
];

const pageCopy = {
  "/admin/roles-permissions": {
    title: "Roles & Permissions",
    subtitle: "Create roles and control what your team can access and do.",
  },
  "/admin/staff": {
    title: "Staff Management",
    subtitle: "Manage your store team, attendance, roles and salaries.",
  },
  "/admin/dashboard": {
    title: "Dashboard",
    subtitle: "Real-time insights into your sales, inventory, and customer activity.",
  },
  "/admin/products": {
    title: "Products & Catalog",
    subtitle: "Manage product descriptions, SKU pricing, and restrict purchase quantities.",
  },
  "/admin/products/add": {
    title: "Add New Product",
    subtitle: "Add product to your inventory. Fill in the basic information to get started.",
  },
  "/admin/website": {
    title: "Website Management",
    subtitle: "Central hub for managing website catalog, marketing, and users.",
  },
  "/admin/categories": {
    title: "Categories Catalog",
    subtitle: "Manage product and outdoor category taxonomy, tags, and thumbnails.",
  },
  "/admin/homepage-sections": {
    title: "Homepage Section Headings",
    subtitle: "Customize headings, cards, and text for Outdoor Collection, Budget, Experiences, and Guides.",
  },
  "/admin/banners": {
    title: "Banners & Page Images",
    subtitle: "Manage banner images, overlay text, and headers across Events, Rentals, Blogs, and Homepage.",
  },
  "/admin/rentals": {
    title: "Rentals Catalog Management",
    subtitle: "Manage gear rental items, daily rates, deposit amounts, and stock availability.",
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
    title: "User Management",
    subtitle: "Manage registered user accounts, customer profiles, staff roles and permissions.",
  },
  "/admin/blogs": {
    title: "Blog & Content Management",
    subtitle: "Create, edit, and publish engaging outdoor articles, trekking guides, and reviews.",
  },
  "/admin/events": {
    title: "Events & Treks Management",
    subtitle: "Schedule workshops, outdoor treks, campsite training, and manage attendees.",
  },
  "/admin/loyalty": {
    title: "Dzire Credits Loyalty",
    subtitle: "Configure Rs 1000 spend = 50 credits rule (Max redemption: 10% of cart).",
  },
  "/admin/marketing": {
    title: "Marketing & Campaigns",
    subtitle: "Manage Flat/Percentage coupons, catalog offers, and email/WhatsApp campaigns.",
  },
  "/admin/offers": {
    title: "Offers",
    subtitle: "Manage sitewide, bundle and category-specific discounts.",
  },
  "/admin/coupons": {
    title: "Coupons",
    subtitle: "Create and manage coupon codes for your online and physical stores.",
  },

  "/admin/audit-logs": {
    title: "Audit Logs",
    subtitle: "Security tracking logs for price changes, stock updates, and admin actions.",
  },
  "/admin/settings": {
    title: "System Settings",
    subtitle: "Setup GST company info, Razorpay keys, and manual data backups.",
  },
  "/admin/notifications": {
    title: "Notifications Hub",
    subtitle: "Failed payments, expiring coupons, low stock alerts, and customer notifications.",
  },
  "/admin/bulk-upload": {
    title: "Bulk Operations",
    subtitle: "Import and export Products, Inventory, Vendors, and Loyalty wallets via Excel/CSV.",
  },
  "/admin/inventory": {
    title: "Inventory",
    subtitle: "Inventory / Stock Overview",
  },
  "/admin/attributes": {
    title: "Product Attribute Names",
    subtitle: "Manage attribute names, option choices, and variation presets.",
  },
  "/admin/vendors": {
    title: "Vendor Management",
    subtitle: "Central hub for managing all vendors.",
  },
  "/admin/pos": {
    title: "POS Management",
    subtitle: "Real-time point of sale transactions, billing, and invoices data sheet.",
  },
  "/admin/pos/sales-invoice": {
    title: "Sales Invoice",
    subtitle: "Real-time point of sale transactions, billing, and invoices data sheet.",
  },
  "/admin/pos/create-sales-invoice": {
    title: "Create Sales Invoice",
    subtitle: "Point of sale billing, terminal, and invoice generation.",
  },
  "/admin/customers": {
    title: "Customers",
    subtitle: "Manage your customers, view purchase history, credits and more.",
  },
  "/admin/dzire-credits": {
    title: "Dzire Credits",
    subtitle: "Manage customer loyalty credits, track usage and create manual adjustments.",
  },
  "/admin/quotation": {
    title: "Quotation Management",
    subtitle: "View customer quotations, validity dates, status, and estimates.",
  },
  "/admin/quotation/create": {
    title: "Create Quotation",
    subtitle: "Generate new estimate/quotation for customers.",
  },
  "/admin/credit-note": {
    title: "Credit Note Management",
    subtitle: "View and manage issued credit notes, customer adjustments, and balances.",
  },
  "/admin/credit-note/create": {
    title: "Create Credit Note",
    subtitle: "Issue a new credit note for return or adjustment.",
  },
  "/admin/purchase": {
    title: "Purchase Management",
    subtitle: "Central hub for managing purchases and invoices.",
  },
  "/admin/reports/sales": {
    title: "Sales Reports",
    subtitle: "Daily, monthly, yearly sales trends",
  },
  "/admin/reports/gst": {
    title: "GST Reports",
    subtitle: "GST filing data, turnover, and Input Tax Credit (ITC) summaries",
  },
  "/admin/reports/profit": {
    title: "Profitability Reports",
    subtitle: "Channel-wise margins, operating costs, and revenue",
  },
  "/admin/reports": {
    title: "All Reports",
    subtitle: "Central hub for all business intelligence reports",
  },
  "/admin/returns": {
    title: "Returns Management",
    subtitle: "Central hub for managing all returns.",
  },
  "/admin/instore-return": {
    title: "Instore Return",
    subtitle: "Manage in-store customer product returns and refunds.",
  },
  "/admin/purchase-return": {
    title: "Purchase Returns",
    subtitle: "Manage vendor purchase returns, credit settlements, and excel records.",
  },
  "/admin/purchase-return/add": {
    title: "Create Purchase Return",
    subtitle: "Generate vendor purchase return and adjustment.",
  },
  "/admin/purchase-return/create": {
    title: "Create Purchase Return",
    subtitle: "Generate vendor purchase return and adjustment.",
  },
  "/admin/purchase/invoices": {
    title: "Purchase Invoices",
    subtitle: "Manage vendor purchase invoices and payments.",
  },
  "/admin/purchase-invoices": {
    title: "Purchase Invoices",
    subtitle: "Manage vendor purchase invoices and payments.",
  },
  "/admin/purchase-orders": {
    title: "Purchase Orders",
    subtitle: "Manage supplier purchase orders and status.",
  },
  "/admin/payment-out": {
    title: "Payment Out",
    subtitle: "Record outgoing vendor and supplier payments.",
  },
  "/admin/debit-note": {
    title: "Debit Note",
    subtitle: "View and manage vendor debit adjustments.",
  },
  "/admin/staff-management": {
    title: "Staff Management",
    subtitle: "Manage staff permissions, roles, and profiles.",
  },
  "/admin/returns/list": {
    title: "Inventory Returns",
    subtitle: "Manage inventory return requests and claims.",
  },
  "/admin/returns/inventory": {
    title: "Inventory Returns",
    subtitle: "Manage inventory return requests",
  },
  "/admin/returns/defective": {
    title: "Defective & Normal Returns",
    subtitle: "Manage defective and normal return requests",
  }
};

let globalSidebarScroll = 0;

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const navRef = useRef(null);

  useLayoutEffect(() => {
    const saved = sessionStorage.getItem('admin_sidebar_scroll');
    const targetPos = saved !== null ? parseInt(saved, 10) : globalSidebarScroll;
    if (navRef.current) {
      navRef.current.scrollTop = targetPos;
    }
  }, [location.pathname]);

  const handleNavScroll = (e) => {
    const top = e.currentTarget.scrollTop;
    globalSidebarScroll = top;
    sessionStorage.setItem('admin_sidebar_scroll', String(top));
  };

  const saveCurrentScroll = () => {
    if (navRef.current) {
      globalSidebarScroll = navRef.current.scrollTop;
      sessionStorage.setItem('admin_sidebar_scroll', String(navRef.current.scrollTop));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout("admin");
      navigate("/admin/login");
    }
  };

  const activePage = pageCopy[location.pathname] || (
    location.pathname.startsWith("/admin/staff/")
      ? {
        title: "Staff Profile",
        subtitle: "View and edit staff details, attendance, salary structure and permissions."
      }
      : pageCopy["/admin/dashboard"] || {
        title: "Admin Panel",
        subtitle: "Real-time insights and management."
      }
  );

  const sidebar = (
    <aside className="admin-sidebar">
      <style>{`
        .admin-nav-group {
          margin-bottom: 14px;
        }
        .admin-nav-group-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #94a3b8;
          padding: 0 12px;
          margin: 10px 0 6px;
        }
        .admin-sub-items {
          margin-left: 28px;
          border-left: 1.5px solid #edf2f7;
          padding-left: 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 3px;
        }
        .admin-sub-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
          text-decoration: none;
          padding: 5px 8px;
          border-radius: 8px;
          transition: all 0.15s ease;
        }
        .admin-sub-link:hover, .admin-sub-link.active {
          color: #ff6600;
          background-color: #fff7f1;
        }
      `}</style>

      <div className="admin-brand">
        <a href="/admin/dashboard" onClick={saveCurrentScroll}>
          <img src={logo} alt="Dzire" className="admin-brand-logo" />
        </a>
      </div>

      <nav
        ref={navRef}
        onScroll={handleNavScroll}
        className="admin-nav"
        style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}
      >
        {navigationSections.map((section) => (
          <div key={section.title} className="admin-nav-group">
            <h4 className="admin-nav-group-title">{section.title}</h4>
            <div style={{ display: 'grid', gap: '3px' }}>
              {section.items.map((item) => (
                <div key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => {
                      saveCurrentScroll();
                      if (!item.subItems) setMobileOpen(false);
                    }}
                    className={({ isActive }) => {
                      const isSubItemActive = item.subItems?.some(sub => location.pathname === sub.to);
                      return `admin-nav-link ${isActive || isSubItemActive ? "active" : ""}`;
                    }}
                    style={{
                      paddingLeft: !item.icon ? '42px' : '12px'
                    }}
                  >
                    {item.icon && <item.icon size={18} />}
                    <span>{item.label}</span>
                  </NavLink>
                  {item.subItems && (
                    <div className="admin-sub-items">
                      {item.subItems.map((sub) => (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          onClick={() => {
                            saveCurrentScroll();
                            setMobileOpen(false);
                          }}
                          className={({ isActive }) => `admin-sub-link ${isActive ? "active" : ""}`}
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderTop: '1px solid #edf2fa', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="admin-profile-avatar">A</div>
          <div className="admin-profile-info" style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin User</p>
            <span style={{ fontSize: '11px', color: '#667085', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@dzire.in</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{ background: 'none', border: 'none', color: '#f04438', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#fef3f2'}
          onMouseOut={(e) => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-shell">
      {mobileOpen ? <button className="admin-overlay" type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" /> : null}

      <div className={`admin-mobile-panel ${mobileOpen ? "open" : ""}`}>
        <button className="admin-close" type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
        {sidebar}
      </div>

      <div className="admin-desktop-sidebar">{sidebar}</div>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-button" type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h1 className="admin-page-title">{activePage.title}</h1>
            <span className="admin-page-subtitle">{activePage.subtitle}</span>
          </div>
          <span className="admin-mode-pill">No backend</span>
        </header>

        <main style={{ flex: 1, width: '100%', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
