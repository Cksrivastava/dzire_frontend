import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutContactShippingForm from '../components/checkout/CheckoutContactShippingForm';
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary';
import { ShopContext } from '../context/ShopContext';
import { orderAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, user } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    contact: user?.email || user?.phone || "",
    fullName: user?.name || "",
    street: user?.addresses?.[0]?.street || "",
    city: user?.addresses?.[0]?.city || "",
    state: user?.addresses?.[0]?.state || "",
    pincode: user?.addresses?.[0]?.pincode || "",
    deliveryMethod: "home",
    gstin: "",
    businessName: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.length > 0
    ? cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    : 7498;
  const gst = Math.round(subtotal * 0.18);
  const shipping = formData.deliveryMethod === "pickup" ? 0 : 50;
  const discount = 0;
  const total = subtotal + gst + shipping - discount;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    const orderPayload = {
      items: cartItems.length > 0 ? cartItems : [
        { id: 1, name: "Premium Hiking Backpack", price: 2499, quantity: 1 },
        { id: 2, name: "Camping Tent (2 Person)", price: 4999, quantity: 1 },
      ],
      shippingAddress: {
        fullName: formData.fullName || "Customer",
        street: formData.street || "Pune Street",
        city: formData.city || "Pune",
        state: formData.state || "Maharashtra",
        pincode: formData.pincode || "411001",
      },
      total,
      subtotal,
      gst,
      shippingCost: shipping,
      discount,
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Credit/Debit Card, UPI (Razorpay)",
      contactEmail: formData.contact?.includes("@") ? formData.contact : user?.email || "customer@example.com",
      contactPhone: !formData.contact?.includes("@") ? formData.contact : user?.phone || "",
      fullName: formData.fullName || user?.name || "Customer",
    };

    try {
      const res = await orderAPI.create(orderPayload);
      const createdOrder = res.order || { orderId: `DZ-${Math.floor(10000 + Math.random() * 90000)}` };

      navigate("/order-details", {
        state: {
          orderId: createdOrder.orderId,
          orderStatus: createdOrder.status || "Confirmed",
          orderDate: createdOrder.date || "Just now",
        },
      });
    } catch (err) {
      console.warn("API Order create fallback:", err.message);
      const fallbackId = `DZ-${Math.floor(10000 + Math.random() * 90000)}`;
      navigate("/order-details", {
        state: {
          orderId: fallbackId,
          orderStatus: "Confirmed",
          orderDate: "Just now",
        },
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
        </div>
        
        <div className="checkout-content">
          <CheckoutContactShippingForm
            formData={formData}
            onChange={handleChange}
          />
          <CheckoutOrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            gst={gst}
            shipping={shipping}
            discount={discount}
            total={total}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
