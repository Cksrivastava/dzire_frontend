import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Printer, Download, RefreshCcw, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const gstInvoices = [
  { inv: 'GST-26-00201', date: 'Jul 10, 2026', order: 'DZ-10101', cust: 'Rahul Mehta',    gstin: '27AABCT1234A1Z5', taxable: '₹5,084', cgst: '₹305', sgst: '₹305', igst: '—',    total: '₹5,999',  type: 'B2C', status: 'Filed' },
  { inv: 'GST-26-00200', date: 'Jul 09, 2026', order: 'DZ-10099', cust: 'Ananya Iyer',    gstin: '29AABCI9876B2Z1', taxable: '₹2,457', cgst: '₹221', sgst: '₹221', igst: '—',    total: '₹2,899',  type: 'B2B', status: 'Filed' },
  { inv: 'GST-26-00199', date: 'Jul 08, 2026', order: 'DZ-10097', cust: 'Mohan Gupta',    gstin: '—',               taxable: '₹1,186', cgst: '₹107', sgst: '₹107', igst: '—',    total: '₹1,399',  type: 'B2C', status: 'Pending' },
  { inv: 'GST-26-00198', date: 'Jul 07, 2026', order: 'DZ-10094', cust: 'Priya Kapoor',   gstin: '06AABCP5432C3Z8', taxable: '₹3,389', cgst: '—',    sgst: '—',    igst: '₹610', total: '₹3,999',  type: 'B2B', status: 'Filed' },
  { inv: 'GST-26-00197', date: 'Jul 06, 2026', order: 'DZ-10090', cust: 'Suresh Nair',    gstin: '32AABCS3210D4Z2', taxable: '₹847',  cgst: '—',    sgst: '—',    igst: '₹152', total: '₹999',    type: 'B2B', status: 'Cancelled' },
  { inv: 'GST-26-00196', date: 'Jul 05, 2026', order: 'POS-5010', cust: 'Walk-in',        gstin: '—',               taxable: '₹4,236', cgst: '₹381', sgst: '₹381', igst: '—',    total: '₹4,999',  type: 'B2C', status: 'Filed' },
  { inv: 'GST-26-00195', date: 'Jul 04, 2026', order: 'POS-5008', cust: 'Walk-in',        gstin: '—',               taxable: '₹2,119', cgst: '₹190', sgst: '₹190', igst: '—',    total: '₹2,499',  type: 'B2C', status: 'Filed' },
  { inv: 'GST-26-00194', date: 'Jul 03, 2026', order: 'DZ-10087', cust: 'Deepika Joshi',  gstin: '19AABCD2109E5Z7', taxable: '₹6,779', cgst: '₹610', sgst: '₹610', igst: '—',    total: '₹7,999',  type: 'B2B', status: 'Filed' },
];

const typeOptions   = ['All Types',    'B2B', 'B2C'];
const statusOptions = ['All Statuses', 'Filed', 'Pending', 'Cancelled'];

const statusStyle = {
  Filed:     { background: '#f0fdf4', color: '#15803d' },
  Pending:   { background: '#fffbeb', color: '#b45309' },
  Cancelled: { background: '#fef2f2', color: '#dc2626' },
};

const StatusIcon = ({ status }) => {
  if (status === 'Filed')     return <CheckCircle size={13} />;
  if (status === 'Pending')   return <Clock size={13} />;
  if (status === 'Cancelled') return <AlertCircle size={13} />;
  return null;
};

const AdminGstInvoices = () => {
  const [searchQuery, setSearchQuery]   = useState('');
  const [showFilters, setShowFilters]   = useState(false);
  const [typeFilter, setTypeFilter]     = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return gstInvoices.filter(item => {
      const matchSearch = !q || [item.inv, item.order, item.cust, item.gstin, item.total].some(v => v.toLowerCase().includes(q));
      const matchType   = typeFilter   === 'All Types'    || item.type   === typeFilter;
      const matchStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [searchQuery, typeFilter, statusFilter]);

  const clearFilters = () => { setSearchQuery(''); setTypeFilter('All Types'); setStatusFilter('All Statuses'); };

  const totalTaxable = filtered
    .filter(i => i.status === 'Filed')
    .reduce((acc, i) => acc + parseInt(i.taxable.replace(/[₹,]/g, ''), 10), 0);

  return (
    <AdminLayout>
      <div className="admin-page-container">

        {/* Header */}
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff6600' }}>GST &amp; Tax</p>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '700', color: '#111' }}>GST Invoices</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#667085' }}>Statutory GST tax invoices with CGST / SGST / IGST breakdown for GSTR filing</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => alert('Filing GSTR-1…')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff4ed', color: '#ff6600', border: '1px solid #ffe0cc', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            >
              <FileText size={16} /> File GSTR-1
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            >
              <RefreshCcw size={16} /> Refresh
            </button>
          </div>
        </section>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total GST Invoices', value: gstInvoices.length,                                         color: '#111' },
            { label: 'Filed',              value: gstInvoices.filter(i => i.status === 'Filed').length,       color: '#15803d' },
            { label: 'Pending Filing',     value: gstInvoices.filter(i => i.status === 'Pending').length,     color: '#b45309' },
            { label: 'Taxable Value (Filed)', value: `₹${totalTaxable.toLocaleString()}`,                     color: '#ff6600' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '16px 20px' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#667085', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* GST Rates Notice */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={16} color="#15803d" />
          <p style={{ margin: 0, fontSize: '13px', color: '#15803d', fontWeight: '500' }}>
            B2B invoices include reverse-charge and IGST for inter-state supply. B2C invoices have CGST + SGST split.
          </p>
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
                placeholder="Search invoice, GSTIN or customer…"
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
                onClick={() => alert('Exporting GST Invoices CSV…')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#344054' }}
              >
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          {showFilters && (
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f9fafb' }}>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', background: 'white' }}>
                {typeOptions.map(o => <option key={o}>{o}</option>)}
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
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '11px', color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>GST Invoice</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer / GSTIN</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Type</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Taxable</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>CGST</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>SGST</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>IGST</th>
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
                      <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>{item.gstin}</p>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: item.type === 'B2B' ? '#eff6ff' : '#fdf4ff', color: item.type === 'B2B' ? '#1d4ed8' : '#7e22ce' }}>
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: '600', color: '#111' }}>{item.taxable}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#667085' }}>{item.cgst}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#667085' }}>{item.sgst}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#667085' }}>{item.igst}</td>
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
                    <td colSpan="11" style={{ padding: '40px 20px', textAlign: 'center', fontSize: '14px', color: '#9ca3af' }}>
                      No GST invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '12px', color: '#667085' }}>
            Showing {filtered.length} of {gstInvoices.length} GST invoices
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGstInvoices;
