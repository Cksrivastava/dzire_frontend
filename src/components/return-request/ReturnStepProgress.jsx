import React from "react";
import { Check } from "lucide-react";

const ReturnStepProgress = ({ currentStep }) => {
  if (currentStep === 3) return null;

  return (
    <div className="dz-stepper-bar">
      {/* STEP 1 */}
      <div
        className={`step-node ${currentStep >= 1 ? "active" : ""} ${
          currentStep > 1 ? "completed" : ""
        }`}
      >
        <div className="step-circle">
          {currentStep > 1 ? <Check size={14} strokeWidth={3} /> : "1"}
        </div>
        <span className="step-label">Select Items & Add Details</span>
      </div>

      <div className={`step-line ${currentStep >= 2 ? "active" : ""}`}></div>

      {/* STEP 2 */}
      <div
        className={`step-node ${currentStep >= 2 ? "active" : ""} ${
          currentStep > 2 ? "completed" : ""
        }`}
      >
        <div className="step-circle">
          {currentStep > 2 ? <Check size={14} strokeWidth={3} /> : "2"}
        </div>
        <span className="step-label">Review</span>
      </div>

      <div className={`step-line ${currentStep >= 3 ? "active" : ""}`}></div>

      {/* STEP 3 */}
      <div className={`step-node ${currentStep >= 3 ? "active" : ""}`}>
        <div className="step-circle">3</div>
        <span className="step-label">Submit</span>
      </div>
    </div>
  );
};

export default ReturnStepProgress;
