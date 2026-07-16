import { useState, useEffect } from "react";
import {
  AlertTriangle,
  BellRing,
  Boxes,
  CreditCard,
  Layers3,
  PackagePlus,
  Search,
  ShoppingBag,
  Tags,
  Users2,
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import "./AdminDashboard.css";

const pageConfig = {
  products: {
    eyebrow: "Catalog",
    title: "Products",
    description: "Static product management screen with inventory cards, category filters, and a product table.",
    icon: Boxes,
    stats: [
      ["Total Products", "642", "All visible catalog rows"],
      ["Published", "598", "Ready for storefront"],
      ["Low Stock", "24", "Needs restock soon"],
      ["Drafts", "20", "Waiting for review"],
    ],
    columns: ["Product", "Category", "Stock", "Price", "Status"],
    rows: [
      ["Running Shoes", "Running", "42", "Rs 2,499", "Published"],
      ["Sports Jacket", "Running", "24", "Rs 1,899", "Published"],
      ["Training Gloves", "Gym", "12", "Rs 599", "Published"],
      ["Sports Bag", "Gym", "30", "Rs 1,299", "Published"],
      ["Cycling Helmet", "Cycling", "8", "Rs 1,499", "Low Stock"],
      ["Football Shoes", "Football", "15", "Rs 2,199", "Published"],
      ["Yoga Mat", "Yoga", "0", "Rs 799", "Out of Stock"],
      ["Camping Jacket", "Camping", "18", "Rs 2,499", "Published"],
      ["Hiking Shoes", "Hiking", "5", "Rs 2,999", "Low Stock"],
      ["Swimming Goggles", "Swimming", "22", "Rs 499", "Published"],
    ],
  },
  categories: {
    eyebrow: "Storefront",
    title: "Categories",
    description: "Static category overview for arranging sports, activities, and product groupings.",
    icon: Tags,
    stats: [
      ["Categories", "18", "Main navigation groups"],
      ["Active", "15", "Visible on storefront"],
      ["Hidden", "3", "Paused sections"],
      ["Featured", "6", "Homepage highlights"],
    ],
    columns: ["Category", "Products", "Featured", "Status", "Updated"],
    rows: [
      ["Running", "124", "Yes", "Active", "Today"],
      ["Gym", "98", "Yes", "Active", "Yesterday"],
      ["Cycling", "72", "Yes", "Active", "2 days ago"],
      ["Football", "85", "Yes", "Active", "Apr 28"],
      ["Yoga", "45", "No", "Active", "Apr 29"],
      ["Camping", "32", "No", "Hidden", "May 1"],
      ["Hiking", "28", "No", "Active", "May 2"],
      ["Swimming", "19", "No", "Hidden", "May 3"],
    ],
  },
  brands: {
    eyebrow: "Catalog Intelligence",
    title: "Brands",
    description: "Static brand coverage screen for stock depth, price mix, and product count.",
    icon: Tags,
    stats: [
      ["Brands", "34", "Catalog labels"],
      ["Top Brand", "Nike", "124 products"],
      ["Avg Price", "Rs 188K", "Across active items"],
      ["Low Stock Brands", "7", "Need attention"],
    ],
    columns: ["Brand", "Products", "In Stock", "Avg Price", "Trend"],
    rows: [
      ["Nike", "124", "112", "Rs 210K", "Up"],
      ["Adidas", "98", "91", "Rs 198K", "Stable"],
      ["Puma", "76", "64", "Rs 172K", "Up"],
      ["Yonex", "54", "49", "Rs 132K", "Stable"],
    ],
  },
  collections: {
    eyebrow: "Merchandising",
    title: "Collections",
    description: "Static collection manager for homepage rows, campaign groups, and seasonal edits.",
    icon: Layers3,
    stats: [
      ["Collections", "12", "Active storefront sections"],
      ["Hero Slots", "4", "Homepage campaigns"],
      ["Scheduled", "3", "Ready to publish"],
      ["Drafts", "5", "Being prepared"],
    ],
    columns: ["Collection", "Products", "Placement", "Status", "Owner"],
    rows: [
      ["Summer Essentials", "32", "Hero", "Active", "Admin"],
      ["Weekend Camping", "28", "Homepage", "Active", "Admin"],
      ["Cycling Gear", "24", "Category", "Scheduled", "Admin"],
      ["Training Picks", "18", "Homepage", "Draft", "Admin"],
    ],
  },
  outOfStock: {
    eyebrow: "Inventory",
    title: "Out of Stock",
    description: "Static restock watchlist for products whose inventory has reached zero.",
    icon: AlertTriangle,
    stats: [
      ["Out of Stock", "18", "Zero inventory"],
      ["Pending Alerts", "76", "Customers waiting"],
      ["Critical Brands", "5", "Repeated shortages"],
      ["Restocked Today", "9", "Back online"],
    ],
    columns: ["Product", "Brand", "Requests", "Last Sold", "Priority"],
    rows: [
      ["Yoga Training Mat", "FitPro", "18", "Today", "High"],
      ["Hiking Backpack 45L", "Quechua", "14", "Yesterday", "High"],
      ["Badminton Shuttle Pack", "Yonex", "9", "Apr 29", "Medium"],
      ["Thermal Jacket", "North Ridge", "7", "Apr 27", "Medium"],
    ],
  },
  stockAlerts: {
    eyebrow: "Customer Requests",
    title: "Stock Alerts",
    description: "Static notification queue for customers waiting on back-in-stock products.",
    icon: BellRing,
    stats: [
      ["Requests", "126", "Total alert signups"],
      ["Pending", "76", "Waiting to notify"],
      ["Notified", "38", "Sent updates"],
      ["Failed", "12", "Need retry"],
    ],
    columns: ["Customer", "Product", "Channel", "Status", "Requested"],
    rows: [
      ["Aarav Mehta", "Hiking Backpack 45L", "Email", "Pending", "Today"],
      ["Priya Sharma", "Yoga Training Mat", "SMS", "Pending", "Today"],
      ["Rahul Verma", "Cycling Helmet", "Email", "Notified", "Yesterday"],
      ["Neha Patel", "Thermal Jacket", "Email", "Pending", "Apr 29"],
    ],
  },
  orders: {
    eyebrow: "Operations",
    title: "Orders",
    description: "Static order management page for fulfillment status, totals, and customer activity.",
    icon: ShoppingBag,
    stats: [
      ["Orders", "1,284", "All-time orders"],
      ["Pending", "86", "Need confirmation"],
      ["Shipped", "92", "In delivery flow"],
      ["Delivered", "894", "Completed orders"],
    ],
    columns: ["Order", "Customer", "Total", "Payment", "Status"],
    rows: [
      ["#DZ-1048", "Aarav Mehta", "Rs 420K", "Paid", "Delivered"],
      ["#DZ-1047", "Priya Sharma", "Rs 180K", "Paid", "Packed"],
      ["#DZ-1046", "Rahul Verma", "Rs 96K", "Pending", "Pending"],
      ["#DZ-1045", "Neha Patel", "Rs 310K", "Paid", "Shipped"],
    ],
  },
  payments: {
    eyebrow: "Finance",
    title: "Payments",
    description: "Static payment health screen for completed, pending, failed, and refund states.",
    icon: CreditCard,
    stats: [
      ["Success Rate", "96.4%", "Healthy payment flow"],
      ["Paid", "1,148", "Completed payments"],
      ["Pending", "24", "Awaiting confirmation"],
      ["Failed", "6", "Need review"],
    ],
    columns: ["Reference", "Customer", "Amount", "Method", "Status"],
    rows: [
      ["PAY-8842", "Aarav Mehta", "Rs 420K", "Card", "Paid"],
      ["PAY-8841", "Priya Sharma", "Rs 180K", "UPI", "Paid"],
      ["PAY-8840", "Rahul Verma", "Rs 96K", "COD", "Pending"],
      ["PAY-8839", "Neha Patel", "Rs 310K", "Card", "Paid"],
    ],
  },
  users: {
    eyebrow: "Customers",
    title: "Customers",
    description: "Static customer management screen with verification status and account health.",
    icon: Users2,
    stats: [
      ["Customers", "8,942", "Registered accounts"],
      ["Verified", "8,120", "Trusted customers"],
      ["Pending", "42", "Need follow-up"],
      ["New Month", "312", "Recent signups"],
    ],
    columns: ["Customer", "Email", "Orders", "Status", "Joined"],
    rows: [
      ["Aarav Mehta", "aarav@example.com", "12", "Verified", "Today"],
      ["Priya Sharma", "priya@example.com", "8", "Verified", "Yesterday"],
      ["Rahul Verma", "rahul@example.com", "3", "Pending", "Apr 29"],
      ["Neha Patel", "neha@example.com", "16", "Verified", "Apr 25"],
    ],
  },
};

const AdminStaticPage = ({ page }) => {
  const config = pageConfig[page] || pageConfig.products;
  const Icon = config.icon;

  const [rows, setRows] = useState(config.rows);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    product: "",
    category: "",
    brand: "",
    sku: "",
    stock: "",
    price: "",
    oldPrice: "",
    status: "Published",
    description: ""
  });

  useEffect(() => {
    setRows(config.rows);
    setShowAddForm(false);
  }, [page, config.rows]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newRow = [
      formData.product,
      formData.category,
      formData.stock,
      `Rs ${Number(formData.price).toLocaleString()}`,
      formData.status
    ];
    setRows([newRow, ...rows]);
    setFormData({ product: "", category: "", brand: "", sku: "", stock: "", price: "", oldPrice: "", status: "Published", description: "" });
    setShowAddForm(false);
  };

  return (
    <AdminLayout>
      <section className="admin-hero">
        <div>
          <span className="admin-eyebrow">{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <button className="admin-primary-button" type="button">
          <PackagePlus size={18} />
          Static UI
        </button>
      </section>

      <section className="admin-stat-grid">
        {config.stats.map(([label, value, note], index) => (
          <article className="admin-stat-card" key={label}>
            <div>
              <p>{label}</p>
              <strong>{value}</strong>
            </div>
            <span className={`admin-stat-icon ${["blue", "green", "pink", "amber"][index]}`}>
              <Icon size={22} />
            </span>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-list-toolbar" style={{ flexWrap: 'wrap' }}>
          <div>
            <span className="admin-eyebrow">Management Table</span>
            <h2>{config.title} preview</h2>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="admin-search-box">
              <Search size={18} />
              <span>Search {config.title.toLowerCase()}</span>
            </div>
            {page === "products" && (
              <button
                type="button"
                className="admin-primary-button"
                style={{ cursor: "pointer", height: "44px", borderRadius: "48px" }}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? "Cancel" : "Add Product"}
              </button>
            )}
          </div>
        </div>

        {page === "products" && showAddForm && (
          <form onSubmit={handleAddProduct} style={{ padding: "24px", marginBottom: "24px", border: "1px solid #eef2f6", borderRadius: "16px", backgroundColor: "#f8fafc", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>Product Name</label>
              <input required value={formData.product} onChange={e => setFormData({ ...formData, product: e.target.value })} style={{ border: "1px solid #e4e9f0", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} placeholder="e.g. Running Shoes" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>Category</label>
              <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ border: "1px solid #e4e9f0", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} placeholder="e.g. Running" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>Brand</label>
              <input required value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} style={{ border: "1px solid #e4e9f0", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} placeholder="e.g. Nike" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>SKU (Product ID)</label>
              <input required value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} style={{ border: "1px solid #e4e9f0", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} placeholder="e.g. NK-RUN-101" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>Stock</label>
              <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} style={{ border: "1px solid #e4e9f0", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} placeholder="e.g. 42" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>Price (Rs)</label>
              <input required type="number" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={{ border: "1px solid #e4e9f0", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} placeholder="e.g. 2499" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>Old Price (Optional)</label>
              <input type="number" min="0" value={formData.oldPrice} onChange={e => setFormData({ ...formData, oldPrice: e.target.value })} style={{ border: "1px solid #e4e9f0", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} placeholder="e.g. 2999" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ border: "1px solid #e4e9f0", padding: "10px 14px", borderRadius: "10px", fontSize: "14px", backgroundColor: "white" }}>
                <option value="Published">Published</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ border: "1px solid #e4e9f0", padding: "10px 14px", borderRadius: "10px", fontSize: "14px", minHeight: "80px" }} placeholder="Enter product description..." />
            </div>
            <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button type="submit" className="admin-primary-button" style={{ cursor: "pointer" }}>Save Product</button>
            </div>
          </form>
        )}

        <div className="admin-data-table">
          <div className="admin-data-row admin-data-head">
            {config.columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
          {rows.map((row) => (
            <div className="admin-data-row" key={row.join("-") + Math.random()}>
              {row.map((cell, index) => (
                <span key={`${cell}-${index}`} className={index === 0 ? "strong" : ""}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminStaticPage;
