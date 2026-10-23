import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  primaryCategories,
  moreCategories,
} from "../data/blogPageCategories";
import BlogHeroSlider from "../components/blog/BlogHeroSlider";
import BlogTabs from "../components/blog/BlogTabs";
import BlogCard from "../components/blog/BlogCard";
import "./BlogPage.css";
import { blogAPI } from "../services/api";
import { getBannerSettings, BANNER_SETTINGS_EVENT } from "../services/bannerSettings";

const BlogPage = () => {
  const navigate = useNavigate();
  const moreDropdownRef = useRef(null);

  const [blogPosts, setBlogPosts] = useState([]);
  const [blogConfig, setBlogConfig] = useState(() => getBannerSettings().blog);

  useEffect(() => {
    const handleBannerUpdate = (e) => {
      if (e.detail?.blog) {
        setBlogConfig(e.detail.blog);
      } else {
        setBlogConfig(getBannerSettings().blog);
      }
    };
    window.addEventListener(BANNER_SETTINGS_EVENT, handleBannerUpdate);
    window.addEventListener("storage", handleBannerUpdate);
    return () => {
      window.removeEventListener(BANNER_SETTINGS_EVENT, handleBannerUpdate);
      window.removeEventListener("storage", handleBannerUpdate);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    blogAPI
      .getAll()
      .then((res) => {
        if (mounted && Array.isArray(res.blogs)) {
          setBlogPosts(res.blogs);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const featuredPosts = blogPosts.filter((post) => post && post.image);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    if (featuredPosts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  useEffect(() => {
    setVisibleCount(6);
  }, [activeCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target)
      ) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openBlog = (slug) => {
    navigate(`/blog/${slug}`);
    window.scrollTo(0, 0);
  };

  const isMoreActive = moreCategories.includes(activeCategory);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return blogPosts;

    return blogPosts.filter((post) => {
      const cats = (post.category || "").toLowerCase();
      const target = activeCategory.toLowerCase();

      if (cats.split(",").map((item) => item.trim()).includes(target)) {
        return true;
      }

      if (
        cats.includes(target) ||
        (post.title && post.title.toLowerCase().includes(target.replace(/&.*/, "").trim())) ||
        (post.slug && post.slug.toLowerCase().includes(target.split(" ")[0].toLowerCase())) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(target.replace(/&.*/, "").trim()))
      ) {
        return true;
      }

      return false;
    });
  }, [activeCategory, blogPosts]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const handleAllBlogsClick = () => {
    if (visibleCount < filteredPosts.length) {
      setVisibleCount((prev) => prev + 6);
    } else {
      setActiveCategory("All");
      setVisibleCount(filteredPosts.length);
    }
  };

  return (
    <>
      <Navbar />

      <div className="blog-page">
        {/* Dynamic Blog Hero Banner */}
        <section
          style={{
            position: "relative",
            width: "100%",
            minHeight: "320px",
            backgroundImage: `url(${blogConfig?.image || blogConfig?.bgImage || "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=80"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="blog-hero-overlay" style={{ width: "100%", height: "100%", padding: "48px 32px", boxSizing: "border-box" }}>
            <div className="blog-hero-content-inner" style={{ maxWidth: "800px" }}>
              {blogConfig?.badge && (
                <span className="blog-featured-tag" style={{ backgroundColor: "#ff6600" }}>
                  {blogConfig.badge}
                </span>
              )}
              <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#ffffff", margin: "10px 0" }}>
                {blogConfig?.title || "Stories, Tips & Adventure Guides"}
              </h1>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.92)", margin: "0 0 20px 0", lineHeight: "1.6" }}>
                {blogConfig?.subtitle || "In-depth gear reviews, trail guides, packing checklists and Himalayan stories from passionate explorers."}
              </p>
              {blogConfig?.ctaText && (
                <button
                  className="blog-main-readmore"
                  onClick={() => {
                    const el = document.querySelector(".blog-tabs-nav") || document.querySelector(".blog-grid-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {blogConfig.ctaText}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Text Directly Below Banner */}
        {blogConfig?.belowBannerHeading && (
          <div
            style={{
              maxWidth: "1300px",
              margin: "32px auto 8px auto",
              padding: "0 32px",
              boxSizing: "border-box",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px 0" }}>
              {blogConfig.belowBannerHeading}
            </h2>
            {blogConfig?.belowBannerSubtitle && (
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                {blogConfig.belowBannerSubtitle}
              </p>
            )}
          </div>
        )}

        {featuredPosts.length > 0 && (
          <BlogHeroSlider
            featuredPosts={featuredPosts}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            onOpenBlog={openBlog}
          />
        )}

        <BlogTabs
          primaryCategories={primaryCategories}
          moreCategories={moreCategories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          isMoreOpen={isMoreOpen}
          setIsMoreOpen={setIsMoreOpen}
          isMoreActive={isMoreActive}
          moreDropdownRef={moreDropdownRef}
        />

        <section className="blog-grid-section">
          {visiblePosts.length > 0 ? (
            <div className="blog-grid">
              {visiblePosts.map((post) => (
                <BlogCard
                  key={post.id || post._id || post.slug}
                  post={post}
                  onOpenBlog={openBlog}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#64748b",
              }}
            >
              <h3>No blog posts published yet</h3>
              <p>Check back later for fresh updates and adventure guides.</p>
            </div>
          )}

          {visibleCount < filteredPosts.length && (
            <div className="blog-all-btn-wrap">
              <button className="blog-all-btn" onClick={handleAllBlogsClick}>
                All Blogs
              </button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
};

export default BlogPage;