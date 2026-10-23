import React, { useContext, useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShopContext } from "../context/ShopContext";

import everestBookCover from "../assets/everest-book-cover.svg";
import "./Bookstore.css";
import "./BookDetail.css";

import {
  booksDatabase,
  readersAlsoEnjoyed,
  relatedAdventures,
} from "../data/booksData";

import BookBreadcrumb from "../components/book-detail/BookBreadcrumb";
import BookGallery from "../components/book-detail/BookGallery";
import BookAboutAndTabs from "../components/book-detail/BookAboutAndTabs";
import BookBuyingPanel from "../components/book-detail/BookBuyingPanel";
import BookReadersEnjoyed from "../components/book-detail/BookReadersEnjoyed";
import BookRelatedAdventures from "../components/book-detail/BookRelatedAdventures";
import BookStickyBar from "../components/book-detail/BookStickyBar";
import BookLightbox from "../components/book-detail/BookLightbox";
import { bookAPI } from "../services/api";

export { booksDatabase, readersAlsoEnjoyed, relatedAdventures };

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isInCompare,
  } = useContext(ShopContext);

  const [remoteBook, setRemoteBook] = useState(null);

  useEffect(() => {
    let mounted = true;
    bookAPI.getById(id)
      .then((res) => {
        if (mounted && res.book) {
          setRemoteBook(res.book);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [id]);

  const matchedBook =
    booksDatabase[id] || (location.state?.id && booksDatabase[location.state.id]);
  const currentBook = {
    ...(matchedBook || {}),
    ...(remoteBook || {}),
    ...(location.state || {}),
    description:
      remoteBook?.description ||
      matchedBook?.description ||
      location.state?.description ||
      "A legendary account of mountaineering, courage, and human endurance amidst extreme wilderness.",
    whyRead:
      matchedBook?.whyRead ||
      location.state?.whyRead ||
      "A masterclass in leadership, camaraderie, and endurance under extreme high-altitude conditions.",
    whyReadHighlights:
      matchedBook?.whyReadHighlights ||
      location.state?.whyReadHighlights || [
        {
          icon: "🏔️",
          title: "Captivating Adventure Tale",
          text: "A gripping exploration of human courage, endurance, and raw passion in extreme environments.",
        },
        {
          icon: "⚡",
          title: "Essential Outdoor Reading",
          text: "Packed with timeless wisdom, wilderness lessons, and inspiring storytelling for outdoor enthusiasts.",
        },
      ],
  };

  const frontCoverImage =
    currentBook.frontImage ||
    currentBook.image ||
    currentBook.fallbackImage ||
    everestBookCover;

  const backCoverImage =
    currentBook.backImage ||
    matchedBook?.backImage ||
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80";

  const bookImages = [
    {
      src: frontCoverImage,
      label: "Front Cover",
      fallback: currentBook.fallbackImage || everestBookCover,
    },
    {
      src: backCoverImage,
      label: "Back Cover",
      fallback: currentBook.fallbackImage || everestBookCover,
    },
  ];

  const [zoomImageIndex, setZoomImageIndex] = useState(-1);
  const [activeCoverIndex, setActiveCoverIndex] = useState(0);
  const mobileBookSliderRef = useRef(null);
  const sliderRef = useRef(null);

  const handleMobileBookSliderScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const clientWidth = e.target.clientWidth;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== activeCoverIndex && index >= 0 && index < bookImages.length) {
        setActiveCoverIndex(index);
      }
    }
  };

  const handleCoverThumbClick = (index) => {
    setActiveCoverIndex(index);
    if (mobileBookSliderRef.current) {
      mobileBookSliderRef.current.scrollTo({
        left: index * mobileBookSliderRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState("whyRead");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const wishlisted = isWishlisted(currentBook.id);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header =
        document.querySelector(".header-wrapper") ||
        document.querySelector(".navbar");
      if (header) {
        const h = header.offsetHeight;
        document.documentElement.style.setProperty("--book-header-height", `${h}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener("scroll", updateHeaderHeight, { passive: true });
    window.addEventListener("resize", updateHeaderHeight, { passive: true });

    const handleScroll = () => {
      if (window.scrollY > 320) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", updateHeaderHeight);
      window.removeEventListener("resize", updateHeaderHeight);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAddToCart = () => {
    addToCart(currentBook);
    setToastMessage(`Added "${currentBook.title || currentBook.name}" to Cart!`);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(currentBook);
    setToastMessage(
      wishlisted
        ? `Removed "${currentBook.title || currentBook.name}" from Wishlist`
        : `Added "${currentBook.title || currentBook.name}" to Wishlist!`
    );
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="book-detail-page">
      <Navbar />

      <main className="book-detail-container">
        {/* Navigation / Breadcrumb Row */}
        <BookBreadcrumb title={currentBook.title || currentBook.name} />

        {/* Main 2-Column Product Sticky Layout */}
        <div className="book-sticky-layout">
          {/* Left Column - 2 Book Covers (Front & Back), Specs & Tabs */}
          <div className="book-left-column">
            <BookGallery
              bookImages={bookImages}
              title={currentBook.title || currentBook.name}
              activeCoverIndex={activeCoverIndex}
              mobileBookSliderRef={mobileBookSliderRef}
              onMobileScroll={handleMobileBookSliderScroll}
              onDotClick={handleCoverThumbClick}
              onZoomClick={(idx) => setZoomImageIndex(idx)}
            />

            <BookAboutAndTabs
              currentBook={currentBook}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Right Column - Sticky Buying Box */}
          <BookBuyingPanel
            currentBook={currentBook}
            quantity={quantity}
            wishlisted={wishlisted}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
            onNavigateOffers={() => navigate("/offers")}
          />
        </div>

        {/* Readers Also Enjoyed Slider */}
        <BookReadersEnjoyed
          sliderRef={sliderRef}
          onScrollSlider={scrollSlider}
          onBookClick={(b) =>
            navigate(`/bookstore/${b.id}`, { state: booksDatabase[b.id] || b })
          }
          isWishlisted={isWishlisted}
          isInCompare={isInCompare}
          onWishlistToggle={(b, itemWishlisted) => {
            toggleWishlist(b);
            setToastMessage(
              itemWishlisted
                ? `Removed "${b.name}" from Wishlist`
                : `Added "${b.name}" to Wishlist!`
            );
            setTimeout(() => setToastMessage(""), 3000);
          }}
          onCompareToggle={(b, itemCompared) => {
            if (toggleCompare) toggleCompare(b);
            setToastMessage(
              itemCompared
                ? `Removed "${b.name}" from Compare`
                : `Added "${b.name}" to Compare!`
            );
            setTimeout(() => setToastMessage(""), 3000);
          }}
          onAddToCart={(b) => {
            addToCart(b);
            setToastMessage(`Added "${b.name}" to Cart!`);
            setTimeout(() => setToastMessage(""), 3000);
          }}
        />

        {/* Related Adventures Section */}
        <BookRelatedAdventures />
      </main>

      {/* Sticky Bottom Buy/Action Bar */}
      <BookStickyBar
        show={showStickyBar}
        currentBook={currentBook}
        isWishlisted={wishlisted}
        onAddToCart={handleAddToCart}
        onWishlistToggle={handleWishlistToggle}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="book-toast">
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Lightbox / Zoom Modal for Book Covers */}
      <BookLightbox
        zoomImageIndex={zoomImageIndex}
        bookImages={bookImages}
        onClose={() => setZoomImageIndex(-1)}
        onPrev={() =>
          setZoomImageIndex((prev) =>
            prev === 0 ? bookImages.length - 1 : prev - 1
          )
        }
        onNext={() =>
          setZoomImageIndex((prev) =>
            prev === bookImages.length - 1 ? 0 : prev + 1
          )
        }
      />

      <Footer />
    </div>
  );
};

export default BookDetail;
