import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, ArrowDownToLine, Plus, AlertCircle, RefreshCcw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  badge: (c) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', ...c }),
  input: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' },
  btn: (v) => ({ padding: '8px 16px', background: v ? '#ff6600' : 'white', color: v ? 'white' : '#374151', border: v ? 'none' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }),
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  formCard: { background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '560px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' },
  inp: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  saveBtn: { padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' },
};

const mockItems = [
  { name: 'Premium Hiking Backpack (45L)', sku: 'BG-HK-45L-ORG', cat: 'Gear', sellable: 45, reserved: 12, defective: 2, incoming: 20, status: 'In Stock' },
  { name: 'Camping Headlamp LED', sku: 'LT-HL-LED-01', cat: 'Lighting', sellable: 5, reserved: 0, defective: 0, incoming: 50, status: 'Low Stock' },
  { name: 'Trekking Poles (Pair)', sku: 'GR-TP-ALU-2', cat: 'Gear', sellable: 0, reserved: 0, defective: 5, incoming: 0, status: 'Out of Stock' },
];

const StatusBadge = ({ s }) => {
  const colors = {
    'In Stock':    { background: '#e3fcef', color: '#12b76a' },
    'Low Stock':   { background: '#fef0c7', color: '#f79009' },
    'Out of Stock':{ background: '#fef3f2', color: '#f04438' },
  };
  return <span style={{ ...S.badge(colors[s] || {}), display: 'inline-block' }}>{s}</span>;
};

