import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, Mail, ArrowRight } from 'lucide-react';

const notifyMeRequests = [
  { id: 1, prod: 'Premium Backpack (Orange)', sku: 'BAG-PREM-ORG', email: 'amit.sharma@example.com', date: '08 Jul 2026', status: 'Pending Restock' },
  { id: 2, prod: 'Trekking Shoes', sku: 'SHOE-TRK-001', email: 'priya@example.com', date: '02 Jul 2026', status: 'Pending Restock' }
];

const AdminNotifyMeRequests = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail color="#ff6600" />
              Notify-Me Customer Requests
            </h1>
            <p>List of catalog products requested by customers to be notified when inventory restocks.</p>
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Active Customer Requests Queue</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Product Title</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>SKU Code</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer Email</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Requested Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {notifyMeRequests.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{c.prod}</td>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace' }}>{c.sku}</td>
                    <td style={{ padding: '16px 20px' }}>{c.email}</td>
                    <td style={{ padding: '16px 20px' }}>{c.date}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        background: '#fef0c7',
                        color: '#b54708'
                      }}>
                        {c.status}
                      </span>
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

export default AdminNotifyMeRequests;
