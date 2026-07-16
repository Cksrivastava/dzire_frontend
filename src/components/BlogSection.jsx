import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRegCalendar, FaRegUser } from "react-icons/fa";
import "./BlogSection.css";

const blogData = [
  {
    id: 1,
    category: "TREKKING TIPS",
    date: "May 18, 2024",
    author: "Dzire Store",
    title: "10 Beginner Trekking Mistakes to Avoid",
    slug: "trekking-essentials-beginners",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    category: "GEAR GUIDE",
    date: "May 12, 2024",
    author: "Dzire Store",
    title: "How to Choose the Right Backpack for Your Trek",
    slug: "perfect-trekking-backpack",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    category: "DESTINATIONS",
    date: "May 08, 2024",
    author: "Dzire Store",
    title: "Top 7 Treks in Himachal You Must Experience",
    slug: "kedarkantha-trek",
    image: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    category: "CAMPING 101",
    date: "May 01, 2024",
    author: "Dzire Store",
    title: "Camping Essentials Checklist for Every Trip",
    slug: "camping-essentials-checklist",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    category: "WILDLIFE",
    date: "April 25, 2024",
    author: "Dzire Store",
    title: "Safety Rules for Wildlife Encounters on Trails",
    slug: "wildlife-safety-tips",
    image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    category: "NUTRITION",
    date: "April 18, 2024",
    author: "Dzire Store",
    title: "Best High-Energy Snacks for Long Hikes",
    slug: "hiking-nutrition-guide",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    category: "PHOTOGRAPHY",
    date: "April 10, 2024",
    author: "Dzire Store",
    title: "How to Capture Stunning Mountain Landscape Photos",
    slug: "mountain-photography-tips",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    category: "FITNESS",
    date: "April 02, 2024",
    author: "Dzire Store",
    title: "Cardio Exercises to Prepare for High Altitudes",
    slug: "altitude-training-fitness",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
  }
];

const BlogSection = () => {
  const [activeDot, setActiveDot] = useState(0);
  const gridRef = useRef(null);

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

        // Calculate horizontal offset relative to container viewport
        const targetScroll = containerScrollLeft + targetRect.left - containerRect.left;

        container.scrollTo({
          left: targetScroll,
          behavior: "smooth"
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
          <span className="blog-section-subtitle">FROM THE BLOG</span>
          <h2 className="blog-section-title">Stories, Tips & Adventure Guides</h2>
          <p className="blog-section-description">
            Inspiration to help you explore more and travel better.
          </p>
        </div>

        {/* Blog Grid / Slider */}
        <div
          className="home-blog-grid"
          ref={gridRef}
          onScroll={handleScroll}
        >
          {blogData.map((post) => (
            <div className="home-blog-card-wrapper" key={post.id}>
              <Link
                to={`/blog/${post.slug}`}
                className="home-blog-card"
                style={{ backgroundImage: `url(${post.image})` }}
              >
                {/* Card Overlay */}
                <div className="home-blog-card-overlay"></div>

                {/* Card Content Top: Category Badge */}
                <div className="home-blog-card-top">
                  <span className="home-blog-card-badge">{post.category}</span>
                </div>

                {/* Card Content Bottom: Info */}
                <div className="home-blog-card-bottom">
                  <div className="home-blog-card-date">
                    <div className="home-blog-meta-item">
                      <FaRegCalendar className="calendar-icon" />
                      <span>{post.date}</span>
                    </div>
                    <span className="meta-separator">•</span>
                    <div className="home-blog-meta-item">
                      <FaRegUser className="author-icon" />
                      <span>{post.author}</span>
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

        {/* Bullet point navigation (like in Banner) */}
        <div className="blog-dots-container">
          {blogData.map((_, index) => (
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
