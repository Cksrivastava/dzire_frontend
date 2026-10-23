import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";
import "./ReturnRequestDetail.css";
import { orderAPI } from "../services/api";

import {
  INITIAL_RETURN_PRODUCTS,
  REASON_OPTIONS,
} from "../data/returnRequestData";

import ReturnStepProgress from "../components/return-request/ReturnStepProgress";
import ReturnStepSelectItems from "../components/return-request/ReturnStepSelectItems";
import ReturnStepReview from "../components/return-request/ReturnStepReview";
import ReturnStepSubmitted from "../components/return-request/ReturnStepSubmitted";

const ReturnRequestDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(() => {
    if (location.state?.step) return location.state.step;
    return 1;
  });
  const [products, setProducts] = useState(INITIAL_RETURN_PRODUCTS);
  const [refundMethod, setRefundMethod] = useState("wallet");
  const [submittedReturnData, setSubmittedReturnData] = useState(() => {
    if (location.state?.returnData) return location.state.returnData;
    try {
      const saved = JSON.parse(localStorage.getItem("dzire_returns") || "[]");
      if (saved.length > 0) return saved[0];
    } catch (e) {}
    return null;
  });

  const toggleSelectProduct = (id) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextSelected = !item.selected;
          return {
            ...item,
            selected: nextSelected,
            reason: nextSelected ? item.reason || "Size doesn't fit" : "",
          };
        }
        return item;
      })
    );
  };

  const updateProductField = (id, field, value) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handlePhotoUpload = (id, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newPhotoUrls = files.map((file) => URL.createObjectURL(file));

    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            photos: [...item.photos, ...newPhotoUrls],
          };
        }
        return item;
      })
    );
  };

  const handleRemovePhoto = (id, photoIndex) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedPhotos = item.photos.filter((_, idx) => idx !== photoIndex);
          return { ...item, photos: updatedPhotos };
        }
        return item;
      })
    );
  };

  const handleVideoUpload = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const videoObj = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      thumb: URL.createObjectURL(file),
    };

    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, video: videoObj } : item))
    );
  };

  const handleRemoveVideo = (id) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, video: null } : item))
    );
  };

  const selectedProducts = products.filter((p) => p.selected);

  const handleProceedToReview = () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least 1 item to return.");
      return;
    }

    for (let p of selectedProducts) {
      if (!p.reason || p.reason === "Select reason...") {
        alert(`Please select a reason for return for "${p.name}".`);
        return;
      }
    }

    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitReturn = () => {
    const generatedId = "RET-000128";
    const totalRefund = selectedProducts.reduce(
      (sum, p) => sum + p.price * p.qty,
      0
    );

    const record = {
      returnId: generatedId,
      orderId: "DZIRE2505181024",
      date: "18 May, 2025 • 11:30 AM",
      items: selectedProducts,
      itemCount: selectedProducts.length,
      refundMethod:
        refundMethod === "wallet"
          ? "Dzire Store Wallet"
          : "Original Payment Method (UPI)",
      totalAmount: totalRefund,
      status: "Return Requested",
    };

    try {
      const existing = JSON.parse(localStorage.getItem("dzire_returns") || "[]");
      existing.unshift(record);
      localStorage.setItem("dzire_returns", JSON.stringify(existing));

      const returnedMap = {};
      selectedProducts.forEach((p) => {
        returnedMap[p.id || p.name] = record;
      });
      localStorage.setItem(
        `dzire_user_submitted_return_${record.orderId}`,
        JSON.stringify(returnedMap)
      );
      window.dispatchEvent(new Event("dzire_return_submitted"));

      // Send to backend API
      orderAPI.requestReturn(record.orderId, {
        reason: record.items?.[0]?.reason || "Size/Fit issue",
        resolution: record.refundMethod,
        itemDetails: record.items?.map((i) => i.name).join(", "),
        comments: record.items?.[0]?.comment || "Submitted via returns portal",
      }).catch((apiErr) => {
        console.warn("Backend return request sync fallback:", apiErr);
      });
    } catch (e) {
      console.error(e);
    }

    setSubmittedReturnData(record);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="dz-return-request-page">
      <Navbar />

      <main className="dz-return-container">
        {/* TOP BACK LINK */}
        <div className="dz-back-nav-row">
          <button
            type="button"
            className="btn-back-link"
            onClick={() => {
              if (currentStep === 2) {
                setCurrentStep(1);
              } else {
                navigate("/order-details");
              }
            }}
          >
            <ArrowLeft size={16} />
            <span>
              {currentStep === 1 && "Back to Order Details"}
              {currentStep === 2 && "Back"}
              {currentStep === 3 && "Back to Orders"}
            </span>
          </button>
        </div>

        {/* MAIN PAGE TITLE (Show when not on step 3) */}
        {currentStep !== 3 && (
          <h1 className="dz-return-heading">
            {currentStep === 1 &&
              "Return Items – Select Products & Provide Details"}
            {currentStep === 2 && "Review Your Return Request"}
          </h1>
        )}

        {/* 3-STEP PROGRESS STEPPER */}
        <ReturnStepProgress currentStep={currentStep} />

        {/* STEP 1: SELECT ITEMS & ADD DETAILS */}
        {currentStep === 1 && (
          <ReturnStepSelectItems
            products={products}
            onToggleSelect={toggleSelectProduct}
            onUpdateField={updateProductField}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={handleRemovePhoto}
            onVideoUpload={handleVideoUpload}
            onRemoveVideo={handleRemoveVideo}
            onCancel={() => navigate("/order-details")}
            onContinue={handleProceedToReview}
          />
        )}

        {/* STEP 2: REVIEW YOUR RETURN REQUEST */}
        {currentStep === 2 && (
          <ReturnStepReview
            selectedProducts={selectedProducts}
            onEditStep={() => setCurrentStep(1)}
            onRemovePhoto={handleRemovePhoto}
            onRemoveVideo={handleRemoveVideo}
            onBack={() => setCurrentStep(1)}
            onSubmit={handleSubmitReturn}
          />
        )}

        {/* STEP 3: SUBMITTED CONFIRMATION */}
        {currentStep === 3 && (
          <ReturnStepSubmitted
            submittedReturnData={submittedReturnData}
            selectedProductsCount={selectedProducts.length}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ReturnRequestDetail;
