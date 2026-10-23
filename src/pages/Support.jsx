import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccountSidebar from "../components/AccountSidebar";
import AccountHeader from "../components/AccountHeader";
import { ShopContext } from "../context/ShopContext";
import { ChevronRight } from "lucide-react";
import ContactForm from "../components/contact/ContactForm";
import ContactInfoCard from "../components/contact/ContactInfoCard";
import { contactAPI } from "../services/api";

import "./CustomerAccount.css";
import "./Contact.css";

const Support = () => {
  const navigate = useNavigate();
  const { user } = useContext(ShopContext);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirectTo=/support");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: ""
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
        source: "support_help_center",
      });
    } catch (err) {
      console.warn("API support submit fallback:", err.message);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        message: ""
      });
    }, 4000);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="profile-page-wrapper">
        {/* Top Breadcrumb Bar */}
        <div className="profile-top-breadcrumb-bar">
          <div className="profile-top-breadcrumb">
            <Link to="/" className="breadcrumb-home">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-active">Help Center</span>
          </div>
        </div>

        <div className="profile-page-container">
          {/* Reusable Left Sidebar Navigation */}
          <AccountSidebar />

          {/* Main Content Area */}
          <main className="profile-main-content">
            <AccountHeader
              title="Help Center & Contact Us"
              subtitle="Have questions or need support? Reach out to our team."
            />

            <div className="contact-main-container-inner" style={{ paddingTop: "10px" }}>
              {/* Main Two-Column Layout */}
              <div className="contact-grid-section">
                {/* Left Column: Contact Form */}
                <ContactForm
                  title="Contact Us For More Info !!"
                  subtitle="Send us a message and our support team will respond within 24 hours."
                  formData={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  submitted={submitted}
                />

                {/* Right Column: Contact Details Card */}
                <ContactInfoCard />
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Support;