import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  Undo2,
  Boxes,
  FolderOpen,
  Tag,
  Sliders,
  Bookmark,
  Package2,
  Archive,
  ShoppingCart,
  ClipboardCheck,
  ScanBarcode,
  Users2,
  Gift,
  Truck,
  Terminal,
  TicketPercent,
  FileText,
  Search,
  BarChart3,
  Calculator,
  Bell,
  Activity,
  UploadCloud,
  Shield,
  History,
  Settings
} from "lucide-react";

export const moduleCards = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    colorClass: "icon-orange",
    to: "/admin/dashboard",
    items: [
      "Business KPI Overview",
      "Sales Overview",
      "Orders Overview",
      "Inventory Alerts",
      "Low Stock Alerts",
      "Top Selling Products",
      "Dzire Credits Summary",
      "Recent Orders",
      "Today's Summary"
    ]
  },
  {
    title: "Sales",
    icon: TrendingUp,
    colorClass: "icon-orange",
    to: "/admin/online-sales",
    items: [
      "Online Sales",
      "Offline Sales (POS)",
      "Store Pickup Sales",
      "Sales Invoices",
      "GST Invoices",
      "Credit Notes",
      "Debit Notes",
      "Payment Transactions",
      "Sales Returns",
      "Sales Reports"
    ]
  },
  {
    title: "Orders",
    icon: ShoppingBag,
    colorClass: "icon-orange",
    to: "/admin/orders",
    items: [
      "All Orders",
      "Order Details",
      "Order Timeline",
      "Order Status Update",
      "Shipment Tracking",
      "Store Pickup Orders",
      "Invoice Download",
      "Order Notes",
      "Bulk Actions",
      "Order Export"
    ]
  },
  {
    title: "Returns",
    icon: Undo2,
    colorClass: "icon-orange",
    to: "/admin/returns/requests",
    items: [
      "Return Requests",
      "Approve / Reject Returns",
      "Normal Returns",
      "Defective Returns",
      "Partial Returns",
      "Refund Options",
      "Return History",
      "Return Analytics",
      "Credit Reversal"
    ]
  },
  {
    title: "Products",
    icon: Boxes,
    colorClass: "icon-orange",
    to: "/admin/products",
    items: [
      "All Products",
      "Add / Edit Product",
      "Product Variants",
      "Product Specifications",
      "Product Images & Videos",
      "Pricing Management",
      "SEO Management",
      "Dzire Credits Eligibility",
      "Purchase Restrictions",
      "Product Status (Draft/Active/Archived)",
      "Bulk Actions"
    ]
  },
  {
    title: "Categories",
    icon: FolderOpen,
    colorClass: "icon-orange",
    to: "/admin/categories",
    items: [
      "All Categories",
      "Add / Edit Category",
      "Parent Categories",
      "Sub Categories",
      "Category Image",
      "Category Description",
      "Category SEO",
      "Display Settings",
      "Bulk Actions"
    ]
  },
  {
    title: "Brands",
    icon: Tag,
    colorClass: "icon-orange",
    to: "/admin/brands",
    items: [
      "All Brands",
      "Add / Edit Brand",
      "Brand Logo",
      "Brand Description",
      "Brand SEO",
      "Brand Products",
      "Display Settings",
      "Bulk Actions"
    ]
  },
  {
    title: "Attributes",
    icon: Sliders,
    colorClass: "icon-orange",
    to: "/admin/products",
    items: [
      "All Attributes",
      "Add / Edit Attribute",
      "Attribute Type (Text, Color, Size etc.)",
      "Attribute Values",
      "Attribute Group",
      "Display Order",
      "Bulk Actions"
    ]
  },
  {
    title: "Collections",
    icon: Bookmark,
    colorClass: "icon-orange",
    to: "/admin/collections",
    items: [
      "All Collections",
      "Add / Edit Collection",
      "Collection Products",
      "Collection Banners",
      "Display Settings",
      "Priority & Sorting",
      "Scheduling",
      "Bulk Actions"
    ]
  },
  {
    title: "Bundles",
    icon: Package2,
    colorClass: "icon-orange",
    to: "/admin/products",
    items: [
      "All Bundles",
      "Add / Edit Bundle",
      "Bundle Products",
      "Bundle Pricing",
      "Bundle Images",
      "Bundle Status",
      "Bulk Actions"
    ]
  },
  {
    title: "Inventory",
    icon: Archive,
    colorClass: "icon-orange",
    to: "/admin/inventory",
    items: [
      "Stock Overview",
      "Sellable Stock",
      "Reserved Stock",
      "Defective Stock",
      "Incoming Stock",
      "Stock Inward",
      "Stock Adjustment",
      "Stock Transfer",
      "Stock History",
      "Stock Expiry (if applicable)",
      "Inventory Report"
    ]
  },
  {
    title: "Purchases",
    icon: ShoppingCart,
    colorClass: "icon-orange",
    to: "/admin/purchase-orders",
    items: [
      "Purchase Orders",
      "Add Purchase Order",
      "PO Status Tracking",
      "Goods Received Notes (GRN)",
      "Purchase Invoices",
      "Debit Notes",
      "Credit Notes",
      "Vendor Notes",
      "Purchase Analytics",
      "Cost Price History"
    ]
  },
  {
    title: "Stock Audit",
    icon: ClipboardCheck,
    colorClass: "icon-orange",
    to: "/admin/inventory",
    items: [
      "Create Stock Audit",
      "Audit Planning",
      "Physical Count Entry",
      "Audit Comparison",
      "Variance Report",
      "Approve / Reject Audit",
      "Audit History",
      "Audit Report"
    ]
  },
  {
    title: "Barcode Management",
    icon: ScanBarcode,
    colorClass: "icon-blue",
    to: "/admin/barcode",
    items: [
      "Generate Barcode",
      "Print Barcode",
      "Barcode List",
      "Bulk Barcode Generation",
      "Scan History",
      "Barcode Settings",
      "POS Integration"
    ]
  },
  {
    title: "Customers",
    icon: Users2,
    colorClass: "icon-blue",
    to: "/admin/audiences",
    items: [
      "All Customers",
      "Customer Profile",
      "Order History",
      "Return History",
      "Wishlist",
      "Saved Addresses",
      "Customer Segments",
      "Customer Notes",
      "Customer Export"
    ]
  },
  {
    title: "Dzire Credits",
    icon: Gift,
    colorClass: "icon-blue",
    to: "/admin/loyalty",
    items: [
      "Credits Overview",
      "Credit Ledger",
      "Earned Credits",
      "Redeemed Credits",
      "Reversed Credits",
      "Manual Credit Adjustment",
      "Credit Rules",
      "Credit Promotions",
      "Credit Reports",
      "Credit Expiry Management"
    ]
  },
  {
    title: "Vendors",
    icon: Truck,
    colorClass: "icon-blue",
    to: "/admin/vendors",
    items: [
      "All Vendors",
      "Vendor Profile",
      "GST Details",
      "Contact Details",
      "Vendor Documents",
      "Product Mapping",
      "Cost Price Management",
      "Vendor Performance",
      "Purchase History",
      "Vendor Analytics"
    ]
  },
  {
    title: "POS Billing",
    icon: Terminal,
    colorClass: "icon-blue",
    to: "/admin/pos",
    items: [
      "POS Dashboard",
      "New Bill (POS)",
      "Barcode Scan",
      "Product Search",
      "Cart Management",
      "Apply Coupon",
      "Apply Dzire Credits",
      "Payment (Cash/UPI/Card)",
      "Split Payments",
      "POS Returns",
      "POS Exchange",
      "Sales History"
    ]
  },
  {
    title: "Marketing",
    icon: TicketPercent,
    colorClass: "icon-blue",
    to: "/admin/marketing",
    items: [
      "Coupons",
      "Add Coupon",
      "Coupon List",
      "Offers",
      "Add Offer",
      "Offer List",
      "Campaigns",
      "Email Campaigns",
      "WhatsApp Campaigns",
      "Campaign Reports"
    ]
  },
  {
    title: "Content",
    icon: FileText,
    colorClass: "icon-blue",
    to: "/admin/homepage-builder",
    items: [
      "Homepage Builder",
      "Manage Sections",
      "Banners",
      "Brands",
      "Collections",
      "Featured Products",
      "Pages",
      "All Pages",
      "Blog Management",
      "Media Library",
      "Menu Navigation"
    ]
  },
  {
    title: "SEO",
    icon: Search,
    colorClass: "icon-blue",
    to: "/admin/seo/dashboard",
    items: [
      "SEO Dashboard",
      "Meta Titles & Descriptions",
      "URL Slugs",
      "Canonical URLs",
      "Open Graph Management",
      "Schema Management",
      "Redirect Manager",
      "Sitemap Generator",
      "SEO Audit",
      "Search Console Integration"
    ]
  },
  {
    title: "Reports",
    icon: BarChart3,
    colorClass: "icon-blue",
    to: "/admin/reports",
    items: [
      "Sales Reports",
      "Inventory Reports",
      "Product Reports",
      "Customer Reports",
      "Vendor Reports",
      "Loyalty Reports",
      "Financial Reports",
      "Export Reports"
    ]
  },
  {
    title: "Accounting",
    icon: Calculator,
    colorClass: "icon-blue",
    to: "/admin/accounting/gst-reports",
    items: [
      "GST Reports",
      "Sales Register",
      "Purchase Register",
      "HSN Summary",
      "Credit Notes List",
      "Debit Notes List",
      "Profit & Loss Report",
      "Export Reports"
    ]
  },
  {
    title: "Notifications",
    icon: Bell,
    colorClass: "icon-blue",
    to: "/admin/notifications/system-alerts",
    items: [
      "System Alerts",
      "Low Stock Alerts",
      "Out of Stock Alerts",
      "Pending Returns Alerts",
      "Failed Payment Alerts",
      "Expiring Coupons",
      "Expiring Credits",
      "Back-in-Stock Alerts",
      "Notify-Me Requests"
    ]
  },
  {
    title: "Global Activity Feed",
    icon: Activity,
    colorClass: "icon-blue",
    to: "/admin/activity-feed/all",
    items: [
      "All Activities",
      "Product Changes",
      "Inventory Changes",
      "Order Activities",
      "Return Activities",
      "Other Activities",
      "User Activities",
      "Filter & Search"
    ]
  },
  {
    title: "Bulk Operations (Excel & CSV Support)",
    icon: UploadCloud,
    colorClass: "icon-green",
    to: "/admin/bulk-upload/products",
    items: [
      "Product Import / Export",
      "Inventory Import / Export",
      "Customer Import / Export",
      "Redirect Import / Export",
      "Dzire Credits Import / Export",
      "SEO Import (Meta Data)",
      "Bulk Image Upload (ZIP)",
      "Background Job Processing",
      "Import History & Reports"
    ]
  },
  {
    title: "Users & Roles",
    icon: Shield,
    colorClass: "icon-green",
    to: "/admin/users/all",
    items: [
      "All Users",
      "Add User",
      "User Roles",
      "Permissions",
      "Role Management",
      "Login Activity"
    ]
  },
  {
    title: "Audit Logs",
    icon: History,
    colorClass: "icon-green",
    to: "/admin/audit-logs/all",
    items: [
      "All Logs",
      "User Activity Logs",
      "Data Change Logs",
      "Login Logs",
      "IP Logs",
      "Action Logs"
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    colorClass: "icon-green",
    to: "/admin/settings/store",
    items: [
      "Store Settings",
      "GST Settings",
      "Payment Settings",
      "Shipping Settings",
      "Loyalty Settings",
      "Invoice Templates",
      "Email Settings",
      "SMS / WhatsApp Settings",
      "Backup & Recovery",
      "System Settings"
    ]
  }
];

