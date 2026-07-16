import React from "react";
import "./ReturnsPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Laptop, Printer, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const ReturnsPage = () => {
  return (
    <>
      <Navbar />

      <div className="returns-page">
        <div className="returns-wrapper">
          <div className="returns-left">
            <h1 className="returns-title">Returns</h1>

            <div className="returns-steps">
              <div className="return-step">
                <Laptop strokeWidth={1.4} className="step-icon" />
                <p>1. Enter Order Information</p>
              </div>

              <div className="return-step">
                <Printer strokeWidth={1.4} className="step-icon" />
                <p>2. Print The Label</p>
              </div>

              <div className="return-step">
                <Package strokeWidth={1.4} className="step-icon" />
                <p>3. Pack Up Your Items</p>
              </div>

              <div className="return-step">
                <Truck strokeWidth={1.4} className="step-icon" />
                <p>4. Ship The Package</p>
              </div>
            </div>

            <div className="returns-form-top">
              <h2>Enter the information below to quickly start your return.</h2>
              <span>*Required</span>
            </div>

            <form className="returns-form">
              <div className="form-group">
                <input type="text" placeholder="Order Number *" />
                <small>e.g. 15133006 or 200006567</small>
              </div>

              <div className="form-group">
                <input type="email" placeholder="Email *" />
              </div>

              <div className="form-group">
                <input type="text" placeholder="Billing Zip Code *" />
                <small>For Klarna orders, use shipping zip code instead.</small>
              </div>

              <button type="submit" className="find-order-btn">
                Find Order
              </button>

              <p className="signin-text">
                Already have an account? <a href="/">Sign In</a>
              </p>
            </form>
          </div>

          <div className="returns-right">
            <h2>Frequently Asked Questions</h2>

            <div className="faq-item">
              <h3>What can I return?</h3>
              <p>
                We will gladly accept returns on all purchases made on our
                website which are in original condition; unworn with tags
                attached and for footwear with the original box in new
                condition.
              </p>
            </div>

            <div className="faq-item">
              <h3>When can I return?</h3>
              <p>
                Purchases may be returned within 60 days of purchase date. We
                will gladly accept returns on all purchases made on our website
                which are in original condition; unworn with tags attached and
                footwear with the original box in new condition.
              </p>
            </div>

            <div className="faq-item">
              <h3>Where can I return?</h3>
              <p>
                Bring your return to your nearest{" "}
                <a href="/">UPS dropoff location</a>.
              </p>
              <p>
                When returning items to a Columbia store, please present your
                Order Confirmation email.
              </p>
              <p>
                Parcels can only be returned from the country where they were
                delivered. Please visit our detailed <a href="/">FAQ page</a>{" "}
                for more information.
              </p>
            </div>

            <div className="faq-item">
              <h3>When do I get my refund?</h3>
              <p>
                Once we receive your package, our team will verify its contents,
                inspect it to ensure it is unworn and in original condition. We
                will then send the credit back to your financial institution
                within 7-10 business days.
              </p>
            </div>

            <div className="faq-item">
              <h3>How can I exchange an item?</h3>
              <p>
                Please note direct exchanges of our products are not possible at
                this stage. If you need a different size or colour, you will
                need to return the item back to us for a refund, and then place
                a new order.
              </p>
            </div>
          </div>
          
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ReturnsPage;