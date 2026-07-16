import React from 'react';
import AdminLayout from './AdminLayout';
import { Download, Truck, Calendar } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const AdminVendorReports = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Vendor Reports</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Analyze vendor lead times, PO conversion rates, and defect ratios</p>
          </div>
          <button onClick={() => alert('Vendor Report Exported')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Active B2B Vendors</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#111', fontWeight: '700' }}>3 Suppliers</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>Regular PO fulfillment agreements</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>On-Time Delivery Rate</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#12b76a', fontWeight: '700' }}>92.4%</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>Fulfillment within scheduled PO date</p>
          </div>
          <div style={S.card}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Avg Supplier Lead Time</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#ff6600', fontWeight: '700' }}>4.8 Days</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>Order creation to GRN receipt</p>
          </div>
        </div>

        <div style={S.panel}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <strong>Vendor Fulfillment Performance metrics</strong>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Supplier Name</th>
                <th style={S.th}>Fulfillment Rate</th>
                <th style={S.th}>Overall Score</th>
                <th style={S.th}>Defect Ratio</th>
                <th style={S.th}>Monthly Outflow</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Wildcraft India Pvt Ltd', fill: '96.4%', score: '94%', defect: '0.4%', outflow: '₹1,25,000' },
                { name: 'Decathlon Sports India', fill: '89.2%', score: '88%', defect: '1.2%', outflow: '₹3,40,000' },
                { name: 'Coleman Gear', fill: '82.5%', score: '82%', defect: '2.1%', outflow: '₹45,500' }
              ].map((v, i) => (
                <tr key={i}>
                  <td style={S.td}><strong>{v.name}</strong></td>
                  <td style={S.td}>{v.fill}</td>
                  <td style={S.td}><span style={S.badge('#e3fcef', '#12b76a')}>{v.score}</span></td>
                  <td style={{ ...S.td, color: parseFloat(v.defect) > 1.5 ? '#f04438' : '#12b76a', fontWeight: '600' }}>{v.defect}</td>
                  <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{v.outflow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVendorReports;
