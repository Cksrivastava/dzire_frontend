import React from "react";
import { Link } from "react-router-dom";
import { Check, MapPin } from "lucide-react";

const ReturnStepSubmitted = ({ submittedReturnData, selectedProductsCount }) => {
  return (
    <div className="dz-return-step-content">
      <div className="dz-submitted-main-card">
        {/* GREEN CHECK CIRCLE ICON */}
        <div className="submitted-check-circle">
          <Check size={28} strokeWidth={3.5} color="#ffffff" />
        </div>

        {/* HEADING & SUBTITLE */}
        <h2 className="submitted-heading">Return Request Submitted!</h2>
        <p className="submitted-subtext">
          Your return request has been received and will be reviewed shortly.<br />
          We'll notify you via email and in your account once there's an update.
        </p>

        {/* 3-COLUMN META SUMMARY BOX */}
        <div className="submitted-meta-grid">
          <div className="submitted-meta-col">
            <span className="s-meta-label">Return Request ID</span>
            <strong className="s-meta-val">
              {submittedReturnData?.returnId || "RET-000128"}
            </strong>
          </div>
          <div className="submitted-meta-col">
            <span className="s-meta-label">Order ID</span>
            <strong className="s-meta-val">
              {submittedReturnData?.orderId || "DZIRE2505181024"}
            </strong>
          </div>
          <div className="submitted-meta-col">
            <span className="s-meta-label">Items</span>
            <strong className="s-meta-val">
              {submittedReturnData?.itemCount || selectedProductsCount || 2}
            </strong>
          </div>
        </div>

        {/* WHAT'S NEXT? VERTICAL TIMELINE */}
        <div className="submitted-whats-next-section">
          <h3 className="whats-next-title">What's Next?</h3>

          <div className="vertical-timeline-container">
            {/* Step 1 */}
            <div className="timeline-node-row active">
              <div className="timeline-left-node">
                <div className="timeline-dot active-dot">
                  <span className="inner-orange-dot"></span>
                </div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content-wrap">
                <h4 className="t-node-title">Return Requested</h4>
                <span className="t-node-date">18 May, 2025 • 11:30 AM</span>
                <p className="t-node-desc">We have received your return request.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="timeline-node-row">
              <div className="timeline-left-node">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content-wrap">
                <h4 className="t-node-title">Under Review</h4>
                <p className="t-node-desc">
                  Our team will review the submitted details and media.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="timeline-node-row">
              <div className="timeline-left-node">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content-wrap">
                <h4 className="t-node-title">Pickup / Product Received</h4>
                <p className="t-node-desc">We'll arrange pickup (if applicable).</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="timeline-node-row">
              <div className="timeline-left-node">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content-wrap">
                <h4 className="t-node-title">Quality Inspection</h4>
                <p className="t-node-desc">Our team will inspect the product.</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="timeline-node-row">
              <div className="timeline-left-node">
                <div className="timeline-dot"></div>
              </div>
              <div className="timeline-content-wrap">
                <h4 className="t-node-title">Return Approved</h4>
                <p className="t-node-desc">
                  Store credit will be issued to your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM NEED HELP BOX */}
      <div className="submitted-need-help-card">
        <div className="help-left-info">
          <div className="help-icon-circle">
            <MapPin size={18} color="#ffffff" />
          </div>
          <div className="help-text-wrap">
            <strong className="help-title">Need Help?</strong>
            <p className="help-subtext">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>

        <Link to="/support" className="help-contact-link">
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default ReturnStepSubmitted;
