import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import EventSection from "../components/EventSection";
import BlogSection from "../components/BlogSection";
import Footer from "../components/Footer";
import { featuredProducts } from "../data/products";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTarget = params.get("scrollTarget");
    if (scrollTarget) {
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          const yOffset = window.innerWidth < 1024 ? -80 : -140;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <Hero />
      <CategorySection />
      <ProductSection title="Product List" products={featuredProducts} isHomePage={true} />
      <EventSection />
      <BlogSection />
      <Footer />
    </>
  );
};

export default Home;