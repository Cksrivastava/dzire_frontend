import React from "react";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

const ContactInfoCard = () => {
  return (
    <div className="contact-details-card">
      <h3 className="details-title">Contact Details :</h3>

      <div className="contact-details-vertical-list">
        {/* 1. Location Address */}
        <div className="detail-item">
          <div className="detail-icon-circle">
            <MapPin size={22} />
          </div>
          <div className="detail-info">
            <h4>Location Address:</h4>
            <p>
              Sr. No. 92/100, "Sun-Flower", Erandwane Gaothan, Pune, Maharashtra – 411004, India
            </p>
          </div>
        </div>

        {/* 2. Email Address */}
        <div className="detail-item">
          <div className="detail-icon-circle">
            <Mail size={22} />
          </div>
          <div className="detail-info">
            <h4>Email Address:</h4>
            <p>dzirestore.in@gmail.com</p>
            <p>support@dzirestore.in</p>
          </div>
        </div>

        {/* 3. Phone Numbers */}
        <div className="detail-item">
          <div className="detail-icon-circle">
            <Phone size={22} />
          </div>
          <div className="detail-info">
            <h4>Phone Numbers:</h4>
            <p>Customer Care: +91-9923080044</p>
            <p>Support: +91-9876543210</p>
          </div>
        </div>

        {/* 4. Opening Hours */}
        <div className="detail-item">
          <div className="detail-icon-circle">
            <Clock size={22} />
          </div>
          <div className="detail-info">
            <h4>Opening Hours:</h4>
            <p>Mon - Sat: 10:00 AM – 08:00 PM</p>
            <p className="closed-tag">Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCard;
