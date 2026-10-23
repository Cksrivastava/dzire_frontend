import React from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaPinterestP
} from "react-icons/fa";

const ContactSocialLinks = () => {
  return (
    <div className="social-media-follow">
      <span>Follow Us On Social Media :</span>
      <div className="social-icons-row">
        <a href="https://wa.me/919923080044" target="_blank" rel="noreferrer" className="social-icon-btn whatsapp" title="WhatsApp">
          <FaWhatsapp size={15} />
        </a>
        <a href="https://instagram.com/dzirestore.in" target="_blank" rel="noreferrer" className="social-icon-btn instagram" title="Instagram">
          <FaInstagram size={15} />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn facebook" title="Facebook">
          <FaFacebookF size={15} />
        </a>
        <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="social-icon-btn pinterest" title="Pinterest">
          <FaPinterestP size={15} />
        </a>
      </div>
    </div>
  );
};

export default ContactSocialLinks;
