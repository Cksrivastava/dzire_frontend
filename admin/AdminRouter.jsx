import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCreateItem from "./pages/AdminCreateItem";
import AdminProductDetails from "./pages/AdminProductDetails";
import AdminBrands from "./pages/AdminBrands";
import AdminOutOfStock from "./pages/AdminOutOfStock";
import AdminStockAlerts from "./pages/AdminStockAlerts";
import AdminOrders from "./pages/AdminOrders";
import AdminPayments from "./pages/AdminPayments";
import AdminUsers from "./pages/AdminUsers";
import AdminAudiences from "./pages/AdminAudiences";
import AdminCategories from "./pages/AdminCategories";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminOrderDetail from "./pages/AdminOrderDetail";
import AdminSiteContent from "./pages/AdminSiteContent";
import AdminSectionHeadings from "./pages/AdminSectionHeadings";
import AdminBanners from "./pages/AdminBanners";
import AdminRentals from "./pages/AdminRentals";
import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminInventory from "./pages/AdminInventory";
import AdminAttributes from "./pages/AdminAttributes";
import AdminReturns from "./pages/AdminReturns";
import AdminVendors from "./pages/AdminVendors";
import AdminVendorsDataSheet from "./pages/AdminVendorsDataSheet";
import AdminVendorProfile from "./pages/AdminVendorProfile";
import AdminPurchaseOrders from "./pages/AdminPurchaseOrders";
import AdminCreatePurchaseOrder from "./pages/AdminCreatePurchaseOrder";
import AdminPurchaseInvoices from "./pages/AdminPurchaseInvoices";
import AdminCreatePurchaseInvoice from "./pages/AdminCreatePurchaseInvoice";
import AdminDebitCreditNotes from "./pages/AdminDebitCreditNotes";
import AdminVendorReturns from "./pages/AdminVendorReturns";
import AdminPOS from "./pages/AdminPOS";
import AdminOfflineSales from "./pages/AdminOfflineSales";
import AdminInvoices from "./pages/AdminInvoices";
import AdminQuotation from "./pages/AdminQuotation";
import AdminQuotationDataSheet from "./pages/AdminQuotationDataSheet";
import AdminCreditNote from "./pages/AdminCreditNote";
import AdminCreditNoteDataSheet from "./pages/AdminCreditNoteDataSheet";
import AdminPaymentIn from "./pages/AdminPaymentIn";
import AdminInstoreReturn from "./pages/AdminInstoreReturn";
import AdminPurchaseReturn from "./pages/AdminPurchaseReturn";
import AdminCreatePurchaseReturn from "./pages/AdminCreatePurchaseReturn";
import AdminPaymentOut from "./pages/AdminPaymentOut";
import AdminCreatePaymentOut from "./pages/AdminCreatePaymentOut";
import AdminDebitNote from "./pages/AdminDebitNote";
import AdminCreateDebitNote from "./pages/AdminCreateDebitNote";
import AdminReports from "./pages/AdminReports";
import AdminSalesReports from "./pages/AdminSalesReports";
import AdminProductReports from "./pages/AdminProductReports";
import AdminPurchaseReports from "./pages/AdminPurchaseReports";
import AdminInventoryReports from "./pages/AdminInventoryReports";
import AdminCustomerReports from "./pages/AdminCustomerReports";
import AdminVendorReports from "./pages/AdminVendorReports";
import AdminProfitReports from "./pages/AdminProfitReports";
import AdminGSTReports from "./pages/AdminGSTReports";
import AdminOffers from "./pages/AdminOffers";
import AdminCoupons from "./pages/AdminCoupons";
import AdminBulkUpload from "./pages/AdminBulkUpload";
import AdminBarcode from "./pages/AdminBarcode";
import AdminShippingSettings from "./pages/AdminShippingSettings";
import AdminLoyalty from "./pages/AdminLoyalty";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminSettings from "./pages/AdminSettings";
import AdminNotifications from "./pages/AdminNotifications";
import AdminMarketing from "./pages/AdminMarketing";
import AdminVendorHub from "./pages/AdminVendorHub";
import AdminPOSHub from "./pages/AdminPOSHub";
import AdminPOSDataSheet from "./pages/AdminPOSDataSheet";
import AdminPurchaseHub from "./pages/AdminPurchaseHub";
import AdminWebsiteHub from "./pages/AdminWebsiteHub";
import AdminReturnsHub from "./pages/AdminReturnsHub";
import AdminCustomers from "./pages/AdminCustomers";
import AdminDzireCredits from "./pages/AdminDzireCredits";
import AdminStaff from "./pages/AdminStaff";
import AdminStaffProfile from "./pages/AdminStaffProfile";
import AdminRolesPermissions from "./pages/AdminRolesPermissions";
import AdminBlogs from "./pages/AdminBlogs";
import AdminEvents from "./pages/AdminEvents";
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
      <Route path="website" element={<Navigate to="/admin/orders" replace />} />
      <Route path="products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
      <Route path="products/add" element={<RequireAdmin><AdminCreateItem /></RequireAdmin>} />
      <Route path="products/:id" element={<RequireAdmin><AdminProductDetails /></RequireAdmin>} />
      <Route path="products/edit/:id" element={<RequireAdmin><AdminCreateItem /></RequireAdmin>} />
      <Route path="brands" element={<RequireAdmin><AdminBrands /></RequireAdmin>} />
      <Route path="out-of-stock" element={<RequireAdmin><AdminOutOfStock /></RequireAdmin>} />
      <Route path="stock-alerts" element={<RequireAdmin><AdminStockAlerts /></RequireAdmin>} />
      <Route path="orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
      <Route path="orders/:id" element={<RequireAdmin><AdminOrderDetail /></RequireAdmin>} />
      <Route path="payments" element={<RequireAdmin><AdminPayments /></RequireAdmin>} />
      <Route path="users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
      <Route path="blogs" element={<RequireAdmin><AdminBlogs /></RequireAdmin>} />
      <Route path="blog" element={<Navigate to="/admin/blogs" replace />} />
      <Route path="events" element={<RequireAdmin><AdminEvents /></RequireAdmin>} />
      <Route path="event" element={<Navigate to="/admin/events" replace />} />
      <Route path="audiences" element={<RequireAdmin><AdminAudiences /></RequireAdmin>} />
      <Route path="categories" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
      <Route path="homepage-sections" element={<RequireAdmin><AdminSectionHeadings /></RequireAdmin>} />
      <Route path="section-headings" element={<Navigate to="/admin/homepage-sections" replace />} />
      <Route path="banners" element={<RequireAdmin><AdminBanners /></RequireAdmin>} />
      <Route path="page-banners" element={<Navigate to="/admin/banners" replace />} />
      <Route path="rentals" element={<RequireAdmin><AdminRentals /></RequireAdmin>} />
      <Route path="rental" element={<Navigate to="/admin/rentals" replace />} />
      <Route path="site-content" element={<RequireAdmin><AdminSiteContent /></RequireAdmin>} />
      <Route path="login" element={<AdminLogin />} />
      <Route path="forgot-password" element={<AdminForgotPassword />} />
      <Route path="inventory" element={<RequireAdmin><AdminInventory /></RequireAdmin>} />
      <Route path="attributes" element={<RequireAdmin><AdminAttributes /></RequireAdmin>} />
      <Route path="inventory/attributes" element={<RequireAdmin><AdminAttributes /></RequireAdmin>} />
      <Route path="returns" element={<Navigate to="/admin/instore-return" replace />} />
      <Route path="returns/list" element={<RequireAdmin><AdminReturns /></RequireAdmin>} />
      <Route path="returns/inventory" element={<RequireAdmin><AdminReturns /></RequireAdmin>} />
      <Route path="returns/defective" element={<RequireAdmin><AdminReturns /></RequireAdmin>} />
      <Route path="vendors" element={<RequireAdmin><AdminVendorsDataSheet /></RequireAdmin>} />
      <Route path="vendors/manage" element={<RequireAdmin><AdminVendors /></RequireAdmin>} />
      <Route path="vendors/profile" element={<RequireAdmin><AdminVendorProfile /></RequireAdmin>} />
      <Route path="purchase" element={<RequireAdmin><AdminPurchaseHub /></RequireAdmin>} />
      <Route path="purchase-orders" element={<RequireAdmin><AdminPurchaseOrders /></RequireAdmin>} />
      <Route path="purchase-orders/add" element={<RequireAdmin><AdminCreatePurchaseOrder /></RequireAdmin>} />
      <Route path="purchase-orders/create" element={<RequireAdmin><AdminCreatePurchaseOrder /></RequireAdmin>} />
      <Route path="purchase/orders" element={<RequireAdmin><AdminPurchaseOrders /></RequireAdmin>} />
      <Route path="purchase/orders/add" element={<RequireAdmin><AdminCreatePurchaseOrder /></RequireAdmin>} />
      <Route path="purchase/orders/create" element={<RequireAdmin><AdminCreatePurchaseOrder /></RequireAdmin>} />
      <Route path="purchase-invoices" element={<RequireAdmin><AdminPurchaseInvoices /></RequireAdmin>} />
      <Route path="purchase/invoices" element={<RequireAdmin><AdminPurchaseInvoices /></RequireAdmin>} />
      <Route path="purchase-invoices/add" element={<RequireAdmin><AdminCreatePurchaseInvoice /></RequireAdmin>} />
      <Route path="purchase-invoices/create" element={<RequireAdmin><AdminCreatePurchaseInvoice /></RequireAdmin>} />
      <Route path="purchase/invoices/add" element={<RequireAdmin><AdminCreatePurchaseInvoice /></RequireAdmin>} />
      <Route path="purchase/invoices/create" element={<RequireAdmin><AdminCreatePurchaseInvoice /></RequireAdmin>} />
      <Route path="debit-credit-notes" element={<RequireAdmin><AdminDebitCreditNotes /></RequireAdmin>} />
      <Route path="vendor-returns" element={<RequireAdmin><AdminVendorReturns /></RequireAdmin>} />
      <Route path="pos" element={<RequireAdmin><AdminPOSDataSheet /></RequireAdmin>} />
      <Route path="pos/hub" element={<RequireAdmin><AdminPOSHub /></RequireAdmin>} />
      <Route path="pos/sales-invoice" element={<RequireAdmin><AdminPOSDataSheet /></RequireAdmin>} />
      <Route path="pos/create-sales-invoice" element={<RequireAdmin><AdminPOS /></RequireAdmin>} />
      <Route path="pos/add" element={<RequireAdmin><AdminPOS /></RequireAdmin>} />
      <Route path="customers" element={<RequireAdmin><AdminCustomers /></RequireAdmin>} />
      <Route path="dzire-credits" element={<RequireAdmin><AdminDzireCredits /></RequireAdmin>} />
      <Route path="quotation" element={<RequireAdmin><AdminQuotationDataSheet /></RequireAdmin>} />
      <Route path="quotation/create" element={<RequireAdmin><AdminQuotation /></RequireAdmin>} />
      <Route path="quotation/add" element={<RequireAdmin><AdminQuotation /></RequireAdmin>} />
      <Route path="credit-note" element={<RequireAdmin><AdminCreditNoteDataSheet /></RequireAdmin>} />
      <Route path="credit-note/create" element={<RequireAdmin><AdminCreditNote /></RequireAdmin>} />
      <Route path="credit-note/add" element={<RequireAdmin><AdminCreditNote /></RequireAdmin>} />
      <Route path="payment-in" element={<RequireAdmin><AdminPaymentIn /></RequireAdmin>} />
      <Route path="instore-return" element={<RequireAdmin><AdminInstoreReturn /></RequireAdmin>} />

      <Route path="purchase-return" element={<RequireAdmin><AdminPurchaseReturn /></RequireAdmin>} />
      <Route path="purchase-return/add" element={<RequireAdmin><AdminCreatePurchaseReturn /></RequireAdmin>} />
      <Route path="purchase-return/create" element={<RequireAdmin><AdminCreatePurchaseReturn /></RequireAdmin>} />
      <Route path="payment-out" element={<RequireAdmin><AdminPaymentOut /></RequireAdmin>} />
      <Route path="payment-out/add" element={<RequireAdmin><AdminCreatePaymentOut /></RequireAdmin>} />
      <Route path="debit-note" element={<RequireAdmin><AdminDebitNote /></RequireAdmin>} />
      <Route path="debit-note/add" element={<RequireAdmin><AdminCreateDebitNote /></RequireAdmin>} />
      <Route path="offline-sales" element={<RequireAdmin><AdminOfflineSales /></RequireAdmin>} />
      <Route path="invoices" element={<RequireAdmin><AdminInvoices /></RequireAdmin>} />
      <Route path="reports" element={<Navigate to="/admin/reports/sales" replace />} />
      <Route path="reports/sales" element={<RequireAdmin><AdminSalesReports /></RequireAdmin>} />
      <Route path="reports/gst" element={<RequireAdmin><AdminGSTReports /></RequireAdmin>} />
      <Route path="reports/products" element={<RequireAdmin><AdminProductReports /></RequireAdmin>} />
      <Route path="reports/profit" element={<RequireAdmin><AdminProfitReports /></RequireAdmin>} />
      <Route path="reports/purchase" element={<RequireAdmin><AdminPurchaseReports /></RequireAdmin>} />
      <Route path="reports/customers" element={<RequireAdmin><AdminCustomerReports /></RequireAdmin>} />
      <Route path="reports/inventory" element={<RequireAdmin><AdminInventoryReports /></RequireAdmin>} />
      <Route path="reports/vendors" element={<RequireAdmin><AdminVendorReports /></RequireAdmin>} />
      <Route path="offers" element={<RequireAdmin><AdminOffers /></RequireAdmin>} />
      <Route path="coupons" element={<RequireAdmin><AdminCoupons /></RequireAdmin>} />
      <Route path="bulk-upload" element={<RequireAdmin><AdminBulkUpload /></RequireAdmin>} />
      <Route path="barcode" element={<RequireAdmin><AdminBarcode /></RequireAdmin>} />
      <Route path="settings/shipping" element={<RequireAdmin><AdminShippingSettings /></RequireAdmin>} />
      <Route path="loyalty" element={<RequireAdmin><AdminLoyalty /></RequireAdmin>} />
      <Route path="marketing" element={<RequireAdmin><AdminMarketing /></RequireAdmin>} />
      <Route path="staff" element={<RequireAdmin><AdminStaff /></RequireAdmin>} />
      <Route path="staff/:id" element={<RequireAdmin><AdminStaffProfile /></RequireAdmin>} />
      <Route path="staff-management" element={<RequireAdmin><AdminStaff /></RequireAdmin>} />
      <Route path="roles-permissions" element={<RequireAdmin><AdminRolesPermissions /></RequireAdmin>} />
      <Route path="roles" element={<RequireAdmin><AdminRolesPermissions /></RequireAdmin>} />
      <Route path="audit-logs" element={<RequireAdmin><AdminAuditLogs /></RequireAdmin>} />
      <Route path="settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
      <Route path="notifications" element={<RequireAdmin><AdminNotifications /></RequireAdmin>} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRouter;
