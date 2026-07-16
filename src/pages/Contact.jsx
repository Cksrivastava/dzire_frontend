import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css";

const galleryImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506629905607-d9b1d1c00f70?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516641395977-73f16ad6bfbc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
];

const Contact = () => {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <>
      <Navbar />

      <div className="contact-page">
        <div className="contact-top" class="col-md-12">
          <div className="contact-info-card">
            <div className="info-block">
              <div className="icon-circle">📞</div>
              <div>
                <h3>Customer Care</h3>
                <p>+91-9923080044</p>
                <a
                  href="https://wa.me/919923080044"
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-btn"
                >
                  CHAT WITH US ON WHATSAPP
                </a>
              </div>
            </div>

            <div className="info-block">
              <div className="icon-circle">✉️</div>
              <div>
                <h3>Email ID</h3>
                <p>dzirestore.in@gmail.com</p>
              </div>
            </div>

            <div className="info-block">
              <div className="icon-circle">📍</div>
              <div>
                <h3>Store Location</h3>
                <p>
                  Sr. No. 92/100, "Sun-Flower",
                  <br />
                  Erandwane Gaothan, Pune, India
                  <br />
                  411004
                </p>
              </div>
            </div>

            <div className="info-block">
              <div className="icon-circle">🕒</div>
              <div>
                <h3>Opening Timings</h3>
                <p>Mon-Sat: 10:00 to 20:00</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="map-card" class="col-md-12">
      <iframe
        title="map"
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src="https://www.google.com/maps?q=Lucknow&output=embed"
      ></iframe>
</div>

        <div className="store-social-header">
          <div className="store-brand-row">
            <div className="store-mini-logo">dzire</div>
            <div>
              <h2>dzirestore.in</h2>
              <p>
                Go Outside &amp; Move Forward with us • Estd. in 2024 @ Pune •
                Travel Partner
              </p>
            </div>
          </div>
        </div>

        <div className="gallery-grid">
          {galleryImages.slice(0, visibleCount).map((img, index) => (
            <a
              key={index}
              href="https://www.instagram.com/dzirestore.in/"
              target="_blank"
              rel="noreferrer"
              className="gallery-item"
            >
              <img src={img} alt={`Dzire gallery ${index + 1}`} />
            </a>
          ))}
        </div>

        <div className="gallery-buttons">
          {visibleCount < galleryImages.length && (
            <button className="load-more-btn" onClick={handleLoadMore}>
              LOAD MORE
            </button>
          )}

          <a
            href="https://www.instagram.com/dzirestore.in/"
            target="_blank"
            rel="noreferrer"
            className="instagram-btn"
          >
            Follow on Instagram
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;