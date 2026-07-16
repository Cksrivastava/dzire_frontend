import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Download, RefreshCcw, TrendingUp, ShoppingBag, CreditCard, Globe, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

const onlineSales = [
  { id: '#ONL-5012', date: 'Jul 10, 2026', time: '10:15 AM', cust: 'Rahul Mehta',   items: 3, amount: '₹5,999', gateway: 'Razorpay (UPI)',  status: 'Paid',    city: 'Mumbai' },
  { id: '#ONL-5011', date: 'Jul 10, 2026', time: '09:30 AM', cust: 'Ananya Iyer',   items: 1, amount: '₹2,899', gateway: 'Razorpay (Card)', status: 'Paid',    city: 'Bengaluru' },
  { id: '#ONL-5010', date: 'Jul 09, 2026', time: '07:45 PM', cust: 'Mohan Gupta',   items: 2, amount: '₹1,399', gateway: 'Razorpay (UPI)',  status: 'Pending', city: 'Delhi' },
  { id: '#ONL-5009', date: 'Jul 09, 2026', time: '03:10 PM', cust: 'Priya Kapoor',  items: 1, amount: '₹3,999', gateway: 'Razorpay (Card)', status: 'Paid',    city: 'Pune' },
  { id: '#ONL-5008', date: 'Jul 08, 2026', time: '11:55 AM', cust: 'Suresh Nair',   items: 4, amount: '₹999',   gateway: 'Razorpay (UPI)',  status: 'Failed',  city: 'Kochi' },
  { id: '#ONL-5007', date: 'Jul 08, 2026', time: '08:20 AM', cust: 'Deepika Joshi', items: 2, amount: '₹7,999', gateway: 'Razorpay (Card)', status: 'Paid',    city: 'Hyderabad' },
  { id: '#ONL-5006', date: 'Jul 07, 2026', time: '06:15 PM', cust: 'Vikram Singh',  items: 1, amount: '₹1,299', gateway: 'Razorpay (UPI)',  status: 'Paid',    city: 'Jaipur' },
  { id: '#ONL-5005', date: 'Jul 07, 2026', time: '02:40 PM', cust: 'Ritu Sharma',   items: 3, amount: '₹4,499', gateway: 'Razorpay (Card)', status: 'Paid',    city: 'Ahmedabad' },
];

const gatewayOptions = ['All Gateways', 'Razorpay (UPI)', 'Razorpay (Card)'];
const statusOptions  = ['All Statuses', 'Paid', 'Pending', 'Failed'];

const statusMeta = {
  Paid:    { bg: '#f0fdf4', color: '#15803d', icon: CheckCircle },
  Pending: { bg: '#fffbeb', color: '#b45309', icon: Clock },
  Failed:  { bg: '#fef2f2', color: '#dc2626', icon: XCircle },
};

const stats = [
  { label: 'Total Orders',    value: onlineSales.length,                                           icon: ShoppingBag, color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Total Revenue',   value: '₹29,091',                                                    icon: TrendingUp,  color: '#15803d', bg: '#f0fdf4' },
  { label: 'Paid',           value: onlineSales.filter(o => o.status === 'Paid').length,           icon: CreditCard,  color: '#ff6600', bg: '#fff4ed' },
  { label: 'Avg Order Value', value: '₹3,636',                                                     icon: Globe,       color: '#0369a1', bg: '#f0f9ff' },
];

const AdminOnlineSales = () => {
  const [search, setSearch]         = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [gateway, setGateway]       = useState('All Gateways');
  const [status, setStatus]         = useState('All Statuses');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return onlineSales.filter(o =>
      (!q || [o.id, o.cust, o.city].some(v => v.toLowerCase().includes(q))) &&
      (gateway === 'All Gateways' || o.gateway === gateway) &&
      (status  === 'All Statuses' || o.status  === status)
    );
  }, [search, gateway, status]);

  return (
    <AdminLayout>
      <div className="admin-page-container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6600' }}>Sales › Online</p>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Online Sales</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>All customer orders placed through the Dzire website and app</p>
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
          {stats.map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <span style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <s.icon size={20} color={s.color} />
              </span>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {/* Toolbar */}
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order, customer, city…"
                style={{ padding: '9px 14px 9px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', width: '280px', outline: 'none', color: '#334155' }} />
            </div>
            <button onClick={() => setShowFilter(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: showFilter ? '#fff4ed' : 'white', border: `1px solid ${showFilter ? '#ff6600' : '#e2e8f0'}`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: showFilter ? '#ff6600' : '#475569', cursor: 'pointer' }}>
              <Filter size={14} /> Filters
            </button>
          </div>
          {showFilter && (
            <div style={{ padding: '14px 22px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={gateway} onChange={e => setGateway(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: 'white', color: '#334155' }}>
                {gatewayOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: 'white', color: '#334155' }}>
                {statusOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <button onClick={() => { setSearch(''); setGateway('All Gateways'); setStatus('All Statuses'); }}
                style={{ padding: '8px 14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#64748b', cursor: 'pointer' }}>Clear</button>
            </div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {['Order ID', 'Date & Time', 'Customer', 'City', 'Items', 'Gateway', 'Amount', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '12px 22px', fontWeight: '700' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const meta = statusMeta[o.status];
                const Icon = meta.icon;
                return (
                  <tr key={o.id} style={{ borderTop: '1px solid #f8fafc' }} onMouseEnter={e => e.currentTarget.style.background='#fafafa'} onMouseLeave={e => e.currentTarget.style.background='white'}>
                    <td style={{ padding: '15px 22px', fontSize: '13px', fontWeight: '700', color: '#ff6600' }}>{o.id}</td>
                    <td style={{ padding: '15px 22px' }}>
                      <p style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#1e293b' }}>{o.date}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{o.time}</p>
                    </td>
                    <td style={{ padding: '15px 22px', fontSize: '13px', color: '#334155', fontWeight: '500' }}>{o.cust}</td>
                    <td style={{ padding: '15px 22px', fontSize: '13px', color: '#64748b' }}>{o.city}</td>
                    <td style={{ padding: '15px 22px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>{o.items}</td>
                    <td style={{ padding: '15px 22px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: '#f0f9ff', color: '#0369a1' }}>{o.gateway}</span>
                    </td>
                    <td style={{ padding: '15px 22px', fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{o.amount}</td>
                    <td style={{ padding: '15px 22px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: meta.bg, color: meta.color }}>
                        <Icon size={11} /> {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px 22px' }}>
                      <button onClick={() => alert(`Viewing ${o.id}`)} style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#475569', fontWeight: '600' }}>
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="9" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No online sales found.</td></tr>
              )}
            </tbody>
          </table>
          <div style={{ padding: '12px 22px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
            Showing {filtered.length} of {onlineSales.length} orders
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOnlineSales;
