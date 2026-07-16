import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Terms.css";

const Terms = () => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />

      <div className="terms-page">
        <div className="terms-banner">
          <div className="terms-banner-overlay">
            <h1 className="terms-banner-title">
              Dzire Terms <span>& Conditions</span>
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
        </div>

        <div className="terms-container">
          <div className="terms-sidebar">
            <ul>
              <li><a href="#last-revision">Last Revision</a></li>
              <li><a href="#eligibility">Eligibility and Acceptance</a></li>
              <li><a href="#site-use">Use of the Site</a></li>
              <li><a href="#account-security">Account Registration</a></li>
              <li><a href="#product-pricing">Product Information</a></li>
              <li><a href="#orders-payment">Orders and Payment</a></li>
              <li><a href="#shipping-delivery">Shipping and Delivery</a></li>
              <li><a href="#returns-refunds">Returns and Refunds</a></li>
              <li><a href="#user-content">User Content</a></li>
              <li><a href="#intellectual-property">Intellectual Property</a></li>
              <li><a href="#third-party-services">Third-Party Services</a></li>
              <li><a href="#privacy-policy">Privacy Policy</a></li>
              <li><a href="#warranties">Disclaimer of Warranties</a></li>
              <li><a href="#liability">Limitation of Liability</a></li>
              <li><a href="#indemnification">Indemnification</a></li>
              <li><a href="#force-majeure">Force Majeure</a></li>
              <li><a href="#dispute-resolution">Dispute Resolution</a></li>
              <li><a href="#governing-law">Governing Law</a></li>
              <li><a href="#modifications">Modifications</a></li>
              <li><a href="#contact-information">Contact Information</a></li>
            </ul>
          </div>

          <div className="terms-content">
            <section id="last-revision" className="terms-section">
              <p>
                <strong>Date of Last Revision:</strong> Add Date
              </p>
              <p>
                PLEASE READ THESE TERMS OF USE CAREFULLY. BY ACCESSING, USING,
                OR PLACING AN ORDER ON dzirestore.in, YOU AGREE TO BE BOUND BY
                THESE TERMS OF USE AND ALL APPLICABLE LAWS. IF YOU DO NOT
                AGREE, YOU MUST NOT USE THE SITE.
              </p>
              <p>
                Dzire Store provides access to its website and services subject
                to your compliance with these Terms of Use. These Terms govern
                your access to and use of the Site and any purchases made
                through it.
              </p>
              <p>
                Dzire Store reserves the right to modify these Terms at any time.
                Changes will be effective upon posting. Continued use of the Site
                constitutes your acceptance of the updated Terms.
              </p>
            </section>

            <section id="eligibility" className="terms-section">
              <h2>1. Eligibility and Acceptance</h2>
              <p>
                By using the Site, you confirm that you are at least 18 years old
                and legally capable of entering into a binding agreement.
              </p>
              <p>
                If you use the Site on behalf of an entity, you represent that
                you are authorized to bind that entity to these Terms.
              </p>
            </section>

            <section id="site-use" className="terms-section">
              <h2>2. Use of the Site</h2>
              <p>You agree to use the Site only for lawful purposes.</p>
              <p>You shall not interfere with or disrupt the Site or its security.</p>
              <p>You shall not attempt unauthorized access to systems or data.</p>
              <p>You shall not engage in fraudulent, abusive, or illegal activities.</p>
              <p>
                Dzire Store reserves the right to suspend or terminate access for
                violations.
              </p>
            </section>

            <section id="account-security" className="terms-section">
              <h2>3. Account Registration and Security</h2>
              <p>You may be required to create an account to place orders.</p>
              <p>You agree to provide accurate and complete information.</p>
              <p>You agree to maintain confidentiality of login credentials.</p>
              <p>
                You accept responsibility for all activities under your account.
              </p>
              <p>
                Notify us immediately of any unauthorized access. Dzire Store is
                not liable for losses arising from compromised credentials.
              </p>
            </section>

            <section id="product-pricing" className="terms-section">
              <h2>4. Product Information and Pricing</h2>
              <p>
                We strive for accuracy in product descriptions, images, and
                pricing. However, errors may occur and are subject to correction.
              </p>
              <p>
                Prices and availability may change without notice. Orders may be
                cancelled if products are unavailable.
              </p>
              <p>In such cases, a full refund will be issued.</p>
            </section>

            <section id="orders-payment" className="terms-section">
              <h2>5. Orders and Payment</h2>
              <p>By placing an order, you agree that all details provided are accurate and complete.</p>
              <p>
                Payments are processed via secure third-party gateways. Dzire
                Store does not store card details.
              </p>
              <p>
                We reserve the right to cancel or refuse orders suspected of
                fraud or misuse.
              </p>
            </section>

            <section id="shipping-delivery" className="terms-section">
              <h2>6. Shipping and Delivery</h2>
              <p>Delivery is available across India subject to serviceable pin codes.</p>
              <p>Timelines are estimates and may vary.</p>
              <p>Risk transfers upon handover to courier partner.</p>
              <p>Shipping charges are displayed at checkout.</p>
              <p>Shipping is governed by our Shipping Policy.</p>
            </section>

            <section id="returns-refunds" className="terms-section">
              <h2>7. Returns, Refunds, and Cancellations</h2>
              <p>
                Returns and refunds are governed by our Return & Refund Policy
                and applicable Indian consumer laws.
              </p>
              <p>Products must be unused and returned with original packaging.</p>
              <p>Refunds are processed after inspection.</p>
              <p>Refunds are issued to the original payment method.</p>
              <p>
                Nothing in these Terms limits your statutory rights under the
                Consumer Protection Act, 2019.
              </p>
            </section>

            <section id="user-content" className="terms-section">
              <h2>8. User Content and Reviews</h2>
              <p>You may post reviews or content on the Site.</p>
              <p>You confirm the content is lawful, accurate, and non-infringing.</p>
              <p>
                You grant Dzire Store a worldwide, royalty-free license to use
                such content.
              </p>
              <p>
                You must not post misleading, abusive, defamatory, or unlawful
                content.
              </p>
              <p>
                Dzire Store reserves the right to remove or modify User Content
                at its discretion and is not responsible for user-posted content.
              </p>
            </section>

            <section id="intellectual-property" className="terms-section">
              <h2>9. Intellectual Property</h2>
              <p>
                All Site content including text, images, logos, graphics, and
                software is owned by Dzire Store or its licensors and protected
                under applicable laws.
              </p>
              <p>
                Unauthorized use, reproduction, or distribution is strictly
                prohibited.
              </p>
            </section>

            <section id="third-party-services" className="terms-section">
              <h2>10. Third-Party Services</h2>
              <p>
                The Site may contain links to third-party services such as
                payment gateways and logistics providers. Dzire Store is not
                responsible for third-party content, policies, or services.
              </p>
            </section>

            <section id="privacy-policy" className="terms-section">
              <h2>11. Privacy Policy</h2>
              <p>
                Your use of the Site is subject to our Privacy Policy. By using
                the Site, you consent to the collection and use of your
                information as described therein.
              </p>
            </section>

            <section id="warranties" className="terms-section">
              <h2>12. Disclaimer of Warranties</h2>
              <p>
                To the maximum extent permitted by law, the Site and all content
                and services are provided “as is” and “as available” without
                warranties of any kind.
              </p>
              <p>
                Dzire Store does not guarantee uninterrupted, secure, or
                error-free operation.
              </p>
            </section>

            <section id="liability" className="terms-section">
              <h2>13. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Dzire Store shall not be
                liable for any indirect, incidental, or consequential damages
                arising from use or inability to use the Site, or purchase or use
                of products.
              </p>
              <p>
                Nothing in this clause excludes liability where prohibited by law.
              </p>
            </section>

            <section id="indemnification" className="terms-section">
              <h2>14. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Dzire Store and
                its affiliates from any claims, damages, or expenses arising from
                your use of the Site, violation of these Terms, breach of
                applicable laws, or User Content submitted by you.
              </p>
            </section>

            <section id="force-majeure" className="terms-section">
              <h2>15. Force Majeure</h2>
              <p>
                Dzire Store shall not be liable for delays or failures caused by
                events beyond reasonable control, including natural disasters,
                pandemics, war, government actions, supply chain disruptions, or
                network failures.
              </p>
              <p>Obligations will be suspended during such events.</p>
            </section>

            <section id="dispute-resolution" className="terms-section">
              <h2>16. Dispute Resolution and Arbitration</h2>
              <p>You agree to first contact Dzire Store to resolve disputes amicably within 30 days.</p>
              <p>
                Unresolved disputes shall be settled by binding arbitration
                conducted by a sole arbitrator.
              </p>
              <p>
                Seat: Pune, Maharashtra. Mode: Online or in-person.
              </p>
              <p>
                Disputes shall be resolved individually, not as class actions.
              </p>
              <p>
                Dzire Store may seek court relief for intellectual property or
                misuse issues.
              </p>
            </section>

            <section id="governing-law" className="terms-section">
              <h2>17. Governing Law and Jurisdiction</h2>
              <p>
                These Terms are governed by Indian law. Subject to arbitration,
                courts in Pune, Maharashtra shall have jurisdiction.
              </p>
            </section>

            <section id="modifications" className="terms-section">
              <h2>18. Modifications to Terms</h2>
              <p>
                Dzire Store may update these Terms at any time. Continued use of
                the Site constitutes acceptance.
              </p>
            </section>

            <section id="contact-information" className="terms-section">
              <h2>19. Contact Information</h2>
              <p>For queries or concerns:</p>
              <p>
                <strong>Dzire Store</strong>
              </p>
              <p>
                <strong>Email:</strong> dzirestore.in@gmail.com
              </p>
              <p>
                <strong>Contact:</strong> 9923080044
              </p>
              <p>
                <strong>Address:</strong>
                <br />
                92/100, “Sunflower” Bunglow, Near Mhatre Bridge
                <br />
                Landmark: Near Mantri Hospital
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

export default Terms;