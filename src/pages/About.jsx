import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";
import aboutImg from "../assets/about.jpeg";
import aboutVideo from "../assets/about.mp4";
import { getBannerSettings, BANNER_SETTINGS_EVENT } from "../services/bannerSettings";

const About = () => {
  const [aboutConfig, setAboutConfig] = useState(() => getBannerSettings().about);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.about) {
        setAboutConfig(e.detail.about);
      } else {
        setAboutConfig(getBannerSettings().about);
      }
    };
    window.addEventListener(BANNER_SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(BANNER_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <>
      <Navbar />

      {/* TOP IMAGE */}
      <div className="about-image" style={{ position: "relative" }}>
        <img src={aboutConfig?.image || aboutConfig?.topBannerImage || aboutImg} alt="About Dzire Store" />
        {(aboutConfig?.title || aboutConfig?.subtitle) && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "30px",
              backgroundColor: "rgba(15, 23, 42, 0.72)",
              backdropFilter: "blur(6px)",
              padding: "16px 24px",
              borderRadius: "10px",
              color: "#ffffff",
              maxWidth: "600px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            {aboutConfig?.title && (
              <h1 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 6px 0", color: "#ffffff" }}>
                {aboutConfig.title}
              </h1>
            )}
            {aboutConfig?.subtitle && (
              <p style={{ margin: 0, fontSize: "14px", color: "rgba(255, 255, 255, 0.92)", lineHeight: "1.4" }}>
                {aboutConfig.subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ROOTS SECTION */}
      <section className="about-story-section">
        <div className="about-story-grid">
          <div className="about-story-left">
            <img
              src={aboutConfig?.rootsImage || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"}
              alt="Dzire Store roots"
              className="about-story-img about-story-img-main"
            />
          </div>

          <div className="about-story-right">
            <h2 className="about-story-title">{aboutConfig?.rootsTitle || "OUR ROOTS"}</h2>

            <p>
              Welcome to Dzire Store – your trusted destination for outdoor gear, trekking equipment, and travel accessories in India. Whether you’re heading for a Himalayan trek, a weekend hike in the Sahyadris, or simply looking for durable everyday travel essentials, Dzire Store has you covered.
            </p>

            <p>
              Founded with the passion to inspire adventure, Dzire Store brings together top outdoor and lifestyle brands under one roof. From backpacks, trekking shoes, camping gear, travel accessories to everyday functional products, every item at Dzire Store is handpicked for its quality, reliability, and style.
              </p>

            <p>
              We operate both online through dzirestore.in and at our offline store in Pune, giving customers the flexibility to shop the way they prefer. Our goal is to make premium adventure gear accessible across India with seamless shopping, secure payment options, and on-time delivery.
            </p>
          </div>

          <div className="about-story-bottom-image">
            <img
              src={aboutConfig?.bottomJourneyImage || "https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?auto=format&fit=crop&w=1200&q=80"}
              alt="Dzire Store adventure journey"
              className="about-story-img about-story-img-overlay"
            />
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <div className="about-video">
        <video
          src={aboutVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      <div className="about-community-section">
  <div className="about-community-content">
    <div className="about-community-left">
      <h2>Our Community</h2>
      <p>
        At Dzire Store, we believe adventure becomes more meaningful when it is
        shared. Our growing community of trekkers, travelers, campers, and
        outdoor enthusiasts inspires us to create a space where everyone feels
        welcome, supported, and ready to explore.
      </p>

      <p>
        Through shared experiences, useful gear, customer support, and a passion
        for the outdoors, we aim to build a stronger connection between people
        and adventure. From first-time explorers to experienced hikers, Dzire
        Store is here to support every journey and help create a broader outdoor
        culture across India.
      </p>

      <a href="/" className="about-community-link">
        Join Our Community
      </a>
    </div>

    <div className="about-community-right">
      <img
        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
        alt="Dzire community"
      />
    </div>
  </div>
</div>

<div className="about-responsibility">
  <div className="about-responsibility-overlay">
    <div className="about-responsibility-content">
      <h2>Our Responsibility</h2>

      <p>
        At Dzire Store, responsibility goes beyond selling products. We believe
        in creating a positive impact through ethical sourcing, quality
        manufacturing, and sustainable practices that support both people and
        the environment.
      </p>

      <p>
        Every product involves materials, effort, and resources. That’s why we
        focus on minimizing environmental impact while maintaining high
        standards of durability and performance. We work with trusted partners
        and follow responsible practices to ensure long-term value.
      </p>

      <p>
        Our goal is to build a future where adventure and sustainability go hand
        in hand, helping explorers enjoy nature while preserving it for
        generations to come.
      </p>

      <button className="about-responsibility-btn">
        Learn More About Our Strategy
      </button>
    </div>
  </div>
</div>

      <Footer />
    </>
  );
};

export default About;