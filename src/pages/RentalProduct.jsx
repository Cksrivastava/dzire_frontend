import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./RentalProduct.css";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Heart,
  Star,
} from "lucide-react";

const rentalProducts = [
  {
    id: 1,
    name: "Mountain Trek Trouser",
    category: "Trouser",
    price: 149,
    oldPrice: 249,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 2,
    name: "Adventure Hiking Trouser",
    category: "Trouser",
    price: 159,
    oldPrice: 259,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 3,
    name: "All Weather Jacket",
    category: "Jacket",
    price: 199,
    oldPrice: 349,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 4,
    name: "Padded Trek Jacket",
    category: "Jacket",
    price: 219,
    oldPrice: 399,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 5,
    name: "Rain Shield Jacket",
    category: "Rainwear",
    price: 129,
    oldPrice: 229,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 6,
    name: "Travel Rainwear",
    category: "Rainwear",
    price: 139,
    oldPrice: 239,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 7,
    name: "60L Trek Bag",
    category: "Trek Bag",
    price: 189,
    oldPrice: 329,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504280390368-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 8,
    name: "Compact Backpack",
    category: "Trek Bag",
    price: 169,
    oldPrice: 299,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504280390368-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 9,
    name: "Grip Trek Shoes",
    category: "Shoes",
    price: 179,
    oldPrice: 319,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 10,
    name: "Outdoor Shoes",
    category: "Shoes",
    price: 189,
    oldPrice: 329,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 11,
    name: "Camping Tent",
    category: "Camping",
    price: 249,
    oldPrice: 449,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1504280390368-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1504280390368-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 12,
    name: "Camping Kit",
    category: "Camping",
    price: 229,
    oldPrice: 399,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504280390368-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

const RentalProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useMemo(() => {
    return rentalProducts.find((item) => String(item.id) === String(id));
  }, [id]);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(0);
  const [openSizeGuide, setOpenSizeGuide] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState(null);

  const [openFeatureCards, setOpenFeatureCards] = useState({
    quality: true,
    comfort: false,
    rental: false,
  });

  const [openSections, setOpenSections] = useState({
    features: false,
    specification: false,
    additionalInfo: false,
    reviews: false,
  });

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-page not-found">
          <h2>Product not found</h2>
          <p>The rental product you are looking for does not exist.</p>
          <button onClick={() => navigate("/rental")} className="back-shop-btn">
            Back to Rental
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const galleryImages =
    product.images?.length >= 4
      ? product.images.slice(0, 4)
      : [product.image, product.image, product.image, product.image];

  const colors = [
    { id: 1, name: "Black / Orange", image: galleryImages[0] },
    { id: 2, name: "Grey / Black", image: galleryImages[1] || galleryImages[0] },
    { id: 3, name: "Blue / Grey", image: galleryImages[2] || galleryImages[0] },
    { id: 4, name: "Green / Black", image: galleryImages[3] || galleryImages[0] },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const price = product.price || 149;
  const oldPrice = product.oldPrice || 249;
  const discount = Math.round(((oldPrice - price) / oldPrice) * 100);

  const toggleFeatureCard = (key) => {
    setOpenFeatureCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const scrollToSection = (key) => {
    const el = document.getElementById(key);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleRentNow = () => {
  navigate("/rental-booking", {
    state: {
      productName: product.name,
      size: selectedSize,
      costing: `₹${price}/day`,
    },
  });
};

  const featureCards = [
    {
      key: "quality",
      title: "Premium Rental Quality",
      content:
        "Every rental product is checked, cleaned and prepared before delivery so you get reliable outdoor gear for your trip.",
    },
    {
      key: "comfort",
      title: "Comfort Ready",
      content:
        "Designed for trekking, camping and travel comfort with durable materials suitable for changing outdoor conditions.",
    },
    {
      key: "rental",
      title: "Affordable Daily Rent",
      content:
        "Save more by renting instead of buying. Perfect for short trips, weekend adventures and occasional outdoor use.",
    },
  ];

  const sectionTabs = [
    { key: "features", label: "Features" },
    { key: "specification", label: "Specification" },
    { key: "additionalInfo", label: "Additional Info" },
    { key: "reviews", label: "Reviews" },
  ];

  const serviceModalData = {
    delivery: {
      title: "Rental Delivery",
      content:
        "Rental delivery is available for selected service areas. Delivery time depends on product availability, location and booking date.",
    },
    secure: {
      title: "Secure Rental & Easy Return",
      content:
        "Your rental booking is handled securely. Products should be returned in the same condition after use according to rental policy.",
    },
  };

  return (
    <>
      <Navbar />

      <div className="product-page">
        <div className="product-breadcrumb adidas-breadcrumb">
          <span onClick={() => navigate("/rental")}>← Back</span>
          <span>/</span>
          <span onClick={() => navigate("/")}>Home</span>
          <span>/</span>
          <span onClick={() => navigate("/rental")}>Rental</span>
          <span>/</span>
          <strong>{product.name}</strong>
        </div>

        <div className="product-sticky-layout">
          <div className="product-left-column">
            <section className="product-gallery-section">
              <div className="gallery-grid-2x2">
                {galleryImages.map((img, index) => (
                  <div className="gallery-grid-card" key={index}>
                    <div className="gallery-image-wrap">
                      <img
                        src={img}
                        alt={`${product.name}-${index + 1}`}
                        className="gallery-grid-image"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="product-lower-content">
              <div className="section-tabs-bar">
                {sectionTabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`section-tab ${
                      openSections[tab.key] ? "active" : ""
                    }`}
                    onClick={() => {
                      setOpenSections((prev) => ({
                        ...prev,
                        [tab.key]: true,
                      }));
                      scrollToSection(tab.key);
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="accordion-sections">
                <section className="big-accordion-section" id="features">
                  <button
                    className="big-section-header"
                    onClick={() => toggleSection("features")}
                  >
                    <h2>Features</h2>
                    {openSections.features ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </button>

                  {openSections.features && (
                    <div className="big-section-body">
                      <p className="section-intro">
                        Rent premium outdoor gear for your next trip. This
                        product is selected for comfort, durability and easy
                        adventure use.
                      </p>

                      <div className="feature-cards-grid">
                        {featureCards.map((card) => (
                          <div key={card.key} className="feature-expand-card">
                            <button
                              className="feature-card-head"
                              onClick={() => toggleFeatureCard(card.key)}
                            >
                              <div className="feature-card-title">
                                {card.title}
                              </div>
                              {openFeatureCards[card.key] ? (
                                <Minus size={28} />
                              ) : (
                                <Plus size={28} />
                              )}
                            </button>

                            {openFeatureCards[card.key] && (
                              <div className="feature-card-body">
                                <p>{card.content}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                <section className="big-accordion-section" id="specification">
                  <button
                    className="big-section-header"
                    onClick={() => toggleSection("specification")}
                  >
                    <h2>Specification</h2>
                    {openSections.specification ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </button>

                  {openSections.specification && (
                    <div className="big-section-body">
                      <div className="detail-white-box">
                        <div className="specifications-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                          <div className="spec-item">
                            <span style={{ fontWeight: '700', display: 'block', color: '#111', fontSize: '14px', marginBottom: '4px' }}>Brand</span>
                            <span style={{ color: '#555', fontSize: '14px' }}>{product.brand || 'DZIRE RENTAL'}</span>
                          </div>
                          <div className="spec-item">
                            <span style={{ fontWeight: '700', display: 'block', color: '#111', fontSize: '14px', marginBottom: '4px' }}>Category</span>
                            <span style={{ color: '#555', fontSize: '14px' }}>{product.category || 'Rental Gear'}</span>
                          </div>
                          <div className="spec-item">
                            <span style={{ fontWeight: '700', display: 'block', color: '#111', fontSize: '14px', marginBottom: '4px' }}>Rental ID</span>
                            <span style={{ color: '#555', fontSize: '14px' }}>RN-{String(product.id).padStart(4, '0')}</span>
                          </div>
                          <div className="spec-item">
                            <span style={{ fontWeight: '700', display: 'block', color: '#111', fontSize: '14px', marginBottom: '4px' }}>Ideal For</span>
                            <span style={{ color: '#555', fontSize: '14px' }}>Outdoor Trips & Adventures</span>
                          </div>
                          <div className="spec-item">
                            <span style={{ fontWeight: '700', display: 'block', color: '#111', fontSize: '14px', marginBottom: '4px' }}>Condition</span>
                            <span style={{ color: '#555', fontSize: '14px' }}>Sanitized & Quality-Checked</span>
                          </div>
                          <div className="spec-item">
                            <span style={{ fontWeight: '700', display: 'block', color: '#111', fontSize: '14px', marginBottom: '4px' }}>Rental Pricing</span>
                            <span style={{ color: '#555', fontSize: '14px' }}>Daily Basis</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <section className="big-accordion-section" id="additionalInfo">
                  <button
                    className="big-section-header"
                    onClick={() => toggleSection("additionalInfo")}
                  >
                    <h2>Additional Info</h2>
                    {openSections.additionalInfo ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </button>

                  {openSections.additionalInfo && (
                    <div className="big-section-body">
                      <div className="detail-white-box">
                        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                          <li style={{ marginBottom: '8px', color: '#444', fontSize: '14px' }}>
                            <strong>Rental Duration:</strong> You can select the number of rental days during the booking process.
                          </li>
                          <li style={{ marginBottom: '8px', color: '#444', fontSize: '14px' }}>
                            <strong>Security Deposit:</strong> A minimal refundable security deposit may be applicable depending on the product value.
                          </li>
                          <li style={{ marginBottom: '8px', color: '#444', fontSize: '14px' }}>
                            <strong>Cancellation Policy:</strong> Free cancellations up to 24 hours before the rental start date.
                          </li>
                          <li style={{ marginBottom: '8px', color: '#444', fontSize: '14px' }}>
                            <strong>Care & Usage:</strong> Please do not alter the product. Customers are expected to return the gear in clean, functional condition.
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </section>

                <section className="big-accordion-section" id="reviews">
                  <button
                    className="big-section-header"
                    onClick={() => toggleSection("reviews")}
                  >
                    <h2>Reviews</h2>
                    {openSections.reviews ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </button>

                  {openSections.reviews && (
                    <div className="big-section-body">
                      <div className="detail-white-box">
                        <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>
                          Customers highly appreciate the excellent condition of the gear, hassle-free pickup/delivery, and extremely budget-friendly rental options.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </section>
          </div>

          <aside className="product-right-sticky">
            <div className="product-right-panel">
              <p className="brand-name">DZIRE RENTAL</p>

              <div className="top-rating-line" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="rating-small" style={{ fontSize: '14px', fontWeight: '700', color: '#111', lineHeight: '1' }}>{product.rating}</span>
                <div className="stars-container" style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                  {Array.from({ length: 5 }, (_, i) => {
                    const ratingVal = parseFloat(product.rating) || 4.5;
                    const isFilled = i < Math.round(ratingVal);
                    return (
                      <Star
                        key={i}
                        size={14}
                        fill={isFilled ? "#ffa41c" : "transparent"}
                        color={isFilled ? "#ffa41c" : "#d1d5db"}
                      />
                    );
                  })}
                </div>
                <span className="review-link" style={{ fontSize: '13px', color: '#777', lineHeight: '1' }}>(128)</span>
              </div>

              <h1 className="adidas-product-title">
                {product.name.toUpperCase()}
              </h1>

              <div className="adidas-price-block">
                <div className="sale-line">₹{price}/day</div>
                <div className="mrp-line">
                  ₹{oldPrice}/day MRP
                  <span>Inclusive of rental handling charges</span>
                </div>
                <div className="save-line">Save {discount}% by renting</div>
              </div>

              <p className="promo-note">
                This product is available for rental booking. Final availability
                depends on selected date and location.
              </p>

              <div className="selector-block">
                <h4>Colours</h4>

                <div className="color-swatch-grid">
                  {colors.map((color, index) => (
                    <button
                      key={color.id}
                      className={`color-swatch-item ${
                        selectedColor === index ? "active" : ""
                      }`}
                      onClick={() => setSelectedColor(index)}
                      title={color.name}
                    >
                      <img
                        src={color.image}
                        alt={color.name}
                        className="color-swatch-image"
                      />
                    </button>
                  ))}
                </div>

                <p className="selected-color-name">
                  {colors[selectedColor]?.name}
                </p>
              </div>

              <div className="selector-block">
                <div className="size-header">
                  <h2>Sizes</h2>
                </div>

                <div className="size-grid">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${
                        selectedSize === size ? "active" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <div className="size-guides">
                  <button
                    className="size-guide-link"
                    onClick={() => setOpenSizeGuide(true)}
                  >
                    Size guide
                  </button>
                </div>

                {openSizeGuide && (
                  <div
                    className="size-guide-overlay"
                    onClick={() => setOpenSizeGuide(false)}
                  >
                    <div
                      className="size-guide-drawer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="size-guide-header">
                        <h2>Size guide</h2>
                        <button onClick={() => setOpenSizeGuide(false)}>
                          ✕
                        </button>
                      </div>

                      <div className="size-guide-content">
                        <h3>Rental product sizing</h3>
                        <p>Choose your regular size for comfortable fit.</p>

                        <h4>Size chart</h4>

                        <div className="table-scroll">
                          <table>
                            <tbody>
                              <tr>
                                <th>Size</th>
                                <td>XS</td>
                                <td>S</td>
                                <td>M</td>
                                <td>L</td>
                                <td>XL</td>
                                <td>XXL</td>
                              </tr>
                              <tr>
                                <th>Chest/Waist</th>
                                <td>34</td>
                                <td>36</td>
                                <td>38</td>
                                <td>40</td>
                                <td>42</td>
                                <td>44</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <h4>In between sizes?</h4>
                        <p>For tight fit, go one size down.</p>
                        <p>For loose fit, go one size up.</p>

                        <p className="return-note">
                          Size exchange depends on rental stock availability.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="size-guide-box">
                <span>&#9432;</span> <strong>Recommended:</strong> Select your
                normal size for rental comfort.
              </div>

              <div className="di-margin">
                <button className="main-bag-btn" onClick={handleRentNow}>
                  <span className="bag-text">Rent Now</span>
                  <span className="bag-plus">+</span>
                </button>
              </div>

              <div className="service-list">
                <div className="service-item-header">
                  <span>Rental Benefits</span>
                </div>

                <div className="service-item-below-header">
                  <span>₹{price}/day affordable rental plan</span>
                </div>

                <button
                  type="button"
                  className="service-item clickable-service-item"
                  onClick={() => setActiveServiceModal("delivery")}
                >
                  <Truck size={18} />
                  <span>
                    Delivery available for selected areas. Rental duration can
                    be selected during booking.
                  </span>
                </button>

                <button
                  type="button"
                  className="service-item clickable-service-item"
                  onClick={() => setActiveServiceModal("secure")}
                >
                  <ShieldCheck size={18} />
                  <span>
                    Secure booking with easy product return after rental period.
                  </span>
                </button>
              </div>

              {activeServiceModal && (
                <div
                  className="service-modal-overlay"
                  onClick={() => setActiveServiceModal(null)}
                >
                  <div
                    className="service-modal-box"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="service-modal-header">
                      <h3>{serviceModalData[activeServiceModal].title}</h3>
                      <button
                        type="button"
                        className="service-modal-close"
                        onClick={() => setActiveServiceModal(null)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="service-modal-body">
                      <p>{serviceModalData[activeServiceModal].content}</p>
                      <p>
                        Please check product availability, pickup/return timing
                        and rental rules before confirming your booking.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RentalProduct;