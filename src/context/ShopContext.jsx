import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [compareItems, setCompareItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const compare = JSON.parse(localStorage.getItem("compareItems")) || [];

    setCartItems(cart);
    setWishlistItems(wishlist);
    setCompareItems(compare);
  }, []);

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
    const exist = wishlistItems.find((item) => item.id === product.id);

    if (exist) {
      setWishlistItems((prev) =>
        prev.filter((item) => item.id !== product.id)
      );
    } else {
      setWishlistItems((prev) => [...prev, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
  };

  const isWishlisted = (id) => {
    return wishlistItems.some((item) => String(item.id) === String(id));
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