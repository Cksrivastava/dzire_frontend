import React from 'react';
import AdminLayout from './AdminLayout';
import { Download, Package, Activity, RefreshCw } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const AdminInventoryReports = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Inventory Reports</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Track stock valuation, turnover rates, and levels</p>
          </div>
          <button onClick={() => alert('Inventory Report Exported')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Total Inventory Valuation</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#111', fontWeight: '700' }}>₹24,60,000</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>At average cost price value</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Avg Inventory Turnover</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#ff6600', fontWeight: '700' }}>18.4 Days</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#12b76a' }}>Highly optimized replenishment</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Out of Stock rate</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#f04438', fontWeight: '700' }}>1.4%</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>5 SKUs currently zero stock</p>
          </div>
        </div>

        <div style={S.panel}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <strong>Stock Valuation by Segment Category</strong>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Category Segment</th>
                <th style={S.th}>Active SKU Count</th>
                <th style={S.th}>Physical Quantity</th>
                <th style={S.th}>Total Value at Cost</th>
                <th style={S.th}>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Bags & Packs', skus: 142, qty: 1540, val: '₹11,40,000', status: 'Healthy' },
                { cat: 'Trekking Footwear', skus: 84, qty: 620, val: '₹8,20,000', status: 'Healthy' },
                { cat: 'Camping Gear', skus: 58, qty: 140, val: '₹5,00,000', status: 'Low Stock Alerts' }
              ].map((c, i) => (
                <tr key={i}>
                  <td style={S.td}><strong>{c.cat}</strong></td>
                  <td style={S.td}>{c.skus} SKUs</td>
                  <td style={S.td}>{c.qty} units</td>
                  <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{c.val}</td>
                  <td style={S.td}>
                    <span style={S.badge(c.status === 'Healthy' ? '#e3fcef' : '#fef0c7', c.status === 'Healthy' ? '#12b76a' : '#f79009')}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInventoryReports;
