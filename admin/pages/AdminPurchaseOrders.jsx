import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Filter, FileText, RefreshCcw, Download, TrendingUp, Package } from 'lucide-react';

/* ── Shared styles ─────────────────────────────────── */
const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' },
  inp: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  saveBtn: { padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

/* ── Mock data ─────────────────────────────────────── */
const mockPOs = [
  { po: 'PO-2026-1005', date: '08 Jul 2026', vendor: 'Wildcraft India Pvt Ltd', items: 45, amount: '₹1,25,000', status: 'Sent' },
  { po: 'PO-2026-1004', date: '01 Jul 2026', vendor: 'Decathlon Sports India', items: 120, amount: '₹3,40,000', status: 'Received (Partial)' },
  { po: 'PO-2026-1003', date: '20 Jun 2026', vendor: 'Coleman Gear', items: 15, amount: '₹45,500', status: 'Completed' },
  { po: 'PO-2026-1002', date: '10 Jun 2026', vendor: 'Reebok India', items: 80, amount: '₹2,10,000', status: 'Draft' },
];

const mockGRNs = [
  { grn: 'GRN-2026-401', po: 'PO-2026-1004', vendor: 'Decathlon Sports India', date: '05 Jul 2026', received: 60, expected: 120, status: 'Partial' },
  { grn: 'GRN-2026-400', po: 'PO-2026-1003', vendor: 'Coleman Gear', date: '22 Jun 2026', received: 15, expected: 15, status: 'Complete' },
];

const mockInvoices = [
  { inv: 'PINV-2026-201', po: 'PO-2026-1004', vendor: 'Decathlon Sports India', date: '06 Jul 2026', amount: '₹1,70,000', status: 'Paid' },
  { inv: 'PINV-2026-200', po: 'PO-2026-1003', vendor: 'Coleman Gear', date: '21 Jun 2026', amount: '₹45,500', status: 'Paid' },
  { inv: 'PINV-2026-199', po: 'PO-2026-1002', vendor: 'Reebok India', date: '12 Jun 2026', amount: '₹2,10,000', status: 'Pending' },
];

const statusColor = (s) => {
  if (s === 'Sent' || s === 'Partial') return { bg: '#eff8ff', col: '#175cd3' };
  if (s === 'Completed' || s === 'Complete' || s === 'Paid') return { bg: '#e3fcef', col: '#12b76a' };
  if (s === 'Draft' || s === 'Pending') return { bg: '#fef0c7', col: '#b54708' };
  return { bg: '#f3f4f6', col: '#374151' };
};

const Badge = ({ s }) => { const c = statusColor(s); return <span style={S.badge(c.bg, c.col)}>{s}</span>; };

/* ── Sub-renders ─────────────────────────────────────────────────── */

const KpiRow = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
    {[
      { label: 'Total POs (Month)', val: '12', sub: '4 pending' },
      { label: 'PO Value (Month)',  val: '₹7.2L', sub: 'Across 6 vendors' },
      { label: 'Pending GRNs',      val: '3', sub: 'Awaiting receipt' },
      { label: 'Pending Invoices',  val: '₹2.1L', sub: '2 purchase invoices' },
    ].map(k => (
      <div key={k.label} style={S.card}>
        <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#667085' }}>{k.label}</p>
        <h2 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: '700' }}>{k.val}</h2>
        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{k.sub}</p>
      </div>
    ))}
  </div>
);

