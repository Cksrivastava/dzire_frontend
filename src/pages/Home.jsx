import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import EventSection from "../components/EventSection";
import BlogSection from "../components/BlogSection";
import Footer from "../components/Footer";
import { productAPI, categoryAPI } from "../services/api";
import wsClient from "../services/websocket";
import "./Home.css";

const isWebsiteVisible = (p) => {
  if (!p) return false;
  const vis = (p.visibility || p.productChannel || "").toString().trim().toLowerCase();
  const webStatus = (p.webStatus || "").toString().trim().toLowerCase();
  if (vis === "in-store" || vis === "instore" || vis === "in-store only" || vis === "store") {
    return false;
  }
  if (webStatus === "in-store" || webStatus === "add_to_web" || webStatus === "hidden") {
    return false;
  }
  return true;
};

const Home = () => {
  const location = useLocation();
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const loadData = (skipCache = false) => {
    productAPI
      .getAll({ skipCache })
      .then((res) => {
        if (Array.isArray(res.products)) {
          const webOnly = res.products.filter(isWebsiteVisible);
          setProductsList(webOnly);
        }
      })
      .catch(() => {});

    categoryAPI
      .getAll({ skipCache })
      .then((res) => {
        if (res && res.success && Array.isArray(res.categories)) {
          setCategoriesList(res.categories);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData(false);

    // Real-time WebSocket synchronization with zero manual refresh
    const unsubProduct = wsClient.on("PRODUCT_UPDATED", () => loadData(true));
    const unsubCategory = wsClient.on("CATEGORIES_UPDATED", () => loadData(true));

    return () => {
      unsubProduct();
      unsubCategory();
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTarget = params.get("scrollTarget");
    if (scrollTarget) {
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          const yOffset = window.innerWidth < 1024 ? -80 : -140;
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <div className="home-page-sections">
        <Hero />
        <CategorySection />
        {productsList.length > 0 && (
          <ProductSection
            title="Product List"
            products={productsList}
            categories={categoriesList}
            isHomePage={true}
          />
        )}
        <EventSection />
        <BlogSection />
      </div>
      <Footer />
    </>
  );
};

export default Home;