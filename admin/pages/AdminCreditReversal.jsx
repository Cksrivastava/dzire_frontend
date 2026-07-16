import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, RefreshCcw } from 'lucide-react';

const reversalLogs = [
  { id: '#REV-9082', cust: 'Vikram Singh', orderId: '#DZR-8290', credits: '-150 Credits', status: 'Reversed' },
  { id: '#REV-9080', cust: 'Ritu Sharma', orderId: '#DZR-8211', credits: '-50 Credits', status: 'Reversed' }
];

const AdminCreditReversal = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return reversalLogs.filter((item) => {
      return !query || [item.id, item.cust, item.orderId].some((value) => value.toLowerCase().includes(query));
    });
  }, [searchQuery]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Credit Reversal</h1>
            <p>Track reversed loyalty points adjustments for returned and cancelled orders.</p>
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

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Loyalty Points Credit Reversal Logs</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#667085' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reversals..."
                style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '250px' }}
              />
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Activity ID</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Returned Order Ref</th>
                <th style={{ padding: '12px 16px' }}>Reversed Points</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }} key={item.id}>
                  <td style={{ padding: '16px 16px' }}><strong>{item.id}</strong></td>
                  <td style={{ padding: '16px 16px' }}>{item.cust}</td>
                  <td style={{ padding: '16px 16px', color: '#667085' }}>{item.orderId}</td>
                  <td style={{ padding: '16px 16px', fontWeight: '600', color: '#f04438' }}>{item.credits}</td>
                  <td style={{ padding: '16px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#fef2f2', color: '#ef4444' }}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreditReversal;
