import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, Landmark } from 'lucide-react';

const otherLogs = [
  { id: 1, timestamp: "2026-07-10 17:34:11", user: "Admin User", action: "Credits Adjusted", target: "Customer 1092", details: "Manually awarded loyalty credits bonus of 50 points to account" },
  { id: 2, timestamp: "2026-07-09 16:22:45", user: "Marketing Mgr", action: "Coupon Created", target: "MONSOON500", details: "Configured promotional code with minimum spend 5000 Rs" },
];

const AdminOtherActivities = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark color="#ff6600" />
              Other Activities Log
            </h1>
            <p>Track marketing coupon adjustments, store settings modifications, manual credits, and general configurations.</p>
          </div>
          <button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} /> Refresh Logs
          </button>
        </section>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Miscellaneous System Audits</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Timestamp</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Manager / Actor</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Target Module</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Action Type</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>details</th>
                </tr>
              </thead>
              <tbody>
                {otherLogs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{l.timestamp}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{l.user}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600' }}>{l.target}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#fffbeb', color: '#b45309' }}>
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

export default AdminOtherActivities;
