import React from 'react';
import AdminLayout from './AdminLayout';
import { Download, Award, Gift, RefreshCw, Users } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminLoyaltyReports = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Loyalty & Credits Reports</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Monitor customer loyalty points, credits issued, and points redemptions</p>
          </div>
          <button onClick={() => alert('Loyalty Report Exported')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7c3aed', marginBottom: '8px' }}>
              <Award size={20} />
              <span style={{ fontSize: '14px', color: '#667085', fontWeight: '500' }}>Total Issued Credits</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#111', fontWeight: '700' }}>₹8,45,000</h2>
            <span style={{ fontSize: '12px', color: '#667085' }}>Points value credited to users</span>
          </div>
          
          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#12b76a', marginBottom: '8px' }}>
              <Gift size={20} />
              <span style={{ fontSize: '14px', color: '#667085', fontWeight: '500' }}>Redeemed Credits</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#12b76a', fontWeight: '700' }}>₹5,12,000</h2>
            <span style={{ fontSize: '12px', color: '#12b76a', fontWeight: '600' }}>60.5% Redemption Rate</span>
          </div>

          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0284c7', marginBottom: '8px' }}>
              <Users size={20} />
              <span style={{ fontSize: '14px', color: '#667085', fontWeight: '500' }}>Active Loyalty Members</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#0284c7', fontWeight: '700' }}>4,890</h2>
            <span style={{ fontSize: '12px', color: '#667085' }}>Enrolled customers in database</span>
          </div>
        </div>

        {/* Loyalty Activity */}
        <div style={S.panel}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Recent Loyalty Transactions Summary</strong>
            <button style={{ background: 'none', border: 'none', color: '#667085', cursor: 'pointer' }}><RefreshCw size={16} /></button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Customer Name</th>
                <th style={S.th}>Email Address</th>
                <th style={S.th}>Points Event</th>
                <th style={S.th}>Transaction Value</th>
                <th style={S.th}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Rahul Verma', email: 'rahul@example.com', event: 'Order #DZ-1002 Purchase Reward', val: '+120 pts', color: '#12b76a' },
                { name: 'Priya Sharma', email: 'priya@example.com', event: 'Order #DZ-1003 Points Redeemed', val: '-500 pts', color: '#dc2626' },
                { name: 'Aarav Mehta', email: 'aarav@example.com', event: 'Sign-up Welcome Bonus', val: '+500 pts', color: '#12b76a' }
              ].map((row, i) => (
                <tr key={i}>
                  <td style={S.td}><strong>{row.name}</strong></td>
                  <td style={S.td}>{row.email}</td>
                  <td style={S.td}>{row.event}</td>
                  <td style={{ ...S.td, fontWeight: '700', color: row.color }}>{row.val}</td>
                  <td style={S.td}>{new Date().toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLoyaltyReports;
