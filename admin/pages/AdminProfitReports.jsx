import React from 'react';
import AdminLayout from './AdminLayout';
import { Download, TrendingUp, DollarSign } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const AdminProfitReports = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Profitability Reports</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Analyze channel gross profits, markup rates, and catalog margins</p>
          </div>
          <button onClick={() => alert('Profitability Report Exported')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Gross Margin (Month)</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#10b981', fontWeight: '700' }}>44.5%</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>Target benchmark: 40%</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Total Net Profit</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#ff6600', fontWeight: '700' }}>₹5,54,000</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>Revenue minus cost of goods sold</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Cost of Goods Sold (COGS)</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#175cd3', fontWeight: '700' }}>₹6,91,000</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>Raw material procurement cost</p>
          </div>
        </div>

        <div style={S.panel}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <strong>Profitability Margins by Category</strong>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Category Segment</th>
                <th style={S.th}>Revenue Generated</th>
                <th style={S.th}>Cost of Goods (COGS)</th>
                <th style={S.th}>Gross Profit Value</th>
                <th style={S.th}>Gross Margin (%)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Bags & Packs', rev: '₹5,97,600', cogs: '₹2,86,848', gp: '₹3,10,752', margin: '52%' },
                { cat: 'Trekking Footwear', rev: '₹3,98,400', cogs: '₹2,35,056', gp: '₹1,63,344', margin: '41%' },
                { cat: 'Camping Gear', rev: '₹2,49,000', cogs: '₹1,40,685', gp: '₹1,08,315', margin: '43.5%' }
              ].map((c, i) => (
                <tr key={i}>
                  <td style={S.td}><strong>{c.cat}</strong></td>
                  <td style={S.td}>{c.rev}</td>
                  <td style={S.td}>{c.cogs}</td>
                  <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{c.gp}</td>
                  <td style={S.td}>
                    <span style={S.badge('#e3fcef', '#12b76a')}>{c.margin}</span>
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

export default AdminProfitReports;
