import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, Eye, Clock, ArrowRight } from 'lucide-react';

const pendingReturns = [
  { id: 'RET-1002', orderId: 'ORD-24082', date: 'Oct 28, 2026', cust: 'John Doe', items: '1', amount: '₹4,999', status: 'Pending Verification' },
  { id: 'RET-1005', orderId: 'ORD-24095', date: 'Oct 29, 2026', cust: 'Robert King', items: '1', amount: '₹2,300', status: 'Pending Verification' }
];

const AdminPendingReturnsAlerts = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock color="#ff6600" />
              Pending Returns Alerts
            </h1>
            <p>List of open return requests awaiting warehouse receipt verification or inspection approval.</p>
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Inspection Queue</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Return ID</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Requested Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Items Count</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingReturns.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#111' }}>{item.id}</td>
                    <td style={{ padding: '16px 20px', color: '#175cd3' }}>{item.orderId}</td>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{item.date}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '500' }}>{item.cust}</td>
                    <td style={{ padding: '16px 20px' }}>{item.items}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.amount}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button onClick={() => alert('Redirecting to returns inspection panel...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#344054', fontWeight: '500' }}>
                        Inspect <ArrowRight size={14} />
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

export default AdminPendingReturnsAlerts;
