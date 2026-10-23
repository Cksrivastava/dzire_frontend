import React from "react";

const BlogCard = ({ post, onOpenBlog }) => {
  return (
    <div
      className="blog-card"
      onClick={() => onOpenBlog(post.slug)}
    >
      <div className="blog-card-image-wrap">
        <img
          src={post.image}
          alt={post.title}
          className="blog-card-image"
        />
        <span className="blog-card-badge">{post.category}</span>
      </div>

      <div className="blog-card-content">
        <h3>{post.title}</h3>

        <div className="blog-card-meta-top">
          <div className="blog-card-author-line">
            By, <strong>{post.author || "Dzire Store"}</strong>
          </div>
        </div>

        <p>{post.excerpt}</p>

        <div className="blog-card-footer-row">
          <button
            className="blog-readmore-btn"
            onClick={() => onOpenBlog(post.slug)}
          >
            Read more
          </button>
          <div className="blog-card-date-line">{post.date}</div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
