import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CategoryProducts.css";

const allProducts = [
  "Running Shoes",
  "Sports Sneakers",
  "Jogging Shoes",
  "Training Shoes",
  "Marathon Shoes",
  "Gym Shoes",
  "Walking Shoes",
  "Outdoor Shoes",
  "Training Gloves",
  "Gym Gloves",
  "Workout Gloves",
  "Weight Lifting Gloves",
  "Fitness Gloves",
  "Grip Gloves",
  "Cycling Gloves",
  "Sports Gloves",
  "Sports Bag",
  "Gym Bag",
  "Duffle Bag",
  "Travel Sports Bag",
  "Training Bag",
  "Outdoor Bag",
  "Fitness Bag",
  "Kit Bag",
  "Camping Jacket",
  "Outdoor Jacket",
  "Rain Jacket",
  "Winter Jacket",
  "Trekking Jacket",
  "Windproof Jacket",
  "Hiking Jacket",
  "Travel Jacket",
  "Hiking Shoes",
  "Trekking Shoes",
  "Mountain Shoes",
  "Trail Shoes",
  "Outdoor Boots",
  "Adventure Shoes",
  "Climbing Shoes",
  "Travel Shoes",
  "Water Bottle",
  "Sports Bottle",
  "Gym Bottle",
  "Steel Bottle",
  "Sipper Bottle",
  "Travel Bottle",
  "Cycling Bottle",
  "Fitness Bottle",
  "Fitness Band",
  "Smart Band",
  "Workout Tracker",
  "Running Tracker",
  "Sports Watch",
  "Activity Band",
  "Health Band",
  "Training Band",
  "Sports Cap",
  "Running Cap",
  "Gym Cap",
  "Outdoor Cap",
  "Baseball Cap",
  "Training Cap",
  "Sun Cap",
  "Fitness Cap",
];

const titleMap = {
  "running-shoes": "Running Shoes",
  "training-gloves": "Training Gloves",
  "sports-bag": "Sports Bag",
  "camping-jacket": "Camping Jacket",
  "hiking-shoes": "Hiking Shoes",
  "water-bottle": "Water Bottle",
  "fitness-band": "Fitness Band",
  "sports-cap": "Sports Cap",
};

const shuffleProducts = (products) => {
  return [...products].sort(() => Math.random() - 0.5).slice(0, 6);
};

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const productList = useMemo(() => shuffleProducts(allProducts), [categoryName]);
  const pageTitle = titleMap[categoryName] || "Sports Category";

  return (
    <>
      <Navbar />

      <section className="category-products-page">
        <button className="category-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="category-products-header">
          <p>Dzire Sports Collection</p>
          <h1>{pageTitle}</h1>
          <span>
            Premium sports products selected for training, outdoor activities,
            fitness and daily performance.
          </span>
        </div>

        <div className="category-products-grid">
          {productList.map((item, index) => (
            <div
              className="category-product-card"
              key={`${item}-${index}`}
              onClick={() =>
                navigate(`/product/${categoryName}-${index}`, {
                  state: {
                    id: `${categoryName}-${index}`,
                    name: item,
                    price: 999 + index * 120,
                    oldPrice: 1499 + index * 150,
                    image: `https://picsum.photos/500/600?random=${categoryName}-${index}`,
                  },
                })
              }
            >
              <div className="category-product-img-box">
                <img
                  src={`https://picsum.photos/500/600?random=${categoryName}-${index}`}
                  alt={item}
                />
              </div>

              <div className="category-product-info">
                <p>DZIRE</p>
                <h3>{item}</h3>

                <div className="category-product-price">
                  <span>₹{999 + index * 120}</span>
                  <del>₹{1499 + index * 150}</del>
                </div>

                <button onClick={(e) => e.stopPropagation()}>
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default CategoryProducts;