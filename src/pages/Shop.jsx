import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductSection from "../components/ProductSection";
import { featuredProducts } from "../data/products";
import "./Shop.css";
import { productAPI } from "../services/api";
import wsClient from "../services/websocket";

const Shop = () => {
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";
  const maxPriceQuery = searchParams.get("maxPrice") || "";

  const [productsList, setProductsList] = useState([]);

  const loadProducts = (skipCache = false) => {
    productAPI.getAll({ skipCache })
      .then((res) => {
        if (Array.isArray(res.products)) {
          const webOnly = res.products.filter((p) => {
            const vis = (p.visibility || p.productChannel || "").toString().toLowerCase();
            const webStatus = (p.webStatus || "").toString().toLowerCase();
            if (vis === "in-store" || vis === "instore" || webStatus === "in-store") return false;
            return true;
          });
          setProductsList(webOnly);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadProducts(false);

    // Live real-time WebSocket synchronization
    const unsubProduct = wsClient.on("PRODUCT_UPDATED", () => loadProducts(true));

    return () => {
      unsubProduct();
    };
  }, []);

  const filteredProducts = productsList.filter((product) => {
    const query = searchQuery.toLowerCase();
    const category = categoryQuery.toLowerCase();
    const maxPrice = maxPriceQuery ? parseFloat(maxPriceQuery) : null;

    const productText = `
      ${product.name || ""}
      ${product.title || ""}
      ${product.category || ""}
      ${product.description || ""}
      ${product.brand || ""}
    `.toLowerCase();

    const matchSearch = query ? productText.includes(query) : true;
    const matchCategory = category ? productText.includes(category) : true;
    const matchPrice = maxPrice !== null && !isNaN(maxPrice) ? Number(product.price || 0) <= maxPrice : true;

    return matchSearch && matchCategory && matchPrice;
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
              : maxPriceQuery
              ? `Products Below ₹${Number(maxPriceQuery).toLocaleString("en-IN")}`
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