import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Rental.css";

import banner from "../assets/about.jpeg";

const categoryList = [
  "Trouser",
  "Jacket",
  "Rainwear",
  "Trek Bag",
  "Shoes",
  "Camping",
];

const rentalProducts = [
  { id: 1, name: "Mountain Trek Trouser", category: "Trouser", price: 149, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" },
  { id: 2, name: "Adventure Hiking Trouser", category: "Trouser", price: 159, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518" },
  { id: 3, name: "All Weather Jacket", category: "Jacket", price: 199, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246" },
  { id: 4, name: "Padded Trek Jacket", category: "Jacket", price: 219, image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb" },
  { id: 5, name: "Rain Shield Jacket", category: "Rainwear", price: 129, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
  { id: 6, name: "Travel Rainwear", category: "Rainwear", price: 139, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b" },
  { id: 7, name: "60L Trek Bag", category: "Trek Bag", price: 189, image: "https://images.unsplash.com/photo-1514477917009-389c76a86b68" },
  { id: 8, name: "Compact Backpack", category: "Trek Bag", price: 169, image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa" },
  { id: 9, name: "Grip Trek Shoes", category: "Shoes", price: 179, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
  { id: 10, name: "Outdoor Shoes", category: "Shoes", price: 189, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772" },
  { id: 11, name: "Camping Tent", category: "Camping", price: 249, image: "https://images.unsplash.com/photo-1504280390368-361c6d9f38f4" },
  { id: 12, name: "Camping Kit", category: "Camping", price: 229, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
];

const Rental = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Trouser");
  const [showFilter, setShowFilter] = useState(false);

  const filteredProducts = useMemo(() => {
    const selected = rentalProducts.filter(p => p.category === activeCategory);
    const others = rentalProducts.filter(p => p.category !== activeCategory);
    return [...selected, ...others].slice(0, 12);
  }, [activeCategory]);

  return (
    <>
      <Navbar />

      <div className="rental-page">

        {/* Banner + Overlay Buttons */}
        <div className="banner-wrap">
          <div className="top-bar">
            <button onClick={() => navigate("/terms")}>Policy</button>
            <button onClick={() => navigate("/account")}>Profile</button>
          </div>

          <div className="banner">
            <img src={banner} alt="" />
          </div>
        </div>

        <div className="main">
          <button
  className="mobile-filter-toggle"
  onClick={() => setShowFilter(!showFilter)}
>
  Filter
</button>

          <div className={`sidebar ${showFilter ? "show-filter" : ""}`}>
            <h2>Filter</h2>
            {categoryList.map(cat => (
              <button
                key={cat}
                className={activeCategory === cat ? "active" : ""}
                onClick={() => {
  setActiveCategory(cat);
  setShowFilter(false);
}}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="products">
            <div className="header">
              <h1>Check out our premium</h1>
            </div>

            <div className="grid">
              {filteredProducts.map(item => (
                <div
                  key={item.id}
                  className="card"
                  onClick={() => navigate(`/rental-product/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={`${item.image}?auto=format&fit=crop&w=500&q=80`} alt="" />
                  <h3>{item.name}</h3>
                  <p>Save more by renting</p>
                  <h4>₹{item.price}/day</h4>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Rental;