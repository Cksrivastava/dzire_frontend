import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Download, RefreshCcw, CreditCard, Zap, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';

const transactions = [
  { txnId: 'pay_Rjk92Abc', date: 'Jul 10, 2026', time: '10:45 AM', orderId: '#ONL-5012', cust: 'Rahul Mehta',   gateway: 'Razorpay UPI',  method: 'UPI',  amount: '₹5,999', status: 'Success' },
  { txnId: 'pay_Rjk91Xyz', date: 'Jul 10, 2026', time: '09:30 AM', orderId: '#ONL-5011', cust: 'Ananya Iyer',   gateway: 'Razorpay Card', method: 'Card', amount: '₹2,899', status: 'Success' },
  { txnId: 'pay_Rjk89Mno', date: 'Jul 09, 2026', time: '07:15 PM', orderId: '#ONL-5010', cust: 'Mohan Gupta',   gateway: 'Razorpay UPI',  method: 'UPI',  amount: '₹1,399', status: 'Failed' },
  { txnId: 'POS-CASH-5010',date: 'Jul 09, 2026', time: '03:00 PM', orderId: 'POS-5010',  cust: 'Walk-in',       gateway: 'POS Cash',      method: 'Cash', amount: '₹4,999', status: 'Success' },
  { txnId: 'pay_Rjk85Pqr', date: 'Jul 09, 2026', time: '01:20 PM', orderId: '#ONL-5009', cust: 'Priya Kapoor',  gateway: 'Razorpay Card', method: 'Card', amount: '₹3,999', status: 'Success' },
  { txnId: 'POS-UPI-5008', date: 'Jul 08, 2026', time: '11:55 AM', orderId: 'POS-5008',  cust: 'Walk-in',       gateway: 'POS UPI',       method: 'UPI',  amount: '₹2,499', status: 'Success' },
  { txnId: 'pay_Rjk80Rst', date: 'Jul 08, 2026', time: '08:40 AM', orderId: '#ONL-5008', cust: 'Suresh Nair',   gateway: 'Razorpay UPI',  method: 'UPI',  amount: '₹999',   status: 'Pending' },
  { txnId: 'pay_Rjk78Uvw', date: 'Jul 08, 2026', time: '06:15 AM', orderId: '#ONL-5007', cust: 'Deepika Joshi', gateway: 'Razorpay Card', method: 'Card', amount: '₹7,999', status: 'Success' },
];

const statusMeta = {
  Success: { bg: '#f0fdf4', color: '#15803d', icon: CheckCircle },
  Failed:  { bg: '#fef2f2', color: '#dc2626', icon: XCircle },
  Pending: { bg: '#fffbeb', color: '#b45309', icon: Clock },
};

const methodOptions  = ['All Methods',  'UPI', 'Card', 'Cash'];
const statusOptions  = ['All Statuses', 'Success', 'Failed', 'Pending'];

const AdminPaymentTransactions = () => {
  const [search, setSearch]   = useState('');
  const [method, setMethod]   = useState('All Methods');
  const [status, setStatus]   = useState('All Statuses');
  const [showFilter, setShow] = useState(false);

  const filtered = useMemo(() =>
    transactions.filter(t =>
      (!search.trim() || [t.txnId, t.orderId, t.cust].some(v => v.toLowerCase().includes(search.toLowerCase()))) &&
      (method === 'All Methods'  || t.method === method) &&
      (status === 'All Statuses' || t.status === status)
    ), [search, method, status]);

  const successRevenue = transactions.filter(t => t.status === 'Success').reduce((a, t) => a + parseInt(t.amount.replace(/[₹,]/g, '')), 0);

  return (
    <AdminLayout>
      <div className="admin-page-container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6600' }}>Sales › Payments</p>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Payment Transactions</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>All payment gateway and POS transactions with full status tracking</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => alert('Exporting…')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
              <Download size={15} /> Export
            </button>
            <button onClick={() => window.location.reload()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#ff6600', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: 'white', cursor: 'pointer' }}>
              <RefreshCcw size={15} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Transactions', value: transactions.length,                                            icon: Activity,   color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Success',            value: transactions.filter(t => t.status === 'Success').length,        icon: CheckCircle,color: '#15803d', bg: '#f0fdf4' },
            { label: 'Failed',             value: transactions.filter(t => t.status === 'Failed').length,         icon: XCircle,    color: '#dc2626', bg: '#fef2f2' },
            { label: 'Revenue Collected',  value: `₹${successRevenue.toLocaleString()}`,                          icon: CreditCard, color: '#ff6600', bg: '#fff4ed' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <span style={{ width: '46px', height: '46px', borderRadius: '12px', background: s.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <s.icon size={20} color={s.color} />
              </span>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search TXN ID, order, customer…"
                style={{ padding: '9px 14px 9px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', width: '300px', outline: 'none' }} />
            </div>
            <button onClick={() => setShow(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: showFilter ? '#fff4ed' : 'white', border: `1px solid ${showFilter ? '#ff6600' : '#e2e8f0'}`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: showFilter ? '#ff6600' : '#475569', cursor: 'pointer' }}>
              <Filter size={14} /> Filters
            </button>
          </div>
          {showFilter && (
            <div style={{ padding: '14px 22px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={method} onChange={e => setMethod(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: 'white' }}>
                {methodOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: 'white' }}>
                {statusOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <button onClick={() => { setSearch(''); setMethod('All Methods'); setStatus('All Statuses'); }} style={{ padding: '8px 14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#64748b', cursor: 'pointer' }}>Clear</button>
            </div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {['TXN ID', 'Date & Time', 'Order ID', 'Customer', 'Gateway', 'Method', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 22px', fontWeight: '700' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const meta = statusMeta[t.status];
                const Icon = meta.icon;
                return (
                  <tr key={t.txnId} style={{ borderTop: '1px solid #f8fafc' }} onMouseEnter={e => e.currentTarget.style.background='#fafafa'} onMouseLeave={e => e.currentTarget.style.background='white'}>
                    <td style={{ padding: '15px 22px', fontSize: '12px', fontFamily: 'monospace', fontWeight: '700', color: '#334155' }}>{t.txnId}</td>
                    <td style={{ padding: '15px 22px' }}>
                      <p style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#1e293b' }}>{t.date}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{t.time}</p>
                    </td>
                    <td style={{ padding: '15px 22px', fontSize: '13px', color: '#ff6600', fontWeight: '700' }}>{t.orderId}</td>
                    <td style={{ padding: '15px 22px', fontSize: '13px', color: '#334155', fontWeight: '500' }}>{t.cust}</td>
                    <td style={{ padding: '15px 22px', fontSize: '12px', color: '#64748b' }}>{t.gateway}</td>
                    <td style={{ padding: '15px 22px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                        background: t.method === 'UPI' ? '#f0f9ff' : t.method === 'Card' ? '#f5f3ff' : '#f0fdf4',
                        color:      t.method === 'UPI' ? '#0369a1' : t.method === 'Card' ? '#7c3aed' : '#15803d' }}>
                        {t.method}
                      </span>
                    </td>
                    <td style={{ padding: '15px 22px', fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{t.amount}</td>
                    <td style={{ padding: '15px 22px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: meta.bg, color: meta.color }}>
                        <Icon size={11} /> {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="8" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No transactions found.</td></tr>
              )}
            </tbody>
          </table>
          <div style={{ padding: '12px 22px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
            Showing {filtered.length} of {transactions.length} transactions
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentTransactions;
