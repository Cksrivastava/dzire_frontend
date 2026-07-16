import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminBrands from "./pages/AdminBrands";
import AdminOutOfStock from "./pages/AdminOutOfStock";
import AdminStockAlerts from "./pages/AdminStockAlerts";
import AdminOrders from "./pages/AdminOrders";
import AdminPayments from "./pages/AdminPayments";
import AdminUsers from "./pages/AdminUsers";
import AdminAddUser from "./pages/AdminAddUser";
import AdminUserRoles from "./pages/AdminUserRoles";
import AdminPermissions from "./pages/AdminPermissions";
import AdminRoleManagement from "./pages/AdminRoleManagement";
import AdminLoginActivity from "./pages/AdminLoginActivity";
import AdminAudiences from "./pages/AdminAudiences";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminOrderDetail from "./pages/AdminOrderDetail";
import AdminSiteContent from "./pages/AdminSiteContent";
import AdminHomepageBuilder from "./pages/AdminHomepageBuilder";
import AdminCategories from "./pages/AdminCategories";
import AdminCollections from "./pages/AdminCollections";
import AdminCustomPages from "./pages/AdminCustomPages";
import AdminBlog from "./pages/AdminBlog";
import AdminMediaLibrary from "./pages/AdminMediaLibrary";
import AdminManageSections from "./pages/AdminManageSections";
import AdminBanners from "./pages/AdminBanners";
import AdminSiteBrands from "./pages/AdminSiteBrands";
import AdminFeaturedProducts from "./pages/AdminFeaturedProducts";
import AdminAllPages from "./pages/AdminAllPages";
import AdminMenuNavigation from "./pages/AdminMenuNavigation";
import AdminStoreSettings from "./pages/AdminStoreSettings";
import AdminGstSettings from "./pages/AdminGstSettings";
import AdminPaymentSettings from "./pages/AdminPaymentSettings";
import AdminLoyaltySettings from "./pages/AdminLoyaltySettings";
import AdminInvoiceTemplates from "./pages/AdminInvoiceTemplates";
import AdminEmailSettings from "./pages/AdminEmailSettings";
import AdminSmsSettings from "./pages/AdminSmsSettings";
import AdminBackupSettings from "./pages/AdminBackupSettings";
import AdminSystemSettings from "./pages/AdminSystemSettings";
import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminInventory from "./pages/AdminInventory";
import AdminReturns from "./pages/AdminReturns";
import AdminVendors from "./pages/AdminVendors";
import AdminPurchaseOrders from "./pages/AdminPurchaseOrders";
import AdminPurchaseInvoices from "./pages/AdminPurchaseInvoices";
import AdminDebitCreditNotes from "./pages/AdminDebitCreditNotes";
import AdminVendorReturns from "./pages/AdminVendorReturns";
import AdminPOS from "./pages/AdminPOS";
import AdminOfflineSales from "./pages/AdminOfflineSales";
import AdminInvoices from "./pages/AdminInvoices";
import AdminSalesInvoices from "./pages/AdminSalesInvoices";
import AdminGstInvoices from "./pages/AdminGstInvoices";
import AdminOnlineSales from "./pages/AdminOnlineSales";
import AdminStorePickupSales from "./pages/AdminStorePickupSales";
import AdminCreditNotes from "./pages/AdminCreditNotes";
import AdminDebitNotes from "./pages/AdminDebitNotes";
import AdminPaymentTransactions from "./pages/AdminPaymentTransactions";
import AdminSalesReturns from "./pages/AdminSalesReturns";
import AdminReturnsRequests from "./pages/AdminReturnsRequests";
import AdminNormalReturns from "./pages/AdminNormalReturns";
import AdminDefectiveReturns from "./pages/AdminDefectiveReturns";
import AdminPartialReturns from "./pages/AdminPartialReturns";
import AdminRefundOptions from "./pages/AdminRefundOptions";
import AdminReturnsHistory from "./pages/AdminReturnsHistory";
import AdminReturnsAnalytics from "./pages/AdminReturnsAnalytics";
import AdminCreditReversal from "./pages/AdminCreditReversal";
import AdminGstReports from "./pages/AdminGstReports";
import AdminSalesRegister from "./pages/AdminSalesRegister";
import AdminPurchaseRegister from "./pages/AdminPurchaseRegister";
import AdminHsnSummary from "./pages/AdminHsnSummary";
import AdminCreditNotesList from "./pages/AdminCreditNotesList";
import AdminDebitNotesList from "./pages/AdminDebitNotesList";
import AdminProfitLossReport from "./pages/AdminProfitLossReport";
import AdminReports from "./pages/AdminReports";
import AdminSalesReports from "./pages/AdminSalesReports";
import AdminInventoryReports from "./pages/AdminInventoryReports";
import AdminProductReports from "./pages/AdminProductReports";
import AdminCustomerReports from "./pages/AdminCustomerReports";
import AdminVendorReports from "./pages/AdminVendorReports";
import AdminProfitReports from "./pages/AdminProfitReports";
import AdminLoyaltyReports from "./pages/AdminLoyaltyReports";
import AdminFinancialReports from "./pages/AdminFinancialReports";
import AdminExportReports from "./pages/AdminExportReports";
import AdminOffers from "./pages/AdminOffers";
import AdminCoupons from "./pages/AdminCoupons";
import AdminBulkUpload from "./pages/AdminBulkUpload";
import AdminBulkInventoryImport from "./pages/AdminBulkInventoryImport";
import AdminBulkCustomerImport from "./pages/AdminBulkCustomerImport";
import AdminBulkVendorImport from "./pages/AdminBulkVendorImport";
import AdminBulkSeoImport from "./pages/AdminBulkSeoImport";
import AdminBulkImageUpload from "./pages/AdminBulkImageUpload";
import AdminBulkCreditsImport from "./pages/AdminBulkCreditsImport";
import AdminBackgroundJobs from "./pages/AdminBackgroundJobs";
import AdminImportHistory from "./pages/AdminImportHistory";
import AdminBarcode from "./pages/AdminBarcode";
import AdminShippingSettings from "./pages/AdminShippingSettings";
import AdminLoyalty from "./pages/AdminLoyalty";
import AdminUserActivityLogs from "./pages/AdminUserActivityLogs";
import AdminDataChangeLogs from "./pages/AdminDataChangeLogs";
import AdminLoginLogs from "./pages/AdminLoginLogs";
import AdminIpLogs from "./pages/AdminIpLogs";
import AdminActionLogs from "./pages/AdminActionLogs";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminSettings from "./pages/AdminSettings";
import AdminNotifications from "./pages/AdminNotifications";
import AdminSystemAlerts from "./pages/AdminSystemAlerts";
import AdminLowStockAlerts from "./pages/AdminLowStockAlerts";
import AdminOutOfStockAlerts from "./pages/AdminOutOfStockAlerts";
import AdminPendingReturnsAlerts from "./pages/AdminPendingReturnsAlerts";
import AdminFailedPaymentAlerts from "./pages/AdminFailedPaymentAlerts";
import AdminExpiringCoupons from "./pages/AdminExpiringCoupons";
import AdminExpiringCredits from "./pages/AdminExpiringCredits";
import AdminBackInStockAlerts from "./pages/AdminBackInStockAlerts";
import AdminNotifyMeRequests from "./pages/AdminNotifyMeRequests";
import AdminAllActivities from "./pages/AdminAllActivities";
import AdminProductChanges from "./pages/AdminProductChanges";
import AdminInventoryChanges from "./pages/AdminInventoryChanges";
import AdminOrderActivities from "./pages/AdminOrderActivities";
import AdminReturnActivities from "./pages/AdminReturnActivities";
import AdminOtherActivities from "./pages/AdminOtherActivities";
import AdminUserActivities from "./pages/AdminUserActivities";
import AdminActivityFilterSearch from "./pages/AdminActivityFilterSearch";
import AdminMarketing from "./pages/AdminMarketing";

