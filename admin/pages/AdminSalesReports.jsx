import React from 'react';
import AdminLayout from './AdminLayout';
import { Download, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const AdminSalesReports = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Sales Reports</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Analyze channel sales performance and growth trends</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} /> This Month
            </button>
            <button onClick={() => alert('Report Exported!')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Total Revenue</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#111', fontWeight: '700' }}>₹12,45,000</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#12b76a', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={14} /> +15.2% vs last month
            </p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Online Sales Revenue</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#ff6600', fontWeight: '700' }}>₹8,20,000</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>66% of total revenue</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>POS (Offline) Sales</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#175cd3', fontWeight: '700' }}>₹4,25,000</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>34% of total revenue</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Sales Over Time Breakdown</strong>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={S.th}>Date Segment</th>
                  <th style={S.th}>Orders count</th>
                  <th style={S.th}>Average Order value</th>
                  <th style={S.th}>Total Gross Sales</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '01 Jul – 07 Jul', count: 142, aov: '₹2,499', gross: '₹3,54,858' },
                  { date: '24 Jun – 30 Jun', count: 184, aov: '₹2,100', gross: '₹3,86,400' },
                  { date: '17 Jun – 23 Jun', count: 215, aov: '₹2,320', gross: '₹4,98,800' }
                ].map((s, i) => (
                  <tr key={i}>
                    <td style={S.td}><strong>{s.date}</strong></td>
                    <td style={S.td}>{s.count} orders</td>
                    <td style={S.td}>{s.aov}</td>
                    <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{s.gross}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={S.card}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Sales Share by Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { cat: 'Bags & Packs', pct: '48%', rev: '₹5,97,600', bar: '48%' },
                { cat: 'Trekking Footwear', pct: '32%', rev: '₹3,98,400', bar: '32%' },
                { cat: 'Camping Accessories', pct: '20%', rev: '₹2,49,000', bar: '20%' }
              ].map((c, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>{c.cat}</span>
                    <strong>{c.rev} ({c.pct})</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: c.bar, height: '100%', background: '#ff6600', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSalesReports;
