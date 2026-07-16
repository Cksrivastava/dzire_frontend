import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import blogPosts from "../data/blogData";
import "./BlogPage.css";

const BlogPage = () => {
  const navigate = useNavigate();

  const featuredPosts = [blogPosts[1], blogPosts[2], blogPosts[4]].filter(
    (post) => post && post.image
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

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

  const openBlog = (slug) => {
    navigate(`/blog/${slug}`);
    window.scrollTo(0, 0);
  };

  const categories = ["All", "Adventure Tips", "Gear Guides", "Uncategorized"];

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return blogPosts;

    return blogPosts.filter((post) =>
      post.category
        .split(",")
        .map((item) => item.trim())
        .includes(activeCategory)
    );
  }, [activeCategory]);

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
        <section className="blog-hero-slider">
          <div
            className="blog-hero-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {featuredPosts.map((post) => (
              <div
                className="blog-hero-slide"
                key={post.id}
                style={{ backgroundImage: `url(${post.image})` }}
              >
                <div className="blog-hero-overlay">
                  <span className="blog-featured-tag">Featured Blog</span>
                  <h1>{post.title}</h1>
                  <p>{post.excerpt}</p>

                  <button
                    className="blog-main-readmore"
                    onClick={() => openBlog(post.slug)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="blog-dots">
            {featuredPosts.map((_, index) => (
              <button
                key={index}
                className={`blog-dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>

        <section className="blog-tabs-wrapper">
          {categories.map((item) => (
            <button
              key={item}
              className={`blog-tab-btn ${
                activeCategory === item ? "active" : ""
              }`}
              onClick={() => setActiveCategory(item)}
            >
              {item}
            </button>
          ))}
        </section>

        <section className="blog-grid-section">
          <div className="blog-grid">
            {visiblePosts.map((post) => (
              <div className="blog-card" key={post.id}>
                <div className="blog-card-image-wrap">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="blog-card-image"
                  />
                </div>

                <div className="blog-card-content">
                  <span className="blog-card-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>

                  <div className="blog-card-meta">
                    <span>{post.date}</span>
                    <span>{post.author}</span>
                  </div>

                  <button
                    className="blog-readmore-btn"
                    onClick={() => openBlog(post.slug)}
                  >
                    Read more
                  </button>
                </div>
              </div>
            ))}
          </div>

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