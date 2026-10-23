import React from "react";

const ContactMapSection = () => {
  return (
    <div className="contact-map-section">
      <iframe
        title="Store Location Map"
        width="100%"
        height="420"
        style={{ border: 0, borderRadius: "16px" }}
        loading="lazy"
        allowFullScreen
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2514101831776!2d73.83404537593259!3d18.517520069269557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf933c090623%3A0xe5a3c613045faeef!2sErandwane%20Gaothan%2C%20Erandwane%2C%20Pune%2C%20Maharashtra%20411004!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
      ></iframe>
    </div>
  );
};

export default ContactMapSection;
