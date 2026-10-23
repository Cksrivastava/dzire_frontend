import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { DEFAULT_CART_ITEMS, AVAILABLE_OFFERS } from "../data/cartDefaults";
import CartHeader from "../components/cart/CartHeader";
import CartEmptyState from "../components/cart/CartEmptyState";
import CartTable from "../components/cart/CartTable";
import CartSummary from "../components/cart/CartSummary";
import CartTrustBadges from "../components/cart/CartTrustBadges";
import "./Cart.css";

const normalizeCartItem = (item, idx) => {
  let size = item.size;
  let availableSizes = item.availableSizes;

  if (!size || size === "Standard") {
    if (item.category === "Backpack") {
      size = "60L";
      availableSizes = ["50L", "60L", "70L"];
    } else if (
      item.category === "Trekking Shoes" ||
      item.category === "Foot-Wear"
    ) {
      size = "UK 8";
      availableSizes = ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];
    } else {
      size = "M";
      availableSizes = ["S", "M", "L", "XL"];
    }
  }

  if (!availableSizes || availableSizes.includes("Standard")) {
    availableSizes = ["S", "M", "L", "XL"];
  }

  return {
    ...item,
    id: item.id || `cart-${idx}`,
    category: item.category || "Gear",
    color: item.color || "Black",
    size: size || "M",
    inStock: true,
    availableColors: item.availableColors || [
      { name: "Black", hex: "#18181b" },
      { name: "Blue", hex: "#1d4ed8" },
      { name: "Olive Green", hex: "#4d7c0f" },
    ],
    availableSizes: availableSizes,
  };
};

