import React, { useState, useRef } from "react";
import { FaStar, FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import "./Reviews.css";

const reviewsData = [
  {
    id: 1,
    name: "Vishvas Trikutkar",
    date: "11 January 2026",
    rating: 5,
    text: "If you're looking for a one-stop shop for all your trekking and travel needs, Dzire - Outdoor Equipment Store is a place you must visit....",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
    initial: "V"
  },
  {
    id: 2,
    name: "Vedant Kalyani",
    date: "9 January 2026",
    rating: 5,
    text: "All the equipment are available required for a treak or for cycling Overall store experience was very good",
    avatar: null,
    initial: "V",
    avatarBg: "#8d6e63"
  },
  {
    id: 3,
    name: "Smita Sahoo",
    date: "9 January 2026",
    rating: 5,
    text: "Quality material",
    avatar: null,
    initial: "S",
    avatarBg: "#795548"
  },
  {
    id: 4,
    name: "Rahul Sharma",
    date: "15 January 2026",
    rating: 5,
    text: "Excellent customer service and highly durable outdoor products. Recommended to everyone.",
    avatar: null,
    initial: "R",
    avatarBg: "#5d4037"
  },
  {
    id: 5,
    name: "Nikhil Joshi",
    date: "5 January 2026",
    rating: 5,
    text: "Got all my trekking gear from here. The shoes are top-notch and the staff was extremely helpful.",
    avatar: null,
    initial: "N",
    avatarBg: "#4e342e"
  },
  {
    id: 6,
    name: "Amit Patel",
    date: "10 January 2026",
    rating: 5,
    text: "Quick and hassle-free rental process. The trekking poles and sleeping bag were in pristine condition. Highly recommended!",
    avatar: null,
    initial: "A",
    avatarBg: "#2e7d32"
  },
  {
    id: 7,
    name: "Priyanka Sen",
    date: "8 January 2026",
    rating: 5,
    text: "Superb hiking shoes! Kept my feet dry during the whole trail. Outstanding collection for outdoor enthusiasts.",
    avatar: null,
    initial: "P",
    avatarBg: "#0277bd"
  },
  {
    id: 8,
    name: "Vikram Rathore",
    date: "2 January 2026",
    rating: 5,
    text: "Very prompt delivery and premium packaging. The rucksack has great capacity and feels extremely durable.",
    avatar: null,
    initial: "W",
    avatarBg: "#d84315"
  },
  {
    id: 9,
    name: "Neha Deshmukh",
    date: "29 December 2025",
    rating: 5,
    text: "The absolute best store in town for adventure gear. Helpful staff and very reasonable prices.",
    avatar: null,
    initial: "N",
    avatarBg: "#ad1457"
  },
  {
    id: 10,
    name: "Rajesh K.",
    date: "25 December 2025",
    rating: 5,
    text: "Dzire's gym clothing is extremely comfortable and moisture-wicking. Perfect fit and great colors!",
    avatar: null,
    initial: "R",
    avatarBg: "#37474f"
  },
  {
    id: 11,
    name: "Aarti Desai",
    date: "18 December 2025",
    rating: 4,
    text: "Good collection of camping tents. Prices are fair, and the staff helped me choose the right one for my family trip.",
    avatar: null,
    initial: "A",
    avatarBg: "#c2185b"
  },
  {
    id: 12,
    name: "Siddharth Jain",
    date: "12 December 2025",
    rating: 5,
    text: "Amazing quality outdoor jackets. Kept me warm during my trip to Spiti Valley. Highly recommended store!",
    avatar: null,
    initial: "S",
    avatarBg: "#1976d2"
  },
  {
    id: 13,
    name: "Meera Nair",
    date: "5 December 2025",
    rating: 5,
    text: "Rented a sleeping bag and a backpack. The rental process was easy, items were clean, and return was hassle-free.",
    avatar: null,
    initial: "M",
    avatarBg: "#388e3c"
  },
  {
    id: 14,
    name: "Karan Singh",
    date: "28 November 2025",
    rating: 5,
    text: "The best outdoor store in the city! They literally have everything you could possibly need for a hiking expedition.",
    avatar: null,
    initial: "K",
    avatarBg: "#f57c00"
  },
  {
    id: 15,
    name: "Pooja Verma",
    date: "20 November 2025",
    rating: 5,
    text: "I buy all my trekking pants from here. The fabric is durable and stretchable, perfect for tough terrains.",
    avatar: null,
    initial: "P",
    avatarBg: "#7b1fa2"
  }
];

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" style={{ display: 'block' }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const VerifiedBadge = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" style={{ display: 'inline-block', marginLeft: '5px', verticalAlign: 'middle' }}>
    <path fill="#2196F3" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const brandsData = [
  { id: 1, name: "Technosport", logo: "https://dzirestore.in/wp-content/uploads/2025/07/b-technosport.png" },
  { id: 2, name: "EBG", logo: "https://dzirestore.in/wp-content/uploads/2025/07/b-EBG.png" },
  { id: 3, name: "Vissco", logo: "https://dzirestore.in/wp-content/uploads/2025/07/b-vissco.png" },
  { id: 4, name: "Dzire", logo: "https://dzirestore.in/wp-content/uploads/2025/07/b-dzire.png" },
  { id: 5, name: "Reccy", logo: "https://dzirestore.in/wp-content/uploads/2025/07/b-reccy.png" },
  { id: 6, name: "Adventure Worx", logo: "https://dzirestore.in/wp-content/uploads/2025/07/b-adventureworx.png" },
  { id: 7, name: "CTR-1", logo: "https://dzirestore.in/wp-content/uploads/2025/07/b-ctr-1.png" },
  { id: 8, name: "Walkoutwear", logo: "https://dzirestore.in/wp-content/uploads/2025/07/b-walkoutwear.png" },
  { id: 9, name: "Tripole", logo: "https://dzirestore.in/wp-content/uploads/2025/07/b-tripole.png" }
];

const Reviews = () => {
  const viewportRef = useRef(null);
  const brandsRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (viewportRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = viewportRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const handlePrev = () => {
    if (viewportRef.current) {
      const card = viewportRef.current.querySelector(".review-card");
      if (card) {
        const cardWidth = card.offsetWidth;
        viewportRef.current.scrollBy({ left: -(cardWidth + 16), behavior: "smooth" });
        setTimeout(checkScroll, 400);
      }
    }
  };

  const handleNext = () => {
    if (viewportRef.current) {
      const card = viewportRef.current.querySelector(".review-card");
      if (card) {
        const cardWidth = card.offsetWidth;
        viewportRef.current.scrollBy({ left: cardWidth + 16, behavior: "smooth" });
        setTimeout(checkScroll, 400);
      }
    }
  };

  const handleBrandsPrev = () => {
    if (brandsRef.current) {
      const item = brandsRef.current.querySelector(".brand-slide-item");
      if (item) {
        const itemWidth = item.offsetWidth;
        brandsRef.current.scrollBy({ left: -(itemWidth + 40), behavior: "smooth" });
      }
    }
  };

  const handleBrandsNext = () => {
    if (brandsRef.current) {
      const item = brandsRef.current.querySelector(".brand-slide-item");
      if (item) {
        const itemWidth = item.offsetWidth;
        brandsRef.current.scrollBy({ left: itemWidth + 40, behavior: "smooth" });
      }
    }
  };

  React.useEffect(() => {
    const el = viewportRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <section className="reviews-section">
      <h3 className="reviews-section-heading">What people say about Dzire Store?</h3>
      <div className="reviews-container">

        {/* Left Side: Scorecard card */}
        <div className="reviews-scorecard">
          <div className="scorecard-logo-container">
            <img src={logo} alt="Dzire Logo" className="scorecard-logo" />
          </div>
          <div className="scorecard-info">
            <div className="scorecard-stars">
              <FaStar className="star-icon fill" />
              <FaStar className="star-icon fill" />
              <FaStar className="star-icon fill" />
              <FaStar className="star-icon fill" />
              <FaStar className="star-icon fill" />
            </div>
            <p className="scorecard-count">115 Google reviews</p>
            <a
              href="https://g.page/r/Chq70kwarocEEAE/review"
              target="_blank"
              rel="noreferrer"
              className="write-review-btn"
            >
              Write a review
            </a>
          </div>
        </div>

        {/* Right Side: Reviews Slider */}
        <div className="reviews-slider-container">
          <button
            className={`slider-arrow prev ${!canScrollLeft ? "disabled" : ""}`}
            onClick={handlePrev}
            aria-label="Previous reviews"
          >
            <FaChevronLeft size={12} />
          </button>

          <div className="reviews-slider-viewport" ref={viewportRef}>
            <div className="reviews-slider-track">
              {reviewsData.map((review) => (
                <div key={review.id} className="review-card">

                  {/* Card Header: User Avatar & Details */}
                  <div className="review-card-header">
                    <div className="user-profile">
                      {review.avatar ? (
                        <img src={review.avatar} alt={review.name} className="user-avatar" />
                      ) : (
                        <div
                          className="user-avatar-initial"
                          style={{ backgroundColor: review.avatarBg || "#8d6e63" }}
                        >
                          {review.initial}
                        </div>
                      )}
                      <div className="user-meta">
                        <h4 className="user-name">{review.name}</h4>
                        <span className="review-date">{review.date}</span>
                      </div>
                    </div>
                    <div className="google-icon-wrapper">
                      <GoogleIcon />
                    </div>
                  </div>

                  {/* Rating Stars & Verified Checkmark */}
                  <div className="review-card-stars-row">
                    <div className="stars-list">
                      <FaStar className="card-star-icon" />
                      <FaStar className="card-star-icon" />
                      <FaStar className="card-star-icon" />
                      <FaStar className="card-star-icon" />
                      <FaStar className="card-star-icon" />
                    </div>
                    <VerifiedBadge />
                  </div>

                  {/* Review Text */}
                  <div className="review-text-container">
                    <p className="review-text">{review.text}</p>
                    {review.text.length > 110 && (
                      <span className="read-more-link">Read more</span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          <button
            className={`slider-arrow next ${!canScrollRight ? "disabled" : ""}`}
            onClick={handleNext}
            aria-label="Next reviews"
          >
            <FaChevronRight size={12} />
          </button>
        </div>

      </div>

      {/* Trustindex Badge footer row */}
      <div className="trust-index-footer">
        <a
          href="https://www.trustindex.io"
          target="_blank"
          rel="noreferrer"
          className="trust-badge"
        >
          <span>Verified by</span> Trustindex <FaInfoCircle size={11} className="info-icon" />
        </a>
      </div>

      {/* Brands Slider Section */}
      <div className="brands-slider-section">
        <h4 className="brands-section-title">Brands available at Dzire Store!</h4>
        <div className="brands-slider-container">
          <div className="brands-viewport" ref={brandsRef}>
            <div className="brands-track marquee-animation">
              {[...brandsData, ...brandsData].map((brand, index) => (
                <div key={`${brand.id}-${index}`} className="brand-slide-item">
                  <img src={brand.logo} alt={brand.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
