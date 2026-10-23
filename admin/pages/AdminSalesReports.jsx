import React from 'react';
import AdminLayout from './AdminLayout';
import { Calendar } from 'lucide-react';
import ExportDropdown from '../components/ExportDropdown';

const AdminSalesReports = () => {
  const salesSummaryData = [
    ['Total Sales (This Month)', '₹12,45,000', '+15% from last month'],
    ['Online Sales', '₹8,20,000', '66% of total'],
    ['Offline (POS) Sales', '₹4,25,000', '34% of total']
  ];

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Sales Reports</h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b' }}>
                <Calendar size={16} /> This Month
              </button>
              <ExportDropdown
                fileName="Sales_Report"
                title="Sales & Revenue Performance Report"
                headers={['Sales Metric', 'Revenue Amount', 'Contribution / Growth']}
                rows={salesSummaryData}
              />
            </div>
          </div>
          <div style={{ padding: '24px', background: '#fafafa' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Total Sales (Month)</p>
                <h2 style={{ margin: 0, fontSize: '28px', color: '#111' }}>₹12,45,000</h2>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#12b76a' }}>+15% from last month</p>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Online Sales</p>
                <h2 style={{ margin: 0, fontSize: '28px', color: '#ff6600' }}>₹8,20,000</h2>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>66% of total</p>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Offline (POS) Sales</p>
                <h2 style={{ margin: 0, fontSize: '28px', color: '#175cd3' }}>₹4,25,000</h2>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>34% of total</p>
              </div>
            </div>

            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              [ Chart Placeholder: Sales Trend Line Chart ]
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSalesReports;
