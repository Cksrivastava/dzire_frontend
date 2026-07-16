import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import blogPosts from "../data/blogData";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="blog-detail-page">
          <div className="blog-detail-container">
            <button className="blog-back-btn" onClick={() => navigate("/blog")}>
              ← Back
            </button>
            <h1>Blog not found</h1>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="blog-detail-page">
        <div className="blog-detail-container">

          <img src={post.image} alt={post.title} className="blog-detail-image" />

          <div className="blog-detail-content">
            <span className="blog-detail-category">{post.category}</span>
            <h1>{post.title}</h1>

            <div className="blog-detail-meta">
              <span>{post.date}</span>
              <span>{post.author}</span>
            </div>

            <p>{post.excerpt}</p>

            <p>
              {post.content
                ? post.content
                : "This blog shares useful details, tips, and practical information related to outdoor lifestyle, travel, gear, and adventure planning. Read carefully and use these points to improve your next experience."}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogDetail;