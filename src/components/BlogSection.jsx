import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegCalendar, FaRegUser } from "react-icons/fa";
import "./BlogSection.css";
import { blogAPI } from "../services/api";
import wsClient from "../services/websocket";
import { getSectionSettings, SECTION_SETTINGS_EVENT } from "../services/sectionSettings";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeDot, setActiveDot] = useState(0);
  const [blogSectionConfig, setBlogSectionConfig] = useState(() => getSectionSettings().blogs);
  const gridRef = useRef(null);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.blogs) {
        setBlogSectionConfig(e.detail.blogs);
      } else {
        setBlogSectionConfig(getSectionSettings().blogs);
      }
    };
    window.addEventListener(SECTION_SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(SECTION_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const fetchBlogs = (skipCache = false) => {
    blogAPI
      .getAll(skipCache ? { skipCache: true } : {})
      .then((res) => {
        if (Array.isArray(res.blogs)) {
          const published = res.blogs.filter(
            (b) => !b.status || b.status.toLowerCase() === "published"
          );
          setBlogs(published.length > 0 ? published : res.blogs);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchBlogs(false);
    const unsub = wsClient.on("BLOGS_UPDATED", () => fetchBlogs(true));
    return () => {
      unsub();
    };
  }, []);

  if (blogs.length === 0) return null;

  const handleScroll = () => {
    if (gridRef.current) {
      const container = gridRef.current;
      const wrappers = container.querySelectorAll(".home-blog-card-wrapper");
      if (wrappers.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const containerMid = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      wrappers.forEach((wrapper, idx) => {
        const rect = wrapper.getBoundingClientRect();
        const wrapperMid = rect.left + rect.width / 2;
        const distance = Math.abs(wrapperMid - containerMid);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });

      setActiveDot(closestIndex);
    }
  };

  const scrollToBlog = (index) => {
    if (gridRef.current) {
      const wrappers = gridRef.current.querySelectorAll(".home-blog-card-wrapper");
      const targetWrapper = wrappers[index];
      if (targetWrapper) {
        const container = gridRef.current;
        const containerScrollLeft = container.scrollLeft;
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetWrapper.getBoundingClientRect();

        const targetScroll = containerScrollLeft + targetRect.left - containerRect.left;

        container.scrollTo({
          left: targetScroll,
          behavior: "smooth",
        });
        setActiveDot(index);
      }
    }
  };

  return (
    <section className="blog-section">
      <div className="blog-section-container">
        {/* Header Block */}
        <div className="blog-section-header">
          {blogSectionConfig.subtitle && (
            <span className="blog-section-subtitle">{blogSectionConfig.subtitle}</span>
          )}
          <h2 className="blog-section-title">
            {blogSectionConfig.title || "Stories, Tips & Adventure Guides"}
          </h2>
          {blogSectionConfig.description && (
            <p className="blog-section-description">
              {blogSectionConfig.description}
            </p>
          )}
        </div>

        {/* Blog Grid / Slider */}
        <div className="home-blog-grid" ref={gridRef} onScroll={handleScroll}>
          {blogs.map((post) => (
            <div className="home-blog-card-wrapper" key={post.id || post._id}>
              <Link
                to={`/blog/${post.slug || post.id}`}
                className="home-blog-card"
                style={{ backgroundImage: `url(${post.image})` }}
              >
                <div className="home-blog-card-overlay"></div>

                <div className="home-blog-card-top">
                  <span className="home-blog-card-badge">
                    {post.category || "BLOG"}
                  </span>
                </div>

                <div className="home-blog-card-bottom">
                  <div className="home-blog-card-date">
                    <div className="home-blog-meta-item">
                      <FaRegCalendar className="calendar-icon" />
                      <span>{post.date || "Recent"}</span>
                    </div>
                    <span className="meta-separator">•</span>
                    <div className="home-blog-meta-item">
                      <FaRegUser className="author-icon" />
                      <span>{post.author || "Dzire"}</span>
                    </div>
                  </div>
                  <h3 className="home-blog-card-title">{post.title}</h3>
                  <span className="home-blog-card-readmore">
                    Read More <span className="readmore-arrow">&raquo;</span>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bullet point navigation */}
        <div className="blog-dots-container">
          {blogs.map((_, index) => (
            <button
              key={index}
              className={`blog-dot ${activeDot === index ? "active" : ""}`}
              onClick={() => scrollToBlog(index)}
              aria-label={`Go to blog ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="blog-view-all">
          <Link to="/blog" className="view-all-blogs-btn">
            VIEW ALL BLOGS <span className="btn-arrow">&raquo;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
