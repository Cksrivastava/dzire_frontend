import React from "react";
import { User, Send, CheckCircle2 } from "lucide-react";

const BlogCommentForm = ({
  authorName,
  setAuthorName,
  authorEmail,
  setAuthorEmail,
  commentText,
  setCommentText,
  onAddComment,
  successMsg,
  errorMsg,
}) => {
  return (
    <div className="blog-comment-form-card">
      <h3>Leave a Comment</h3>
      {successMsg && (
        <div className="blog-comment-alert success">
          <CheckCircle2 size={18} />
          <span>Your comment has been posted successfully!</span>
        </div>
      )}
      {errorMsg && (
        <div className="blog-comment-alert error">
          <span>{errorMsg}</span>
        </div>
      )}
      <form onSubmit={onAddComment} className="blog-comment-form">
        <div className="blog-comment-form-row">
          <div className="blog-comment-field">
            <label htmlFor="authorName">Your Name *</label>
            <div className="blog-input-wrapper">
              <User size={16} className="input-icon" />
              <input
                id="authorName"
                type="text"
                placeholder="e.g. Alex Sharma"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
          </div>

          <div className="blog-comment-field">
            <label htmlFor="authorEmail">Your Email (Optional)</label>
            <div className="blog-input-wrapper">
              <input
                id="authorEmail"
                type="email"
                placeholder="alex@example.com"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="blog-comment-field">
          <label htmlFor="commentText">Comment *</label>
          <textarea
            id="commentText"
            rows={4}
            placeholder="Share your experience, thoughts, or ask a question..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="blog-comment-submit-btn">
          <Send size={16} />
          <span>Post Comment</span>
        </button>
      </form>
    </div>
  );
};

export default BlogCommentForm;
