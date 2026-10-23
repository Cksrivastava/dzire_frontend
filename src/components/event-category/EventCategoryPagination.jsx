import React from "react";

const EventCategoryPagination = ({
  totalPages,
  currentPage,
  onChangePage,
  onNextPage,
}) => {
  return (
    <div className="classes-pagination">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          className={currentPage === index + 1 ? "active" : ""}
          onClick={() => onChangePage(index + 1)}
          type="button"
        >
          {index + 1}
        </button>
      ))}

      <button onClick={onNextPage} type="button">
        {">"}
      </button>
    </div>
  );
};

export default EventCategoryPagination;
