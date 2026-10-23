import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { orderAPI } from "../../services/api";

const ProfileOrdersTable = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let mounted = true;
    orderAPI
      .getAll()
      .then((res) => {
        if (mounted && Array.isArray(res.orders)) {
          setOrders(res.orders);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="profile-card order-history-card full-width">
      <div className="card-header">
        <h3>Order History</h3>
        <NavLink to="/account/orders" className="header-action-link">
          View All Orders
        </NavLink>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderId || order._id || order.id}>
                  <td>
                    <div className="order-id-cell">
                      <span className="order-id-code">{order.orderId || order.id}</span>
                    </div>
                  </td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : order.date || "—"}
                  </td>
                  <td>{order.items?.[0]?.name || "Product"}</td>
                  <td className="order-amount">
                    ₹{(order.total || 0).toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className="badge badge-confirmed">
                      {order.status || "Confirmed"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <NavLink to="/account/orders" className="order-details-btn">
                      View Details
                    </NavLink>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}
                >
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileOrdersTable;
