import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, RotateCcw, RefreshCcw, Filter } from 'lucide-react';

const vendorReturns = [
  { no: 'RTV-1001', date: 'Oct 29, 2026', vendor: 'Wildcraft India', items: '2 SKUs (15 Qty)', reason: 'Defective (Zipper Issue)', status: 'Dispatched' }
];

const statusOptions = ['All Statuses', ...new Set(vendorReturns.map((item) => item.status))];
const reasonOptions = ['All Reasons', ...new Set(vendorReturns.map((item) => item.reason))];

const AdminVendorReturns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [reasonFilter, setReasonFilter] = useState('All Reasons');

  const filteredVendorReturns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return vendorReturns.filter((item) => {
      const matchesSearch = !query || [item.no, item.vendor, item.reason].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
      const matchesReason = reasonFilter === 'All Reasons' || item.reason === reasonFilter;

      return matchesSearch && matchesStatus && matchesReason;
    });
  }, [searchQuery, statusFilter, reasonFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Statuses');
    setReasonFilter('All Reasons');
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
      <section className="admin-hero" style={{ marginBottom: '24px' }}>
        <div>
          <h1>Vendor Returns</h1>
          <p>Return defective or unsold stock back to vendors</p>
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
              placeholder="Search RTV No, Vendor or Reason..."
              style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '300px' }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            style={{ padding: '8px 12px', background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}`, borderRadius: '6px', cursor: 'pointer' }}
            aria-label="Toggle vendor return filters"
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
              value={reasonFilter}
              onChange={(event) => setReasonFilter(event.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
            >
              {reasonOptions.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
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
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>RTV No & Date</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Vendor</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Items / Qty</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Reason</th>
              <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendorReturns.map((item) => (
              <tr key={item.no} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 20px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.no}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>{item.date}</p>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111' }}>{item.vendor}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#667085' }}>{item.items}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#f04438' }}>{item.reason}</td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    background: '#eff8ff',
                    color: '#175cd3'
                  }}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredVendorReturns.length === 0 && (
              <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                <td colSpan="5" style={{ padding: '28px 20px', textAlign: 'center', fontSize: '14px', color: '#667085' }}>
                  No vendor returns found.
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

export default AdminVendorReturns;
