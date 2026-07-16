import React from "react";
import "./ShippingPolicy.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const ShippingPolicy = () => {
  return (
    <>
      <Navbar />

      <div className="shipping-policy-page">
        {/* HERO */}
        <section className="shipping-hero">
          <div className="shipping-hero-overlay">
            <h1>SHIPPING</h1>
          </div>
        </section>

        {/* MAIN SECTION */}
        <section className="shipping-main-section">
          <div className="shipping-main-container">
            {/* LEFT SIDEBAR */}
            <aside className="shipping-sidebar">
              <div className="shipping-sidebar-block">
                <h4 className="shipping-sidebar-heading active">
                  <ChevronDown size={15} />
                  <span>CUSTOMER SERVICE</span>
                </h4>

                <ul className="shipping-sidebar-links">
                  <li>
                    <Link to="/contact">
                      <ChevronRight size={13} />
                      Contact Us
                    </Link>
                  </li>
                  <li className="active-link">
                    <Link to="/shipping-policy">Shipping</Link>
                  </li>
                  <li>
                    <Link to="/returns">Returns</Link>
                  </li>
                  <li>
                    <Link to="/privacy">Privacy</Link>
                  </li>
                  <li>
                    <Link to="/terms">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link to="/support">FAQ</Link>
                  </li>
                </ul>
              </div>

              <div className="shipping-sidebar-collapsed">
                <h4>
                  <ChevronRight size={15} />
                  <span>WHO WE ARE</span>
                </h4>
              </div>

              <div className="shipping-sidebar-collapsed">
                <h4>
                  <ChevronRight size={15} />
                  <span>LEGAL</span>
                </h4>
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <div className="shipping-content">
              <div className="shipping-content-block">
                <h2>SHIPPING POLICY</h2>
                <p>
                  At Dzire Store, we aim to provide you with a seamless shopping
                  experience. We are committed to delivering your order with
                  high-quality packaging within the promised timeframe. All
                  orders are shipped through trusted courier partners to ensure a
                  hassle-free experience.
                </p>
              </div>

              <div className="shipping-content-block">
                <h2>WHAT ARE THE SHIPPING CHARGES?</h2>
                <p>
                  Shipping cost is based on offers and the total shopping cart
                  value.
                </p>

                <div className="shipping-bullet-list">
                  <p>
                    <strong>- Free Shipping</strong> on all orders above ₹1499
                  </p>
                  <p>
                    <strong>- Standard Shipping Fee</strong> will be applied at
                    checkout for orders below ₹1499
                  </p>
                </div>
              </div>

              <div className="shipping-content-block">
                <h2>HOW LONG WILL MY ORDER TAKE FOR DELIVERY?</h2>
                <p>
                  Most orders are delivered within <strong>6–7 business days</strong> in
                  India. Orders are shipped throughout the week to support
                  faster delivery.
                </p>
                <p>
                  Delivery timelines may vary due to factors beyond our control,
                  such as courier delays, weather disruptions, or unforeseen
                  circumstances.
                </p>
              </div>

              <div className="shipping-content-block">
                <h2>HOW ARE PRODUCTS PACKED?</h2>
                <p>
                  All items are packed in secure, tamper-proof packaging to make
                  sure your order reaches you safely and in good condition.
                </p>
              </div>

              <div className="shipping-content-block">
                <h2>WHAT IF I RECEIVE A TAMPERED PACKAGE?</h2>
                <p>
                  If you find the package tampered with, please do not accept
                  the delivery and return it immediately to the delivery
                  executive.
                </p>
                <p>
                  Contact us on WhatsApp at <strong>9923080044</strong> with your{" "}
                  <strong>Order ID</strong>, and our team will assist you.
                </p>
              </div>

              <div className="shipping-content-block">
                <h2>WHAT IF I HAVE ALREADY ACCEPTED THE DELIVERY?</h2>
                <p>
                  If the delivery has been accepted, it will be considered that
                  the parcel was received in good condition.
                </p>
              </div>

              <div className="shipping-content-block">
                <h2>CAN DELIVERY BE DELAYED?</h2>
                <p>
                  Yes. Dzire Store is not responsible for courier delays or
                  external factors such as weather disruptions or unforeseen
                  circumstances affecting delivery timelines.
                </p>
                <p>
                  However, we will actively help you track and resolve any such
                  issues with our logistics partners.
                </p>
              </div>

              <div className="shipping-content-block">
                <h2>DISCLAIMER</h2>
                <p>
                  Dzire Store is not responsible for delays caused by courier
                  partners or events outside our control. Even so, our support
                  team will always try to help you with tracking updates and
                  issue resolution wherever possible.
                </p>
              </div>
            </div>
          </div>
        </section>
       </div>

      <Footer />
    </>
  );
};

export default ShippingPolicy;