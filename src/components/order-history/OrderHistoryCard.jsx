import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck, RotateCcw } from "lucide-react";

const OrderHistoryCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div className="order-history-card">
      <div className="order-history-header">
        <div className="order-history-header-left">
          <div>
            <span className="order-history-meta-label">Order Placed</span>
            <span className="order-history-meta-value">{order.date}</span>
          </div>
          <div>
            <span className="order-history-meta-label">Total</span>
            <span className="order-history-meta-value">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
          <div>
            <span className="order-history-meta-label">Ship To</span>
            <span className="order-history-meta-value">{order.userName || order.shippingAddress?.fullName || "Ananya Patil"}</span>
          </div>
        </div>
        <div>
          <span className="order-history-meta-label">Order #</span>
          <span className="order-history-meta-value">{order.id}</span>
        </div>
      </div>

      <div className="order-history-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: order.statusColor, borderRadius: '50%', display: 'inline-block' }}></span>
            <span style={{ color: order.statusColor, fontWeight: '700' }}>{order.status}</span>
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '500' }}>{order.deliveryInfo}</p>
        </div>

        <div className="order-history-product">
          <div className="order-history-product-img" style={{ backgroundImage: `url(${order.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="order-history-product-info">
            <h4 className="order-history-product-name">{order.product}</h4>
            <p className="order-history-product-desc">{order.desc}</p>
          </div>
          <div className="order-history-product-price">₹{order.price.toLocaleString("en-IN")}</div>
        </div>
      </div>

      <div className="order-history-actions">
        {order.allowReturn && (
          <Link to={`/return-request/${order.id}`} className="btn-outline">
            <RotateCcw size={14} style={{ marginRight: '4px' }} /> Return Item
          </Link>
        )}
        <button
          type="button"
          className="btn-outline"
          onClick={() =>
            navigate("/order-details", {
              state: {
                orderId: order.id,
                orderStatus: order.status,
                orderDate: order.date,
              },
            })
          }
        >
          View Order Details
        </button>
        {order.status === "Delivered" && (
          <button type="button" className="btn-primary-small">Write a Review</button>
        )}
        {order.status === "Payment Failed" && (
          <button type="button" className="btn-primary-small" style={{ background: '#be123c' }} onClick={() => navigate("/cart")}>Retry Payment</button>
        )}
        {order.status === "In Transit" && (
          <button
            type="button"
            className="btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() =>
              navigate("/order-details", {
                state: { orderId: order.id, orderStatus: order.status },
              })
            }
          >
            <Truck size={15} /> Track Package
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryCard;
