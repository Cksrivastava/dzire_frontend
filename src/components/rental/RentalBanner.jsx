import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultBanner from "../../assets/about.jpeg";
import {
  getBannerSettings,
  BANNER_SETTINGS_EVENT,
} from "../../services/bannerSettings";

const RentalBanner = () => {
  const navigate = useNavigate();
  const [rentalConfig, setRentalConfig] = useState(
    () => getBannerSettings().rental
  );

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.rental) {
        setRentalConfig(e.detail.rental);
      } else {
        setRentalConfig(getBannerSettings().rental);
      }
    };
    window.addEventListener(BANNER_SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(BANNER_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const bannerImgSrc = rentalConfig?.image || defaultBanner;

  return (
    <div className="banner-wrap">
      <div className="top-bar">
        <button
          onClick={() =>
            navigate(rentalConfig?.policyBtnLink || "/terms")
          }
        >
          {rentalConfig?.policyBtnText || "Policy"}
        </button>
        <button
          onClick={() =>
            navigate(rentalConfig?.profileBtnLink || "/account")
          }
        >
          {rentalConfig?.profileBtnText || "Profile"}
        </button>
      </div>

      <div className="banner" style={{ position: "relative" }}>
        <img src={bannerImgSrc} alt="Dzire Rental Banner" />

        {/* Dynamic Overlay Text on Rental Banner */}
        {(rentalConfig?.title || rentalConfig?.badge || rentalConfig?.subtitle) && (
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              left: "28px",
              maxWidth: "600px",
              backgroundColor: "rgba(15, 23, 42, 0.72)",
              backdropFilter: "blur(6px)",
              padding: "16px 24px",
              borderRadius: "12px",
              color: "#ffffff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            {rentalConfig?.badge && (
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  color: "#ff8c42",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                {rentalConfig.badge}
              </span>
            )}
            {rentalConfig?.title && (
              <h2
                style={{
                  margin: "2px 0 6px 0",
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#ffffff",
                  letterSpacing: "0.2px",
                }}
              >
                {rentalConfig.title}
              </h2>
            )}
            {rentalConfig?.subtitle && (
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: "1.4",
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                {rentalConfig.subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalBanner;
