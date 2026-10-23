import React, { createContext, useEffect, useState } from "react";
import { authAPI, userAPI } from "../services/api";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const compare = JSON.parse(localStorage.getItem("compareItems")) || [];
    const savedUser = JSON.parse(localStorage.getItem("user")) || null;
    const savedToken = localStorage.getItem("token") || null;

    setCartItems(cart);
    setWishlistItems(wishlist);
    setCompareItems(compare);
    setUser(savedUser);
    setToken(savedToken);

    // Verify token with backend for secure authentication
    if (savedToken) {
      authAPI
        .getMe(savedToken)
        .then((res) => {
          if (res && res.success && res.user) {
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
            // Load backend wishlist
            userAPI
              .getWishlist(savedToken)
              .then((wRes) => {
                if (wRes && wRes.success && Array.isArray(wRes.wishlist)) {
                  setWishlistItems(wRes.wishlist);
                  localStorage.setItem("wishlistItems", JSON.stringify(wRes.wishlist));
                }
              })
              .catch(() => {});
          } else {
            // Invalid session
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        })
        .catch((err) => {
          console.warn("Session verification warning:", err?.message);
          // If explicitly unauthorized or expired token, clear storage
          const msg = (err?.message || "").toLowerCase();
          if (msg.includes("401") || msg.includes("expired") || msg.includes("invalid") || msg.includes("unauthorized")) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        });
    }
  }, []);

  const loginUser = async (email, password) => {
    const cleanEmail = (email || "").trim();

    try {
      const res = await authAPI.login({ email: cleanEmail, password });
      if (res && res.success && res.user) {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
        if (res.token) {
          setToken(res.token);
          localStorage.setItem("token", res.token);
          // Load backend wishlist
          userAPI
            .getWishlist(res.token)
            .then((wRes) => {
              if (wRes && wRes.success && Array.isArray(wRes.wishlist)) {
                setWishlistItems(wRes.wishlist);
                localStorage.setItem("wishlistItems", JSON.stringify(wRes.wishlist));
              }
            })
            .catch(() => {});
        }
        return res;
      }
      throw new Error(res?.message || "Invalid email or password.");
    } catch (err) {
      console.warn("Login failed:", err.message);
      throw err;
    }
  };

  const registerUser = async ({ name, email, password }) => {
    const cleanEmail = (email || "").trim();

    try {
      const res = await authAPI.register({ name, email: cleanEmail, password });
      if (res && res.success && res.user) {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
        if (res.token) {
          setToken(res.token);
          localStorage.setItem("token", res.token);
        }
        return res;
      }
      throw new Error(res?.message || "Registration failed.");
    } catch (err) {
      console.warn("Register failed:", err.message);
      throw err;
    }
  };

  const refreshUser = async () => {
    const currentToken = localStorage.getItem("token") || token;
    if (!currentToken) return null;
    try {
      const res = await authAPI.getMe(currentToken);
      if (res && res.success && res.user) {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
        return res.user;
      }
    } catch (err) {
      console.warn("Refresh user failed:", err.message);
    }
    return null;
  };

  const updateUserPhone = async (phone) => {
    const cleanPhone = (phone || "").trim();

    try {
      await userAPI.updateProfile({ phone: cleanPhone, phoneVerified: true });
    } catch (err) {
      console.warn("Backend profile update failed, using local update:", err.message);
    }

    setUser((prev) => {
      const updated = {
        ...(prev || {}),
        phone: cleanPhone,
        phoneVerified: true,
      };
      localStorage.setItem("user", JSON.stringify(updated));

      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const updatedUsers = registeredUsers.map((u) =>
        u.email?.toLowerCase() === updated.email?.toLowerCase()
          ? { ...u, phone: cleanPhone, phoneVerified: true }
          : u
      );
      if (
        updated.email &&
        !registeredUsers.some((u) => u.email?.toLowerCase() === updated.email?.toLowerCase())
      ) {
        updatedUsers.push(updated);
      }
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

      return updated;
    });
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const deleteAccount = async () => {
    const currentToken = localStorage.getItem("token") || token;
    try {
      if (currentToken) {
        await userAPI.deleteAccount(currentToken);
      }
    } catch (err) {
      console.warn("Backend delete account warning:", err?.message);
    } finally {
      setUser(null);
      setToken(null);
      setCartItems([]);
      setWishlistItems([]);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("wishlistItems");
    }
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    localStorage.setItem("compareItems", JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCart = (product) => {
    const exist = cartItems.find((item) => item.id === product.id);

    if (exist) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const decreaseCartQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
      );
  };

  const toggleWishlist = (product) => {
    const exist = wishlistItems.find((item) => String(item.id || item._id) === String(product.id || product._id));
    let nextWishlist = [];

    if (exist) {
      nextWishlist = wishlistItems.filter((item) => String(item.id || item._id) !== String(product.id || product._id));
    } else {
      nextWishlist = [...wishlistItems, product];
    }
    setWishlistItems(nextWishlist);
    localStorage.setItem("wishlistItems", JSON.stringify(nextWishlist));

    const currentToken = localStorage.getItem("token") || token;
    if (currentToken) {
      userAPI.syncWishlist({ items: nextWishlist }, currentToken).catch(() => {});
    }
  };

  const removeFromWishlist = (id) => {
    const nextWishlist = wishlistItems.filter((item) => String(item.id || item._id) !== String(id));
    setWishlistItems(nextWishlist);
    localStorage.setItem("wishlistItems", JSON.stringify(nextWishlist));

    const currentToken = localStorage.getItem("token") || token;
    if (currentToken) {
      userAPI.syncWishlist({ items: nextWishlist }, currentToken).catch(() => {});
    }
  };

  const isWishlisted = (id) => {
    return wishlistItems.some((item) => String(item.id || item._id) === String(id));
  };

  const toggleCompare = (product) => {
    const exist = compareItems.find((item) => String(item.id) === String(product.id));

    if (exist) {
      setCompareItems((prev) =>
        prev.filter((item) => String(item.id) !== String(product.id))
      );
    } else {
      if (compareItems.length >= 4) {
        alert("You can compare a maximum of 4 products at a time.");
        return;
      }
      setCompareItems((prev) => [...prev, product]);
    }
  };

  const removeFromCompare = (id) => {
    setCompareItems((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
  };

  const isInCompare = (id) => {
    return compareItems.some((item) => String(item.id) === String(id));
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        wishlistItems,
        compareItems,
        user,
        token,
        isAuthenticated: !!user,
        loginUser,
        registerUser,
        refreshUser,
        updateUserPhone,
        logoutUser,
        deleteAccount,
        addToCart,
        removeFromCart,
        decreaseCartQuantity,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        toggleCompare,
        removeFromCompare,
        isInCompare,
        cartCount,
        setCompareItems,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;