import React from "react";

const OrderHistoryEmpty = ({ selectedStatusFilter }) => {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
      <p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>No orders found matching status "{selectedStatusFilter}"</p>
    </div>
  );
};

export default OrderHistoryEmpty;
