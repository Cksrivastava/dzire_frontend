import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, CheckCircle, Mail } from 'lucide-react';

const sentAlerts = [
  { id: 1, name: 'Premium Backpack (Orange)', sku: 'BAG-PREM-ORG', recipients: '45 customers', triggerStock: '50 units restocked', status: 'Sent Successfully', date: 'Jul 09, 2026' },
  { id: 2, name: 'Trekking Shoes (V2)', sku: 'SHOE-TRK-V2', recipients: '12 customers', triggerStock: '15 units restocked', status: 'Sent Successfully', date: 'Jul 08, 2026' },
];

const AdminBackInStockAlerts = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle color="#12b76a" />
              Back-in-Stock Alerts Sent
            </h1>
            <p>Track automated restock notifications dispatched to customers when physical counts are updated.</p>
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Dispatched Restock Alerts</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Product Name</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>SKU Code</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Restock Event Details</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Notification Recipients</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Dispatched Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sentAlerts.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.name}</td>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace' }}>{item.sku}</td>
                    <td style={{ padding: '16px 20px' }}>{item.triggerStock}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600' }}>{item.recipients}</td>
                    <td style={{ padding: '16px 20px' }}>{item.date}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        background: '#e3fcef',
                        color: '#12b76a'
                      }}>
                        {item.status}
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

export default AdminBackInStockAlerts;
