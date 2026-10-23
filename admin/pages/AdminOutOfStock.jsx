import { cn, Button, Input, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BellRing, PackageSearch, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import ExportDropdown from "../components/ExportDropdown";
import AdminLayout from "./AdminLayout";
const formatDateTime = (value) => value ? new Date(value).toLocaleString() : "-";
const formatCurrency = (value) => `${Number(value || 0).toLocaleString()} Rs`;
const getCategoryLabel = (category) => ({
  bestseller: "Bestseller",
  premium: "Premium",
  new: "New Arrival"
})[category] || category || "Uncategorized";
const adminOutOfStockStyles = `
.admin-out-page {
  width: 100%;
  display: grid;
  gap: 24px;
}

.admin-out-page .admin-hero {
  margin-bottom: 0;
}

.admin-out-metrics,
.admin-out-products-grid {
  display: grid;
  gap: 18px;
}

.admin-out-metrics {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.admin-out-metric {
  min-width: 0;
  padding: 20px;
  border: 1px solid #eeeeee;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.06);
}

.admin-out-metric-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.admin-out-label {
  margin: 0;
  color: #777777;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.admin-out-value {
  margin: 10px 0 0;
  color: #111111;
  font-size: 30px;
  line-height: 1;
  font-weight: 700;
}

.admin-out-note {
  margin: 16px 0 0;
  color: #666666;
  font-size: 14px;
  line-height: 1.5;
}

.admin-out-metric-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: #fff3eb;
  color: #ff6600;
}

.admin-out-products-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.admin-out-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #eeeeee;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.06);
}

.admin-out-card-body {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  min-width: 0;
}

.admin-out-image {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 104px;
  width: 104px;
  height: 104px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  overflow: hidden;
}

.admin-out-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.admin-out-copy {
  min-width: 0;
  flex: 1;
}

.admin-out-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.admin-out-status,
.admin-out-alert-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 11px;
  border-radius: 999px;
  background: #fff3eb;
  color: #ff6600;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.admin-out-product-title {
  margin: 14px 0 0;
  color: #111111;
  font-size: 22px;
  line-height: 1.25;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.admin-out-brand {
  margin: 6px 0 0;
  color: #666666;
  font-size: 14px;
}

.admin-out-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.admin-out-detail-label {
  margin: 0;
  color: #777777;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.admin-out-detail-value {
  margin: 5px 0 0;
  color: #111111;
  font-size: 14px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.admin-out-old-price {
  margin: 4px 0 0;
  color: #999999;
  font-size: 12px;
  text-decoration: line-through;
}

.admin-out-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 20px;
}

.admin-out-primary,
.admin-out-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
}

.admin-out-primary {
  border: 1px solid #ff6600;
  background: #ff6600;
  color: #ffffff;
}

.admin-out-primary:hover {
  border-color: #111111;
  background: #111111;
}

.admin-out-secondary {
  border: 1px solid #eeeeee;
  background: #ffffff;
  color: #111111;
}

.admin-out-secondary:hover {
  border-color: #ff6600;
  background: #fff7f1;
  color: #ff6600;
}

.admin-out-state {
  padding: 48px 24px;
  border: 1px solid #eeeeee;
  border-radius: 16px;
  background: #ffffff;
  color: #666666;
  text-align: center;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.06);
}

.admin-out-state-title {
  margin: 14px 0 0;
  color: #111111;
  font-size: 18px;
  font-weight: 700;
}

.admin-out-state-copy {
  max-width: 560px;
  margin: 8px auto 0;
  color: #666666;
  font-size: 14px;
  line-height: 1.6;
}

.admin-out-error {
  border-color: #ffd8d8;
  background: #fff8f8;
  color: #b42318;
  text-align: left;
}

@media (max-width: 1100px) {
  .admin-out-metrics {
    grid-template-columns: 1fr;
  }

  .admin-out-products-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .admin-out-page {
    gap: 16px;
  }

  .admin-out-metric,
  .admin-out-card,
  .admin-out-state {
    border-radius: 14px;
  }

  .admin-out-card-body {
    flex-direction: column;
  }

  .admin-out-image {
    flex-basis: auto;
    width: 100%;
    height: 180px;
  }

  .admin-out-detail-grid {
    grid-template-columns: 1fr;
  }

  .admin-out-actions,
  .admin-out-actions a {
    width: 100%;
  }
}
`;
const AdminOutOfStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchOutOfStockProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/admin/products/out-of-stock"), { headers: getAuthHeaders(false, "admin") });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setProducts([]);
        setError(data?.message || "Failed to load out-of-stock products");
        return;
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      console.error(fetchError);
      setProducts([]);
      setError("Failed to load out-of-stock products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void fetchOutOfStockProducts();
  }, []);
  const summary = useMemo(() => ({
    totalProducts: products.length,
    pendingAlerts: products.reduce((sum, product) => sum + Number(product.pending_alerts || 0), 0),
    recentlyUpdated: products.filter((product) => Boolean(product.updated_at)).length
  }), [products]);
  return <AdminLayout>
    <style>{adminOutOfStockStyles}</style>
    <div className="admin-out-page">
      <section className="admin-hero">
        <div>
          <h1>Out of stock products</h1>
          <p>
            Live database view of every product whose stock has reached zero. This updates from the same backend stock values used by orders, admin, and the customer storefront.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ExportDropdown
            fileName="Out_Of_Stock_Products_Report"
            title="Out of Stock Products Inventory Report"
            headers={['Product Name', 'Brand', 'Category', 'Price', 'Pending Alerts Count', 'Last Updated']}
            rows={products.map((p) => [
              p.name || '',
              p.brand || '',
              getCategoryLabel(p.category),
              formatCurrency(p.price),
              String(p.pending_alerts || 0),
              formatDateTime(p.updated_at)
            ])}
          />
          <button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} />
            Refresh Data
          </button>
        </div>
      </section>

      <section className="admin-out-metrics">
        {[
          [
            "Out of Stock",
            summary.totalProducts,
            "Products at zero stock",
            AlertTriangle
          ],
          [
            "Pending Alerts",
            summary.pendingAlerts,
            "Customers waiting to be notified",
            BellRing
          ],
          [
            "Synced Rows",
            summary.recentlyUpdated,
            "Rows with live update timestamps",
            PackageSearch
          ]
        ].map(([label, value, note, Icon]) => <div key={String(label)} className="admin-out-metric">
          <div className="admin-out-metric-top">
            <div>
              <p className="admin-out-label">{label}</p>
              <p className="admin-out-value">{Number(value)}</p>
            </div>
            <span className="admin-out-metric-icon">
              <Icon size={22} />
            </span>
          </div>
          <p className="admin-out-note">{String(note)}</p>
        </div>)}
      </section>

      {loading ? <div className="admin-out-state">
        Loading out-of-stock products...
      </div> : error ? <div className="admin-out-state admin-out-error">{error}</div> : products.length === 0 ? <div className="admin-out-state">
        <PackageSearch size={34} />
        <p className="admin-out-state-title">No out-of-stock products right now</p>
        <p className="admin-out-state-copy">As soon as stock reaches zero from orders or manual edits, products will appear here automatically.</p>
      </div> : <div className="admin-out-products-grid">
        {products.map((product) => <section key={product.id} className="admin-out-card">
          <div className="admin-out-card-body">
            <div className="admin-out-image">
              <img src={getProductImage(product.image)} alt={product.name} />
            </div>

            <div className="admin-out-copy">
              <div className="admin-out-pills">
                <span className="admin-out-status">Out of stock</span>
                {Number(product.pending_alerts || 0) > 0 ? <span className="admin-out-alert-pill">
                  {Number(product.pending_alerts)} notify request(s)
                </span> : null}
              </div>

              <h2 className="admin-out-product-title">{product.name}</h2>
              <p className="admin-out-brand">{product.brand}</p>

              <div className="admin-out-detail-grid">
                <div>
                  <p className="admin-out-detail-label">Price</p>
                  <p className="admin-out-detail-value">{formatCurrency(product.price)}</p>
                  {product.old_price && Number(product.old_price) > Number(product.price) ? <p className="admin-out-old-price">{formatCurrency(product.old_price)}</p> : null}
                </div>
                <div>
                  <p className="admin-out-detail-label">Audience</p>
                  <p className="admin-out-detail-value">{getAudienceMeta(product.audience)?.navLabel || "Not set"}</p>
                </div>
                <div>
                  <p className="admin-out-detail-label">Category</p>
                  <p className="admin-out-detail-value">{getCategoryLabel(product.category)}</p>
                </div>
                <div>
                  <p className="admin-out-detail-label">Last Sync</p>
                  <p className="admin-out-detail-value">{formatDateTime(product.updated_at || product.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-out-actions">
            <Link to={`/admin/edit/${product.id}`} className="admin-out-primary">
              Restock / Edit Product
            </Link>
            <Link to="/admin/stock-alerts" className="admin-out-secondary">
              Open Notify Customers
            </Link>
          </div>
        </section>)}
      </div>}
    </div>
  </AdminLayout>;
};
export default AdminOutOfStock;
