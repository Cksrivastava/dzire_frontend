import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CookiePolicy.css";

const CookiePolicy = () => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />

      <div className="cookie-page">
        <section className="cookie-banner">
          <div className="cookie-banner-overlay">
            <h1 className="cookie-banner-title">
              Dzire Cookie <span>Policy</span>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
              <span>BACK TO TOP</span>
            </button>
          </div>
        </section>

        <div className="cookie-container">
          <aside className="cookie-sidebar">
            <ul>
              <li><a href="#updated">Last Updated</a></li>
              <li><a href="#what-cookies">What Are Cookies?</a></li>
              <li><a href="#types">Types of Cookies</a></li>
              <li><a href="#third-party">Third-Party Cookies</a></li>
              <li><a href="#legal-basis">Legal Basis</a></li>
              <li><a href="#manage">Manage Preferences</a></li>
              <li><a href="#data-collected">Data Collected</a></li>
              <li><a href="#retention">Data Retention</a></li>
              <li><a href="#updates">Policy Updates</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </aside>

          <div className="cookie-content">
            <section id="updated" className="cookie-section">
              <p><strong>Last Updated:</strong> Add Date</p>
              <p>
                This Cookie Policy explains how Dzire Store uses cookies and similar
                technologies when you visit dzirestore.in.
              </p>
              <p>
                This Policy should be read together with our Privacy Policy.
              </p>
              <p>
                By continuing to use our Site, you consent to the use of cookies as
                described in this Policy. Where required by law, we will obtain your
                consent before placing non-essential cookies.
              </p>
            </section>

            <section id="what-cookies" className="cookie-section">
              <h2>1. What Are Cookies?</h2>
              <p>
                Cookies are small text files placed on your device such as computer,
                mobile, or tablet when you visit a website.
              </p>
              <p>
                They help websites function efficiently and provide information to
                website owners.
              </p>
              <p><strong>Session Cookies:</strong> Deleted when you close your browser.</p>
              <p><strong>Persistent Cookies:</strong> Stored until they expire or are deleted.</p>
            </section>

            <section id="types" className="cookie-section">
              <h2>2. Types of Cookies We Use</h2>

              <h3>A. Essential Cookies</h3>
              <p>
                These cookies are necessary for the functioning of the Site and cannot
                be disabled.
              </p>
              <p>They enable secure login, account access, shopping cart functionality, and payment processing.</p>

              <h3>B. Performance & Analytics Cookies</h3>
              <p>
                These cookies help us understand how users interact with our Site.
              </p>
              <p>
                They collect information such as pages visited, time spent on the Site,
                and errors encountered.
              </p>
              <p>Examples include Google Analytics or similar tools.</p>

              <h3>C. Functional Cookies</h3>
              <p>
                These cookies enhance your experience by remembering preferences such
                as language, region, or saved settings.
              </p>

              <h3>D. Advertising & Marketing Cookies</h3>
              <p>
                These cookies are used to show relevant ads, measure ad performance,
                and retarget users across platforms.
              </p>
              <p>
                They may be set by social media platforms and advertising partners.
              </p>
            </section>

            <section id="third-party" className="cookie-section">
              <h2>3. Third-Party Cookies</h2>
              <p>
                We may allow third-party services such as analytics providers and
                advertising platforms to place cookies on your device.
              </p>
              <p>
                These third parties may collect data about your online activities
                across websites.
              </p>
              <p>
                We do not control these cookies. Please refer to their respective
                privacy policies.
              </p>
            </section>

            <section id="legal-basis" className="cookie-section">
              <h2>4. Legal Basis</h2>
              <p>Under the Digital Personal Data Protection Act, 2023, we:</p>
              <p>Use essential cookies based on legitimate use.</p>
              <p>Use non-essential cookies such as analytics and ads only with your consent.</p>
              <p>Provide options to manage or withdraw consent.</p>
            </section>

            <section id="manage" className="cookie-section">
              <h2>5. Managing Your Cookie Preferences</h2>

              <h3>A. Browser Settings</h3>
              <p>
                You can block or delete cookies through browser settings such as
                Chrome, Firefox, Safari, and Edge.
              </p>
              <p>Disabling cookies may affect website functionality.</p>

              <h3>B. Cookie Consent Banner</h3>
              <p>
                When you first visit our Site, you may choose to accept all cookies,
                reject non-essential cookies, or customize preferences.
              </p>

              <h3>C. Opt-Out of Advertising Cookies</h3>
              <p>
                You can opt out using Google Ads Settings, Network Advertising
                Initiative tools, or device-level ad settings.
              </p>
            </section>

            <section id="data-collected" className="cookie-section">
              <h2>6. Data Collected Through Cookies</h2>
              <p>
                Cookies may collect IP address, device and browser information,
                browsing behavior, and interaction data.
              </p>
              <p>
                This data may be combined with other personal data as described in
                our Privacy Policy.
              </p>
            </section>

            <section id="retention" className="cookie-section">
              <h2>7. Data Retention</h2>
              <p>Cookies are stored for varying durations.</p>
              <p>Session cookies are deleted after the session ends.</p>
              <p>Persistent cookies are stored for a defined period or until deleted.</p>
            </section>

            <section id="updates" className="cookie-section">
              <h2>8. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. Changes will be
                posted with a revised Last Updated date.
              </p>
              <p>Continued use of the Site constitutes acceptance of updates.</p>
            </section>

            <section id="contact" className="cookie-section">
              <h2>9. Contact Us</h2>
              <p>For questions regarding this Cookie Policy:</p>
              <p><strong>Dzire Store</strong></p>
              <p><strong>Email:</strong> dzirestore.in@gmail.com</p>
              <p><strong>Contact:</strong> 9923080044</p>
              <p>
                <strong>Address:</strong>
                <br />
                92/100, “Sunflower” Bunglow, Near Mhatre Bridge
                <br />
                Erandawne, Pune – 411004
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CookiePolicy;