import React from 'react';
import AdminLayout from './AdminLayout';
import { BarChart3, TrendingUp, Users, Package, ShoppingCart, RefreshCcw, DollarSign, FileSpreadsheet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import ExportDropdown from '../components/ExportDropdown';

const AdminReports = () => {
  const reports = [
    {
      title: 'Sales Reports',
      path: '/admin/reports/sales',
      icon: TrendingUp,
      desc: 'Online store vs POS revenue, AOV, and transactional velocity.',
      color: '#ff6600'
    },
    {
      title: 'GST Reports',
      path: '/admin/reports/gst',
      icon: BarChart3,
      desc: 'Turnover, output tax liabilities, and ITC claim reconciliations.',
      color: '#10b981'
    },
    {
      title: 'Product Reports',
      path: '/admin/reports/products',
      icon: Package,
      desc: 'SKU sales volume, stock turnover, margins, and catalog return rates.',
      color: '#8b5cf6'
    },
    {
      title: 'Profitability Reports',
      path: '/admin/reports/profit',
      icon: DollarSign,
      desc: 'Channel gross profit, COGS analysis, and net operating margins.',
      color: '#f04438'
    },
    {
      title: 'Purchase Reports',
      path: '/admin/reports/purchase',
      icon: ShoppingCart,
      desc: 'Vendor procurement expenditures, outstanding bills, and input tax.',
      color: '#2563eb'
    },
    {
      title: 'Customer Reports',
      path: '/admin/reports/customers',
      icon: Users,
      desc: 'Customer segments, repeat shopper frequency, retention, and LTV.',
      color: '#0ea5e9'
    },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #eef2f6', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>All Reports & Analytics</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Select a report category below to view in-depth metrics and export spreadsheets</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ExportDropdown
                fileName="Business_Reports_Directory"
                title="Dzire All Business Intelligence & Financial Reports Directory"
                headers={['Report Name', 'Module', 'Description', 'Direct URL Path']}
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
                style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCcw size={16} /> Refresh
              </button>
            </div>
          </div>

          <div style={{ padding: '24px', background: '#fafafa' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {reports.map((report, idx) => (
                <NavLink key={idx} to={report.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      padding: '24px',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = report.color;
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div>
                      <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: `${report.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: report.color }}>
                        <report.icon size={24} />
                      </div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>{report.title}</h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{report.desc}</p>
                    </div>

                    <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: report.color }}>
                      <span>View Detailed Report</span>
                      <span>→</span>
                    </div>
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
