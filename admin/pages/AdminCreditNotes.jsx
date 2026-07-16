import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Download, RefreshCcw, FileText, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

const creditNotes = [
  { id: 'CN-9010', date: 'Jul 10, 2026', cust: 'Rahul Mehta',   refOrder: '#ONL-5012', reason: 'Product returned',       value: '₹1,499', expiry: 'Aug 10, 2026', status: 'Active' },
  { id: 'CN-9009', date: 'Jul 09, 2026', cust: 'Ananya Iyer',   refOrder: '#ONL-5010', reason: 'Wrong item shipped',      value: '₹2,899', expiry: 'Aug 09, 2026', status: 'Active' },
  { id: 'CN-9008', date: 'Jul 08, 2026', cust: 'Vikram Singh',  refOrder: '#ONL-4920', reason: 'Partial return',          value: '₹1,299', expiry: 'Aug 08, 2026', status: 'Redeemed' },
  { id: 'CN-9007', date: 'Jul 07, 2026', cust: 'Ritu Sharma',   refOrder: '#ONL-4811', reason: 'Damaged in transit',      value: '₹599',   expiry: 'Aug 07, 2026', status: 'Redeemed' },
  { id: 'CN-9006', date: 'Jul 05, 2026', cust: 'Mohan Gupta',   refOrder: '#ONL-4805', reason: 'Customer dissatisfied',   value: '₹3,499', expiry: 'Jul 20, 2026', status: 'Expired' },
  { id: 'CN-9005', date: 'Jul 04, 2026', cust: 'Priya Kapoor',  refOrder: '#ONL-4790', reason: 'Quality issue reported',  value: '₹999',   expiry: 'Aug 04, 2026', status: 'Active' },
];

const statusOptions = ['All Statuses', 'Active', 'Redeemed', 'Expired'];

const statusMeta = {
  Active:   { bg: '#f0fdf4', color: '#15803d', icon: CheckCircle },
  Redeemed: { bg: '#f0f9ff', color: '#0369a1', icon: CheckCircle },
  Expired:  { bg: '#fef2f2', color: '#dc2626', icon: XCircle },
};

const AdminCreditNotes = () => {
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('All Statuses');
  const [showFilter, setShow] = useState(false);

  const filtered = useMemo(() =>
    creditNotes.filter(n =>
      (!search.trim() || [n.id, n.cust, n.refOrder, n.reason].some(v => v.toLowerCase().includes(search.toLowerCase()))) &&
      (status === 'All Statuses' || n.status === status)
    ), [search, status]);

  const totalActive = creditNotes.filter(n => n.status === 'Active').reduce((a, n) => a + parseInt(n.value.replace(/[₹,]/g, '')), 0);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6600' }}>Sales › Credit Notes</p>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Credit Notes</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Customer credit vouchers issued against product returns and refunds</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => alert('Creating credit note…')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#fff4ed', border: '1px solid #ffe0cc', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: '#ff6600', cursor: 'pointer' }}>
              <Plus size={15} /> New Credit Note
            </button>
            <button onClick={() => alert('Exporting…')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
              <Download size={15} /> Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Notes',     value: creditNotes.length,                                           color: '#0f172a', bg: '#f8fafc' },
            { label: 'Active',          value: creditNotes.filter(n => n.status === 'Active').length,        color: '#15803d', bg: '#f0fdf4' },
            { label: 'Redeemed',        value: creditNotes.filter(n => n.status === 'Redeemed').length,      color: '#0369a1', bg: '#f0f9ff' },
            { label: 'Active Value',    value: `₹${totalActive.toLocaleString()}`,                           color: '#ff6600', bg: '#fff4ed' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search note ID, customer…"
                style={{ padding: '9px 14px 9px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', width: '280px', outline: 'none' }} />
            </div>
            <button onClick={() => setShow(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: showFilter ? '#fff4ed' : 'white', border: `1px solid ${showFilter ? '#ff6600' : '#e2e8f0'}`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: showFilter ? '#ff6600' : '#475569', cursor: 'pointer' }}>
              <Filter size={14} /> Filters
            </button>
          </div>
          {showFilter && (
            <div style={{ padding: '14px 22px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: 'white' }}>
                {statusOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <button onClick={() => { setSearch(''); setStatus('All Statuses'); }} style={{ padding: '8px 14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#64748b', cursor: 'pointer' }}>Clear</button>
            </div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {['Note ID', 'Date', 'Customer', 'Ref Order', 'Reason', 'Value', 'Expiry', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 22px', fontWeight: '700' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(n => {
                const meta = statusMeta[n.status];
                const Icon = meta.icon;
                return (
                  <tr key={n.id} style={{ borderTop: '1px solid #f8fafc' }} onMouseEnter={e => e.currentTarget.style.background='#fafafa'} onMouseLeave={e => e.currentTarget.style.background='white'}>
                    <td style={{ padding: '15px 22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={15} color="#ff6600" />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{n.id}</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px 22px', fontSize: '13px', color: '#64748b' }}>{n.date}</td>
                    <td style={{ padding: '15px 22px', fontSize: '13px', fontWeight: '500', color: '#334155' }}>{n.cust}</td>
                    <td style={{ padding: '15px 22px', fontSize: '13px', color: '#7c3aed', fontWeight: '600' }}>{n.refOrder}</td>
                    <td style={{ padding: '15px 22px', fontSize: '12px', color: '#64748b', maxWidth: '200px' }}>{n.reason}</td>
                    <td style={{ padding: '15px 22px', fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{n.value}</td>
                    <td style={{ padding: '15px 22px', fontSize: '12px', color: n.status === 'Expired' ? '#dc2626' : '#64748b' }}>{n.expiry}</td>
                    <td style={{ padding: '15px 22px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: meta.bg, color: meta.color }}>
                        <Icon size={11} /> {n.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="8" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No credit notes found.</td></tr>
              )}
            </tbody>
          </table>
          <div style={{ padding: '12px 22px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
            Showing {filtered.length} of {creditNotes.length} credit notes
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreditNotes;
