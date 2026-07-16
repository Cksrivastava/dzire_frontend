import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, UserCheck } from 'lucide-react';

const userLogs = [
  { id: 1, timestamp: "2026-07-10 11:20:14", actor: "Super Admin", targetUser: "Inventory Mgr", action: "Role Modified", details: "Upgraded permission tier levels to L2 operations audit" },
  { id: 2, timestamp: "2026-07-09 09:30:12", actor: "Super Admin", targetUser: "Accountant Pro", action: "Invite Sent", details: "Invited new accountant credentials to team platform" },
];

const AdminUserActivities = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck color="#ff6600" />
              User Activities &amp; Roles Audit
            </h1>
            <p>Track administrator roles alterations, employee invitations, global permission adjustments, and team activity logs.</p>
          </div>
          <button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} /> Refresh Logs
          </button>
        </section>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Admin Auth &amp; Invites Logs</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Timestamp</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Authorized Actor</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Recipient User</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Action Type</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>details</th>
                </tr>
              </thead>
              <tbody>
                {userLogs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{l.timestamp}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{l.actor}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#ff6600' }}>{l.targetUser}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#e0f2fe', color: '#0369a1' }}>
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

export default AdminUserActivities;
