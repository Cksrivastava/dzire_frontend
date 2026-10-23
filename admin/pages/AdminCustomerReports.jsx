import React from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';

const AdminCustomerReports = () => {
  const customerReportData = [
    ['New Customers (This Month)', '240 users', '68% of new registrations', '₹4,80,000'],
    ['Returning Customers', '115 users', '32% of active shoppers', '₹7,65,000'],
    ['Total Registered Base', '3,450 users', '100%', '₹12,45,000']
  ];

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Customer Reports</h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ExportDropdown
                fileName="Customer_Demographics_Report"
                title="Customer Demographics & Retention Analytics"
                headers={['Customer Segment', 'User Count', 'Percentage', 'Revenue Contribution']}
                rows={customerReportData}
              />
            </div>
          </div>
          <div style={{ padding: '24px', background: '#fafafa' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              [ Chart Placeholder: New vs Returning Customers Pie Chart ]
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomerReports;
