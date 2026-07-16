import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, Eye, ShieldAlert, Mail } from 'lucide-react';

const failedPayments = [
  { id: 'TXN-90234', date: 'Jul 10, 2026', time: '10:45 AM', cust: 'Rahul Verma', phone: '+91 98765 00010', amount: '₹4,500', error: 'Razorpay PG: Insufficient Funds in UPI Account' },
  { id: 'TXN-90192', date: 'Jul 09, 2026', time: '02:30 PM', cust: 'Sneha Patel', phone: '+91 98765 00021', amount: '₹1,299', error: 'Razorpay PG: Authentication failed / OTP Timeout' },
];

const AdminFailedPaymentAlerts = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert color="#ef4444" />
              Failed Payment Alerts
            </h1>
            <p>Monitor real-time payment gateway checkout drop-offs, network failures, and OTP timeouts.</p>
          </div>
          <button
            className="admin-primary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw size={18} />
            Refresh Data
          </button>
        </section>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Failed Gateway Checkouts</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>TXN ID</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Date &amp; Time</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Gateway Error Message</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {failedPayments.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#111' }}>{item.id}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ margin: '0 0 2px 0', fontSize: '13px' }}>{item.date}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{item.time}</p>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ margin: '0 0 2px 0', fontWeight: '500' }}>{item.cust}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#667085' }}>{item.phone}</p>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#b91c1c' }}>{item.amount}</td>
                    <td style={{ padding: '16px 20px', color: '#b91c1c', fontWeight: '500' }}>{item.error}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button onClick={() => alert('Sending cart checkout recovery link...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#344054', fontWeight: '500' }}>
                        <Mail size={14} /> Send Recovery SMS
                      </button>
                    </td>
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

export default AdminFailedPaymentAlerts;
