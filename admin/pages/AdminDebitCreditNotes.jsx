import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Plus, RefreshCcw, Filter } from 'lucide-react';

const debitCreditNotes = [
  { no: 'DN-26-001', date: 'Oct 29, 2026', type: 'Debit Note', vendor: 'Wildcraft India', amount: '₹4,500', reason: 'Defective Return', status: 'Pending Settlement' },
  { no: 'CN-26-001', date: 'Oct 15, 2026', type: 'Credit Note', vendor: 'Decathlon Sports', amount: '₹12,000', reason: 'Volume Discount', status: 'Settled' }
];

const typeOptions = ['All Types', ...new Set(debitCreditNotes.map((item) => item.type))];
const statusOptions = ['All Statuses', ...new Set(debitCreditNotes.map((item) => item.status))];

const AdminDebitCreditNotes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return debitCreditNotes.filter((item) => {
      const matchesSearch = !query || [item.no, item.vendor, item.reason].some((value) => value.toLowerCase().includes(query));
      const matchesType = typeFilter === 'All Types' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, typeFilter, statusFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All Types');
    setStatusFilter('All Statuses');
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
      <section className="admin-hero" style={{ marginBottom: '24px' }}>
        <div>
          <h1>Debit/Credit Notes</h1>
          <p>Manage vendor adjustments and settlements</p>
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
              placeholder="Search Note No, Vendor or Reason..."
              style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '300px' }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            style={{ padding: '8px 12px', background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}`, borderRadius: '6px', cursor: 'pointer' }}
            aria-label="Toggle debit credit note filters"
          >
            <Filter size={16} color="#667085" />
          </button>
        </div>

        {showFilters && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f9fafb' }}>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

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
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Note No & Date</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Type</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Vendor</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Amount</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Reason</th>
              <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotes.map((item) => (
              <tr key={item.no} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 20px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.no}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>{item.date}</p>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    background: item.type === 'Debit Note' ? '#fef3f2' : '#e3fcef',
                    color: item.type === 'Debit Note' ? '#f04438' : '#12b76a'
                  }}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111' }}>{item.vendor}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600' }}>{item.amount}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#667085' }}>{item.reason}</td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    background: item.status === 'Settled' ? '#f9fafb' : '#fef0c7',
                    color: item.status === 'Settled' ? '#667085' : '#f79009'
                  }}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredNotes.length === 0 && (
              <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                <td colSpan="6" style={{ padding: '28px 20px', textAlign: 'center', fontSize: '14px', color: '#667085' }}>
                  No debit or credit notes found.
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

export default AdminDebitCreditNotes;
