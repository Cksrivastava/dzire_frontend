import React from "react";
import { MessageSquare } from "lucide-react";
import BlogCommentForm from "./BlogCommentForm";
import BlogCommentCard from "./BlogCommentCard";

const BlogCommentsSection = ({
  comments,
  authorName,
  setAuthorName,
  authorEmail,
  setAuthorEmail,
  commentText,
  setCommentText,
  onAddComment,
  onToggleLike,
  getInitials,
  successMsg,
  errorMsg,
}) => {
  return (
    <div className="blog-comments-section">
      <div className="blog-comments-header">
        <div className="blog-comments-title">
          <MessageSquare className="comments-icon" size={24} />
          <h2>Comments ({comments.length})</h2>
        </div>
        <p className="blog-comments-subtitle">
          Join the discussion and share your thoughts or questions about this article.
        </p>
      </div>

      {/* Add Comment Form */}
      <BlogCommentForm
        authorName={authorName}
        setAuthorName={setAuthorName}
        authorEmail={authorEmail}
        setAuthorEmail={setAuthorEmail}
        commentText={commentText}
        setCommentText={setCommentText}
        onAddComment={onAddComment}
        successMsg={successMsg}
        errorMsg={errorMsg}
      />

      {/* Comments List */}
      <div className="blog-comments-list">
        {comments.length === 0 ? (
          <div className="blog-no-comments">
            <MessageSquare size={36} />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <BlogCommentCard
              key={comment.id}
              comment={comment}
              onToggleLike={onToggleLike}
              getInitials={getInitials}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogCommentsSection;
