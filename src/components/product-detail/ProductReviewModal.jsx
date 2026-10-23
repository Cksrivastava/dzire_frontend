import React from "react";
import { Star, X } from "lucide-react";

export const ProductReviewModal = ({
  showReviewModal,
  setShowReviewModal,
  handleReviewSubmit,
  newReviewRating,
  setNewReviewRating,
  newReviewName,
  setNewReviewName,
  newReviewTags,
  handleTagToggle,
  newReviewComment,
  setNewReviewComment,
}) => {
  if (!showReviewModal) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-card">
        <div className="review-modal-header">
          <h3>Write a Review</h3>
          <button className="review-modal-close" onClick={() => setShowReviewModal(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleReviewSubmit} className="review-modal-form">
          <div className="form-group">
            <label>Overall Rating</label>
            <div className="star-rating-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-select-btn ${star <= newReviewRating ? "active" : ""}`}
                  onClick={() => setNewReviewRating(star)}
                >
                  <Star
                    size={24}
                    fill={star <= newReviewRating ? "#ff6600" : "transparent"}
                    color="#ff6600"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reviewer-name">Your Name</label>
            <input
              id="reviewer-name"
              type="text"
              placeholder="e.g. John Doe"
              value={newReviewName}
              onChange={(e) => setNewReviewName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Review Tags (Select all that apply)</label>
            <div className="tag-pill-selector">
              {["Comfort", "Durability", "Sizing"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-pill-btn ${newReviewTags.includes(tag) ? "active" : ""}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reviewer-comment">Review Description</label>
            <textarea
              id="reviewer-comment"
              rows="4"
              placeholder="Write your review comments here..."
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="review-modal-actions">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={() => setShowReviewModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="modal-submit-btn">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductReviewModal;