export const subRouteMap = {
  // Sales
  "Online Sales": "/admin/online-sales",
  "Offline Sales (POS)": "/admin/offline-sales",
  "Store Pickup Sales": "/admin/store-pickup-sales",
  "Sales Invoices": "/admin/sales-invoices",
  "GST Invoices": "/admin/gst-invoices",
  "Credit Notes": "/admin/credit-notes",
  "Debit Notes": "/admin/debit-notes",
  "Payment Transactions": "/admin/payment-transactions",
  "Sales Returns": "/admin/sales-returns",
  "Sales Reports": "/admin/reports/sales",
  
  // Orders
  "All Orders": "/admin/orders",
  
  // Returns
  "Return Requests": "/admin/returns/requests",
  "Approve / Reject Returns": "/admin/returns/requests",
  "Normal Returns": "/admin/returns/normal",
  "Defective Returns": "/admin/returns/defective",
  "Partial Returns": "/admin/returns/partial",
  "Refund Options": "/admin/returns/refund-options",
  "Return History": "/admin/returns/history",
  "Return Analytics": "/admin/returns/analytics",
  "Credit Reversal": "/admin/returns/credit-reversal",
  "Vendor Returns": "/admin/vendor-returns",
  
  // Products
  "All Products": "/admin/products",
  
  // Categories
  "All Categories": "/admin/categories",
  
  // Brands
  "All Brands": "/admin/brands",
  
  // Inventory
  "Stock Overview": "/admin/inventory",
  "Stock Alerts": "/admin/stock-alerts",
  "Out of Stock": "/admin/out-of-stock",
  
  // Purchases
  "Purchase Orders": "/admin/purchase-orders",
  "Purchase Invoices": "/admin/purchase-invoices",
  "Debit/Credit Notes": "/admin/debit-credit-notes",
  "Vendor Returns": "/admin/vendor-returns",
  
  // Customers
  "All Customers": "/admin/audiences",
  
  // Vendors
  "All Vendors": "/admin/vendors",
  
  // POS Billing
  "POS Terminal": "/admin/pos",
  
  // Marketing
  "Offers": "/admin/offers",
  "Coupons": "/admin/coupons",
  
  // Content
  "Homepage Builder": "/admin/homepage-builder",
  "Manage Sections": "/admin/manage-sections",
  "Banners": "/admin/banners",
  "Brands": "/admin/site-brands",
  "Collections": "/admin/collections",
  "Featured Products": "/admin/featured-products",
  "Pages": "/admin/custom-pages",
  "All Pages": "/admin/all-pages",
  "Blog Management": "/admin/blog-management",
  "Media Library": "/admin/media-library",
  "Menu Navigation": "/admin/menu-navigation",
  
  // SEO
  "SEO Dashboard": "/admin/seo/dashboard",
  "Meta Titles & Descriptions": "/admin/seo/meta",
  "URL Slugs": "/admin/seo/slugs",
  "Canonical URLs": "/admin/seo/canonical",
  "Open Graph Management": "/admin/seo/open-graph",
  "Schema Management": "/admin/seo/schema",
  "Redirect Manager": "/admin/seo/redirects",
  "Sitemap Generator": "/admin/seo/sitemap",
  "SEO Audit": "/admin/seo/audit",
  "Search Console Integration": "/admin/seo/search-console",
  "SEO Settings": "/admin/settings",
  
  // Reports
  "Sales Reports": "/admin/reports/sales",
  "Inventory Reports": "/admin/reports/inventory",
  "Product Reports": "/admin/reports/products",
  "Customer Reports": "/admin/reports/customers",
  "Vendor Reports": "/admin/reports/vendors",
  "Profit Reports": "/admin/reports/profit",
  "Loyalty Reports": "/admin/reports/loyalty",
  "Financial Reports": "/admin/reports/financial",
  "Export Reports": "/admin/reports/export",
  
  // Accounting
  "GST Reports": "/admin/accounting/gst-reports",
  "Sales Register": "/admin/accounting/sales-register",
  "Purchase Register": "/admin/accounting/purchase-register",
  "HSN Summary": "/admin/accounting/hsn-summary",
  "Credit Notes List": "/admin/accounting/credit-notes",
  "Debit Notes List": "/admin/accounting/debit-notes",
  "Profit & Loss Report": "/admin/accounting/profit-loss",
  "Payments Log": "/admin/payments",
  
  // Notifications
  "System Alerts": "/admin/notifications/system-alerts",
  "Low Stock Alerts": "/admin/notifications/low-stock",
  "Out of Stock Alerts": "/admin/notifications/out-of-stock",
  "Pending Returns Alerts": "/admin/notifications/pending-returns",
  "Failed Payment Alerts": "/admin/notifications/failed-payments",
  "Expiring Coupons": "/admin/notifications/expiring-coupons",
  "Expiring Credits": "/admin/notifications/expiring-credits",
  "Back-in-Stock Alerts": "/admin/notifications/back-in-stock",
  "Notify-Me Requests": "/admin/notifications/notify-me",
  
  // Users & Roles
  "All Users": "/admin/users/all",
  "Add User": "/admin/users/add",
  "User Roles": "/admin/users/roles",
  "Permissions": "/admin/users/permissions",
  "Role Management": "/admin/users/role-management",
  "Login Activity": "/admin/users/login-activity",
  
  // Bulk Operations
  "Product Import / Export": "/admin/bulk-upload/products",
  "Inventory Import / Export": "/admin/bulk-upload/inventory",
  "Customer Import / Export": "/admin/bulk-upload/customers",
  "Redirect Import / Export": "/admin/bulk-upload/vendors",
  "Dzire Credits Import / Export": "/admin/bulk-upload/credits",
  "SEO Import (Meta Data)": "/admin/bulk-upload/seo",
  "Bulk Image Upload (ZIP)": "/admin/bulk-upload/images",
  "Background Job Processing": "/admin/bulk-upload/background-jobs",
  "Import History & Reports": "/admin/bulk-upload/history",
  
  // Audit Logs
  "All Logs": "/admin/audit-logs/all",
  "User Activity Logs": "/admin/audit-logs/user-activity",
  "Data Change Logs": "/admin/audit-logs/data-change",
  "Login Logs": "/admin/audit-logs/login",
  "IP Logs": "/admin/audit-logs/ip-logs",
  "Action Logs": "/admin/audit-logs/actions",
  
  // Global Activity Feed
  "All Activities": "/admin/activity-feed/all",
  "Product Changes": "/admin/activity-feed/products",
  "Inventory Changes": "/admin/activity-feed/inventory",
  "Order Activities": "/admin/activity-feed/orders",
  "Return Activities": "/admin/activity-feed/returns",
  "Other Activities": "/admin/activity-feed/other",
  "User Activities": "/admin/activity-feed/users",
  "Filter & Search": "/admin/activity-feed/filter-search",
  
  // Settings
  "Store Settings": "/admin/settings/store",
  "GST Settings": "/admin/settings/gst",
  "Payment Settings": "/admin/settings/payments",
  "Shipping Settings": "/admin/settings/shipping",
  "Loyalty Settings": "/admin/settings/loyalty",
  "Invoice Templates": "/admin/settings/invoices",
  "Email Settings": "/admin/settings/email",
  "SMS / WhatsApp Settings": "/admin/settings/sms-whatsapp",
  "Backup & Recovery": "/admin/settings/backup",
  "System Settings": "/admin/settings/system"
};