/* ───────────────────────────────────────────────────────────────── */
const AdminPurchaseOrders = () => {
  const [searchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'Purchase Orders';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filteredPOs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mockPOs.filter(p => {
      const matchQ = !q || [p.po, p.vendor].some(v => v.toLowerCase().includes(q));
      const matchS = statusFilter === 'All Statuses' || p.status === statusFilter;
      return matchQ && matchS;
    });
  }, [searchQuery, statusFilter]);

  const renderSubContent = () => {
    switch (activeSub) {

      /* ── Purchase Orders (default list) ──────────────── */
      case 'Purchase Orders':
      default:
        return (
          <>
            <KpiRow />
            <div style={S.panel}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search PO or Vendor…" style={{ padding: '8px 12px 8px 32px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '240px' }} />
                  </div>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
                    {['All Statuses', 'Draft', 'Sent', 'Received (Partial)', 'Completed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <button onClick={() => alert('New PO')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> New PO
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['PO Number & Date', 'Vendor', 'Items', 'Amount', 'Status', 'Actions'].map((h, i) => (
                      <th key={h} style={{ ...S.th, textAlign: i === 5 ? 'right' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPOs.map(p => (
                    <tr key={p.po}>
                      <td style={S.td}>
                        <p style={{ margin: '0 0 3px', fontWeight: '600', color: '#ff6600' }}>{p.po}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{p.date}</p>
                      </td>
                      <td style={S.td}>{p.vendor}</td>
                      <td style={{ ...S.td, color: '#667085' }}>{p.items} units</td>
                      <td style={{ ...S.td, fontWeight: '600' }}>{p.amount}</td>
                      <td style={S.td}><Badge s={p.status} /></td>
                      <td style={{ ...S.td, textAlign: 'right' }}>
                        <button style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }} onClick={() => alert('View ' + p.po)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      /* ── Add Purchase Order ───────────────────────────── */
      case 'Add Purchase Order':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ ...S.card, gridColumn: '1 / -1' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600' }}>Create New Purchase Order</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Vendor / Supplier', type: 'select', options: ['Wildcraft India', 'Decathlon Sports', 'Coleman Gear', 'Reebok India'] },
                  { label: 'Expected Delivery Date', type: 'date' },
                  { label: 'Payment Terms', type: 'select', options: ['Net 30', 'Net 45', 'Immediate', 'On Delivery'] },
                  { label: 'Shipping Address', placeholder: 'Warehouse address' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={S.label}>{f.label}</label>
                    {f.type === 'select' ? (
                      <select style={S.inp}>{f.options.map(o => <option key={o}>{o}</option>)}</select>
                    ) : (
                      <input type={f.type || 'text'} placeholder={f.placeholder} style={S.inp} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...S.card, gridColumn: '1 / -1' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '600' }}>Order Line Items</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                <thead>
                  <tr>
                    {['Product / SKU', 'Qty', 'Unit Cost', 'Line Total'].map(h => <th key={h} style={S.th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[{ name: 'Premium Hiking Backpack', sku: 'BG-HK-45L-ORG', qty: 50, cost: '₹1,200' }].map((r, i) => (
                    <tr key={i}>
                      <td style={S.td}><strong>{r.name}</strong><br /><span style={{ fontSize: '12px', color: '#9ca3af' }}>{r.sku}</span></td>
                      <td style={S.td}><input type="number" defaultValue={r.qty} style={{ width: '70px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px' }} /></td>
                      <td style={S.td}>{r.cost}</td>
                      <td style={{ ...S.td, fontWeight: '600', color: '#ff6600' }}>₹60,000</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => alert('Line added')} style={{ padding: '8px 16px', background: 'white', border: '2px dashed #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#667085' }}>+ Add Product Line</button>
              <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button style={{ padding: '10px 20px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>Save as Draft</button>
                <button onClick={() => alert('PO Sent!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Send to Vendor</button>
              </div>
            </div>
          </div>
        );

      /* ── PO Status Tracking ─────────────────────────── */
      case 'PO Status Tracking':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>PO Status Tracking Board</strong>
            </div>
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {['Draft', 'Sent', 'Received (Partial)', 'Completed'].map(col => (
                <div key={col} style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
                  <p style={{ margin: '0 0 12px', fontWeight: '600', fontSize: '13px', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col}</p>
                  {mockPOs.filter(p => p.status === col).map(p => (
                    <div key={p.po} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                      <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#ff6600', fontSize: '13px' }}>{p.po}</p>
                      <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#374151' }}>{p.vendor}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{p.amount}</p>
                    </div>
                  ))}
                  {mockPOs.filter(p => p.status === col).length === 0 && (
                    <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', padding: '12px 0' }}>No POs</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      /* ── GRN ────────────────────────────────────────── */
      case 'Goods Received Notes (GRN)':
        return (
          <>
            <div style={{ ...S.card, marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '15px' }}>Goods Received Notes</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#667085' }}>Confirm physical receipt of ordered stock</p>
              </div>
              <button onClick={() => alert('New GRN')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>+ Create GRN</button>
            </div>
            <div style={S.panel}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['GRN #', 'PO Reference', 'Vendor', 'Date', 'Received / Expected', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {mockGRNs.map(g => (
                    <tr key={g.grn}>
                      <td style={{ ...S.td, fontWeight: '600', color: '#ff6600' }}>{g.grn}</td>
                      <td style={{ ...S.td, color: '#667085' }}>{g.po}</td>
                      <td style={S.td}>{g.vendor}</td>
                      <td style={{ ...S.td, color: '#9ca3af' }}>{g.date}</td>
                      <td style={S.td}><strong>{g.received}</strong> / {g.expected} units</td>
                      <td style={S.td}><Badge s={g.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      /* ── Purchase Invoices ──────────────────────────── */
      case 'Purchase Invoices':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Purchase Invoices</strong>
              <button onClick={() => alert('Export')} style={{ padding: '7px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={14} /> Export
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Invoice #', 'PO Reference', 'Vendor', 'Date', 'Amount', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {mockInvoices.map(inv => (
                  <tr key={inv.inv}>
                    <td style={{ ...S.td, fontWeight: '600', color: '#ff6600' }}>{inv.inv}</td>
                    <td style={{ ...S.td, color: '#667085' }}>{inv.po}</td>
                    <td style={S.td}>{inv.vendor}</td>
                    <td style={{ ...S.td, color: '#9ca3af' }}>{inv.date}</td>
                    <td style={{ ...S.td, fontWeight: '600' }}>{inv.amount}</td>
                    <td style={S.td}><Badge s={inv.status} /></td>
                    <td style={{ ...S.td, textAlign: 'right' }}>
                      <button onClick={() => alert('Download ' + inv.inv)} style={{ color: '#667085', background: 'none', border: 'none', cursor: 'pointer' }}><FileText size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      /* ── Debit Notes ─────────────────────────────────── */
      case 'Debit Notes':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '15px' }}>Debit Notes to Vendors</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#667085' }}>For returns, short-supply or pricing corrections</p>
              </div>
              <button onClick={() => alert('New Debit Note')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>+ New DN</button>
            </div>
            {[
              { dn: 'DN-2026-041', vendor: 'Decathlon Sports India', reason: 'Short supply — 60 units received vs 120 ordered', amount: '₹1,70,000', date: '06 Jul 2026', status: 'Sent' },
              { dn: 'DN-2026-040', vendor: 'Coleman Gear', reason: 'Defective goods — 3 units returned', amount: '₹9,000', date: '23 Jun 2026', status: 'Resolved' },
            ].map(d => (
              <div key={d.dn} style={{ ...S.card, borderLeft: '4px solid #f79009' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#ff6600' }}>{d.dn} — {d.vendor}</p>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}>{d.reason}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{d.date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: '700', fontSize: '16px' }}>{d.amount}</p>
                    <Badge s={d.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      /* ── Credit Notes ─────────────────────────────────── */
      case 'Credit Notes':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '15px' }}>Credit Notes from Vendors</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#667085' }}>Credits received from vendors for overpayments or returns</p>
              </div>
              <button onClick={() => alert('New Credit Note')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>+ New CN</button>
            </div>
            {[
              { cn: 'CN-2026-018', vendor: 'Wildcraft India', reason: 'Overpayment refund — PO-2026-1001', amount: '₹12,500', date: '30 Jun 2026', status: 'Received' },
              { cn: 'CN-2026-017', vendor: 'Reebok India', reason: 'Seasonal discount credit applied', amount: '₹21,000', date: '15 Jun 2026', status: 'Applied' },
            ].map(c => (
              <div key={c.cn} style={{ ...S.card, borderLeft: '4px solid #12b76a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#12b76a' }}>{c.cn} — {c.vendor}</p>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}>{c.reason}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{c.date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: '700', fontSize: '16px', color: '#12b76a' }}>{c.amount}</p>
                    <Badge s={c.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      /* ── Vendor Notes ─────────────────────────────────── */
      case 'Vendor Notes':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Vendor Communication Notes</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#667085' }}>Internal notes linked to vendors and POs</p>
              </div>
              <button onClick={() => alert('New Note')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>+ Add Note</button>
            </div>
            {[
              { vendor: 'Decathlon Sports India', note: 'Partial shipment confirmed — balance expected by 20 Jul 2026.', by: 'Rahul (Procurement)', date: '07 Jul 2026', type: 'info' },
              { vendor: 'Wildcraft India', note: 'Requested catalogue update for FY 2026-27. Follow-up on 15 Jul.', by: 'Sneha (Admin)', date: '02 Jul 2026', type: 'follow-up' },
              { vendor: 'Coleman Gear', note: 'Quality issue resolved — defective batch returned and replaced.', by: 'Rahul (Procurement)', date: '24 Jun 2026', type: 'resolved' },
            ].map((n, i) => (
              <div key={i} style={{ ...S.card, borderLeft: `4px solid ${n.type === 'resolved' ? '#12b76a' : n.type === 'follow-up' ? '#f79009' : '#6366f1'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '14px' }}>{n.vendor}</strong>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{n.date}</span>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#374151' }}>{n.note}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>— {n.by}</p>
              </div>
            ))}
          </div>
        );

      /* ── Purchase Analytics ───────────────────────────── */
      case 'Purchase Analytics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {[
                { label: 'Total Purchase Value (FY)',   val: '₹48.6L', sub: '+12% vs last year', col: '#ff6600' },
                { label: 'Avg PO Processing Time',      val: '4.2 days', sub: 'From issue to GRN', col: '#6366f1' },
                { label: 'On-time Delivery Rate',       val: '86%', sub: '14 of 16 POs on time', col: '#12b76a' },
              ].map(k => (
                <div key={k.label} style={S.card}>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#667085' }}>{k.label}</p>
                  <h2 style={{ margin: '0 0 4px', fontSize: '26px', color: k.col, fontWeight: '700' }}>{k.val}</h2>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{k.sub}</p>
                </div>
              ))}
            </div>
            <div style={S.panel}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
                <strong>Top Vendors by Purchase Value</strong>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Vendor', 'POs', 'Total Value', 'Avg Lead Days', 'Defect Rate'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { v: 'Decathlon Sports India', po: 6, val: '₹18.2L', lead: '3.1', defect: '0.4%' },
                    { v: 'Wildcraft India',         po: 4, val: '₹12.8L', lead: '4.8', defect: '1.1%' },
                    { v: 'Reebok India',             po: 3, val: '₹9.4L', lead: '5.2', defect: '0.6%' },
                    { v: 'Coleman Gear',             po: 2, val: '₹8.2L', lead: '6.0', defect: '2.1%' },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td style={{ ...S.td, fontWeight: '500' }}>{r.v}</td>
                      <td style={{ ...S.td, color: '#667085' }}>{r.po}</td>
                      <td style={{ ...S.td, fontWeight: '600' }}>{r.val}</td>
                      <td style={{ ...S.td, color: '#667085' }}>{r.lead} days</td>
                      <td style={S.td}><span style={{ color: parseFloat(r.defect) > 1 ? '#f04438' : '#12b76a', fontWeight: '500' }}>{r.defect}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      /* ── Cost Price History ───────────────────────────── */
      case 'Cost Price History':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Cost Price Change Log</strong>
              <button onClick={() => alert('Export')} style={{ padding: '7px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Export CSV</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Product / SKU', 'Old Cost', 'New Cost', 'Change', '% Δ', 'Updated By', 'Date'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  { name: 'Premium Hiking Backpack', sku: 'BG-HK-45L-ORG', old: '₹1,100', nw: '₹1,200', ch: '+₹100', pct: '+9.1%', by: 'Wildcraft PO-1005', date: '08 Jul' },
                  { name: 'Trekking Shoes',           sku: 'SH-TK-001',     old: '₹1,800', nw: '₹1,950', ch: '+₹150', pct: '+8.3%', by: 'Decathlon PO-1004', date: '01 Jul' },
                  { name: 'Camping Headlamp LED',     sku: 'LT-HL-LED-01',  old: '₹380',   nw: '₹340',   ch: '−₹40',  pct: '−10.5%', by: 'Coleman PO-1003', date: '20 Jun' },
                ].map((r, i) => (
                  <tr key={i}>
                    <td style={S.td}><strong>{r.name}</strong><br /><span style={{ fontSize: '12px', color: '#9ca3af' }}>{r.sku}</span></td>
                    <td style={{ ...S.td, color: '#9ca3af', textDecoration: 'line-through' }}>{r.old}</td>
                    <td style={{ ...S.td, fontWeight: '600' }}>{r.nw}</td>
                    <td style={{ ...S.td, color: r.ch.startsWith('+') ? '#f04438' : '#12b76a', fontWeight: '500' }}>{r.ch}</td>
                    <td style={{ ...S.td, color: r.ch.startsWith('+') ? '#f04438' : '#12b76a' }}>{r.pct}</td>
                    <td style={{ ...S.td, color: '#667085', fontSize: '12px' }}>{r.by}</td>
                    <td style={{ ...S.td, color: '#9ca3af' }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>{activeSub}</h1>
            <p>Manage purchase orders, vendor invoices and procurement analytics</p>
          </div>
          {activeSub === 'Purchase Orders' && (
            <button className="admin-primary-button" onClick={() => window.location.reload()}>
              <RefreshCcw size={18} /> Refresh Data
            </button>
          )}
        </section>
        {renderSubContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminPurchaseOrders;
