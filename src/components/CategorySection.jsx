import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CategorySection.css";
import BannerSection from "./BannerSection";
import { categoryAPI } from "../services/api";

const CategorySection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    categoryAPI
      .getAll()
      .then((res) => {
        if (mounted && res && res.success && Array.isArray(res.categories)) {
          const activeBackendCats = res.categories
            .filter((c) => c.status !== "Inactive")
            .map((c) => ({
              id: c.slug || c.id || c._id,
              name: c.name,
              type: c.type || "outdoor",
              createdAt: c.createdAt ? new Date(c.createdAt).getTime() : 0,
              image:
                c.image ||
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
            }))
            .sort((a, b) => a.createdAt - b.createdAt);
          setCategories(activeBackendCats);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const openCategory = (cat) => {
    navigate(`/shop?category=${encodeURIComponent(cat.name || cat.id)}`);
  };

  const outdoorCategories = categories.filter((c) =>
    (c.type || "").toLowerCase().includes("outdoor")
  );
  const productCategories = categories.filter(
    (c) => !(c.type || "").toLowerCase().includes("outdoor")
  );

  return (
    <>
      {outdoorCategories.length > 0 && (
        <section className="categories">
          <h2 className="category-heading">Outdoor Categories</h2>

          <div className="category-grid">
            {outdoorCategories.map((item) => (
              <div
                className="category-card-2"
                key={`outdoor-${item.id}`}
                onClick={() => openCategory(item)}
              >
                <div className="category-image-box">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="category-image"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <h3>{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="categories">
        <BannerSection />
      </div>

      {productCategories.length > 0 && (
        <section className="categories">
          <h2 className="category-heading">Product Categories</h2>

          <div className="category-grid">
            {productCategories.map((item) => (
              <div
                className="category-card"
                key={`product-${item.id}`}
                onClick={() => openCategory(item)}
              >
                <div className="category-image-box">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="category-image"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <h3>{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default CategorySection;