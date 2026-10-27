import React from "react";

// Simple cn utility
export const cn = (...classes) => classes.filter(Boolean).join(" ");

// Mock Button component
export const Button = ({ className, variant, size, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-slate-200 bg-white hover:bg-slate-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    ghost: "hover:bg-slate-100",
  };
  return (
    <button
      className={cn(baseStyles, variants[variant || "default"], className)}
      {...props}
    />
  );
};

// Mock Input component
export const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);

// Mock AuthShell component
export const AuthShell = ({ children, title, description, badge }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
      <div className="text-center">
        {badge && <span className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full">{badge}</span>}
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </div>
  </div>
);

// Mock toast
export const toast = {
  success: (msg) => alert("Success: " + msg),
  error: (msg) => alert("Error: " + msg),
  info: (msg) => alert("Info: " + msg),
};

// API config
export const apiUrl = (path) => {
  if (typeof path !== "string") return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const rawBase =
    import.meta.env.VITE_API_URL || "https://dzire-backend.onrender.com/api";
  const cleanBase = rawBase.replace(/\/+$/, "");
  const baseWithoutApi = cleanBase.endsWith("/api")
    ? cleanBase.slice(0, -4)
    : cleanBase;
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean.startsWith("/api/")) return `${baseWithoutApi}${clean}`;
  return `${baseWithoutApi}/api${clean}`;
};

const ADMIN_SESSION_KEY = "dzire_demo_admin_session";

const readAdminSession = () => {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (raw === "logged_out") return null;
    if (raw) return JSON.parse(raw);
    return {
      token: "demo-admin-token",
      user: { name: "Admin", role: "admin", email: "admin@dzire.in" }
    };
  } catch {
    return {
      token: "demo-admin-token",
      user: { name: "Admin", role: "admin", email: "admin@dzire.in" }
    };
  }
};

const writeAdminSession = (session) => {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
};

export const getAuthToken = (scope = "admin") => {
  if (scope !== "admin") return null;
  return readAdminSession()?.token || "demo-admin-token";
};

export const getAuthUser = (scope = "admin") => {
  if (scope !== "admin") return null;
  return readAdminSession()?.user || { name: "Admin", role: "admin", email: "admin@dzire.in" };
};

export const getAuthHeaders = (json = false, scope = "admin") => {
  const token = getAuthToken(scope);
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Mock Context
export const useAuth = () => {
  const [adminUser, setAdminUser] = React.useState(() => getAuthUser("admin"));

  const syncUser = (user, { token, scope = "admin" } = {}) => {
    if (scope !== "admin") return;
    const session = { token, user };
    writeAdminSession(session);
    setAdminUser(user);
  };

  const logout = (scope = "admin") => {
    if (scope !== "admin") return;
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminUser(null);
  };

  return { adminUser, syncUser, logout };
};

// Mock Image Map
export const getProductImage = (img) => img;

// Order Status Helpers
export const getOrderStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

export const getOrderStatusMessage = (status, method) => {
  return `Your order status has been updated to ${status}.`;
};

export const getOrderStatusBadgeClass = (status) => {
  const classes = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    confirmed: "border-blue-200 bg-blue-50 text-blue-700",
    packed: "border-purple-200 bg-purple-50 text-purple-700",
    shipped: "border-sky-200 bg-sky-50 text-sky-700",
    delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cancelled: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return classes[status] || "border-slate-200 bg-slate-50 text-slate-700";
};

export const getPaymentStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
  };
  return labels[status] || status;
};

export const getPaymentStatusBadgeClass = (status) => {
  const classes = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
    failed: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return classes[status] || "border-slate-200 bg-slate-50 text-slate-700";
};

export const getPaymentMethodLabel = (method) => {
  const labels = {
    cash_on_delivery: "Cash on Delivery",
    online: "Online Payment",
  };
  return labels[method] || method;
};

export const formatOrderDate = (date, full = false) => {
  if (!date) return "-";
  const d = new Date(date);
  if (full) return d.toLocaleString();
  return d.toLocaleDateString();
};

export const formatCurrency = (value) => {
  return `${Number(value || 0).toLocaleString()} Rs`;
};

