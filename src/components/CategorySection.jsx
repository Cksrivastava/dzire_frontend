import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategorySection.css";
import BannerSection from "./BannerSection";
import { categoryData } from "../data/categoryData";

const CategorySection = () => {
  const navigate = useNavigate();

  const openCategory = (id) => {
    navigate(`/category/${id}`);
  };

  return (
    <>
      <section className="categories">
        <h2 className="category-heading">Outdoor Categories</h2>

        <div className="category-grid">
          {categoryData.map((item) => (
            <div
              className="category-card-2"
              key={item.id}
              onClick={() => openCategory(item.id)}
            >
              <div className="category-image-box">
                <img src={item.image} alt={item.name} className="category-image" />
                <h3>{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="categories">
        <BannerSection />
      </div>

      <section className="categories">
        <h2 className="category-heading">Product Categories</h2>

        <div className="category-grid">
          {categoryData.map((item) => (
            <div
              className="category-card"
              key={item.id}
              onClick={() => openCategory(item.id)}
            >
              <div className="category-image-box">
                <img src={item.image} alt={item.name} className="category-image" />
                <h3>{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default CategorySection;