const Cart = () => {
  const navigate = useNavigate();
  const shopContext = useContext(ShopContext);
  const user = shopContext?.user;

  useEffect(() => {
    if (!user) {
      navigate("/login?redirectTo=/cart");
    }
  }, [user, navigate]);

  const contextCartItems = shopContext?.cartItems || [];
  const removeFromCart = shopContext?.removeFromCart || (() => {});
  const addToCart = shopContext?.addToCart || (() => {});
  const decreaseCartQuantity = shopContext?.decreaseCartQuantity || (() => {});
  const toggleWishlist = shopContext?.toggleWishlist || (() => {});

  // Local active cart items list (fallback to DEFAULT_CART_ITEMS if context cart is empty)
  const [items, setItems] = useState(() => {
    if (contextCartItems.length > 0) {
      return contextCartItems.map((item, idx) => normalizeCartItem(item, idx));
    }
    return DEFAULT_CART_ITEMS;
  });

  const [couponCode, setCouponCode] = useState("DZIRE10");
  const [appliedCouponName, setAppliedCouponName] = useState("DZIRE10");

  const [showGstForm, setShowGstForm] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstSaved, setGstSaved] = useState(false);

  useEffect(() => {
    if (contextCartItems.length > 0) {
      setItems(contextCartItems.map((item, idx) => normalizeCartItem(item, idx)));
    }
  }, [contextCartItems]);

  const handleUpdateQuantity = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
    if (delta > 0) {
      const targetItem = items.find((i) => i.id === id);
      if (targetItem && addToCart) addToCart(targetItem);
    } else {
      if (decreaseCartQuantity) decreaseCartQuantity(id);
    }
  };

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (removeFromCart) removeFromCart(id);
  };

  const handleClearCart = () => {
    setItems([]);
    if (contextCartItems.length > 0 && shopContext?.setCartItems) {
      shopContext.setCartItems([]);
    }
  };

  const handleColorSelect = (itemId, colorName) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, color: colorName } : item
      )
    );
  };

  const handleSizeSelect = (itemId, sizeVal) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, size: sizeVal } : item
      )
    );
  };

  const handleMoveToWishlist = (item) => {
    if (toggleWishlist) toggleWishlist(item);
    handleRemoveItem(item.id);
    alert(`"${item.name}" moved to Wishlist`);
  };

  const handleProductClick = (item) => {
    const targetId = item.originalId || item.id;
    if (
      String(targetId).startsWith("book-") ||
      item.category === "Book" ||
      item.category === "Bookstore" ||
      item.category === "Books"
    ) {
      navigate(`/bookstore/${targetId}`, { state: item });
    } else {
      const slug =
        item?.seoSlug ||
        item?.slug ||
        (item?.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : targetId);
      navigate(`/product/${slug}`, { state: item });
    }
  };

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const baseShipping = 99;
  const freeShippingThreshold = 12000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : baseShipping;

  const computeDiscount = (couponName, currentSubtotal, currentShippingFee) => {
    if (!couponName) return 0;
    const code = couponName.toUpperCase();
    if (code === "DZIRE10") {
      if (currentSubtotal < 2999) return 0;
      return Math.min(500, Math.round(currentSubtotal * 0.1));
    }
    if (code === "ADVENTURE15") {
      if (currentSubtotal < 5000) return 0;
      return Math.min(1000, Math.floor(currentSubtotal * 0.15));
    }
    if (code === "FREESHIP") {
      if (currentSubtotal < 999) return 0;
      return currentShippingFee > 0 ? currentShippingFee : 99;
    }
    return 0;
  };

  const appliedDiscount = computeDiscount(appliedCouponName, subtotal, shippingFee);
  const grandTotal = Math.max(0, subtotal + shippingFee - appliedDiscount);
  const gstAmount = Math.round((subtotal * 18) / 118);
  const amountAwayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );

  useEffect(() => {
    if (appliedCouponName) {
      const match = AVAILABLE_OFFERS.find((o) => o.code === appliedCouponName);
      if (match && subtotal < match.minOrder) {
        setAppliedCouponName("");
        setCouponCode("");
      }
    }
  }, [subtotal, appliedCouponName]);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      alert("Please enter a coupon code");
      return;
    }
    const matchingOffer = AVAILABLE_OFFERS.find((o) => o.code === code);
    if (matchingOffer) {
      if (subtotal < matchingOffer.minOrder) {
        alert(
          `Coupon "${code}" requires a minimum order price of ₹${matchingOffer.minOrder.toLocaleString(
            "en-IN"
          )}.\n\nYour current cart total is ₹${subtotal.toLocaleString(
            "en-IN"
          )}. Add ₹${(matchingOffer.minOrder - subtotal).toLocaleString(
            "en-IN"
          )} more to select this offer!`
        );
        return;
      }
      setAppliedCouponName(code);
      setCouponCode(code);
      const discountVal = computeDiscount(code, subtotal, shippingFee);
      alert(`Coupon "${code}" applied successfully! Saved ₹${discountVal.toLocaleString("en-IN")}`);
    } else {
      alert(`Coupon "${code}" is invalid or expired.`);
    }
  };

  const handleProceedCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/order-details", {
      state: {
        orderId: "DZIRE2505181024",
        customerName: "Ananya",
        email: "ananya.patil@email.com",
        orderDate: "18 May, 2025 • 10:24 AM",
        paymentStatus: "Paid",
        paymentMethod: "UPI – Google Pay",
        orderStatus: "Confirmed",
        items: items,
        subtotal: subtotal,
        shippingFee: shippingFee,
        discountAmount: appliedDiscount,
        grandTotal: grandTotal,
        shippingAddress: {
          name: "Ananya Patil",
          address: "Flat 12, Sai Residency,\nBaner Road, Pune – 411045\nMaharashtra, India",
          phone: "+91 98765 43210",
        },
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="dz-cart-page">
        <div className="dz-cart-wrapper">
          {/* TOP TITLE & BREADCRUMB BAR */}
          <CartHeader
            totalCount={items.reduce((acc, item) => acc + (item.quantity || 1), 0)}
          />

          {items.length === 0 ? (
            <CartEmptyState />
          ) : (
            <div className="dz-cart-grid">
              {/* LEFT COLUMN: PRODUCTS TABLE & OPTIONS */}
              <CartTable
                items={items}
                handleProductClick={handleProductClick}
                handleUpdateQuantity={handleUpdateQuantity}
                handleRemoveItem={handleRemoveItem}
                handleMoveToWishlist={handleMoveToWishlist}
                handleColorSelect={handleColorSelect}
                handleSizeSelect={handleSizeSelect}
                handleClearCart={handleClearCart}
                amountAwayFromFreeShipping={amountAwayFromFreeShipping}
                freeShippingProgress={freeShippingProgress}
              />

              {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
              <CartSummary
                totalItemCount={totalItemCount}
                subtotal={subtotal}
                gstAmount={gstAmount}
                shippingFee={shippingFee}
                isFreeShipping={isFreeShipping}
                appliedDiscount={appliedDiscount}
                appliedCouponName={appliedCouponName}
                setAppliedCouponName={setAppliedCouponName}
                setCouponCode={setCouponCode}
                grandTotal={grandTotal}
                amountAwayFromFreeShipping={amountAwayFromFreeShipping}
                freeShippingProgress={freeShippingProgress}
                showGstForm={showGstForm}
                setShowGstForm={setShowGstForm}
                gstNumber={gstNumber}
                setGstNumber={setGstNumber}
                companyName={companyName}
                setCompanyName={setCompanyName}
                gstSaved={gstSaved}
                setGstSaved={setGstSaved}
                couponCode={couponCode}
                handleApplyCoupon={handleApplyCoupon}
                availableOffers={AVAILABLE_OFFERS}
                handleProceedCheckout={handleProceedCheckout}
              />

              {/* TRUST BADGES GRID ITEM */}
              <CartTrustBadges />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;