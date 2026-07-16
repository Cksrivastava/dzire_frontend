import React from 'react';
import AdminLayout from './AdminLayout';
import { Download, Landmark, PieChart, ShieldCheck } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminFinancialReports = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Financial Reports</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Tax liability, platform fees, operational payouts, and financial logs</p>
          </div>
          <button onClick={() => alert('Financial Report Exported')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export Financial CSV
          </button>
        </div>

        {/* Financial metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#175cd3', marginBottom: '8px' }}>
              <Landmark size={20} />
              <span style={{ fontSize: '14px', color: '#667085', fontWeight: '500' }}>GST Collected (18% Avg)</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#111', fontWeight: '700' }}>₹2,24,100</h2>
            <span style={{ fontSize: '12px', color: '#667085' }}>Total tax collected this quarter</span>
          </div>

          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#059669', marginBottom: '8px' }}>
              <PieChart size={20} />
              <span style={{ fontSize: '14px', color: '#667085', fontWeight: '500' }}>Gateway Fees & Commission</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#059669', fontWeight: '700' }}>₹37,350</h2>
            <span style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>Avg. 3% platform charge rate</span>
          </div>

          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d97706', marginBottom: '8px' }}>
              <ShieldCheck size={20} />
              <span style={{ fontSize: '14px', color: '#667085', fontWeight: '500' }}>Net Disbursed Revenue</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#d97706', fontWeight: '700' }}>₹9,83,550</h2>
            <span style={{ fontSize: '12px', color: '#667085' }}>Deposited into settlement accounts</span>
          </div>
        </div>

        {/* Ledgers table */}
        <div style={S.panel}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <strong>Quarterly Tax Breakdown by Category</strong>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Category Segment</th>
                <th style={S.th}>Taxable Turnover</th>
                <th style={S.th}>CGST Rate</th>
                <th style={S.th}>SGST Rate</th>
                <th style={S.th}>Total Tax Component</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Bags & Accessories', base: '₹5,06,440', cgst: '9%', sgst: '9%', total: '₹91,160' },
                { cat: 'Outdoor & Hiking Shoes', base: '₹3,37,630', cgst: '9%', sgst: '9%', total: '₹60,770' },
                { cat: 'Tents & Camping Gear', base: '₹2,11,010', cgst: '9%', sgst: '9%', total: '₹37,980' }
              ].map((row, i) => (
                <tr key={i}>
                  <td style={S.td}><strong>{row.cat}</strong></td>
                  <td style={S.td}>{row.base}</td>
                  <td style={S.td}>{row.cgst}</td>
                  <td style={S.td}>{row.sgst}</td>
                  <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFinancialReports;
