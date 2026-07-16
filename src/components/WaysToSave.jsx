import React from "react";
import "./WaysToSave.css";

const WaysToSave = () => {
  return (
    <section className="ways-to-save-section">
      <h2 className="ways-to-save-title">Outdoor adventures, offbeat escapes, and curated journeys for the explorer in you.</h2>
      <div className="ways-to-save-grid">
        <div className="save-card">
          <div className="save-card-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=800&q=80"
              alt="The gear you love, for less"
              className="save-card-image"
            />
          </div>
          <div className="save-card-content">
            <span className="save-card-tag">Save More on Outlet</span>
            <h3 className="save-card-heading">The gear you love, for less</h3>
            <p className="save-card-desc">
              Save on expertly picked clothing and gear with up to 40% off at REI Outlet.
            </p>
            <button className="save-card-btn">Shop REI Outlet</button>
          </div>
        </div>

        <div className="save-card">
          <div className="save-card-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80"
              alt="Make a splash"
              className="save-card-image"
            />
          </div>
          <div className="save-card-content">
            <span className="save-card-tag">Bundle & Save 15% on Accessories</span>
            <h3 className="save-card-heading">Make a splash</h3>
            <p className="save-card-desc">
              Save 15% on full-price paddles and PFDs with your kayak or stand up paddle board purchase.
            </p>
            <button className="save-card-btn">Shop watersports</button>
          </div>
        </div>

        <div className="save-card">
          <div className="save-card-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1478131148067-21f180d070d6?auto=format&fit=crop&w=800&q=80"
              alt="Rent Gear & Save"
              className="save-card-image"
            />
          </div>
          <div className="save-card-content">
            <span className="save-card-tag">Rent Premium Outdoor Gear</span>
            <h3 className="save-card-heading">Rent instead of buying</h3>
            <p className="save-card-desc">
              Get top-brand tents, sleeping bags, and backpacks for rent at a fraction of retail prices.
            </p>
            <button className="save-card-btn">Explore Rentals</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaysToSave;
