import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, ShoppingBag } from 'lucide-react';

const productLogs = [
  { id: 1, timestamp: "2026-07-10 11:20:14", user: "Admin User", action: "Price Updated", target: "Traditional CTR OD4 Shoes", details: "Changed selling price from 1399 to 1499 Rs" },
  { id: 2, timestamp: "2026-07-09 14:10:02", user: "Content Editor", action: "Description Edited", target: "Verge 45L Backpack", details: "Corrected washing guidelines specs in product features copy" },
];

const AdminProductChanges = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag color="#ff6600" />
              Product Changes Log
            </h1>
            <p>Track catalog price changes, text edits, category moves and product visibility scheduling.</p>
          </div>
          <button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} /> Refresh Logs
          </button>
        </section>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Product Operations Log</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Timestamp</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>User</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Product Target</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Action Type</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>details</th>
                </tr>
              </thead>
              <tbody>
                {productLogs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{l.timestamp}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{l.user}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#ff6600' }}>{l.target}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#eff8ff', color: '#175cd3' }}>
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

export default AdminProductChanges;
