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

// Mock API config
export const apiUrl = (path) => path;

const ADMIN_SESSION_KEY = "dzire_demo_admin_session";

const readAdminSession = () => {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || "null");
  } catch {
    return null;
  }
};

const writeAdminSession = (session) => {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
};

export const getAuthToken = (scope = "admin") => {
  if (scope !== "admin") return null;
  return readAdminSession()?.token || null;
};

export const getAuthUser = (scope = "admin") => {
  if (scope !== "admin") return null;
  return readAdminSession()?.user || null;
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

// Mock Data
const mockCollections = [
  { id: 1, name: "New Arrivals", slug: "new-arrivals", card_image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400", sort_order: 1, is_active: true, product_ids: [1, 3] },
  { id: 2, name: "Bestsellers", slug: "bestsellers", card_image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400", sort_order: 2, is_active: true, product_ids: [2, 4] },
];

const mockProducts = [
  {
    id: 1,
    name: "Running Shoes Pro",
    brand: "Nike",
    price: 4500,
    old_price: 5500,
    category: "premium",
    audience: "unisex",
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200",
    section: "premium",
  },
  {
    id: 2,
    name: "Training Gloves",
    brand: "Adidas",
    price: 3200,
    old_price: 4000,
    category: "bestseller",
    audience: "men",
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=200",
    section: "bestseller",
  },
  {
    id: 3,
    name: "Yoga Mat",
    brand: "Puma",
    price: 2800,
    old_price: 3500,
    category: "new",
    audience: "women",
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200",
    section: "new",
  },
  {
    id: 4,
    name: "Football Kit",
    brand: "Nike",
    price: 5200,
    old_price: 6000,
    category: "premium",
    audience: "unisex",
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=200",
    section: "premium",
  },
  {
    id: 5,
    name: "Gym Bag",
    brand: "Under Armour",
    price: 2100,
    old_price: 2800,
    category: "bestseller",
    audience: "women",
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&q=80&w=200",
    section: "bestseller",
  },
  {
    id: 6,
    name: "Cricket Bat",
    brand: "SS",
    price: 6500,
    old_price: 7500,
    category: "premium",
    audience: "men",
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1622279457486-28f0ecf5b4b8?auto=format&fit=crop&q=80&w=200",
    section: "premium",
  },
  {
    id: 7,
    name: "Cycling Helmet",
    brand: "Decathlon",
    price: 3900,
    old_price: 4500,
    category: "new",
    audience: "unisex",
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&q=80&w=200",
    section: "new",
  },
  {
    id: 8,
    name: "Basketball",
    brand: "Spalding",
    price: 4800,
    old_price: 5200,
    category: "bestseller",
    audience: "women",
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=200",
    section: "bestseller",
  },
];

const siteContent = [
  {
    id: 1,
    section_key: "hero_slider",
    title: "Sports Collection",
    subtitle: "New Active Gear",
    description:
      "Explore premium sports and fitness essentials for every athlete.",
    cta_label: "Shop Now",
    cta_href: "/shop",
    image_url:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200",
    sort_order: 0,
    is_active: true,
  },
  {
    id: 2,
    section_key: "brand_banners",
    title: "Fitness Essentials",
    subtitle: "Flat 20% Off",
    description:
      "Upgrade your training with premium sports accessories and gear.",
    cta_label: "Explore",
    cta_href: "/shop?sports=true",
    image_url:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600",
    sort_order: 0,
    is_active: true,
  },
];

const mockOrders = [
  { id: 1, order_number: "DZ-1001", status: "delivered", payment_status: "paid", payment_method: "online", total_price: 4500, subtotal: 4500, shipping_fee: 0, created_at: new Date(Date.now() - 86400000).toISOString(), items: [mockProducts[0]], address_data: { fullName: "Aarav Mehta", phone: "+91 9876543210", addressLine: "123, Marine Drive, Mumbai", city: "Mumbai" } },
  { id: 2, order_number: "DZ-1002", status: "pending", payment_status: "pending", payment_method: "cash_on_delivery", total_price: 3200, subtotal: 3200, shipping_fee: 100, created_at: new Date(Date.now() - 3600000).toISOString(), items: [mockProducts[1]], address_data: { fullName: "Priya Sharma", phone: "+91 8765432109", addressLine: "456, Jubilee Hills, Hyderabad", city: "Hyderabad" } },
  { id: 3, order_number: "DZ-1003", status: "shipped", payment_status: "paid", payment_method: "online", total_price: 5200, subtotal: 5200, shipping_fee: 0, created_at: new Date(Date.now() - 43200000).toISOString(), items: [mockProducts[3]], address_data: { fullName: "Rahul Verma", phone: "+91 7654321098", addressLine: "789, Connaught Place, Delhi", city: "Delhi" } },
  { id: 4, order_number: "DZ-1004", status: "packed", payment_status: "paid", payment_method: "upi", total_price: 2100, subtotal: 2100, shipping_fee: 0, created_at: new Date(Date.now() - 7200000).toISOString(), items: [mockProducts[4]], address_data: { fullName: "Neha Patel", phone: "+91 6543210987", addressLine: "101, MG Road, Pune", city: "Pune" } },
];

const mockUsers = [
  { id: 1, name: "Aarav Mehta", email: "aarav@example.com", phone: "+91 9876543210", role: "customer", city: "Mumbai", gender: "Male", joined_at: "2023-01-15", is_verified: true, email_verified: true, phone_verified: true, created_at: "2023-01-15T10:00:00Z" },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", phone: "+91 8765432109", role: "customer", city: "Hyderabad", gender: "Female", joined_at: "2023-02-20", is_verified: false, email_verified: true, phone_verified: false, created_at: "2023-02-20T14:30:00Z" },
  { id: 3, name: "Rahul Verma", email: "rahul@example.com", phone: "+91 7654321098", role: "customer", city: "Delhi", gender: "Male", joined_at: "2023-03-10", is_verified: true, email_verified: true, phone_verified: true, created_at: "2023-03-10T09:15:00Z" },
  { id: 4, name: "Neha Patel", email: "neha@example.com", phone: "+91 6543210987", role: "customer", city: "Pune", gender: "Female", joined_at: "2023-04-05", is_verified: true, email_verified: true, phone_verified: true, created_at: "2023-04-05T16:45:00Z" },
];

const mockStockAlerts = [
  { id: 1, product_id: 2, email: "user1@example.com", status: "pending", created_at: new Date().toISOString() },
  { id: 2, product_id: 6, email: "user2@example.com", status: "pending", created_at: new Date().toISOString() },
];

// Global Fetch Mock
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  const path = typeof url === "string" ? url : url.url;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

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
