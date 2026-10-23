import React from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';

const AdminVendorReports = () => {
  const vendorReportData = [
    ['Tripole Gears', '98.5%', '0.4%', '4.8 / 5.0', 'Tier 1 Preferred'],
    ['Rocksport Supplies', '96.2%', '0.8%', '4.6 / 5.0', 'Active Supplier'],
    ['Outdoor Gear Co.', '91.0%', '1.5%', '4.1 / 5.0', 'Under Review']
  ];

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Vendor Reports</h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ExportDropdown
                fileName="Vendor_Performance_Report"
                title="Vendor Fulfillment & Quality Performance Report"
                headers={['Vendor Name', 'Fulfillment Rate', 'Defect / Return %', 'Quality Rating', 'Vendor Tier']}
                rows={vendorReportData}
              />
            </div>
          </div>
          <div style={{ padding: '24px', background: '#fafafa' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              [ Table Placeholder: Vendor Fulfillment Rate & Defect Percentage ]
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVendorReports;
