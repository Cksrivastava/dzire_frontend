import React from "react";
import { Send, CheckCircle2 } from "lucide-react";
import ContactSocialLinks from "./ContactSocialLinks";

const ContactForm = ({
  title = "Contact Us For More Info About Us !!",
  subtitle,
  formData,
  onChange,
  onSubmit,
  submitted,
}) => {
  return (
    <div className="contact-form-card">
      <div className="form-header">
        <h2>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px", marginBottom: "16px" }}>
            {subtitle}
          </p>
        )}
      </div>

      {submitted ? (
        <div className="form-success-banner">
          <CheckCircle2 size={24} color="#12b76a" />
          <div>
            <h4>Thank You!</h4>
            <p>Your message has been sent successfully. We will get back to you shortly.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="contact-form">
          <div className="form-group full-width">
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone No."
                value={formData.phone}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <textarea
              name="message"
              rows="5"
              placeholder="Enter Your Message *"
              value={formData.message}
              onChange={onChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="contact-submit-btn">
            <Send size={16} /> Send Message
          </button>
        </form>
      )}

      {/* Social Media Follow Links */}
      <ContactSocialLinks />
    </div>
  );
};

export default ContactForm;
