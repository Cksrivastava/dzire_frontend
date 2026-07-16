import React from 'react';
import AdminLayout from './AdminLayout';
import { Download, ShoppingBag, Eye, TrendingUp } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const AdminProductReports = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Product Reports</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Analyze best sellers, slow movers, and PDP conversion metrics</p>
          </div>
          <button onClick={() => alert('Product Report Exported')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Best Performing Category</p>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#111', fontWeight: '700' }}>Bags &amp; Backpacks</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#12b76a' }}>48% of total catalog sales</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Highest Conversion SKU</p>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#ff6600', fontWeight: '700' }}>BAG-PREM-ORG</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>4.2% checkout conversion rate</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Dead Stock Value</p>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#f04438', fontWeight: '700' }}>₹84,000</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>No sales since 90+ days</p>
          </div>
        </div>

        <div style={S.panel}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <strong>Top Selling Products (This Month)</strong>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Product details</th>
                <th style={S.th}>SKU Code</th>
                <th style={S.th}>Units Sold</th>
                <th style={S.th}>Total Revenue Generated</th>
                <th style={S.th}>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Premium Backpack (Orange)', sku: 'BAG-PREM-ORG', qty: 245, rev: '₹6,12,255', status: 'In Stock' },
                { name: 'Trekking Shoes', sku: 'SHOE-TRK-001', qty: 120, rev: '₹3,95,880', status: 'Low Stock' },
                { name: 'Water Bottle 1L', sku: 'BOT-1L-003', qty: 85, rev: '₹38,250', status: 'In Stock' }
              ].map((p, i) => (
                <tr key={i}>
                  <td style={S.td}><strong>{p.name}</strong></td>
                  <td style={{ ...S.td, fontFamily: 'monospace' }}>{p.sku}</td>
                  <td style={S.td}>{p.qty} units</td>
                  <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{p.rev}</td>
                  <td style={S.td}>
                    <span style={S.badge(p.status === 'In Stock' ? '#e3fcef' : '#fef0c7', p.status === 'In Stock' ? '#12b76a' : '#f79009')}>{p.status}</span>
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

export default AdminProductReports;
