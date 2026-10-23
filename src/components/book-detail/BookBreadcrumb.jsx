import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BookBreadcrumb = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="book-detail-nav-row">
      <button className="book-back-btn" onClick={() => navigate(-1)} aria-label="Go Back">
        <ArrowLeft size={18} />
      </button>
      <div className="book-breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/bookstore">Bookstore</Link>
        <span className="sep">/</span>
        <span className="active">{title}</span>
      </div>
    </div>
  );
};

export default BookBreadcrumb;
