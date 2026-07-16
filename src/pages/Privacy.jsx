import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Privacy.css";

const Privacy = () => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />

      <div className="privacy-page">
        <section className="privacy-banner">
          <div className="privacy-banner-overlay">
            <h1 className="privacy-banner-title">
              Dzire Shipping <span>Policy</span>
            </h1>

            <button className="back-to-top-btn" onClick={handleBackToTop}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="back-to-top-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
              <span>BACK TO TOP</span>
            </button>
          </div>
        </section>

        <div className="privacy-container">
          <aside className="privacy-sidebar">
            <ul>
              <li><a href="#delivery-time">Delivery Time</a></li>
              <li><a href="#timeline">Shipping Timeline</a></li>
              <li><a href="#carrier">Shipping Carrier</a></li>
              <li><a href="#ship-to">Where We Ship</a></li>
              <li><a href="#ship-from">Shipping From</a></li>
              <li><a href="#delayed">Order Delayed</a></li>
              <li><a href="#lost">Lost in Transit</a></li>
              <li><a href="#delivered">Delivered but Missing</a></li>
            </ul>
          </aside>

          <div className="privacy-content">

            <section id="delivery-time" className="privacy-section">
              <h2>How Long Will My Order Take for Delivery?</h2>
              <p>
                Dzire Store orders are processed Monday – Friday, excluding holidays.
                Processing time can take up to 3 business days and is not included
                in shipping transit time.
              </p>
              <p>
                Once your order is packed and ready to ship, you will receive
                tracking details. Please check your spam/junk folder as well.
              </p>
            </section>

            <section id="timeline" className="privacy-section">
              <h2>Estimated Shipping Timelines</h2>
              <p>Metro Cities: 4–7 business days from ship date</p>
              <p>Remote Areas: 10–12 business days from ship date</p>
              <p>Local Deliveries: 2–3 business days from ship date</p>
              <p>
                These are estimated timelines and not guaranteed. Delivery depends
                on pincode service availability and external factors.
              </p>
            </section>

            <section id="carrier" className="privacy-section">
              <h2>What Shipping Carrier Do You Use?</h2>
              <p>
                Orders are shipped using various courier partners depending on the
                package and location. The carrier cannot be determined before order placement.
              </p>
            </section>

            <section id="ship-to" className="privacy-section">
              <h2>Where Can You Ship To?</h2>
              <p>
                We ship across PAN INDIA, subject to serviceable pincodes.
              </p>
            </section>

            <section id="ship-from" className="privacy-section">
              <h2>Where Do Orders Ship From?</h2>
              <p>
                Orders may ship from multiple locations including our warehouse
                and retail stores across the country.
              </p>
              <p>
                Your order may be split into multiple packages. In such cases,
                you will receive separate tracking details.
              </p>
            </section>

            <section id="delayed" className="privacy-section">
              <h2>My Order is Delayed</h2>
              <p>
                Shipping delays may occur due to weather, holidays, or high demand.
              </p>
              <p>
                If you do not receive tracking details within 7 business days,
                please contact us.
              </p>
            </section>

            <section id="lost" className="privacy-section">
              <h2>My Order is Lost in Transit</h2>
              <p>
                We will investigate lost packages after the expected delivery timeline
                or if tracking is inactive for 5+ business days.
              </p>
            </section>

            <section id="delivered" className="privacy-section">
              <h2>Order Delivered but Not Received</h2>
              <p>
                Please wait 72 hours before reporting. Sometimes packages are marked
                delivered early.
              </p>
              <p>
                Check with neighbors, mailbox, building security, or nearby delivery areas.
              </p>
              <p>
                Dzire Store is not responsible for lost/stolen packages due to
                incorrect address or unavailable recipient.
              </p>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Privacy;