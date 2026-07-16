import React from 'react';
import AdminLayout from './AdminLayout';
import { BarChart2, RefreshCcw } from 'lucide-react';

const AdminReturnsAnalytics = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Return Analytics</h1>
            <p>Analyze returns metrics, patterns, reasons and intake trends.</p>
          </div>
          <button
            className="admin-primary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw size={18} />
            Refresh Data
          </button>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '12px', color: '#667085' }}>Average Return Rate</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#f04438' }}>2.8%</h3>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '12px', color: '#667085' }}>Top Return Reason</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#111' }}>Size/Fit Issues (64%)</h3>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '12px', color: '#667085' }}>Avg Resolution Time</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#12b76a' }}>1.2 Days</h3>
          </div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Weekly Return Analytics</h3>
          <div style={{ height: '200px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667085' }}>
            <BarChart2 style={{ marginRight: '8px', color: '#ff6600' }} /> Return Intake Trend Line
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReturnsAnalytics;
