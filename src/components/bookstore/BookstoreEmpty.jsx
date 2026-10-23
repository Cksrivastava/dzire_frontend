import React from "react";

const BookstoreEmpty = ({ onReset }) => {
  return (
    <div className="bookstore-empty">
      <h3>No books found matching your search.</h3>
      <p>Try searching for another title or reset your filters.</p>
      <button className="reset-btn" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
};

export default BookstoreEmpty;