/* ─── Stock Table (shared) ─────────────────────────── */
const StockTable = ({ rows, cols = ['sku', 'cat', 'sellable', 'defective', 'status'] }) => (
  <div style={S.panel}>
    <table style={S.table}>
      <thead>
        <tr>
          <th style={S.th}>Product &amp; SKU</th>
          {cols.includes('cat')       && <th style={S.th}>Category</th>}
          {cols.includes('sellable')  && <th style={S.th}>Sellable</th>}
          {cols.includes('reserved')  && <th style={S.th}>Reserved</th>}
          {cols.includes('defective') && <th style={S.th}>Defective</th>}
          {cols.includes('incoming')  && <th style={S.th}>Incoming</th>}
          {cols.includes('status')    && <th style={S.th}>Status</th>}
          <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((item, idx) => (
          <tr key={idx}>
            <td style={S.td}>
              <p style={{ margin: '0 0 4px', fontWeight: '500', color: '#111' }}>{item.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>{item.sku}</p>
            </td>
            {cols.includes('cat')       && <td style={{ ...S.td, color: '#667085' }}>{item.cat}</td>}
            {cols.includes('sellable')  && <td style={{ ...S.td, fontWeight: '500' }}>{item.sellable}</td>}
            {cols.includes('reserved')  && <td style={{ ...S.td, color: '#6366f1', fontWeight: '500' }}>{item.reserved}</td>}
            {cols.includes('defective') && <td style={{ ...S.td, color: '#f04438' }}>{item.defective}</td>}
            {cols.includes('incoming')  && <td style={{ ...S.td, color: '#0ba5ec', fontWeight: '500' }}>{item.incoming}</td>}
            {cols.includes('status')    && <td style={S.td}><StatusBadge s={item.status} /></td>}
            <td style={{ ...S.td, textAlign: 'right' }}>
              <button onClick={() => alert('Editing ' + item.sku)} style={{ color: '#ff6600', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer' }}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ─── KPI cards ─────────────────────────────────────── */
const KpiRow = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
    {[
      { label: 'Total Sellable',   val: '12,450', color: '#111' },
      { label: 'Low Stock Items',  val: '24',     color: '#f79009' },
      { label: 'Out of Stock',     val: '12',     color: '#f04438' },
      { label: 'Defective Returns',val: '18',     color: '#111' },
    ].map(k => (
      <div key={k.label} style={S.card}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#667085', fontWeight: '500' }}>{k.label}</p>
        <h2 style={{ margin: 0, fontSize: '28px', color: k.color }}>{k.val}</h2>
      </div>
    ))}
  </div>
);

/* ─── Inward / Adjustment / Transfer Form ─────────── */
const SimpleForm = ({ title, fields }) => (
  <div style={S.formCard}>
    <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600' }}>{title}</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {fields.map(f => (
        <div key={f.label}>
          <label style={S.label}>{f.label}</label>
          {f.type === 'select' ? (
            <select style={S.inp}>
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          ) : f.type === 'textarea' ? (
            <textarea style={{ ...S.inp, minHeight: '80px' }} placeholder={f.placeholder} />
          ) : (
            <input type={f.type || 'text'} placeholder={f.placeholder} style={S.inp} />
          )}
        </div>
      ))}
      <div>
        <button style={S.saveBtn} onClick={() => alert('Saved!')}>{title.includes('Transfer') ? 'Initiate Transfer' : 'Submit'}</button>
      </div>
    </div>
  </div>
);

/* ─── History log table ─────────────────────────────── */
const HistoryTable = ({ rows }) => (
  <div style={S.panel}>
    <table style={S.table}>
      <thead>
        <tr>
          {['Date', 'Product / SKU', 'Action', 'Qty Change', 'By'].map(h => <th key={h} style={S.th}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td style={{ ...S.td, color: '#667085' }}>{r.date}</td>
            <td style={S.td}><strong>{r.product}</strong><br /><span style={{ fontSize: '12px', color: '#667085' }}>{r.sku}</span></td>
            <td style={S.td}>{r.action}</td>
            <td style={{ ...S.td, color: r.qty > 0 ? '#12b76a' : '#f04438', fontWeight: '600' }}>{r.qty > 0 ? `+${r.qty}` : r.qty}</td>
            <td style={{ ...S.td, color: '#667085' }}>{r.by}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ═══════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════ */
const AdminInventory = () => {
  const [searchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'Stock Overview';
  const activeMenu = searchParams.get('menu') || 'Inventory';
  const [activeTab, setActiveTab] = useState('all');

  const renderSubContent = () => {
    switch (activeSub) {

      /* ── Stock Overview (default) ──────────────── */
      case 'Stock Overview':
      default: {
        const tabs = ['all', 'sellable', 'low_stock', 'out_of_stock', 'defective'];
        const filtered = activeTab === 'all' ? mockItems
          : activeTab === 'sellable'      ? mockItems.filter(i => i.sellable > 0)
          : activeTab === 'low_stock'     ? mockItems.filter(i => i.sellable <= 10 && i.sellable > 0)
          : activeTab === 'out_of_stock'  ? mockItems.filter(i => i.sellable === 0)
          : mockItems.filter(i => i.defective > 0);

        return (
          <>
            <KpiRow />
            <div style={{ ...S.panel }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {tabs.map(tab => (
                    <span key={tab} onClick={() => setActiveTab(tab)} style={{ fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: activeTab === tab ? '#ff6600' : '#667085', borderBottom: activeTab === tab ? '2px solid #ff6600' : 'none', paddingBottom: '16px', marginBottom: '-17px' }}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#667085' }} />
                  <input placeholder="Search SKU or Product" style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '250px' }} />
                </div>
              </div>
              <StockTable rows={filtered} cols={['sku', 'cat', 'sellable', 'reserved', 'defective', 'status']} />
            </div>
          </>
        );
      }

      /* ── Sellable Stock ───────────────────────── */
      case 'Sellable Stock':
        return (
          <>
            <div style={{ ...S.card, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '15px' }}>Sellable Units Available</strong>
                <p style={{ margin: '4px 0 0', color: '#667085', fontSize: '13px' }}>Units ready to be sold — reserved and defective stock excluded</p>
              </div>
              <h2 style={{ margin: 0, fontSize: '32px', color: '#12b76a' }}>12,450</h2>
            </div>
            <StockTable rows={mockItems.filter(i => i.sellable > 0)} cols={['cat', 'sellable', 'status']} />
          </>
        );

      /* ── Reserved Stock ───────────────────────── */
      case 'Reserved Stock':
        return (
          <>
            <div style={{ ...S.card, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '15px' }}>Reserved Units</strong>
                <p style={{ margin: '4px 0 0', color: '#667085', fontSize: '13px' }}>Units held against open or unconfirmed orders</p>
              </div>
              <h2 style={{ margin: 0, fontSize: '32px', color: '#6366f1' }}>62</h2>
            </div>
            <StockTable rows={mockItems.filter(i => i.reserved > 0)} cols={['cat', 'reserved', 'status']} />
          </>
        );

      /* ── Defective Stock ─────────────────────── */
      case 'Defective Stock':
        return (
          <>
            <div style={{ ...S.card, marginBottom: '20px', background: '#fff9f9', borderColor: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '15px', color: '#b91c1c' }}>⚠ Defective Units</strong>
                <p style={{ margin: '4px 0 0', color: '#667085', fontSize: '13px' }}>Damaged / returned stock awaiting inspection or write-off</p>
              </div>
              <h2 style={{ margin: 0, fontSize: '32px', color: '#f04438' }}>18</h2>
            </div>
            <StockTable rows={mockItems.filter(i => i.defective > 0)} cols={['cat', 'sellable', 'defective', 'status']} />
          </>
        );

      /* ── Incoming Stock ─────────────────────── */
      case 'Incoming Stock':
        return (
          <>
            <div style={{ ...S.card, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '15px' }}>Incoming Purchase Orders</strong>
                <p style={{ margin: '4px 0 0', color: '#667085', fontSize: '13px' }}>Stock in transit or pending GRN confirmation</p>
              </div>
              <h2 style={{ margin: 0, fontSize: '32px', color: '#0ba5ec' }}>3 POs</h2>
            </div>
            <StockTable rows={mockItems} cols={['cat', 'incoming', 'status']} />
          </>
        );

      /* ── Stock Inward ────────────────────────── */
      case 'Stock Inward':
        return (
          <SimpleForm title="Stock Inward Entry (GRN)" fields={[
            { label: 'Product / SKU', placeholder: 'Search or enter SKU' },
            { label: 'Supplier', placeholder: 'e.g. Nike India Pvt Ltd' },
            { label: 'Quantity Received', type: 'number', placeholder: '0' },
            { label: 'Purchase Order Reference', placeholder: 'PO-2025-0041' },
            { label: 'Inward Date', type: 'date' },
            { label: 'Remarks', type: 'textarea', placeholder: 'Optional notes about condition etc.' },
          ]} />
        );

      /* ── Stock Adjustment ───────────────────── */
      case 'Stock Adjustment':
        return (
          <SimpleForm title="Manual Stock Adjustment" fields={[
            { label: 'Product / SKU', placeholder: 'Search or enter SKU' },
            { label: 'Adjustment Type', type: 'select', options: ['Add Stock (+)', 'Remove Stock (–)', 'Write-off Defective', 'Correct Count'] },
            { label: 'Quantity', type: 'number', placeholder: '0' },
            { label: 'Reason', type: 'select', options: ['Counting Error', 'Damage / Loss', 'Return Restock', 'Promotional', 'Other'] },
            { label: 'Notes', type: 'textarea', placeholder: 'Explanation for this adjustment...' },
          ]} />
        );

      /* ── Stock Transfer ─────────────────────── */
      case 'Stock Transfer':
        return (
          <SimpleForm title="Transfer Stock Between Locations" fields={[
            { label: 'Product / SKU', placeholder: 'Search or enter SKU' },
            { label: 'From Location', type: 'select', options: ['Main Warehouse', 'Store Floor – Pune', 'Store Floor – Mumbai'] },
            { label: 'To Location', type: 'select', options: ['Store Floor – Pune', 'Store Floor – Mumbai', 'Main Warehouse'] },
            { label: 'Quantity to Transfer', type: 'number', placeholder: '0' },
            { label: 'Reason', placeholder: 'Transfer reason (optional)' },
          ]} />
        );

      /* ── Stock History ──────────────────────── */
      case 'Stock History':
        return (
          <HistoryTable rows={[
            { date: '08 Jul 2025', product: 'Premium Hiking Backpack', sku: 'BG-HK-45L-ORG', action: 'Stock Inward (GRN)',  qty: 100, by: 'Admin' },
            { date: '07 Jul 2025', product: 'Camping Headlamp LED',    sku: 'LT-HL-LED-01',  action: 'Sale Deduction',       qty: -12,  by: 'POS' },
            { date: '06 Jul 2025', product: 'Trekking Poles (Pair)',   sku: 'GR-TP-ALU-2',   action: 'Defective Write-off',  qty: -5,   by: 'Admin' },
            { date: '05 Jul 2025', product: 'Premium Hiking Backpack', sku: 'BG-HK-45L-ORG', action: 'Stock Adjustment (+)', qty: 15,  by: 'Warehouse' },
          ]} />
        );

      /* ── Stock Expiry ───────────────────────── */
      case 'Stock Expiry (if applicable)':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...S.card, borderLeft: '4px solid #f79009' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Energy Gel Pack (Box of 24)</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#667085' }}>SKU: FD-EG-24PK — Batch: B2503</p>
                </div>
                <span style={{ ...S.badge({ background: '#fef0c7', color: '#b54708' }), alignSelf: 'flex-start' }}>Expiring in 14 days</span>
              </div>
            </div>
            <div style={{ ...S.card, borderLeft: '4px solid #f04438' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Sports Sunscreen SPF 70</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#667085' }}>SKU: SK-SC-70PF — Batch: B2501</p>
                </div>
                <span style={{ ...S.badge({ background: '#fef3f2', color: '#b42318' }), alignSelf: 'flex-start' }}>Expired</span>
              </div>
            </div>
          </div>
        );

      /* ── Inventory Report ───────────────────── */
      case 'Inventory Report':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {[
                { label: 'Total SKUs', val: '348',     note: 'Active catalog' },
                { label: 'Total Stock Value', val: '₹24.6L', note: 'At cost price' },
                { label: 'Avg. Turnover',  val: '18 days', note: 'Last 30 days' },
              ].map(k => (
                <div key={k.label} style={S.card}>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#667085' }}>{k.label}</p>
                  <h2 style={{ margin: '0 0 2px', fontSize: '26px' }}>{k.val}</h2>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{k.note}</p>
                </div>
              ))}
            </div>
            <div style={S.panel}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Full Inventory Report</strong>
                <button style={S.btn(true)} onClick={() => alert('Exporting...')}>
                  <ArrowDownToLine size={14} style={{ display: 'inline', marginRight: '6px' }} />Export CSV
                </button>
              </div>
              <StockTable rows={mockItems} cols={['cat', 'sellable', 'reserved', 'defective', 'incoming', 'status']} />
            </div>
          </div>
        );

      /* ═══════════════════════════════════════════
         STOCK AUDIT sub-options
      ═══════════════════════════════════════════ */
      case 'Create Stock Audit':
        return (
          <div style={{ ...S.formCard, maxWidth: '600px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600' }}>Create New Stock Audit</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Audit Name / Reference', placeholder: 'e.g. Q2 2026 Full Audit' },
                { label: 'Audit Type', type: 'select', options: ['Full Inventory', 'Spot Check', 'Category Audit', 'Location Audit'] },
                { label: 'Location / Warehouse', type: 'select', options: ['Main Warehouse', 'Store Floor – Pune', 'Store Floor – Mumbai'] },
                { label: 'Scheduled Date', type: 'date' },
                { label: 'Assigned To', placeholder: 'Staff member name' },
                { label: 'Notes / Instructions', type: 'textarea', placeholder: 'Any special instructions for auditors...' },
              ].map(f => (
                <div key={f.label}>
                  <label style={S.label}>{f.label}</label>
                  {f.type === 'select' ? (
                    <select style={S.inp}>{f.options.map(o => <option key={o}>{o}</option>)}</select>
                  ) : f.type === 'textarea' ? (
                    <textarea style={{ ...S.inp, minHeight: '80px' }} placeholder={f.placeholder} />
                  ) : (
                    <input type={f.type || 'text'} placeholder={f.placeholder} style={S.inp} />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={() => alert('Saved as draft')} style={{ padding: '10px 20px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>Save Draft</button>
                <button onClick={() => alert('Audit created!')} style={S.saveBtn}>Create Audit</button>
              </div>
            </div>
          </div>
        );

      case 'Audit Planning':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '15px' }}>Upcoming Audits</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#667085' }}>Plan and schedule stock count sessions</p>
              </div>
              <button onClick={() => alert('Add plan')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>+ New Plan</button>
            </div>
            {[
              { name: 'Q3 Full Inventory Audit', location: 'Main Warehouse', date: '15 Jul 2026', assignee: 'Rahul K.', status: 'Planned' },
              { name: 'Spot Check – Gear Category', location: 'Store Floor – Pune', date: '20 Jul 2026', assignee: 'Priya M.', status: 'Planned' },
              { name: 'Q2 Full Inventory Audit', location: 'Main Warehouse', date: '01 Apr 2026', assignee: 'Rahul K.', status: 'Completed' },
            ].map((a, i) => (
              <div key={i} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '14px' }}>{a.name}</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#667085' }}>{a.location} · {a.date} · Assigned: {a.assignee}</p>
                </div>
                <span style={{ ...S.badge({ background: a.status === 'Completed' ? '#e3fcef' : '#eff8ff', color: a.status === 'Completed' ? '#12b76a' : '#175cd3' }), display: 'inline-block' }}>{a.status}</span>
              </div>
            ))}
          </div>
        );

      case 'Physical Count Entry':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Physical Count Entry Sheet</strong>
              <span style={{ fontSize: '13px', color: '#667085' }}>Audit: Q3 Full Inventory — 15 Jul 2026</span>
            </div>
            <table style={S.table}>
              <thead>
                <tr>
                  {['Product & SKU', 'System Count', 'Physical Count', 'Variance', 'Notes'].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {mockItems.map((item, i) => (
                  <tr key={i}>
                    <td style={S.td}>
                      <strong>{item.name}</strong><br />
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{item.sku}</span>
                    </td>
                    <td style={S.td}>{item.sellable}</td>
                    <td style={S.td}><input type="number" defaultValue={item.sellable} style={{ width: '80px', padding: '5px 8px', border: '1px solid #d1d5db', borderRadius: '4px' }} /></td>
                    <td style={S.td}><span style={{ color: '#9ca3af', fontWeight: '500' }}>—</span></td>
                    <td style={S.td}><input type="text" placeholder="Optional note..." style={{ width: '160px', padding: '5px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => alert('Saved!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Save Count</button>
            </div>
          </div>
        );

      case 'Audit Comparison':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>System vs Physical Count Comparison</strong>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#667085' }}>Q3 Full Inventory — 15 Jul 2026</p>
            </div>
            <table style={S.table}>
              <thead>
                <tr>
                  {['Product', 'System Qty', 'Physical Qty', 'Variance', 'Variance Value', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Premium Hiking Backpack', sku: 'BG-HK-45L-ORG', sys: 45, phys: 43, val: '₹2,400' },
                  { name: 'Camping Headlamp LED',    sku: 'LT-HL-LED-01',  sys: 5,  phys: 5,  val: '₹0' },
                  { name: 'Trekking Poles (Pair)',   sku: 'GR-TP-ALU-2',   sys: 0,  phys: 2,  val: '+₹3,600' },
                ].map((r, i) => {
                  const v = r.phys - r.sys;
                  return (
                    <tr key={i}>
                      <td style={S.td}><strong>{r.name}</strong><br /><span style={{ fontSize: '12px', color: '#9ca3af' }}>{r.sku}</span></td>
                      <td style={S.td}>{r.sys}</td>
                      <td style={S.td}>{r.phys}</td>
                      <td style={{ ...S.td, fontWeight: '700', color: v < 0 ? '#f04438' : v > 0 ? '#12b76a' : '#9ca3af' }}>{v > 0 ? `+${v}` : v}</td>
                      <td style={{ ...S.td, color: v < 0 ? '#f04438' : v > 0 ? '#12b76a' : '#9ca3af' }}>{r.val}</td>
                      <td style={S.td}><span style={{ ...S.badge({ background: v === 0 ? '#e3fcef' : '#fef3f2', color: v === 0 ? '#12b76a' : '#f04438' }), display: 'inline-block' }}>{v === 0 ? 'Matched' : 'Variance'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case 'Variance Report':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { label: 'Total Variance Items', val: '8', note: 'Out of 348 SKUs audited', col: '#f04438' },
                { label: 'Total Value Loss',     val: '₹18,200', note: 'Shrinkage + counting errors', col: '#f04438' },
                { label: 'Value Surplus Found',  val: '₹3,600', note: 'Items found extra in count', col: '#12b76a' },
              ].map(k => (
                <div key={k.label} style={S.card}>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#667085' }}>{k.label}</p>
                  <h2 style={{ margin: '0 0 4px', fontSize: '26px', color: k.col, fontWeight: '700' }}>{k.val}</h2>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{k.note}</p>
                </div>
              ))}
            </div>
            <div style={S.panel}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Variance Details</strong>
                <button onClick={() => alert('Exported!')} style={{ padding: '7px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Export CSV</button>
              </div>
              <table style={S.table}>
                <thead><tr>{['Product', 'System', 'Physical', 'Difference', 'Loss / Gain'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { name: 'Premium Hiking Backpack (45L)', diff: -2, val: '−₹2,400' },
                    { name: 'Camping Headlamp LED', diff: 0, val: '₹0' },
                    { name: 'Trekking Poles (Pair)', diff: +2, val: '+₹3,600' },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td style={S.td}>{r.name}</td>
                      <td style={S.td}>45</td>
                      <td style={S.td}>{45 + r.diff}</td>
                      <td style={{ ...S.td, fontWeight: '700', color: r.diff < 0 ? '#f04438' : r.diff > 0 ? '#12b76a' : '#9ca3af' }}>{r.diff > 0 ? `+${r.diff}` : r.diff}</td>
                      <td style={{ ...S.td, color: r.diff < 0 ? '#f04438' : r.diff > 0 ? '#12b76a' : '#9ca3af' }}>{r.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Approve / Reject Audit':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...S.card, background: '#fffbeb', borderColor: '#fcd34d' }}>
              <strong style={{ color: '#92400e' }}>⚠ Audit Pending Review — Q3 Full Inventory (15 Jul 2026)</strong>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#78350f' }}>8 variance items identified totaling ₹18,200 in stock discrepancies. Review before approving.</p>
            </div>
            {[
              { item: 'Premium Hiking Backpack (45L)', diff: -2, val: '₹2,400', reason: 'Possible shrinkage' },
              { item: 'Trekking Poles (Pair)', diff: +2, val: '₹3,600', reason: 'Miscounted in previous audit' },
            ].map((v, i) => (
              <div key={i} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '14px' }}>{v.item}</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#667085' }}>Variance: {v.diff > 0 ? `+${v.diff}` : v.diff} units · {v.val} · Reason: {v.reason}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => alert('Approved')} style={{ padding: '7px 14px', background: '#e3fcef', color: '#027a48', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Approve</button>
                  <button onClick={() => alert('Rejected')} style={{ padding: '7px 14px', background: '#fef3f2', color: '#b42318', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Reject</button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => alert('Full audit approved!')} style={{ padding: '10px 20px', background: '#12b76a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>✓ Approve Full Audit</button>
              <button onClick={() => alert('Audit rejected!')} style={{ padding: '10px 20px', background: '#f04438', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>✕ Reject & Re-count</button>
            </div>
          </div>
        );

      case 'Audit History':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Completed Audits History</strong>
              <button onClick={() => alert('Export')} style={{ padding: '7px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Export CSV</button>
            </div>
            <table style={S.table}>
              <thead><tr>{['Audit Name', 'Type', 'Date', 'Auditor', 'Items Audited', 'Variance', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  { name: 'Q2 Full Inventory', type: 'Full', date: '01 Apr 2026', by: 'Rahul K.', items: 348, variance: '−₹12,400', status: 'Approved' },
                  { name: 'Q1 Spot Check – Gear', type: 'Spot', date: '10 Jan 2026', by: 'Priya M.', items: 45, variance: '₹0', status: 'Approved' },
                  { name: 'Q4 2025 Full Audit', type: 'Full', date: '01 Dec 2025', by: 'Rahul K.', items: 312, variance: '−₹8,100', status: 'Approved' },
                ].map((a, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, fontWeight: '500' }}>{a.name}</td>
                    <td style={{ ...S.td, color: '#667085' }}>{a.type}</td>
                    <td style={{ ...S.td, color: '#9ca3af' }}>{a.date}</td>
                    <td style={{ ...S.td, color: '#667085' }}>{a.by}</td>
                    <td style={S.td}>{a.items}</td>
                    <td style={{ ...S.td, color: a.variance === '₹0' ? '#12b76a' : '#f04438', fontWeight: '500' }}>{a.variance}</td>
                    <td style={S.td}><span style={{ ...S.badge({ background: '#e3fcef', color: '#12b76a' }), display: 'inline-block' }}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Audit Report':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { label: 'Total Audits (FY)',    val: '4',       col: '#111' },
                { label: 'SKUs Audited',         val: '348',     col: '#6366f1' },
                { label: 'Total Loss Found',     val: '₹38.7K', col: '#f04438' },
                { label: 'Audit Accuracy Rate',  val: '97.7%',  col: '#12b76a' },
              ].map(k => (
                <div key={k.label} style={S.card}>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#667085' }}>{k.label}</p>
                  <h2 style={{ margin: 0, fontSize: '26px', color: k.col, fontWeight: '700' }}>{k.val}</h2>
                </div>
              ))}
            </div>
            <div style={{ ...S.card }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600' }}>Audit Summary — Q3 2026 (15 Jul 2026)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                {[
                  ['Audit Type', 'Full Inventory'],
                  ['Location', 'Main Warehouse'],
                  ['Auditor', 'Rahul K.'],
                  ['Total SKUs', '348'],
                  ['Matched Items', '340 (97.7%)'],
                  ['Variance Items', '8 (2.3%)'],
                  ['Net Variance Value', '−₹14,600'],
                  ['Status', 'Pending Approval'],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 14px', background: i % 2 === 0 ? '#f9fafb' : 'white', borderRadius: '6px' }}>
                    <span style={{ color: '#667085', flex: 1 }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => alert('PDF Downloaded!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Download PDF Report</button>
                <button onClick={() => alert('CSV Exported!')} style={{ padding: '10px 20px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>Export CSV</button>
              </div>
            </div>
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
            <p>{activeMenu === 'Stock Audit' ? 'Plan, execute and approve physical stock audits' : 'Track and manage stock levels across all locations and channels'}</p>
          </div>
          {(activeSub === 'Stock Overview') && (
            <button className="admin-primary-button" onClick={() => window.location.reload()}>
              <RefreshCcw size={16} /> Refresh
            </button>
          )}
        </section>

        {renderSubContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
