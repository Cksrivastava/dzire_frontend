import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  Share2,
  Copy,
  CheckCircle,
  Info,
  ThumbsUp,
  ChevronRight,
  Home,
  User,
  Wallet,
  Download,
  ChevronDown,
  MessageCircle,
  Star,
} from "lucide-react";
import "./OrderDetails.css";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [showUpdates, setShowUpdates] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState(0);
  const [helpful, setHelpful] = useState(false);
  const [showFees, setShowFees] = useState(false);

  const order = state || {};
  const price = Number(order.price || 457);
  const listingPrice = Number(order.listingPrice || price + 42);
  const sellingPrice = Number(order.sellingPrice || price - 7);
  const fees = Number(order.fees || 7);
  const orderId = order.orderId || "OD436473014234907100";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Dzire Order Details",
      text: `Order ID: ${orderId}`,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      handleCopy();
    }
  };

  const handleInvoiceDownload = () => {
    const invoiceContent = `
DZIRE STORE INVOICE

Order ID: ${orderId}
Product: ${order.productName || "Dzire Premium Sports Product"}
Customer: ${order.customerName || "Ck Srivastava"}
Phone: ${order.phone || "9876543210"}
Address: ${order.address || "Varanasi"}

Listing Price: ₹${listingPrice}
Selling Price: ₹${sellingPrice}
Fees: ₹${fees}
Total Amount: ₹${price}

Payment Method: ${order.paymentMode || "Dzire Wallet"}
Status: Order Confirmed
`;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderId}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />

      <div className="od-page">
        <div className="od-topbar">
          <button className="od-icon-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </button>

          <h1>Order Details</h1>

          <button className="od-help-btn">Help</button>

          <button className="od-icon-btn" onClick={handleShare}>
            <Share2 size={21} />
          </button>
        </div>

        <main className="od-layout">
          <div className="od-left">
            <div className="od-product-card">
              <div className="od-product-content">
                <div>
                  <h2>{order.productName || "Dzire Premium Sports Product"}</h2>
                  <p>Color: {order.color || "Multicolor"}</p>
                  <span>Seller: DZIRE STORE</span>
                  <h3>₹{price.toLocaleString()}</h3>
                </div>

                <img
                  src={order.image || "https://picsum.photos/120/120?random=20"}
                  alt={order.productName || "Product"}
                />
              </div>
            </div>

            <section className="od-status-card">
              <div className="od-timeline-row">
                <CheckCircle size={18} />
                <p>Order Confirmed, Today</p>
              </div>

              <div className="od-green-line"></div>

              <div className="od-timeline-row">
                <CheckCircle size={18} />
                <p>Delivery expected by Fri Jan 09</p>
              </div>

              <button
                className="od-update-btn"
                onClick={() => setShowUpdates(!showUpdates)}
              >
                See All Updates <ChevronRight size={18} />
              </button>

              {showUpdates && (
                <div className="od-update-box">
                  <p>✓ Order has been placed successfully.</p>
                  <p>✓ Payment details received.</p>
                  <p>• Product will be shipped soon.</p>
                  <p>• Delivery executive details will be available later.</p>
                </div>
              )}
            </section>

            <div className="od-chat-box">
              <MessageCircle size={20} />
              <span>Chat with us</span>
            </div>

            <section className="od-rate-section">
              <h2>Rate your experience</h2>

              <div className="od-rating-box">
                <p>Rate the product</p>
                <div className="od-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={26}
                      onClick={() => setRated(star)}
                      fill={rated >= star ? "#ff9f00" : "none"}
                      color={rated >= star ? "#ff9f00" : "#878787"}
                    />
                  ))}
                </div>
              </div>

              <div
                className={`od-helpful-card ${helpful ? "active" : ""}`}
                onClick={() => setHelpful(!helpful)}
              >
                <ThumbsUp size={21} />
                <p>
                  {helpful
                    ? "Thanks for your feedback"
                    : "Did you find this page helpful?"}
                </p>
                <ChevronRight size={22} />
              </div>
            </section>

            <div className="od-bottom-order">
              <span>Order #{orderId}</span>
              <button onClick={handleCopy}>
                <Copy size={16} />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="od-right">
            <section className="od-section">
              <h2>Delivery details</h2>

              <div className="od-delivery-card">
                <div className="od-delivery-row">
                  <Home size={20} />
                  <p>
                    <strong>Home</strong>
                    <span>{order.address || "Varanasi"}</span>
                  </p>
                </div>

                <div className="od-divider"></div>

                <div className="od-delivery-row">
                  <User size={20} />
                  <p>
                    <strong>{order.customerName || "Ck Srivastava"}</strong>
                    <span>{order.phone || "9876543210"}</span>
                  </p>
                </div>
              </div>
            </section>

            <section className="od-section">
              <h2>Price details</h2>

              <div className="od-price-card">
                <div className="od-price-row">
                  <span>Listing price</span>
                  <b className="od-cut">₹{listingPrice.toLocaleString()}</b>
                </div>

                <div className="od-price-row">
                  <span>
                    Special price <Info size={14} />
                  </span>
                  <b>₹{sellingPrice.toLocaleString()}</b>
                </div>

                <div
                  className="od-price-row"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowFees(!showFees)}
                >
                  <span>
                    Total fees{" "}
                    <ChevronDown
                      size={16}
                      style={{
                        transform: showFees ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "0.3s",
                      }}
                    />
                  </span>
                  <b>₹{fees}</b>
                </div>

                {showFees && (
                  <>
                    <div className="od-small-row">
                      <span>Payment Handling Fee</span>
                      <b>₹4</b>
                    </div>

                    <div className="od-small-row">
                      <span>Platform fee</span>
                      <b>₹3</b>
                    </div>
                  </>
                )}

                <div className="od-dashed"></div>

                <div className="od-price-row od-total-row">
                  <span>Total amount</span>
                  <b>₹{price.toLocaleString()}</b>
                </div>

                <div className="od-payment-box">
                  <span>Paid By</span>
                  <b>
                    <Wallet size={18} />
                    {order.paymentMode || "Cash On Delivery"}
                  </b>
                </div>

                <button className="od-invoice-btn" onClick={handleInvoiceDownload}>
                  <Download size={20} />
                  Download Invoice
                </button>
              </div>
            </section>

            <section className="od-offer-card">
              <h2>Offers earned</h2>
              <p>Buy this & get 10% off upto ₹250 on Sports Products</p>
            </section>
          </div>
        </main>

        <Link to="/shop" className="od-shop-btn">
          Shop more from Dzire
        </Link>

        <Footer />
      </div>
    </>
  );
};

export default OrderDetails;