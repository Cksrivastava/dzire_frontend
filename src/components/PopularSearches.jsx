import React from "react";
import { Link } from "react-router-dom";
import "./PopularSearches.css";

const PopularSearches = () => {
  const searchTerms = [
    "Men's Trekking Pants",
    "Multi-function Pants",
    "Men's Tshirts",
    "Travel Pants for Men",
    "Men's Travel Shorts",
    "Travel Clothes",
    "Trekking/Hiking Clothes",
    "Women's Tshirts",
    "Men's Running Tshirts",
    "Running T-shirt",
    "Marathon T-shirt",
    "Women's Running Tshirts",
    "Workout T-shirt",
    "Gym T-shirt",
    "Men's Full Sleeve Tshirts",
    "Women's Full Sleeve Tshirts",
    "Outdoor Shorts",
    "Baselayers",
    "Breathable Quick Drying TShirts",
    "Sweat Absorbing TShirts",
    "Moisture Wicking TShirts",
    "Lightweight T-shirt",
    "Half Sleeve T-shirt",
    "Trekking T-shirt",
    "Training T-shirt",
    "Men's Activewear",
    "Training T-shirt",
    "Sun protection clothing",
    "Cycling Sunglasses",
    "Sports Sunglasses",
    "Sunglasses for Trekking and Hiking",
    "Cargo Shirt for Men",
  ];

  return (
    <section className="popular-searches-section">
      <div className="popular-searches-container">
        <h2 className="popular-searches-heading">POPULAR SEARCHES</h2>
        <div className="popular-searches-links">
          {searchTerms.map((term, index) => (
            <React.Fragment key={index}>
              <Link
                to={`/shop?search=${encodeURIComponent(term)}`}
                className="popular-search-link"
              >
                {term}
              </Link>
              {index < searchTerms.length - 1 && (
                <span className="popular-search-separator">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