// SEO sub-pages
import AdminSeoDashboard from "./pages/AdminSeoDashboard";
import AdminSeoMeta from "./pages/AdminSeoMeta";
import AdminSeoSlugs from "./pages/AdminSeoSlugs";
import AdminSeoCanonical from "./pages/AdminSeoCanonical";
import AdminSeoOpenGraph from "./pages/AdminSeoOpenGraph";
import AdminSeoSchema from "./pages/AdminSeoSchema";
import AdminSeoRedirects from "./pages/AdminSeoRedirects";
import AdminSeoSitemap from "./pages/AdminSeoSitemap";
import AdminSeoAudit from "./pages/AdminSeoAudit";
import AdminSeoSearchConsole from "./pages/AdminSeoSearchConsole";
import { getAuthToken, getAuthUser } from "./AdminShims";

const RequireAdmin = ({ children }) => {
  const token = getAuthToken("admin");
  const user = getAuthUser("admin");

  if (!token || user?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      <Route path="products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
      <Route path="products/edit/:id" element={<RequireAdmin><AdminEditProduct /></RequireAdmin>} />
      <Route path="brands" element={<RequireAdmin><AdminBrands /></RequireAdmin>} />
      <Route path="out-of-stock" element={<RequireAdmin><AdminOutOfStock /></RequireAdmin>} />
      <Route path="stock-alerts" element={<RequireAdmin><AdminStockAlerts /></RequireAdmin>} />
      <Route path="orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
      <Route path="orders/:id" element={<RequireAdmin><AdminOrderDetail /></RequireAdmin>} />
      <Route path="payments" element={<RequireAdmin><AdminPayments /></RequireAdmin>} />
      <Route path="users/all" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
      <Route path="users/add" element={<RequireAdmin><AdminAddUser /></RequireAdmin>} />
      <Route path="users/roles" element={<RequireAdmin><AdminUserRoles /></RequireAdmin>} />
      <Route path="users/permissions" element={<RequireAdmin><AdminPermissions /></RequireAdmin>} />
      <Route path="users/role-management" element={<RequireAdmin><AdminRoleManagement /></RequireAdmin>} />
      <Route path="users/login-activity" element={<RequireAdmin><AdminLoginActivity /></RequireAdmin>} />
      <Route path="users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
      <Route path="audiences" element={<RequireAdmin><AdminAudiences /></RequireAdmin>} />
      <Route path="site-content" element={<RequireAdmin><AdminSiteContent /></RequireAdmin>} />
      <Route path="homepage-builder" element={<RequireAdmin><AdminHomepageBuilder /></RequireAdmin>} />
      <Route path="categories" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
      <Route path="collections" element={<RequireAdmin><AdminCollections /></RequireAdmin>} />
      <Route path="custom-pages" element={<RequireAdmin><AdminCustomPages /></RequireAdmin>} />
      <Route path="blog-management" element={<RequireAdmin><AdminBlog /></RequireAdmin>} />
      <Route path="media-library" element={<RequireAdmin><AdminMediaLibrary /></RequireAdmin>} />
      <Route path="manage-sections" element={<RequireAdmin><AdminManageSections /></RequireAdmin>} />
      <Route path="banners" element={<RequireAdmin><AdminBanners /></RequireAdmin>} />
      <Route path="site-brands" element={<RequireAdmin><AdminSiteBrands /></RequireAdmin>} />
      <Route path="featured-products" element={<RequireAdmin><AdminFeaturedProducts /></RequireAdmin>} />
      <Route path="all-pages" element={<RequireAdmin><AdminAllPages /></RequireAdmin>} />
      <Route path="menu-navigation" element={<RequireAdmin><AdminMenuNavigation /></RequireAdmin>} />
      <Route path="login" element={<AdminLogin />} />
      <Route path="forgot-password" element={<AdminForgotPassword />} />
      <Route path="inventory" element={<RequireAdmin><AdminInventory /></RequireAdmin>} />
      <Route path="returns" element={<RequireAdmin><AdminReturns /></RequireAdmin>} />
      <Route path="vendors" element={<RequireAdmin><AdminVendors /></RequireAdmin>} />
      <Route path="purchase-orders" element={<RequireAdmin><AdminPurchaseOrders /></RequireAdmin>} />
      <Route path="purchase-invoices" element={<RequireAdmin><AdminPurchaseInvoices /></RequireAdmin>} />
      <Route path="debit-credit-notes" element={<RequireAdmin><AdminDebitCreditNotes /></RequireAdmin>} />
      <Route path="vendor-returns" element={<RequireAdmin><AdminVendorReturns /></RequireAdmin>} />
      <Route path="pos" element={<RequireAdmin><AdminPOS /></RequireAdmin>} />
      <Route path="offline-sales" element={<RequireAdmin><AdminOfflineSales /></RequireAdmin>} />
      <Route path="invoices" element={<RequireAdmin><AdminInvoices /></RequireAdmin>} />
      <Route path="sales-invoices" element={<RequireAdmin><AdminSalesInvoices /></RequireAdmin>} />
      <Route path="gst-invoices" element={<RequireAdmin><AdminGstInvoices /></RequireAdmin>} />
      <Route path="online-sales" element={<RequireAdmin><AdminOnlineSales /></RequireAdmin>} />
      <Route path="store-pickup-sales" element={<RequireAdmin><AdminStorePickupSales /></RequireAdmin>} />
      <Route path="credit-notes" element={<RequireAdmin><AdminCreditNotes /></RequireAdmin>} />
      <Route path="debit-notes" element={<RequireAdmin><AdminDebitNotes /></RequireAdmin>} />
      <Route path="payment-transactions" element={<RequireAdmin><AdminPaymentTransactions /></RequireAdmin>} />
      <Route path="sales-returns" element={<RequireAdmin><AdminSalesReturns /></RequireAdmin>} />
      <Route path="returns/requests" element={<RequireAdmin><AdminReturnsRequests /></RequireAdmin>} />
      <Route path="returns/normal" element={<RequireAdmin><AdminNormalReturns /></RequireAdmin>} />
      <Route path="returns/defective" element={<RequireAdmin><AdminDefectiveReturns /></RequireAdmin>} />
      <Route path="returns/partial" element={<RequireAdmin><AdminPartialReturns /></RequireAdmin>} />
      <Route path="returns/refund-options" element={<RequireAdmin><AdminRefundOptions /></RequireAdmin>} />
      <Route path="returns/history" element={<RequireAdmin><AdminReturnsHistory /></RequireAdmin>} />
      <Route path="returns/analytics" element={<RequireAdmin><AdminReturnsAnalytics /></RequireAdmin>} />
      <Route path="returns/credit-reversal" element={<RequireAdmin><AdminCreditReversal /></RequireAdmin>} />
      <Route path="accounting/gst-reports" element={<RequireAdmin><AdminGstReports /></RequireAdmin>} />
      <Route path="accounting/sales-register" element={<RequireAdmin><AdminSalesRegister /></RequireAdmin>} />
      <Route path="accounting/purchase-register" element={<RequireAdmin><AdminPurchaseRegister /></RequireAdmin>} />
      <Route path="accounting/hsn-summary" element={<RequireAdmin><AdminHsnSummary /></RequireAdmin>} />
      <Route path="accounting/credit-notes" element={<RequireAdmin><AdminCreditNotesList /></RequireAdmin>} />
      <Route path="accounting/debit-notes" element={<RequireAdmin><AdminDebitNotesList /></RequireAdmin>} />
      <Route path="accounting/profit-loss" element={<RequireAdmin><AdminProfitLossReport /></RequireAdmin>} />
      <Route path="reports" element={<RequireAdmin><AdminReports /></RequireAdmin>} />
      <Route path="reports/sales" element={<RequireAdmin><AdminSalesReports /></RequireAdmin>} />
      <Route path="reports/inventory" element={<RequireAdmin><AdminInventoryReports /></RequireAdmin>} />
      <Route path="reports/products" element={<RequireAdmin><AdminProductReports /></RequireAdmin>} />
      <Route path="reports/customers" element={<RequireAdmin><AdminCustomerReports /></RequireAdmin>} />
      <Route path="reports/vendors" element={<RequireAdmin><AdminVendorReports /></RequireAdmin>} />
      <Route path="reports/profit" element={<RequireAdmin><AdminProfitReports /></RequireAdmin>} />
      <Route path="reports/loyalty" element={<RequireAdmin><AdminLoyaltyReports /></RequireAdmin>} />
      <Route path="reports/financial" element={<RequireAdmin><AdminFinancialReports /></RequireAdmin>} />
      <Route path="reports/export" element={<RequireAdmin><AdminExportReports /></RequireAdmin>} />
      <Route path="offers" element={<RequireAdmin><AdminOffers /></RequireAdmin>} />
      <Route path="coupons" element={<RequireAdmin><AdminCoupons /></RequireAdmin>} />
      <Route path="bulk-upload/products" element={<RequireAdmin><AdminBulkUpload /></RequireAdmin>} />
      <Route path="bulk-upload/inventory" element={<RequireAdmin><AdminBulkInventoryImport /></RequireAdmin>} />
      <Route path="bulk-upload/customers" element={<RequireAdmin><AdminBulkCustomerImport /></RequireAdmin>} />
      <Route path="bulk-upload/vendors" element={<RequireAdmin><AdminBulkVendorImport /></RequireAdmin>} />
      <Route path="bulk-upload/seo" element={<RequireAdmin><AdminBulkSeoImport /></RequireAdmin>} />
      <Route path="bulk-upload/images" element={<RequireAdmin><AdminBulkImageUpload /></RequireAdmin>} />
      <Route path="bulk-upload/credits" element={<RequireAdmin><AdminBulkCreditsImport /></RequireAdmin>} />
      <Route path="bulk-upload/background-jobs" element={<RequireAdmin><AdminBackgroundJobs /></RequireAdmin>} />
      <Route path="bulk-upload/history" element={<RequireAdmin><AdminImportHistory /></RequireAdmin>} />
      <Route path="bulk-upload" element={<RequireAdmin><AdminBulkUpload /></RequireAdmin>} />
      <Route path="barcode" element={<RequireAdmin><AdminBarcode /></RequireAdmin>} />
      <Route path="settings/shipping" element={<RequireAdmin><AdminShippingSettings /></RequireAdmin>} />
      <Route path="settings/store" element={<RequireAdmin><AdminStoreSettings /></RequireAdmin>} />
      <Route path="settings/gst" element={<RequireAdmin><AdminGstSettings /></RequireAdmin>} />
      <Route path="settings/payments" element={<RequireAdmin><AdminPaymentSettings /></RequireAdmin>} />
      <Route path="settings/loyalty" element={<RequireAdmin><AdminLoyaltySettings /></RequireAdmin>} />
      <Route path="settings/invoices" element={<RequireAdmin><AdminInvoiceTemplates /></RequireAdmin>} />
      <Route path="settings/email" element={<RequireAdmin><AdminEmailSettings /></RequireAdmin>} />
      <Route path="settings/sms-whatsapp" element={<RequireAdmin><AdminSmsSettings /></RequireAdmin>} />
      <Route path="settings/backup" element={<RequireAdmin><AdminBackupSettings /></RequireAdmin>} />
      <Route path="settings/system" element={<RequireAdmin><AdminSystemSettings /></RequireAdmin>} />
      <Route path="loyalty" element={<RequireAdmin><AdminLoyalty /></RequireAdmin>} />
      <Route path="marketing" element={<RequireAdmin><AdminMarketing /></RequireAdmin>} />
      <Route path="audit-logs/all" element={<RequireAdmin><AdminAuditLogs /></RequireAdmin>} />
      <Route path="audit-logs/user-activity" element={<RequireAdmin><AdminUserActivityLogs /></RequireAdmin>} />
      <Route path="audit-logs/data-change" element={<RequireAdmin><AdminDataChangeLogs /></RequireAdmin>} />
      <Route path="audit-logs/login" element={<RequireAdmin><AdminLoginLogs /></RequireAdmin>} />
      <Route path="audit-logs/ip-logs" element={<RequireAdmin><AdminIpLogs /></RequireAdmin>} />
      <Route path="audit-logs/actions" element={<RequireAdmin><AdminActionLogs /></RequireAdmin>} />
      <Route path="audit-logs" element={<RequireAdmin><AdminAuditLogs /></RequireAdmin>} />
      <Route path="activity-feed/all" element={<RequireAdmin><AdminAllActivities /></RequireAdmin>} />
      <Route path="activity-feed/products" element={<RequireAdmin><AdminProductChanges /></RequireAdmin>} />
      <Route path="activity-feed/inventory" element={<RequireAdmin><AdminInventoryChanges /></RequireAdmin>} />
      <Route path="activity-feed/orders" element={<RequireAdmin><AdminOrderActivities /></RequireAdmin>} />
      <Route path="activity-feed/returns" element={<RequireAdmin><AdminReturnActivities /></RequireAdmin>} />
      <Route path="activity-feed/other" element={<RequireAdmin><AdminOtherActivities /></RequireAdmin>} />
      <Route path="activity-feed/users" element={<RequireAdmin><AdminUserActivities /></RequireAdmin>} />
      <Route path="activity-feed/filter-search" element={<RequireAdmin><AdminActivityFilterSearch /></RequireAdmin>} />
      <Route path="settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
      <Route path="notifications" element={<RequireAdmin><AdminNotifications /></RequireAdmin>} />
      <Route path="notifications/system-alerts" element={<RequireAdmin><AdminSystemAlerts /></RequireAdmin>} />
      <Route path="notifications/low-stock" element={<RequireAdmin><AdminLowStockAlerts /></RequireAdmin>} />
      <Route path="notifications/out-of-stock" element={<RequireAdmin><AdminOutOfStockAlerts /></RequireAdmin>} />
      <Route path="notifications/pending-returns" element={<RequireAdmin><AdminPendingReturnsAlerts /></RequireAdmin>} />
      <Route path="notifications/failed-payments" element={<RequireAdmin><AdminFailedPaymentAlerts /></RequireAdmin>} />
      <Route path="notifications/expiring-coupons" element={<RequireAdmin><AdminExpiringCoupons /></RequireAdmin>} />
      <Route path="notifications/expiring-credits" element={<RequireAdmin><AdminExpiringCredits /></RequireAdmin>} />
      <Route path="notifications/back-in-stock" element={<RequireAdmin><AdminBackInStockAlerts /></RequireAdmin>} />
      <Route path="notifications/notify-me" element={<RequireAdmin><AdminNotifyMeRequests /></RequireAdmin>} />

      {/* SEO Sub-Pages */}
      <Route path="seo/dashboard" element={<RequireAdmin><AdminSeoDashboard /></RequireAdmin>} />
      <Route path="seo/meta" element={<RequireAdmin><AdminSeoMeta /></RequireAdmin>} />
      <Route path="seo/slugs" element={<RequireAdmin><AdminSeoSlugs /></RequireAdmin>} />
      <Route path="seo/canonical" element={<RequireAdmin><AdminSeoCanonical /></RequireAdmin>} />
      <Route path="seo/open-graph" element={<RequireAdmin><AdminSeoOpenGraph /></RequireAdmin>} />
      <Route path="seo/schema" element={<RequireAdmin><AdminSeoSchema /></RequireAdmin>} />
      <Route path="seo/redirects" element={<RequireAdmin><AdminSeoRedirects /></RequireAdmin>} />
      <Route path="seo/sitemap" element={<RequireAdmin><AdminSeoSitemap /></RequireAdmin>} />
      <Route path="seo/audit" element={<RequireAdmin><AdminSeoAudit /></RequireAdmin>} />
      <Route path="seo/search-console" element={<RequireAdmin><AdminSeoSearchConsole /></RequireAdmin>} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRouter;
