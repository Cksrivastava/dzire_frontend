import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Plus, UploadCloud, RefreshCcw, Filter } from 'lucide-react';

const purchaseInvoices = [
  { inv: 'INV-WC-992', date: 'Oct 28, 2026', vendor: 'Wildcraft India', po: 'PO-2026-1005', base: '₹1,05,932', gst: '₹19,068', total: '₹1,25,000', status: 'Unpaid' },
  { inv: 'INV-DC-104', date: 'Oct 22, 2026', vendor: 'Decathlon Sports', po: 'PO-2026-1004', base: '₹2,88,135', gst: '₹51,865', total: '₹3,40,000', status: 'Paid' }
];

const statusOptions = ['All Statuses', ...new Set(purchaseInvoices.map((item) => item.status))];

const AdminPurchaseInvoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filteredPurchaseInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return purchaseInvoices.filter((item) => {
      const matchesSearch = !query || [item.inv, item.po, item.vendor].some((value) => value.toLowerCase().includes(query));
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
          <h1>Purchase Invoices</h1>
          <p>Manage vendor bills and GST inputs</p>
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
              placeholder="Search Invoice No, PO Ref or Vendor..."
              style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '300px' }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            style={{ padding: '8px 12px', background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}`, borderRadius: '6px', cursor: 'pointer' }}
            aria-label="Toggle purchase invoice filters"
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
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Invoice No & Date</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Vendor</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>PO Ref</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Base Amount</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>GST</th>
              <th style={{ padding: '12px 20px', fontWeight: '600' }}>Total</th>
              <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchaseInvoices.map((item) => (
              <tr key={item.inv} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 20px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.inv}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>{item.date}</p>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111' }}>{item.vendor}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#ff6600' }}>{item.po}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#667085' }}>{item.base}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#667085' }}>{item.gst}</td>
                <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600' }}>{item.total}</td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    background: item.status === 'Paid' ? '#e3fcef' : '#fef3f2',
                    color: item.status === 'Paid' ? '#12b76a' : '#f04438'
                  }}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredPurchaseInvoices.length === 0 && (
              <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                <td colSpan="7" style={{ padding: '28px 20px', textAlign: 'center', fontSize: '14px', color: '#667085' }}>
                  No purchase invoices found.
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

export default AdminPurchaseInvoices;
