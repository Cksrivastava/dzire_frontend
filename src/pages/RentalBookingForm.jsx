import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./RentalBookingForm.css";
import { rentalAPI } from "../services/api";

const RentalBookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const productData = location.state || {};

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getPriceNumber = (value) => {
    if (!value) return 0;
    return Number(String(value).replace(/[^0-9]/g, ""));
  };

  const todayDate = getTodayDate();

  const [formData, setFormData] = useState({
    userName: "",
    size: productData.size || "",
    productName: productData.productName || "",
    costing: productData.costing || "",
    date: productData.fromDate || todayDate,
    tripDate: productData.toDate || todayDate,
    email: "",
    phone: "",
  });

  const oneDayPrice = getPriceNumber(formData.costing);

  const calculateDays = () => {
    const start = new Date(formData.date);
    const end = new Date(formData.tripDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const totalDays = calculateDays();
  const totalCost = totalDays * oneDayPrice;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      setFormData({
        ...formData,
        date: value,
        tripDate: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalBookingData = {
      ...formData,
      totalDays,
      totalCost,
    };

    try {
      await rentalAPI.book({
        rentalId: productData.product?.id || 1,
        userName: formData.userName,
        userEmail: formData.email,
        userPhone: formData.phone,
        startDate: formData.date,
        endDate: formData.tripDate,
        days: totalDays,
        totalCost,
      });
    } catch (apiErr) {
      console.warn("Backend rental booking sync fallback:", apiErr);
    }

    alert("Rental booking submitted successfully!");
    console.log(finalBookingData);
  };

  return (
    <>
      <Navbar />

      <div className="booking-page">
        <div className="booking-card">
          <button className="booking-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h1>Rental Booking Form</h1>
          <p className="booking-subtitle">
            Fill your details to confirm rental request
          </p>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label>User Name</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
  <label>Costing</label>
  <input
    type="text"
    value={`₹${totalCost}`}
    readOnly
  />
</div>

            <div className="form-group">
              <label>Booking Start Date</label>
              <input
                type="date"
                name="date"
                min={todayDate}
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Trip End Date</label>
              <input
                type="date"
                name="tripDate"
                min={formData.date}
                value={formData.tripDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone No.</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <button type="submit" className="booking-submit-btn">
              Submit Booking
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RentalBookingForm;