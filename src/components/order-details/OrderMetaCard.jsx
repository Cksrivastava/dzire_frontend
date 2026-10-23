import React from "react";
import { Link } from "react-router-dom";
import { Copy, Download } from "lucide-react";

const OrderMetaCard = ({
  orderDate,
  orderId,
  copied,
  onCopyOrderId,
  orderStatus,
  currentStatusConfig,
  paymentStatus,
  paymentMethod,
  onDownloadInvoice,
}) => {
  return (
    <div className="dz-order-meta-card">
      {/* Column 1: Order Placed & Order ID */}
      <div className="meta-col meta-col-bordered">
        <span className="meta-label">ORDER PLACED</span>
        <span className="meta-val date-val">
          <span className="calendar-icon">📅</span> {orderDate}
        </span>
        <div className="meta-subrow">
          <span className="meta-label">ORDER ID</span>
          <div className="order-id-copy-line">
            <button
              type="button"
              className="copy-icon-btn"
              title="Copy Order ID"
              onClick={onCopyOrderId}
            >
              <Copy size={14} />
            </button>
            <span className="order-id-text">{orderId}</span>
            {copied && <span className="copied-tooltip">Copied!</span>}
          </div>
        </div>
      </div>

      {/* Column 2: Status */}
      <div className="meta-col meta-col-bordered">
        <div className="meta-status-box">
          <span className={`status-badge ${currentStatusConfig.badgeClass}`}>
            Status: {orderStatus}
          </span>
          <p className="status-subtext">{currentStatusConfig.subtext}</p>
        </div>
      </div>

      {/* Column 3: Payment Status & Quick Links */}
      <div className="meta-col meta-col-actions">
        <div className="meta-payment-info">
          <span className="meta-label">PAYMENT STATUS</span>
          <span className="status-badge badge-paid">{paymentStatus}</span>
          <div className="meta-subrow">
            <span className="meta-label">PAYMENT METHOD</span>
            <span className="meta-val">{paymentMethod}</span>
          </div>
        </div>

        <div className="meta-quick-links">
          <button
            type="button"
            className="meta-link-btn"
            onClick={onDownloadInvoice}
          >
            <Download size={15} color="#ff6600" />
            <span>Download Invoice</span>
          </button>
          <Link to="/return-policy" className="meta-link-btn meta-return-policy-link">
            <span>View Return Policy</span>
            <span className="arrow-sym">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderMetaCard;
