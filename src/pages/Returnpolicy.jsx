import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Returnpolicy.css";
import { Link } from "react-router-dom";

const Returnpolicy = () => {
  return (
    <>
      <Navbar />

      <div className="rp-page">
        <div className="rp-breadcrumb-wrap">
          <div className="rp-breadcrumb">
            <span>Home</span>
            <span className="rp-breadcrumb-sep">/</span>
            <span>Support</span>
            <span className="rp-breadcrumb-sep">/</span>
            <span className="rp-breadcrumb-current">Return Policy</span>
          </div>
        </div>

        <section className="rp-hero">
          <div className="rp-hero-left">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"
              alt="Return Policy"
            />
          </div>

          <div className="rp-hero-right">
            <h1>Returns & Exchanges</h1>
            <p>
              Need to return something? Read our complete return policy below.
              We want your experience with Dzire Store to feel simple, clear and
              customer-friendly.
            </p>

            <div className="rp-hero-actions">
              <Link to="/returns-form" className="rp-primary-btn">
                Start a Return
              </Link>
              <a href="#return-policy-details" className="rp-secondary-btn">
                Read Policy
              </a>
            </div>
          </div>
        </section>

        <div className="rp-main">
          <aside className="rp-sidebar">
            <div className="rp-sidebar-card">
              <a href="#return-policy-details" className="active">
                Return policy
              </a>
              <a href="#dispatch-proof">Dzire dispatch proof</a>
              <a href="#packaging-guidelines">Packaging guidelines</a>
              <a href="#important-note">Important note</a>
              <a href="#start-return">Start a return</a>
              <a href="#faq-section">FAQs</a>
            </div>
          </aside>

          <div className="rp-content">
            <section id="return-policy-details" className="rp-section">
              <h2>Return policy</h2>
              <p className="rp-lead-text">
                At Dzire Store, we want you to have a smooth and worry-free
                shopping experience. If for any reason you are not fully
                satisfied with your purchase, we offer a return policy under the
                terms below.
              </p>

              <div className="rp-highlight-box">
                <h3>1. General Return Policy — Coupon Only (No Refund)</h3>
                <p>
                  Dzire Store does not offer monetary refunds for returned
                  products.
                </p>
                <p>For all approved returns:</p>

                <ul>
                  <li>
                    A coupon credit equal to the product value will be issued
                  </li>
                  <li>
                    Validity: 2 months (60 days) from the date of issue
                  </li>
                  <li>
                    Can be redeemed on Dzire Store online purchases only
                  </li>
                  <li>
                    Return pickup is allowed only once per order / per product
                  </li>
                </ul>
              </div>
            </section>

            <section id="dispatch-proof" className="rp-section">
              <h2>Dzire dispatch proof</h2>
              <p>
                Dzire Store maintains high-resolution photos and videos of every
                product and package before dispatch.
              </p>
              <div className="rp-note-box">
                This process helps us maintain transparency and supports smooth
                return verification whenever a request is raised.
              </div>
            </section>

            <section id="packaging-guidelines" className="rp-section">
              <h2>Return packaging guidelines</h2>
              <p>When returning an item, customers must ensure:</p>

              <ul className="rp-bullet-list">
                <li>
                  Packed securely exactly as received, properly sealed from all
                  sides, with no part of the product exposed
                </li>
                <li>Unused and in original condition</li>
                <li>
                  With original box, tags, labels, manuals, and packaging
                </li>
                <li>
                  The customer is responsible for ensuring the product is
                  securely packed
                </li>
              </ul>
            </section>

            <section id="important-note" className="rp-section">
              <h2>Important note</h2>
              <p>
                If the parcel is not packed properly, the pickup partner/courier
                personnel may refuse to pick up the package.
              </p>

              <div className="rp-warning-box">
                Please make sure the return parcel is sealed and packed
                correctly before handover.
              </div>
            </section>

            <section id="faq-section" className="rp-section">
              <h2>Frequently Asked Questions</h2>

              <div className="rp-faq-list">
                <div className="rp-faq-item">
                  <span>Do you offer direct cash refunds?</span>
                  <span>+</span>
                </div>

                <div className="rp-faq-item">
                  <span>How long is the coupon valid after return approval?</span>
                  <span>+</span>
                </div>

                <div className="rp-faq-item">
                  <span>Can I return a product more than once?</span>
                  <span>+</span>
                </div>

                <div className="rp-faq-item">
                  <span>Is original packaging required for return?</span>
                  <span>+</span>
                </div>

                <div className="rp-faq-item">
                  <span>What happens if my parcel is not packed properly?</span>
                  <span>+</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Returnpolicy;