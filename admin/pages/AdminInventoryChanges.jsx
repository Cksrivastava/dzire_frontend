import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, Package } from 'lucide-react';

const inventoryLogs = [
  { id: 1, timestamp: "2026-07-10 10:45:00", user: "Inventory Mgr", action: "Stock Adjusted", sku: 'BAG-VRG-45L-OR', target: "Verge 45L Backpack", details: "Manually adjusted safety count (+5 units restocked)" },
  { id: 2, timestamp: "2026-07-09 11:45:50", user: "Vendor Tripole", action: "PO GRN Received", sku: 'KIT-STV-WP-AL', target: "Windproof Camp Stove", details: "Received PO-2026-012 with 50 units physical stock" },
];

const AdminInventoryChanges = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package color="#ff6600" />
              Inventory Changes Log
            </h1>
            <p>Track all physical stock adjustments, purchase order receptions (GRN), and out-of-stock events.</p>
          </div>
          <button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} /> Refresh Logs
          </button>
        </section>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Stock Modification Audit Log</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Timestamp</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>User / Actor</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>SKU Code</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Product Name</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Action</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>details</th>
                </tr>
              </thead>
              <tbody>
                {inventoryLogs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{l.timestamp}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{l.user}</td>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace' }}>{l.sku}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '500' }}>{l.target}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#f0fdf4', color: '#15803d' }}>
                        {l.action}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInventoryChanges;
