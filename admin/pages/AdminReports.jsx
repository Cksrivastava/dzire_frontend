import React from 'react';
import AdminLayout from './AdminLayout';
import { BarChart3, LineChart, PieChart, TrendingUp, Users, Package, ShoppingCart, RefreshCcw } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import ExportDropdown from '../components/ExportDropdown';

const AdminReports = () => {
  const reports = [
    { title: 'GST Reports', path: '/admin/reports/gst', icon: BarChart3, desc: 'GST filing data', color: '#10b981' },
    { title: 'Profitability', path: '/admin/reports/profit', icon: TrendingUp, desc: 'Channel-wise margins', color: '#f04438' },
    { title: 'Inventory Reports', path: '/admin/reports/inventory', icon: Package, desc: 'Stock movement and snapshots', color: '#12b76a' },
    { title: 'Vendor Reports', path: '/admin/reports/vendors', icon: BarChart3, desc: 'Vendor performance and RTVs', color: '#6941c6' },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>All Reports</h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ExportDropdown
                fileName="Business_Reports_Summary"
                title="Dzire All Business & Intelligence Reports Directory"
                headers={['Report Name', 'Report Category', 'Description', 'Direct URL Path']}
                rows={reports.map((r) => [
                  r.title,
                  'Analytics',
                  r.desc,
                  r.path
                ])}
              />
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCcw size={16} /> Refresh Data
              </button>
            </div>
          </div>
          <div style={{ padding: '24px', background: '#fafafa' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {reports.map((report, idx) => (
                <NavLink key={idx} to={report.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', transition: 'all 0.2s', cursor: 'pointer', height: '100%' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = report.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${report.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: report.color }}>
                      <report.icon size={24} />
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#111' }}>{report.title}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#667085' }}>{report.desc}</p>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
