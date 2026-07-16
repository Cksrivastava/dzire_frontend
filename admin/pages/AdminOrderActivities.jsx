import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, ShoppingCart } from 'lucide-react';

const orderLogs = [
  { id: 1, timestamp: "2026-07-10 10:12:30", actor: "System Checkout", orderId: '#DZ-10101', action: "Order Placed", details: "Online payment confirmed via Razorpay (Paid ₹5,999)" },
  { id: 2, timestamp: "2026-07-09 17:10:02", actor: "Store Cashier", orderId: 'POS-5010', action: "POS Sale Completed", details: "In-store checkout invoice generated (Paid ₹4,999 cash)" },
];

const AdminOrderActivities = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart color="#ff6600" />
              Order Activities Log
            </h1>
            <p>Track order placement events, payment gateways confirmations, shipping dispatches and refunds.</p>
          </div>
          <button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} /> Refresh Logs
          </button>
        </section>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Order Processing Logs</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Timestamp</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Actor / Channel</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Action Type</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>details</th>
                </tr>
              </thead>
              <tbody>
                {orderLogs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{l.timestamp}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{l.actor}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#175cd3' }}>{l.orderId}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#f5f3ff', color: '#7c3aed' }}>
                        {l.action}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderActivities;
