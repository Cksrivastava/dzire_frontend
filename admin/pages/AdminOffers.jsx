import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Power, RefreshCcw } from 'lucide-react';

const offers = [
  { name: 'Diwali Special', discount: '15% OFF', target: 'All Tents', validity: 'Oct 20 - Nov 5', status: 'Active' },
  { name: 'Winter Clearance', discount: 'Flat ₹500', target: 'Winter Gear', validity: 'Ongoing', status: 'Inactive' }
];

const statusOptions = ['All Statuses', ...new Set(offers.map((item) => item.status))];

const AdminOffers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filteredOffers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return offers.filter((item) => {
      const matchesSearch = !query || [item.name, item.discount, item.target, item.validity, item.status].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Statuses');
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
      <section className="admin-hero" style={{ marginBottom: '24px' }}>
        <div>
          <h1>Offers</h1>
          <p>Manage sitewide and category-specific discounts</p>
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
              placeholder="Search Offers..."
              style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '250px' }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            style={{ padding: '8px 12px', background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}`, borderRadius: '6px', cursor: 'pointer' }}
            aria-label="Toggle offer filters"
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

            <button
              type="button"
              onClick={clearFilters}
              style={{ padding: '8px 12px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#344054' }}
            >
              Clear
            </button>
          </div>
        )}
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Offer Name</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Discount</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Target</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Validity</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.map((item) => (
              <tr key={item.name} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.name}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#12b76a', fontWeight: '600' }}>{item.discount}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#667085' }}>{item.target}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#667085' }}>{item.validity}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    background: item.status === 'Active' ? '#e3fcef' : '#f3f4f6',
                    color: item.status === 'Active' ? '#12b76a' : '#374151'
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button style={{ color: item.status === 'Active' ? '#f04438' : '#12b76a', background: 'none', border: 'none', cursor: 'pointer' }}><Power size={18} /></button>
                </td>
              </tr>
            ))}
            {filteredOffers.length === 0 && (
              <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                <td colSpan="6" style={{ padding: '28px 20px', textAlign: 'center', fontSize: '14px', color: '#667085' }}>
                  No offers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminOffers;
