import React from "react";

const BlogDetailBody = ({ post }) => {
  return (
    <>
      <span className="blog-detail-category">{post.category}</span>
      <h1>{post.title}</h1>

      <div className="blog-detail-meta-stacked">
        <div className="blog-detail-author-line">
          By, <strong>{post.author || "Dzire Store"}</strong>
        </div>
        <div className="blog-detail-date-line">{post.date}</div>
      </div>

      <p>{post.excerpt}</p>

      {post.content && /<[a-z][\s\S]*>/i.test(post.content) ? (
        <div
          className="blog-detail-rich-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : (
        <p style={{ whiteSpace: "pre-line" }}>
          {post.content
            ? post.content
            : "This blog shares useful details, tips, and practical information related to outdoor lifestyle, travel, gear, and adventure planning. Read carefully and use these points to improve your next experience."}
        </p>
      )}
    </>
  );
};

export default BlogDetailBody;
