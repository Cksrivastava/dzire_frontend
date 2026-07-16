import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Eye, CheckCircle, XCircle, RefreshCcw, Landmark, DollarSign, Wallet } from 'lucide-react';

const returnRequests = [
  { id: 'RET-1002', orderId: 'ORD-24082', date: 'Oct 28, 2026', cust: 'John Doe', items: '1', amount: '₹4,999', type: 'Defective', status: 'Pending Approval' },
  { id: 'RET-1001', orderId: 'ORD-24071', date: 'Oct 25, 2026', cust: 'Alice Smith', items: '2', amount: '₹1,500', type: 'Size Issue', status: 'Refunded (Wallet)' },
  { id: 'RET-1003', orderId: 'ORD-24095', date: 'Oct 29, 2026', cust: 'Robert King', items: '1', amount: '₹2,300', type: 'Normal', status: 'Pending Approval' }
];

const statusOptions = ['All Statuses', 'Pending Approval', 'Refunded (Wallet)'];
const typeOptions = ['All Types', 'Defective', 'Size Issue', 'Normal'];

const AdminReturnsRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return returnRequests.filter((item) => {
      const matchesSearch = !query || [item.id, item.orderId, item.cust].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
      const matchesType = typeFilter === 'All Types' || item.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Statuses');
    setTypeFilter('All Types');
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Return Requests</h1>
            <p>Review customer return requests, approve/reject return logs, and process refunds.</p>
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
                placeholder="Search Request ID or Order..."
                style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '300px' }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              style={{ padding: '8px 12px', background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}`, borderRadius: '6px', cursor: 'pointer' }}
              aria-label="Toggle return filters"
            >
              <Filter size={16} color="#667085" />
            </button>
          </div>

          {showFilters && (
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f9fafb' }}>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#ff6600', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
              >
                Clear Filters
              </button>
            </div>
          )}

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
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Type</th>
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
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', background: item.type === 'Defective' ? '#fef2f2' : '#eff8ff', color: item.type === 'Defective' ? '#ef4444' : '#175cd3' }}>
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        background: item.status === 'Pending Approval' ? '#fff4ed' : '#f0fdf4',
                        color: item.status === 'Pending Approval' ? '#ff6600' : '#15803d'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => alert('Viewing detail...')} style={{ padding: '6px', background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }} aria-label="View request"><Eye size={14} color="#667085" /></button>
                        {item.status === 'Pending Approval' && (
                          <>
                            <button onClick={() => alert('Approved')} style={{ padding: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', cursor: 'pointer' }} aria-label="Approve request"><CheckCircle size={14} color="#15803d" /></button>
                            <button onClick={() => alert('Rejected')} style={{ padding: '6px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }} aria-label="Reject request"><XCircle size={14} color="#b91c1c" /></button>
                          </>
                        )}
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

export default AdminReturnsRequests;
