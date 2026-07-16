import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, RefreshCcw } from 'lucide-react';

const returnsHistory = [
  { id: '#RET-0988', cust: 'Amit Sharma', orderId: '#DZR-8120', value: '₹2,499', status: 'Refunded (Original Source)' },
  { id: '#RET-0985', cust: 'Kiran Verma', orderId: '#DZR-8095', value: '₹1,200', status: 'Refunded (Wallet)' },
  { id: '#RET-0980', cust: 'Deepak Jha', orderId: '#DZR-8012', value: '₹4,999', status: 'Rejected' }
];

const AdminReturnsHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return returnsHistory.filter((item) => {
      return !query || [item.id, item.cust, item.orderId].some((value) => value.toLowerCase().includes(query));
    });
  }, [searchQuery]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Return History</h1>
            <p>View closed and archived historical return logs.</p>
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Archived & Closed Return Cases</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#667085' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history logs..."
                style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '250px' }}
              />
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Return ID</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Original Order</th>
                <th style={{ padding: '12px 16px' }}>Value</th>
                <th style={{ padding: '12px 16px' }}>Resolution</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                  <td style={{ padding: '16px 16px' }}><strong>{item.id}</strong></td>
                  <td style={{ padding: '16px 16px' }}>{item.cust}</td>
                  <td style={{ padding: '16px 16px', color: '#667085' }}>{item.orderId}</td>
                  <td style={{ padding: '16px 16px', fontWeight: '600' }}>{item.value}</td>
                  <td style={{ padding: '16px 16px' }}>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      background: item.status === 'Rejected' ? '#fef2f2' : '#f3f4f6', 
                      color: item.status === 'Rejected' ? '#ef4444' : '#374151' 
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
    </AdminLayout>
  );
};

export default AdminReturnsHistory;
