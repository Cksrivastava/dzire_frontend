import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShopContext } from "../context/ShopContext";

import {
  booksData,
  mainCategories,
  moreCategories,
} from "../data/bookstoreCatalogData";
import BookstoreToolbar from "../components/bookstore/BookstoreToolbar";
import BookstoreProductCard from "../components/bookstore/BookstoreProductCard";
import BookstoreEmpty from "../components/bookstore/BookstoreEmpty";

import "./Bookstore.css";
import { bookAPI } from "../services/api";

export { booksData };

const Bookstore = () => {
  const navigate = useNavigate();
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isInCompare,
  } = useContext(ShopContext);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreDropdownRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [booksList, setBooksList] = useState([]);

  useEffect(() => {
    let mounted = true;
    bookAPI.getAll()
      .then((res) => {
        if (mounted && Array.isArray(res.books)) {
          setBooksList(res.books);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const isMoreActive = moreCategories.some((cat) => cat.id === activeCategory);
  const activeMoreObj = moreCategories.find((cat) => cat.id === activeCategory);

  const filteredBooks = booksList.filter((book) => {
    const matchesCategory =
      activeCategory === "All" || book.category === activeCategory;
    const matchesSearch =
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (book) => {
    navigate(`/bookstore/${book.id}`, { state: book });
  };

  const handleAddToCart = (e, book) => {
    e.stopPropagation();
    addToCart(book);
    showToast(`Added "${book.name}" to Cart!`);
  };

  const handleWishlist = (e, book) => {
    e.stopPropagation();
    toggleWishlist(book);
    const wishlisted = isWishlisted(book.id);
    showToast(
      wishlisted
        ? `Removed "${book.name}" from Wishlist`
        : `Added "${book.name}" to Wishlist!`
    );
  };

  const handleCompare = (e, book) => {
    e.stopPropagation();
    toggleCompare(book);
    const compared = isInCompare(book.id);
    showToast(
      compared
        ? `Removed "${book.name}" from Compare`
        : `Added "${book.name}" to Compare!`
    );
  };

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchTerm("");
  };

  return (
    <div className="bookstore-page">
      <Navbar />

      <main className="bookstore-container">
        {/* Header Section matching Home Page spacing & font hierarchy */}
        <div className="bookstore-header">
          <p className="bookstore-subtitle">DZIRE BOOKSTORE</p>
          <h1 className="bookstore-title">Mountaineering & Outdoor Books</h1>
          <span className="bookstore-desc">
            Explore premium books, expedition logs, mountain survival stories and outdoor guidebooks.
          </span>

          {/* Filter & Search Bar */}
          <BookstoreToolbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            mainCategories={mainCategories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            moreCategories={moreCategories}
            isMoreOpen={isMoreOpen}
            setIsMoreOpen={setIsMoreOpen}
            moreDropdownRef={moreDropdownRef}
            isMoreActive={isMoreActive}
            activeMoreObj={activeMoreObj}
            booksData={booksData}
          />
        </div>

        {/* Books Grid - Exact Home Page Card Size Area & Spacing */}
        <div className="bookstore-products-grid">
          {filteredBooks.map((book) => (
            <BookstoreProductCard
              key={book.id}
              book={book}
              isWishlisted={isWishlisted}
              isInCompare={isInCompare}
              onCardClick={handleCardClick}
              onWishlist={handleWishlist}
              onCompare={handleCompare}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <BookstoreEmpty onReset={handleResetFilters} />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bookstore-toast">
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Bookstore;
