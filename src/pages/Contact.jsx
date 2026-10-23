import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChevronRight } from "lucide-react";
import ContactForm from "../components/contact/ContactForm";
import ContactInfoCard from "../components/contact/ContactInfoCard";
import ContactMapSection from "../components/contact/ContactMapSection";
import { contactAPI } from "../services/api";
import "./Contact.css";
import { getBannerSettings, BANNER_SETTINGS_EVENT } from "../services/bannerSettings";

const Contact = () => {
  const [contactConfig, setContactConfig] = useState(() => getBannerSettings().contact);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.contact) {
        setContactConfig(e.detail.contact);
      } else {
        setContactConfig(getBannerSettings().contact);
      }
    };
    window.addEventListener(BANNER_SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(BANNER_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactAPI.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: "contact_page",
      });
    } catch (err) {
      console.warn("API contact submit fallback:", err.message);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 4000);
  };

  return (
    <>
      <Navbar />

      <div className="contact-page-wrapper">
        {/* Top Hero Banner */}
        <div
          className="contact-hero-banner"
          style={
            contactConfig?.bgImage
              ? {
                  backgroundImage: `linear-gradient(135deg, rgba(2, 51, 65, 0.85) 0%, rgba(11, 124, 128, 0.75) 100%), url(${contactConfig.bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          <div className="contact-hero-container">
            <h1>{contactConfig?.title || "Contact Us"}</h1>
            {contactConfig?.subtitle && (
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255, 255, 255, 0.9)",
                  maxWidth: "700px",
                  margin: "0 auto 16px auto",
                  lineHeight: "1.5",
                }}
              >
                {contactConfig.subtitle}
              </p>
            )}
            <div className="contact-breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={14} className="breadcrumb-sep" />
              <span>Contact Us</span>
            </div>
          </div>
        </div>

        <div className="contact-main-container">
          {/* Main Two-Column Layout */}
          <div className="contact-grid-section">
            {/* Left Column: Contact Form */}
            <ContactForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitted={submitted}
            />

            {/* Right Column: Contact Details Card */}
            <ContactInfoCard />
          </div>

          {/* Full Width Google Map Section */}
          <ContactMapSection />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;