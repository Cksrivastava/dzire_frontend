import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Printer, Download, RefreshCcw, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const salesInvoices = [
  { inv: 'SINV-26-00101', date: 'Jul 10, 2026', order: 'DZ-10101', cust: 'Rahul Mehta',    phone: '+91 98765 00101', base: '₹5,084', tax: '₹915',  total: '₹5,999',  status: 'Paid',    source: 'Online' },
  { inv: 'SINV-26-00100', date: 'Jul 09, 2026', order: 'DZ-10099', cust: 'Ananya Iyer',    phone: '+91 98765 00099', base: '₹2,457', tax: '₹442',  total: '₹2,899',  status: 'Paid',    source: 'Online' },
  { inv: 'SINV-26-00099', date: 'Jul 08, 2026', order: 'DZ-10097', cust: 'Mohan Gupta',    phone: '+91 98765 00097', base: '₹1,186', tax: '₹213',  total: '₹1,399',  status: 'Pending', source: 'Online' },
  { inv: 'SINV-26-00098', date: 'Jul 07, 2026', order: 'DZ-10094', cust: 'Priya Kapoor',   phone: '+91 98765 00094', base: '₹3,389', tax: '₹610',  total: '₹3,999',  status: 'Paid',    source: 'Online' },
  { inv: 'SINV-26-00097', date: 'Jul 06, 2026', order: 'DZ-10090', cust: 'Suresh Nair',    phone: '+91 98765 00090', base: '₹847',  tax: '₹152',  total: '₹999',    status: 'Cancelled', source: 'Online' },
  { inv: 'SINV-26-00096', date: 'Jul 05, 2026', order: 'POS-5010', cust: 'Walk-in',        phone: '—',               base: '₹4,236', tax: '₹763',  total: '₹4,999',  status: 'Paid',    source: 'POS' },
  { inv: 'SINV-26-00095', date: 'Jul 04, 2026', order: 'POS-5008', cust: 'Walk-in',        phone: '—',               base: '₹2,119', tax: '₹380',  total: '₹2,499',  status: 'Paid',    source: 'POS' },
  { inv: 'SINV-26-00094', date: 'Jul 03, 2026', order: 'DZ-10087', cust: 'Deepika Joshi',  phone: '+91 98765 00087', base: '₹6,779', tax: '₹1,220', total: '₹7,999', status: 'Paid',    source: 'Online' },
];

const sourceOptions = ['All Sources', 'Online', 'POS'];
const statusOptions = ['All Statuses', 'Paid', 'Pending', 'Cancelled'];

const statusStyle = {
  Paid:      { background: '#f0fdf4', color: '#15803d' },
  Pending:   { background: '#fffbeb', color: '#b45309' },
  Cancelled: { background: '#fef2f2', color: '#dc2626' },
};
const StatusIcon = ({ status }) => {
  if (status === 'Paid')      return <CheckCircle size={13} />;
  if (status === 'Pending')   return <Clock size={13} />;
  if (status === 'Cancelled') return <XCircle size={13} />;
  return null;
};

const AdminSalesInvoices = () => {
  const [searchQuery, setSearchQuery]   = useState('');
  const [showFilters, setShowFilters]   = useState(false);
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return salesInvoices.filter(item => {
      const matchSearch = !q || [item.inv, item.order, item.cust, item.total].some(v => v.toLowerCase().includes(q));
      const matchSource = sourceFilter === 'All Sources' || item.source === sourceFilter;
      const matchStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
      return matchSearch && matchSource && matchStatus;
    });
  }, [searchQuery, sourceFilter, statusFilter]);

  const clearFilters = () => { setSearchQuery(''); setSourceFilter('All Sources'); setStatusFilter('All Statuses'); };

  const totalAmount = filtered
    .filter(i => i.status === 'Paid')
    .reduce((acc, i) => acc + parseInt(i.total.replace(/[₹,]/g, ''), 10), 0);

  return (
    <AdminLayout>
      <div className="admin-page-container">

        {/* Header */}
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff6600' }}>Sales</p>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '700', color: '#111' }}>Sales Invoices</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#667085' }}>Customer-facing invoices generated for online and POS sales</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </section>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Invoices',   value: salesInvoices.length,                                         color: '#111' },
            { label: 'Paid',             value: salesInvoices.filter(i => i.status === 'Paid').length,        color: '#15803d' },
            { label: 'Pending',          value: salesInvoices.filter(i => i.status === 'Pending').length,     color: '#b45309' },
            { label: 'Revenue (Paid)',   value: `₹${totalAmount.toLocaleString()}`,                           color: '#ff6600' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '16px 20px' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#667085', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>

          {/* Toolbar */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#667085', pointerEvents: 'none' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search invoice, order or customer…"
                style={{ padding: '8px 12px 8px 34px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', width: '280px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowFilters(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: showFilters ? '#ff6600' : '#344054' }}
              >
                <Filter size={14} /> Filters
              </button>
              <button
                type="button"
                onClick={() => alert('Exporting Sales Invoices CSV…')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#344054' }}
              >
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          {showFilters && (
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f9fafb' }}>
              <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', background: 'white' }}>
                {sourceOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', background: 'white' }}>
                {statusOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <button type="button" onClick={clearFilters} style={{ padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#344054' }}>
                Clear
              </button>
            </div>
          )}

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '11px', color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Invoice No</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Order ID</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Source</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Base + Tax</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Total</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.inv} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={15} color="#ff6600" />
                      <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '600', color: '#111' }}>{item.inv}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{item.date}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#175cd3', fontWeight: '500' }}>{item.order}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <p style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#111' }}>{item.cust}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{item.phone}</p>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: item.source === 'POS' ? '#f0f9ff' : '#f5f3ff', color: item.source === 'POS' ? '#0369a1' : '#7c3aed' }}>
                      {item.source}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#667085' }}>
                    {item.base}<br />
                    <span style={{ color: '#12b76a', fontWeight: '500' }}>+ {item.tax} Tax</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '700', color: '#111' }}>{item.total}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', ...statusStyle[item.status] }}>
                      <StatusIcon status={item.status} />
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button title="Print" onClick={() => alert(`Printing ${item.inv}…`)} style={{ padding: '6px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#667085', display: 'flex' }}>
                        <Printer size={15} />
                      </button>
                      <button title="Download PDF" onClick={() => alert(`Downloading ${item.inv} PDF…`)} style={{ padding: '6px', background: '#fff4ed', border: '1px solid #ffe0cc', borderRadius: '6px', cursor: 'pointer', color: '#ff6600', display: 'flex' }}>
                        <Download size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: '40px 20px', textAlign: 'center', fontSize: '14px', color: '#9ca3af' }}>
                    No sales invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '12px', color: '#667085' }}>
            Showing {filtered.length} of {salesInvoices.length} invoices
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSalesInvoices;
