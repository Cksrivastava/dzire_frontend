import React from "react";
import { Heart } from "lucide-react";

const BlogCommentCard = ({ comment, onToggleLike, getInitials }) => {
  return (
    <div className="blog-comment-card">
      <div className="blog-comment-avatar">
        {getInitials(comment.author)}
      </div>
      <div className="blog-comment-body">
        <div className="blog-comment-meta">
          <span className="blog-comment-author">{comment.author}</span>
          <span className="blog-comment-date">{comment.date}</span>
        </div>
        <p className="blog-comment-text">{comment.text}</p>
        <div className="blog-comment-actions">
          <button
            type="button"
            className={`blog-comment-like-btn ${
              comment.userLiked ? "liked" : ""
            }`}
            onClick={() => onToggleLike(comment.id)}
          >
            <Heart
              size={15}
              fill={comment.userLiked ? "#ef4444" : "none"}
              color={comment.userLiked ? "#ef4444" : "#64748b"}
            />
            <span>{comment.likes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCommentCard;
