import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Eye, CheckCircle, RefreshCcw } from 'lucide-react';

const normalReturns = [
  { id: 'RET-1010', orderId: 'ORD-24102', date: 'Oct 30, 2026', cust: 'Amit Patel', items: '2', amount: '₹3,400', reason: 'Incorrect size ordered', status: 'Approved' },
  { id: 'RET-1008', orderId: 'ORD-24099', date: 'Oct 28, 2026', cust: 'Sunita Rao', items: '1', amount: '₹1,200', reason: 'Buyer remorse', status: 'Refunded' }
];

const AdminNormalReturns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return normalReturns.filter((item) => {
      return !query || [item.id, item.orderId, item.cust, item.reason].some((value) => value.toLowerCase().includes(query));
    });
  }, [searchQuery]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Normal Returns</h1>
            <p>View returns requested under the standard 14-day return window for resaleable items.</p>
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
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#667085' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search Return ID or Order..."
                style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '300px' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Request ID</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Items</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Reason</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.id}</td>
                    <td style={{ padding: '16px 20px' }}>{item.orderId}</td>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{item.date}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '500', color: '#111' }}>{item.cust}</td>
                    <td style={{ padding: '16px 20px' }}>{item.items}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.amount}</td>
                    <td style={{ padding: '16px 20px' }}>{item.reason}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        background: '#f0fdf4',
                        color: '#15803d'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => alert('Viewing detail...')} style={{ padding: '6px', background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }} aria-label="View request"><Eye size={14} color="#667085" /></button>
                      </div>
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

export default AdminNormalReturns;
