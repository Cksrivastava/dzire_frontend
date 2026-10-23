import React from "react";
import { FileText, BookOpen, Globe, Award, Star, MessageSquare } from "lucide-react";

const BookAboutAndTabs = ({ currentBook, activeTab, onTabChange }) => {
  return (
    <div className="book-details-unified-card">
      {/* Quick Specs Bar */}
      <div className="book-specs-bar">
        <div className="spec-item">
          <FileText size={18} className="spec-icon" />
          <span>{currentBook.pages || "320 Pages"}</span>
        </div>
        <div className="spec-item">
          <BookOpen size={18} className="spec-icon" />
          <span>{currentBook.format || "Paperback"}</span>
        </div>
        <div className="spec-item">
          <Globe size={18} className="spec-icon" />
          <span>{currentBook.language || "English"}</span>
        </div>
        <div className="spec-item">
          <Award size={18} className="spec-icon" />
          <span>{currentBook.genre || currentBook.category || "History"}</span>
        </div>
      </div>

      {/* About This Book Section */}
      <div className="about-book-section">
        <h3>About This Book</h3>
        <p className="about-text">{currentBook.description}</p>
      </div>

      {/* Horizontal Tabs & Active Tab Content */}
      <div className="book-lower-tabs-section">
        <div className="book-section-tabs-bar">
          <button
            className={`book-section-tab ${activeTab === "whyRead" ? "active" : ""}`}
            onClick={() => onTabChange("whyRead")}
          >
            <Star size={14} className="tab-icon" />
            <span>Why Read This Book</span>
          </button>

          <button
            className={`book-section-tab ${activeTab === "specs" ? "active" : ""}`}
            onClick={() => onTabChange("specs")}
          >
            <FileText size={14} className="tab-icon" />
            <span>Book Details</span>
          </button>

          <button
            className={`book-section-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => onTabChange("reviews")}
          >
            <MessageSquare size={14} className="tab-icon" />
            <span>
              Reviews ({currentBook.reviewsCount || currentBook.reviews || "128"})
            </span>
          </button>
        </div>

        {/* Active Tab Content Box */}
        <div className="book-tab-content-container">
          {activeTab === "whyRead" && (
            <div className="book-tab-pane">
              <div className="why-read-block">
                <h4 className="why-read-heading">Why You Should Read This Book</h4>
                <p className="why-read-intro">
                  {currentBook.whyRead ||
                    "A captivating story of courage, endurance, and human passion in extreme environments. Essential reading for outdoor enthusiasts and adventure lovers."}
                </p>

                {currentBook.whyReadHighlights &&
                  currentBook.whyReadHighlights.length > 0 && (
                    <div className="why-read-highlights-grid">
                      {currentBook.whyReadHighlights.map((item, idx) => (
                        <div key={idx} className="why-read-highlight-item">
                          <span className="why-read-highlight-icon">
                            {item.icon || "✨"}
                          </span>
                          <div className="why-read-highlight-text">
                            <strong>{item.title}:</strong> {item.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="book-tab-pane">
              <div className="specs-details-block">
                <h4
                  style={{
                    fontSize: "15.5px",
                    fontWeight: "750",
                    color: "#0f172a",
                    marginBottom: "6px",
                  }}
                >
                  Product Specifications
                </h4>
                <ul className="details-list">
                  <li>
                    <strong>ISBN:</strong> {currentBook.details?.isbn || "978-1594857072"}
                  </li>
                  <li>
                    <strong>Publisher:</strong>{" "}
                    {currentBook.details?.publisher || "The Mountaineers Books"}
                  </li>
                  <li>
                    <strong>Publication Date:</strong>{" "}
                    {currentBook.details?.pubDate || "October 2012"}
                  </li>
                  <li>
                    <strong>Dimensions:</strong>{" "}
                    {currentBook.details?.dimensions || "6 x 0.8 x 9 inches"}
                  </li>
                  <li>
                    <strong>Weight:</strong> {currentBook.details?.weight || "1.2 lbs"}
                  </li>
                  <li>
                    <strong>Language:</strong> {currentBook.language || "English"}
                  </li>
                  <li>
                    <strong>Format:</strong> {currentBook.format || "Paperback"}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="book-tab-pane">
              <div className="rating-large">
                <span>
                  {currentBook.rating || "4.8"}{" "}
                  <Star size={24} fill="#ffa41c" color="#ffa41c" />
                </span>
                <span className="total-revs">
                  Based on{" "}
                  {currentBook.reviewsCount || currentBook.reviews || "64"} verified
                  reader reviews
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAboutAndTabs;
