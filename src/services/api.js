import wsClient from "./websocket.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://dzire-backend.onrender.com/api";

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes default TTL
const cache = new Map();
const inFlightRequests = new Map();

export const apiCache = {
  get: (key) => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > (entry.ttl || CACHE_TTL_MS)) {
      cache.delete(key);
      return null;
    }
    return entry.data;
  },
  set: (key, data, ttl = CACHE_TTL_MS) => {
    cache.set(key, { data, timestamp: Date.now(), ttl });
  },
  invalidate: (prefixOrPattern) => {
    if (!prefixOrPattern) {
      cache.clear();
      return;
    }
    for (const key of cache.keys()) {
      if (typeof prefixOrPattern === "string" && key.includes(prefixOrPattern)) {
        cache.delete(key);
      } else if (prefixOrPattern instanceof RegExp && prefixOrPattern.test(key)) {
        cache.delete(key);
      }
    }
  },
  clear: () => cache.clear(),
};

// Auto-invalidate cache on WebSocket events so UI stays 100% synchronized in real time
wsClient.on("PRODUCT_UPDATED", () => {
  apiCache.invalidate("/products");
});
wsClient.on("CATEGORIES_UPDATED", () => {
  apiCache.invalidate("/categories");
  apiCache.invalidate("/products");
});
wsClient.on("OFFERS_UPDATED", () => {
  apiCache.invalidate("/coupons");
  apiCache.invalidate("/offers");
  apiCache.invalidate("/products");
});
wsClient.on("ORDERS_UPDATED", () => {
  apiCache.invalidate("/orders");
});
wsClient.on("EVENTS_UPDATED", () => {
  apiCache.invalidate("/events");
});
wsClient.on("BLOGS_UPDATED", () => {
  apiCache.invalidate("/blogs");
});

const getHeaders = (token) => {
  const headers = { "Content-Type": "application/json" };
  const savedToken = token || localStorage.getItem("token");
  if (savedToken) {
    headers["Authorization"] = `Bearer ${savedToken}`;
  }
  return headers;
};

// Generic fetch wrapper with intelligent caching, deduplication & error handling
const request = async (endpoint, options = {}) => {
  const method = (options.method || "GET").toUpperCase();
  const url = `${API_BASE_URL}${endpoint}`;
  const isGet = method === "GET";
  const cacheKey = `${endpoint}_${options.token || localStorage.getItem("token") || ""}`;

  // If GET and cached and not explicitly skipping cache:
  if (isGet && !options.skipCache) {
    const cached = apiCache.get(cacheKey);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    // Deduplicate in-flight concurrent requests for the same endpoint
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...getHeaders(options.token),
          ...options.headers,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }

      // Cache successful GET responses
      if (isGet && !options.skipCache) {
        apiCache.set(cacheKey, data, options.ttl);
      } else if (!isGet) {
        // Mutation occurred: automatically invalidate matching cache
        const root = endpoint.split("/")[1];
        if (root) {
          apiCache.invalidate(`/${root}`);
        }
      }

      return data;
    } catch (error) {
      console.warn(`API Request error for ${endpoint}:`, error.message);
      throw error;
    } finally {
      if (isGet) {
        inFlightRequests.delete(cacheKey);
      }
    }
  })();

  if (isGet && !options.skipCache) {
    inFlightRequests.set(cacheKey, fetchPromise);
  }

  return fetchPromise;
};

// --- AUTH API ---
export const authAPI = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMe: (token) =>
    request("/auth/me", {
      method: "GET",
      token,
    }),
};

// --- USER API ---
export const userAPI = {
  updateProfile: (payload, token) =>
    request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
      token,
    }),

  getAddresses: (token) =>
    request("/users/addresses", {
      method: "GET",
      token,
    }),

  addAddress: (payload, token) =>
    request("/users/addresses", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),

  deleteAddress: (id, token) =>
    request(`/users/addresses/${id}`, {
      method: "DELETE",
      token,
    }),

  setDefaultAddress: (id, token) =>
    request(`/users/addresses/${id}/default`, {
      method: "PUT",
      token,
    }),

  getCredits: (token) =>
    request("/users/credits", {
      method: "GET",
      token,
    }),

  getWishlist: (token) =>
    request("/users/wishlist", {
      method: "GET",
      token,
    }),

  syncWishlist: (payload, token) =>
    request("/users/wishlist", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),

  deleteAccount: (token) =>
    request("/users/account", {
      method: "DELETE",
      token,
    }),
};

// --- PRODUCTS API ---
export const productAPI = {
  getSections: () => request("/products/sections/all"),

  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },

  getById: (id, options = {}) => request(`/products/${id}`, options),

  addReview: (id, payload) =>
    request(`/products/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// --- BOOKS API ---
export const bookAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/books${qs ? `?${qs}` : ""}`);
  },

  getById: (id) => request(`/books/${id}`),

  addReview: (id, payload) =>
    request(`/books/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// --- RENTALS API ---
export const rentalAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/rentals${qs ? `?${qs}` : ""}`);
  },

  getById: (id) => request(`/rentals/${id}`),

  book: (payload, token) =>
    request("/rentals/book", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),
};

// --- EVENTS API ---
export const eventAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/events${qs ? `?${qs}` : ""}`);
  },

  getById: (id) => request(`/events/${id}`),

  register: (payload, token) =>
    request("/events/register", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),
};

// --- ORDERS API ---
export const orderAPI = {
  create: (payload, token) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),

  getAll: (token) =>
    request("/orders", {
      method: "GET",
      token,
    }),

  getById: (id, token) =>
    request(`/orders/${id}`, {
      method: "GET",
      token,
    }),

  requestReturn: (id, payload, token) =>
    request(`/orders/${id}/return`, {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),
};

// --- BLOGS API ---
export const blogAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/blogs${qs ? `?${qs}` : ""}`);
  },

  getBySlug: (slug) => request(`/blogs/${slug}`),

  addComment: (slug, payload) =>
    request(`/blogs/${slug}/comments`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  likeComment: (slug, commentId, liked) =>
    request(`/blogs/${slug}/comments/${commentId}/like`, {
      method: "POST",
      body: JSON.stringify({ liked }),
    }),
};

// --- CATEGORIES API ---
export const categoryAPI = {
  getAll: () => request("/admin/categories"),
};

// --- OFFERS & BANNERS API ---
export const offerAPI = {
  getAll: () => request("/admin/offers"),
};

// --- COUPONS API ---
export const couponAPI = {
  getAll: () => request("/admin/coupons"),
};

// --- BRANDS API ---
export const brandAPI = {
  getAll: () => request("/admin/brands"),
};

// --- CONTACT API ---
export const contactAPI = {
  submit: (payload) =>
    request("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getAll: (token) =>
    request("/contact", {
      method: "GET",
      token,
    }),
};

export default {
  auth: authAPI,
  user: userAPI,
  products: productAPI,
  books: bookAPI,
  rentals: rentalAPI,
  events: eventAPI,
  orders: orderAPI,
  blogs: blogAPI,
  contact: contactAPI,
  categories: categoryAPI,
  offers: offerAPI,
  coupons: couponAPI,
  brands: brandAPI,
};