export const Switch = ({ checked, onCheckedChange }) => (
  <button
    type="button"
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-slate-900" : "bg-slate-200"}`}
    onClick={() => onCheckedChange(!checked)}
  >
    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? "translate-x-4" : "translate-x-1"}`} />
  </button>
);

export const Textarea = (props) => (
  <textarea
    {...props}
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      props.className
    )}
  />
);

export const DropdownMenu = ({ children }) => <div className="relative inline-block text-left">{children}</div>;
export const DropdownMenuTrigger = ({ children, asChild }) => <>{children}</>;
export const DropdownMenuContent = ({ children, align, className }) => (
  <div className={cn("absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none", className)}>
    <div className="py-1">{children}</div>
  </div>
);
export const DropdownMenuItem = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn("flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50", className)}
  >
    {children}
  </button>
);

export const getExpectedDeliveryLabel = () => "Expected in 3-5 days";

export const isInvalidTokenResponse = () => false;
export const clearStoredSession = (scope = "admin") => {
  if (scope === "admin") {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
};
// Mock Hooks
export const useCollections = () => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(apiUrl("/admin/collections"))
      .then(res => res.json())
      .then(json => {
        setData(json);
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, refetch: () => {} };
};

export const useProducts = () => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(apiUrl("/products"))
      .then(res => res.json())
      .then(json => {
        setData(json);
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, refetch: () => {} };
};

// Mock Data (Cleaned - No mock data)
const mockCollections = [];

const mockProducts = [];

const siteContent = [];

const mockOrders = [];

const mockUsers = [];

const mockStockAlerts = [];

// Global Fetch with live backend proxy & mock fallback
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  const path = typeof url === "string" ? url : (url.url || String(url));
  
  if (path.includes("localhost:5000") || path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/api/")) {
    try {
      const realRes = await originalFetch(url, options);
      if (realRes.ok || realRes.status === 400 || realRes.status === 401 || realRes.status === 403 || realRes.status === 404) {
        return realRes;
      }
    } catch (e) {
      // Backend offline, fallback to mock below
    }
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150));

  let responseData = [];
  
  if (path.includes("/products")) responseData = mockProducts;
  else if (path.includes("/admin/collections")) responseData = mockCollections;
  else if (path.includes("/admin/orders/")) {
    const id = path.split("/").pop();
    responseData = mockOrders.find(o => o.id == id || o.order_number == id) || mockOrders[0];
  }
  else if (path.includes("/admin/orders")) responseData = mockOrders;
  else if (path.includes("/admin/users")) responseData = mockUsers;
  else if (path.includes("/api/site-content")) {
      responseData = [
          { id: 1, section_key: "hero_slider", title: "Royal Oud Collection", subtitle: "Limited Edition", description: "Experience the essence of luxury with our new Royal Oud series.", cta_label: "Shop Now", cta_href: "/shop", image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200", sort_order: 0, is_active: true },
          { id: 2, section_key: "brand_banners", title: "Lattafa Exclusive", subtitle: "Flat 20% Off", description: "The best of Lattafa perfumes now available.", cta_label: "Explore", cta_href: "/shop?brand=Lattafa", image_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600", sort_order: 0, is_active: true }
      ].filter(item => path.includes(item.section_key) || !path.includes("/api/site-content/"));
  }
  else if (path.includes("/upload")) {
      return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ imageUrl: "https://via.placeholder.com/400" })
      });
  }
  else if (path.includes("/admin/stock-alerts")) responseData = mockStockAlerts;
  else if (path.includes("/admin/payments")) responseData = mockOrders.map(o => ({
      id: o.id,
      order_number: o.order_number,
      customer_name: o.address_data.fullName,
      amount: o.total_price,
      method: o.payment_method,
      status: o.payment_status,
      created_at: o.created_at
  }));
  else if (path.includes("/admin/brands")) {
      // Create brands from mock products
      const brandsMap = new Map();
      mockProducts.forEach(p => {
          const b = p.brand;
          if(!brandsMap.has(b)) {
              brandsMap.set(b, { 
                  brand: b, 
                  product_count: 1, 
                  in_stock_products: p.stock > 0 ? 1 : 0,
                  total_stock_units: p.stock,
                  min_price: p.price,
                  max_price: p.price,
                  average_price: p.price,
                  low_stock_products: (p.stock > 0 && p.stock <= 5) ? 1 : 0,
                  out_of_stock_products: p.stock === 0 ? 1 : 0,
                  featured_products: [p],
                  latest_updated_at: new Date().toISOString()
              });
          } else {
              const existing = brandsMap.get(b);
              existing.product_count++;
              if(p.stock > 0) existing.in_stock_products++;
              existing.total_stock_units += p.stock;
              existing.min_price = Math.min(existing.min_price, p.price);
              existing.max_price = Math.max(existing.max_price, p.price);
              if(p.stock > 0 && p.stock <= 5) existing.low_stock_products++;
              if(p.stock === 0) existing.out_of_stock_products++;
              existing.featured_products.push(p);
          }
      });
      responseData = Array.from(brandsMap.values());
  }
  else if (path.includes("/admin/products/out-of-stock")) {
      responseData = mockProducts.filter(p => p.stock === 0);
  }
  else if (path.includes("/login")) {
      const credentials = JSON.parse(options?.body || "{}");
      const isDemoAdmin =
        credentials.identifier === "admin" &&
        credentials.password === "123456" &&
        credentials.audience === "admin";

      if (!isDemoAdmin) {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: "Invalid demo admin credentials" })
        });
      }

      return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            token: "demo-admin-token",
            user: { name: "Admin", role: "admin", email: "admin@dzire.in" }
          })
      });
  }

  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(responseData),
    text: () => Promise.resolve(JSON.stringify(responseData))
  });
};

export const getAudienceMeta = (val) => ({ navLabel: val || "General" });
export const PRODUCT_AUDIENCES = [
  { value: "men", navLabel: "Men" },
  { value: "women", navLabel: "Women" },
  { value: "unisex", navLabel: "Unisex" },
];
export const parsePriceInput = (val) => parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
export const PRICE_INPUT_HINT = "Enter numeric value";
