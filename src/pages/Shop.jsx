import React from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductSection from "../components/ProductSection";
import { featuredProducts } from "../data/products";
import "./Shop.css";

const Shop = () => {
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  const filteredProducts = featuredProducts.filter((product) => {
    const query = searchQuery.toLowerCase();
    const category = categoryQuery.toLowerCase();

    const productText = `
      ${product.name || ""}
      ${product.title || ""}
      ${product.category || ""}
      ${product.description || ""}
      ${product.brand || ""}
    `.toLowerCase();

    const matchSearch = query ? productText.includes(query) : true;
    const matchCategory = category ? productText.includes(category) : true;

    return matchSearch && matchCategory;
  });

  return (
    <>
      <Navbar />

      <main className="shop-page">
        <div className="shop-header">
          <p>Dzire Store</p>
          <h1>
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : categoryQuery
              ? `${categoryQuery} Products`
              : "Shop Products"}
          </h1>
          <span>{filteredProducts.length} products found</span>
        </div>

        {filteredProducts.length > 0 ? (
          <ProductSection
            products={filteredProducts}
            showExtraSections={false}
          />
        ) : (
          <div className="shop-empty">
            <h3>No products found</h3>
            <p>Try searching sports shoes, cycle, jacket, bag or fitness.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Shop;