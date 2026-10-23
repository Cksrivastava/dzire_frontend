import React from "react";
import { RotateCcw, X, Send, CheckCircle2 } from "lucide-react";
import { RETURN_REASONS } from "../../data/orderDetailsDefaults";

const OrderReturnModal = ({
  isOpen,
  orderId,
  items,
  returnedItemsMap,
  selectedProductIds,
  selectedReason,
  customReason,
  returnSuccessData,
  onClose,
  onToggleProduct,
  onSelectAll,
  onSelectReason,
  onChangeCustomReason,
  onSubmitReturn,
}) => {
  if (!isOpen) return null;

  const availableItems = items.filter((i) => !returnedItemsMap[i.id]);

  return (
    <div className="dz-modal-backdrop" onClick={onClose}>
      <div className="dz-return-modal" onClick={(e) => e.stopPropagation()}>
        <div className="return-modal-header">
          <div className="header-title-wrap">
            <div className="modal-icon-badge">
              <RotateCcw size={20} color="#ff6600" />
            </div>
            <div>
              <h3 className="modal-title">Request Return</h3>
              <p className="modal-subtitle">Order ID: #{orderId}</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {!returnSuccessData ? (
          <form onSubmit={onSubmitReturn} className="return-modal-body">
            {/* STEP 1: SELECT PRODUCT(S) */}
            <div className="form-section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <label className="section-label" style={{ margin: 0 }}>
                  1. Select Product(s) to Return <span className="req-star">*</span>
                </label>
                <button
                  type="button"
                  className="btn-select-all-link"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ff6600",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  onClick={onSelectAll}
                >
                  {selectedProductIds.length === availableItems.length &&
                  availableItems.length > 0
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
              <div className="product-select-grid">
                {items.map((item) => {
                  const isReturned = !!returnedItemsMap[item.id];
                  const isSelected = selectedProductIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`product-select-card ${isSelected ? "selected" : ""} ${
                        isReturned ? "disabled" : ""
                      }`}
                      onClick={() => onToggleProduct(item.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isReturned}
                        onChange={() => onToggleProduct(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="radio-check"
                      />
                      <img src={item.image} alt={item.name} className="product-thumb" />
                      <div className="product-details">
                        <span className="p-name">{item.name}</span>
                        <span className="p-spec">
                          {item.spec} • ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        {isReturned && (
                          <span className="already-returned-tag">
                            Already Requested
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: SELECT REASON */}
            <div className="form-section">
              <label className="section-label">
                2. Select Reason for Return <span className="req-star">*</span>
              </label>
              <div className="reasons-list">
                {RETURN_REASONS.map((reason) => {
                  const isSelected = selectedReason === reason.id;
                  return (
                    <div
                      key={reason.id}
                      className={`reason-option-card ${isSelected ? "selected" : ""}`}
                      onClick={() => onSelectReason(reason.id)}
                    >
                      <div className="reason-icon-box">{reason.icon}</div>
                      <div className="reason-text-wrap">
                        <strong className="reason-title">{reason.label}</strong>
                        <p className="reason-desc">{reason.desc}</p>
                      </div>
                      <input
                        type="radio"
                        name="returnReason"
                        value={reason.id}
                        checked={isSelected}
                        onChange={() => onSelectReason(reason.id)}
                        className="radio-check"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: CUSTOM ISSUE TEXTAREA */}
            {(selectedReason === "other" || selectedReason !== "") && (
              <div className="form-section custom-text-section">
                <label className="section-label">
                  3. Describe your issue in detail{" "}
                  {selectedReason === "other" && <span className="req-star">*</span>}
                </label>
                <textarea
                  className="custom-issue-textarea"
                  rows={3}
                  placeholder={
                    selectedReason === "other"
                      ? "Please describe the specific issue with the product..."
                      : "Optional: Add any additional details or notes about your return..."
                  }
                  value={customReason}
                  onChange={(e) => onChangeCustomReason(e.target.value)}
                ></textarea>
              </div>
            )}

            {/* MODAL FOOTER ACTIONS */}
            <div className="return-modal-footer">
              <button
                type="button"
                className="btn-cancel-modal"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn-submit-return">
                <Send size={16} />
                <span>
                  Submit Return Request ({selectedProductIds.length} item
                  {selectedProductIds.length !== 1 ? "s" : ""})
                </span>
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="return-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={54} color="#22c55e" strokeWidth={2.5} />
            </div>
            <h4 className="success-title">Return Request Submitted!</h4>
            <p className="success-subtitle">
              Your return request for {returnSuccessData.itemCount} item(s) has been
              logged. Our logistics team will inspect and arrange reverse pickup
              within 2-3 business days.
            </p>

            <div className="return-summary-card">
              <div className="summary-row">
                <span>Return ID:</span>
                <strong className="ret-id">{returnSuccessData.returnId}</strong>
              </div>
              <div className="summary-row">
                <span>Item(s) ({returnSuccessData.itemCount}):</span>
                <strong style={{ textAlign: "right", maxWidth: "60%" }}>
                  {returnSuccessData.productNames}
                </strong>
              </div>
              <div className="summary-row">
                <span>Reason:</span>
                <span className="reason-badge">
                  {returnSuccessData.reasonLabel}
                </span>
              </div>
              {returnSuccessData.customReason && (
                <div className="summary-row full-row">
                  <span>Notes:</span>
                  <p className="notes-text">"{returnSuccessData.customReason}"</p>
                </div>
              )}
              <div className="summary-row">
                <span>Status:</span>
                <span className="status-pending-badge">Pending Approval</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-close-success"
              onClick={onClose}
            >
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderReturnModal;
