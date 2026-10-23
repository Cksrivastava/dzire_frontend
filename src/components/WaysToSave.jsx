import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WaysToSave.css";
import { getSectionSettings, SECTION_SETTINGS_EVENT } from "../services/sectionSettings";

const WaysToSave = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(() => getSectionSettings().waysToSave);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.waysToSave) {
        setConfig(e.detail.waysToSave);
      } else {
        setConfig(getSectionSettings().waysToSave);
      }
    };
    window.addEventListener(SECTION_SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(SECTION_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const {
    title = "Outdoor adventures, offbeat escapes, and curated journeys for the explorer in you.",
    cards = [],
  } = config || {};

  return (
    <section className="ways-to-save-section">
      <h2 className="ways-to-save-title">
        {title}
      </h2>
      <div className="ways-to-save-grid">
        {(cards || []).map((card, index) => (
          <div className="save-card" key={card.id || index}>
            <div className="save-card-image-wrapper">
              <img
                src={card.image || "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=800&q=80"}
                alt={card.heading || "Adventure gear"}
                className="save-card-image"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
            <div className="save-card-content">
              {card.tag && <span className="save-card-tag">{card.tag}</span>}
              <h3 className="save-card-heading">{card.heading}</h3>
              <p className="save-card-desc">{card.desc}</p>
              {card.btnText && (
                <button
                  className="save-card-btn"
                  onClick={() => {
                    if (card.btnLink) {
                      if (card.btnLink.startsWith("http")) {
                        window.open(card.btnLink, "_blank");
                      } else {
                        navigate(card.btnLink);
                      }
                    } else {
                      navigate("/shop");
                    }
                  }}
                >
                  {card.btnText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WaysToSave;
