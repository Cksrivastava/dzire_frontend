import React from 'react';
import AdminLayout from './AdminLayout';
import { Download, Users, UserCheck, Heart } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const AdminCustomerReports = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Customer Reports</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Track customer segments, acquisition rates, and retention values</p>
          </div>
          <button onClick={() => alert('Customer Report Exported')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Active Customer Base</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#111', fontWeight: '700' }}>2,450 Users</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#12b76a' }}>+8.4% month-on-month signups</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Repeat Purchase Rate</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#ff6600', fontWeight: '700' }}>34.2%</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>Customers with 2+ completed orders</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Average Lifetime Value (LTV)</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#175cd3', fontWeight: '700' }}>₹8,450</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>Per registered active user</p>
          </div>
        </div>

        <div style={S.panel}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <strong>Top Customers by Value Contribution</strong>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Customer Name</th>
                <th style={S.th}>Email Address</th>
                <th style={S.th}>Order Count</th>
                <th style={S.th}>Total Spend Amount</th>
                <th style={S.th}>Segment</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Amit Sharma', email: 'amit.sharma@example.com', orders: 15, spend: '₹24,500', segment: 'VIP' },
                { name: 'Priya Sharma', email: 'priya.sharma@example.com', orders: 12, spend: '₹18,400', segment: 'VIP' },
                { name: 'Rohan Verma', email: 'rohan.verma@example.com', orders: 8, spend: '₹12,800', segment: 'Regular' }
              ].map((c, i) => (
                <tr key={i}>
                  <td style={S.td}><strong>{c.name}</strong></td>
                  <td style={S.td}>{c.email}</td>
                  <td style={S.td}>{c.orders} orders</td>
                  <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{c.spend}</td>
                  <td style={S.td}>
                    <span style={S.badge(c.segment === 'VIP' ? '#fef0c7' : '#eff8ff', c.segment === 'VIP' ? '#b54708' : '#175cd3')}>{c.segment}</span>
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

export default AdminCustomerReports;
