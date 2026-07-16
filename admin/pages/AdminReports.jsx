import React from 'react';
import AdminLayout from './AdminLayout';
import { BarChart3, LineChart, PieChart, TrendingUp, Users, Package, ShoppingCart, RefreshCcw, Award, Landmark, Download } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminReports = () => {
  const reports = [
    { title: 'Sales Reports', path: '/admin/reports/sales', icon: LineChart, desc: 'Daily, monthly, yearly sales trends', color: '#ff6600' },
    { title: 'Inventory Reports', path: '/admin/reports/inventory', icon: Package, desc: 'Stock movement and snapshots', color: '#12b76a' },
    { title: 'Product Reports', path: '/admin/reports/products', icon: ShoppingCart, desc: 'Best sellers and dead stock', color: '#f79009' },
    { title: 'Customer Reports', path: '/admin/reports/customers', icon: Users, desc: 'Repeat customers and retention', color: '#175cd3' },
    { title: 'Vendor Reports', path: '/admin/reports/vendors', icon: BarChart3, desc: 'Vendor performance and RTVs', color: '#6941c6' },
    { title: 'Profitability', path: '/admin/reports/profit', icon: TrendingUp, desc: 'Channel-wise margins', color: '#f04438' },
    { title: 'Loyalty Reports', path: '/admin/reports/loyalty', icon: Award, desc: 'Loyalty points and credits transactions', color: '#7c3aed' },
    { title: 'Financial Reports', path: '/admin/reports/financial', icon: Landmark, desc: 'GST liabilities, platform fees and settle logs', color: '#059669' },
    { title: 'Export Reports', path: '/admin/reports/export', icon: Download, desc: 'Export raw databases to CSV / Excel sheets', color: '#d97706' },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-container">
      <section className="admin-hero" style={{ marginBottom: '24px' }}>
        <div>
          <h1>Reports</h1>
          <p>Central hub for all business intelligence reports</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {reports.map((report, idx) => (
          <NavLink key={idx} to={report.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', transition: 'all 0.2s', cursor: 'pointer', height: '100%' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = report.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'}}>
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
    </AdminLayout>
  );
};

export default AdminReports;
