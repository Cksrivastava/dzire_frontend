import React from "react";
import { Check, ExternalLink, RotateCcw } from "lucide-react";
import { TRACKING_STEPS, getOrderStatusConfig } from "../../data/orderDetailsDefaults";

const OrderTrackingCard = ({
  orderStatus,
  currentStatusConfig,
  trackingStage,
  orderId,
  hasReturnedItems,
  firstReturnRecord,
  returnedItemsMap,
  items,
  address,
  grandTotal,
  onStepClick,
  onTrackReturnClick,
  onTrackShipmentClick,
  onRetryPayment,
  onReorder,
  onSupport,
  onViewRefund,
}) => {
  return (
    <div className="dz-tracking-card">
      <div className="tracking-header-row">
        <div>
          <h2 className="card-heading inline-heading">Order Status & Tracking</h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
            Current Status: <strong style={{ color: currentStatusConfig.color }}>{orderStatus}</strong>
          </p>
        </div>
        {currentStatusConfig.isDeliveryFlow && (
          <span className="awb-number">
            AWB No. <strong>123456789012</strong>
          </span>
        )}
      </div>

      {/* DELIVERY FLOW STEPPER (FOR Confirmed, Processed, In Transit, Delivered) */}
      {currentStatusConfig.isDeliveryFlow ? (
        <div className="stepper-horizontal-wrapper">
          <div className="stepper-horizontal-container">
            {TRACKING_STEPS.map((step, idx) => {
              const IconComp = step.icon;
              const isCompleted = step.id < trackingStage;
              const isActive = step.id === trackingStage;
              let statusClass = "";
              if (isCompleted) statusClass = "completed";
              if (isActive) statusClass = "active";

              return (
                <React.Fragment key={step.id}>
                  <div
                    className={`stepper-node ${statusClass}`}
                    style={{ cursor: "pointer" }}
                    title={`Set to ${step.title}`}
                    onClick={() => onStepClick(step)}
                  >
                    <div className="node-circle">
                      {isCompleted ? <Check size={16} strokeWidth={3} /> : <IconComp size={16} />}
                    </div>
                    <div className="node-text-wrap">
                      <span className="node-title">{step.title}</span>
                      <span className="node-date">{step.date}</span>
                    </div>
                  </div>
                  {idx < TRACKING_STEPS.length - 1 && (
                    <div className={`stepper-line ${step.id < trackingStage ? "completed" : ""}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="track-shipment-btn-wrap">
            {orderStatus === "Delivered" && hasReturnedItems && (
              <button
                type="button"
                className="btn-view-return-request"
                onClick={onTrackReturnClick}
              >
                <RotateCcw size={15} />
                <span>Track Return Request</span>
              </button>
            )}

            <button
              type="button"
              className="btn-track-shipment"
              onClick={onTrackShipmentClick}
            >
              <span>Track Shipment</span>
              <ExternalLink size={15} />
            </button>
          </div>
        </div>
      ) : (
        /* EXCEPTION STATUS ALERT CARD (FOR Cancelled, Payment Failed, On Hold, Refunded) */
        <div
          className="status-exception-card"
          style={{
            background: currentStatusConfig.bg,
            borderColor: currentStatusConfig.borderColor,
          }}
        >
          <div
            className="exception-icon-circle"
            style={{ background: currentStatusConfig.color, color: "#ffffff" }}
          >
            {React.createElement(currentStatusConfig.icon, { size: 24 })}
          </div>

          <div className="exception-content">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h3 className="exception-title" style={{ color: currentStatusConfig.color, margin: 0 }}>
                Order Status: {currentStatusConfig.label}
              </h3>
              <span className={`status-badge ${currentStatusConfig.badgeClass}`}>
                {currentStatusConfig.subtext}
              </span>
            </div>
            <p className="exception-desc">{currentStatusConfig.description}</p>

            <div className="exception-actions">
              {orderStatus === "Payment Failed" && (
                <button
                  type="button"
                  className="btn-exception-action retry-btn"
                  onClick={onRetryPayment}
                >
                  Retry Payment
                </button>
              )}
              {orderStatus === "Cancelled" && (
                <button
                  type="button"
                  className="btn-exception-action reorder-btn"
                  onClick={onReorder}
                >
                  Reorder Items
                </button>
              )}
              {orderStatus === "On Hold" && (
                <button
                  type="button"
                  className="btn-exception-action support-btn"
                  onClick={onSupport}
                >
                  Contact Support
                </button>
              )}
              {orderStatus === "Refunded" && (
                <button
                  type="button"
                  className="btn-exception-action refund-btn"
                  onClick={onViewRefund}
                >
                  View Refund Details
                </button>
              )}
              <button
                type="button"
                className="btn-exception-action secondary-btn"
                onClick={onSupport}
              >
                Need Help with this Order?
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingCard;
