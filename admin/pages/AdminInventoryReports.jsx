import React from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';

const AdminInventoryReports = () => {
  const inventoryReportData = [
    ['Tripole Walker 55L Backpack', 'TRP-BLK-55L', 'Backpacks', '38', '₹4,200.00', '₹1,59,600', 'Adequate Stock'],
    ['Sierra Hiking Boot - Size 10', 'SB-8-10', 'Footwear', '78', '₹1,600.00', '₹1,24,800', 'High Stock'],
    ['Alpine Trekking Pole', 'ATP-CF-01', 'Accessories', '0', '₹1,100.00', '₹0', 'Out of Stock']
  ];

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Inventory Reports</h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ExportDropdown
                fileName="Inventory_Valuation_Report"
                title="Inventory Valuation & Stock Movement Report"
                headers={['Item Name', 'SKU', 'Category', 'Quantity on Hand', 'Unit Cost', 'Total Valuation', 'Stock Status']}
                rows={inventoryReportData}
              />
            </div>
          </div>
          <div style={{ padding: '24px', background: '#fafafa' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              [ Table Placeholder: Inventory Valuation & Movement ]
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInventoryReports;
