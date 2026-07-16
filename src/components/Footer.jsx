import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/logo2.png";
import PopularSearches from "./PopularSearches";
import Reviews from "./Reviews";

import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { Compass, Headphones, Users, Star, ChevronDown, ChevronUp } from "lucide-react";

import visaImg from "../assets/visa.png";
import masterImg from "../assets/master.png";
import upiImg from "../assets/upi.png";
import appleImg from "../assets/apple.png";

/* ── Inline SVG icons ── */
const BadgeCheckIcon = ({ size = 26 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.75Z" /><path d="m9 12 2 2 4-4" /></svg>;
const ShieldIcon = ({ size = 26 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>;
const HeadsetIcon = ({ size = 26 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>;
const TruckIcon = ({ size = 26 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
const LockIcon = ({ size = 26 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" ry="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /><circle cx="12" cy="15" r="1.5" /><line x1="12" y1="16.5" x2="12" y2="18.5" /></svg>;
const PinIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
const ChatIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></svg>;
const BoxIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
const XIcon = () => <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" /></svg>;

const valueProps = [
  { icon: <BadgeCheckIcon />, title: "100% Authentic", desc: "Genuine Products Only" },
  { icon: <HeadsetIcon />, title: "Expert Advice", desc: "From Outdoor Specialists" },
  { icon: <TruckIcon />, title: "Fast & Reliable Delivery", desc: "On Time, Every Time" },
  { icon: <LockIcon />, title: "Secure Payment", desc: "Safe & Encrypted Transactions" },
];

const sections = [
  {
    key: "explore", icon: <Compass size={20} className="fp-col-icon" />, title: "EXPLORE",
    links: [{ label: "Our Story", to: "/about" }, { label: "Blogs", to: "/blog" }, { label: "Rentals", to: "/rental" }, { label: "Bookstore", to: "/shop" }],
  },
  {
    key: "support", icon: <Headphones size={20} className="fp-col-icon" />, title: "SUPPORT",
    links: [{ label: "Shipping Policy", to: "/shipping" }, { label: "Return Policy", to: "/return-policy" }, { label: "Dzire Credits", to: "/" }, { label: "Rentals", to: "/rental" }],
  },
  {
    key: "community", icon: <Users size={20} className="fp-col-icon" />, title: "COMMUNITY",
    links: [
      { label: "Events", to: "/event" },
      { label: "Himalayan Treks", to: "/events/himalaya" },
      { label: "Tours", to: "/events/himalaya" },
      { label: "Sahyadri Treks", to: "/events/sahyadri" }
    ],
  },
  {
    key: "dzire", icon: <Star size={20} className="fp-col-icon" />, title: "DZIRE+",
    links: [{ label: "Travel Partner", to: "/" }, { label: "Benefits", to: "/" }, { label: "Membership Plans", to: "/" }],
  },
];

const serviceCards = [
  { icon: <HeadsetIcon size={28} />, label: "Contact Us", sub: "We're here to help", href: "/contact", isLink: true },
  { icon: <PinIcon />, label: "Find a Store", sub: "Locate our offline stores", href: "https://www.google.com/maps/place/Dzire+-+Outdoor+Equipment+Store/@18.5051661,73.8346188", isLink: false },
  { icon: <ChatIcon />, label: "Live Chat", sub: "Chat with our support team", href: "https://wa.me/919923080044", isLink: false },
  { icon: <BoxIcon />, label: "In-Store Pickup", sub: "Collect your order in store", href: "/store-pickup", isLink: true },
];

const Footer = ({ showPopularSearches = true, showReviews = true }) => {
  /* EXPLORE open by default on mobile (matches image) */
  const [openSections, setOpenSections] = useState({ explore: false, support: false, community: false, dzire: false });
  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      {showPopularSearches && <PopularSearches />}
      {showReviews && <Reviews />}

      <footer className="footer">

        {/* ════════════════════════════════════════════
            SECTION 1 — VALUE PROPS
        ════════════════════════════════════════════ */}
        <div className="fp-value-section">

          {/* Desktop: horizontal strip */}
          <div className="fp-value-desktop">
            <div className="fp-value-inner">
              <div className="fp-why-box">
                <div className="fp-why-icon"><ShieldIcon /></div>
                <span className="fp-why-text">Why Choose Dzire?</span>
              </div>
              {valueProps.map((p, i) => (
                <React.Fragment key={i}>
                  <div className="fp-value-divider" />
                  <div className="fp-prop">
                    <div className="fp-prop-icon">{p.icon}</div>
                    <div className="fp-prop-text">
                      <span className="fp-prop-title">{p.title}</span>
                      <span className="fp-prop-desc">{p.desc}</span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Mobile: heading + 2×2 grid */}
          <div className="fp-value-mobile">
            <div className="fp-value-mobile-head">
              <span className="fp-value-mobile-line" />
              <h3 className="fp-value-mobile-title">Why Choose Dzire?</h3>
              <span className="fp-value-mobile-line" />
            </div>
            <div className="fp-value-mobile-grid">
              {valueProps.map((p, i) => (
                <div key={i} className="fp-mob-prop-card">
                  <div className="fp-mob-prop-icon">{p.icon}</div>
                  <div className="fp-mob-prop-text">
                    <span className="fp-mob-prop-title">{p.title}</span>
                    <span className="fp-mob-prop-desc">{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ════════════════════════════════════════════
            SECTION 2 — DARK MAIN
        ════════════════════════════════════════════ */}
        <div className="fp-dark-section">

          {/* Mobile centered logo — only visible on mobile */}
          <div className="fp-mob-brand">
            <img src={logo} alt="Dzire Store" className="fp-mob-logo" />
          </div>

          {/* Desktop + tablet: brand left + 4 cols right */}
          <div className="fp-dark-inner">

            {/* Brand column — hidden on mobile */}
            <div className="fp-brand-col">
              <img src={logo} alt="Dzire Store" className="fp-logo" />
              <div className="fp-socials">
                <a href="https://wa.me/919923080044" target="_blank" rel="noreferrer" className="fp-social-btn"><FaWhatsapp size={17} /></a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="fp-social-btn"><FaInstagram size={17} /></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="fp-social-btn"><FaFacebookF size={17} /></a>
              </div>
            </div>

            {/* 4 link columns */}
            <div className="fp-cols-grid">
              {sections.map((sec) => (
                <div key={sec.key} className={`fp-col ${openSections[sec.key] ? "fp-col--open" : ""}`}>
                  <div className="fp-col-head" onClick={() => toggle(sec.key)}>
                    <div className="fp-col-head-left">
                      {sec.icon}
                      <span className="fp-col-title">{sec.title}</span>
                    </div>
                    <span className="fp-col-chevron">
                      {openSections[sec.key] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </div>
                  <div className="fp-col-content">
                    <ul className="fp-col-links">
                      {sec.links.map((lnk) => (
                        <li key={lnk.label}><Link to={lnk.to}>{lnk.label}</Link></li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ── 4 Service Cards ── */}
          <div className="fp-cards-row">
            <div className="fp-cards-inner">
              {serviceCards.map((c, i) => (
                <div key={i} className="fp-card">
                  <div className="fp-card-icon">{c.icon}</div>
                  <div className="fp-card-text">
                    {c.isLink
                      ? <Link to={c.href} className="fp-card-title">{c.label}</Link>
                      : <a href={c.href} target="_blank" rel="noreferrer" className="fp-card-title">{c.label}</a>
                    }
                    <span className="fp-card-sub">{c.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile social icons row */}
          <div className="fp-mob-socials">
            <a href="https://wa.me/919923080044" target="_blank" rel="noreferrer" className="fp-social-btn"><FaWhatsapp size={17} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="fp-social-btn"><FaInstagram size={17} /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="fp-social-btn"><FaFacebookF size={17} /></a>
          </div>

        </div>

        {/* ════════════════════════════════════════════
            SECTION 3 — BOTTOM BAR
        ════════════════════════════════════════════ */}
        <div className="fp-bottom-bar">
          <div className="fp-bottom-inner">
            <div className="fp-bottom-copy">© 2026 Dzire Store. All Rights Reserved.</div>
            <div className="fp-bottom-policies">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="fp-policy-sep">|</span>
              <Link to="/terms">T&amp;C</Link>
              <span className="fp-policy-sep">|</span>
              <Link to="/cookie-policy">Cookie Policy</Link>
            </div>
            <div className="fp-bottom-payment">
              <span className="fp-accept-text">We Accept:</span>
              <div className="fp-payment-badges">
                <img src={visaImg} alt="Visa" className="fp-badge-img" />
                <img src={masterImg} alt="Mastercard" className="fp-badge-img" />
                <img src={upiImg} alt="UPI" className="fp-badge-img" />
                <img src={appleImg} alt="Apple Pay" className="fp-badge-img" />
              </div>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;