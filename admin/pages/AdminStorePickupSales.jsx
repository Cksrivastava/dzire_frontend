import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Download, RefreshCcw, Package, CheckCircle, Clock, AlertCircle, Eye, MapPin } from 'lucide-react';

const pickupOrders = [
  { id: '#PKP-2010', date: 'Jul 10, 2026', time: '11:00 AM', cust: 'Rahul Verma',   phone: '+91 98765 11000', items: 2, amount: '₹3,150', status: 'Ready for Pickup', slot: '11 AM – 1 PM' },
  { id: '#PKP-2009', date: 'Jul 10, 2026', time: '09:30 AM', cust: 'Sneha Reddy',   phone: '+91 98765 10900', items: 1, amount: '₹1,299', status: 'Picked Up',        slot: '9 AM – 11 AM' },
  { id: '#PKP-2008', date: 'Jul 09, 2026', time: '04:00 PM', cust: 'Amit Sharma',   phone: '+91 98765 10800', items: 3, amount: '₹5,499', status: 'Processing',       slot: '3 PM – 5 PM' },
  { id: '#PKP-2007', date: 'Jul 09, 2026', time: '01:15 PM', cust: 'Neha Gupta',    phone: '+91 98765 10700', items: 1, amount: '₹899',   status: 'Picked Up',        slot: '1 PM – 3 PM' },
  { id: '#PKP-2006', date: 'Jul 08, 2026', time: '10:00 AM', cust: 'Pradeep Nair',  phone: '+91 98765 10600', items: 2, amount: '₹2,799', status: 'Ready for Pickup', slot: '9 AM – 11 AM' },
  { id: '#PKP-2005', date: 'Jul 08, 2026', time: '03:30 PM', cust: 'Kavya Iyer',    phone: '+91 98765 10500', items: 1, amount: '₹1,599', status: 'Expired',          slot: '3 PM – 5 PM' },
];

const statusOptions = ['All Statuses', 'Ready for Pickup', 'Picked Up', 'Processing', 'Expired'];

const statusMeta = {
  'Ready for Pickup': { bg: '#fffbeb', color: '#b45309', icon: Clock },
  'Picked Up':        { bg: '#f0fdf4', color: '#15803d', icon: CheckCircle },
  'Processing':       { bg: '#f0f9ff', color: '#0369a1', icon: Package },
  'Expired':          { bg: '#fef2f2', color: '#dc2626', icon: AlertCircle },
};

const AdminStorePickupSales = () => {
  const [search, setSearch]         = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus]         = useState('All Statuses');

  const filtered = useMemo(() =>
    pickupOrders.filter(o =>
      (!search.trim() || [o.id, o.cust, o.phone].some(v => v.toLowerCase().includes(search.toLowerCase()))) &&
      (status === 'All Statuses' || o.status === status)
    ), [search, status]);

  const counts = { total: pickupOrders.length, ready: pickupOrders.filter(o => o.status === 'Ready for Pickup').length, done: pickupOrders.filter(o => o.status === 'Picked Up').length, expired: pickupOrders.filter(o => o.status === 'Expired').length };

  return (
    <AdminLayout>
      <div className="admin-page-container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff6600' }}>Sales › Store Pickup</p>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Store Pickup Sales</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Orders customers will collect in-store — manage pickup slots and status</p>
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
            { label: 'Total Pickup Orders',  value: counts.total,   color: '#ff6600', bg: '#fff4ed' },
            { label: 'Ready for Pickup',      value: counts.ready,   color: '#b45309', bg: '#fffbeb' },
            { label: 'Picked Up',             value: counts.done,    color: '#15803d', bg: '#f0fdf4' },
            { label: 'Expired Slots',         value: counts.expired, color: '#dc2626', bg: '#fef2f2' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Pickup location banner */}
        <div style={{ background: 'linear-gradient(135deg, #fff4ed 0%, #fff8f3 100%)', border: '1px solid #ffe0cc', borderRadius: '14px', padding: '16px 22px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MapPin size={20} color="#ff6600" />
          <div>
            <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '700', color: '#9a3412' }}>Store Pickup Location</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#c2410c' }}>Dzire Store, Shop No. 14, Sports Complex, MG Road, Bengaluru – 560001 &nbsp;·&nbsp; Open: 9 AM – 8 PM</p>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order, customer, phone…"
                style={{ padding: '9px 14px 9px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', width: '280px', outline: 'none' }} />
            </div>
            <button onClick={() => setShowFilter(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: showFilter ? '#fff4ed' : 'white', border: `1px solid ${showFilter ? '#ff6600' : '#e2e8f0'}`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: showFilter ? '#ff6600' : '#475569', cursor: 'pointer' }}>
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
                {['Order ID', 'Date & Slot', 'Customer', 'Items', 'Amount', 'Status', 'Action'].map(h => (
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
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Slot: {o.slot}</p>
                    </td>
                    <td style={{ padding: '15px 22px' }}>
                      <p style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#334155', fontWeight: '500' }}>{o.cust}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{o.phone}</p>
                    </td>
                    <td style={{ padding: '15px 22px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>{o.items}</td>
                    <td style={{ padding: '15px 22px', fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{o.amount}</td>
                    <td style={{ padding: '15px 22px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: meta.bg, color: meta.color }}>
                        <Icon size={11} /> {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px 22px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => alert(`Viewing ${o.id}`)} style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#475569', fontWeight: '600' }}>
                          <Eye size={13} /> View
                        </button>
                        {o.status === 'Ready for Pickup' && (
                          <button onClick={() => alert(`Marked ${o.id} as Picked Up`)} style={{ padding: '6px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#15803d', fontWeight: '600' }}>
                            ✓ Mark Picked Up
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No pickup orders found.</td></tr>
              )}
            </tbody>
          </table>
          <div style={{ padding: '12px 22px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
            Showing {filtered.length} of {pickupOrders.length} orders
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStorePickupSales;
