import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Eye, CheckCircle, RefreshCcw } from 'lucide-react';

const partialReturns = [
  { id: 'RET-1015', orderId: 'ORD-24155', date: 'Nov 02, 2026', cust: 'Rohan Sharma', itemsReturned: '1 of 3 items', amount: '₹1,500', details: 'Returned only red t-shirt', status: 'Refunded' }
];

const AdminPartialReturns = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return partialReturns.filter((item) => {
      return !query || [item.id, item.orderId, item.cust, item.details].some((value) => value.toLowerCase().includes(query));
    });
  }, [searchQuery]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Partial Returns</h1>
            <p>Track orders where the customer returned only a subset of items instead of the whole order.</p>
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
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Returned Items Ratio</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Partial Refund Amount</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Details</th>
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
                    <td style={{ padding: '16px 20px' }}>{item.itemsReturned}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.amount}</td>
                    <td style={{ padding: '16px 20px' }}>{item.details}</td>
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

export default AdminPartialReturns;
