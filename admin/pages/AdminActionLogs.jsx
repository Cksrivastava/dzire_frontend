import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Terminal, ShieldAlert, Save } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminActionLogs = () => {
  const [actions] = useState([
    { id: 1, time: '09 Jul 12:45 PM', user: 'Admin User', scope: 'Database', details: 'Full SQL database backup generated' },
    { id: 2, time: '09 Jul 11:20 AM', user: 'Super Admin', scope: 'Permissions', details: 'Assigned Inventory Manager role to Priya Patel' },
    { id: 3, time: '08 Jul 16:30 PM', user: 'Marketing Mgr', scope: 'System Settings', details: 'Enabled winter promotional banner visibility storefront' }
  ]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Security Action Logs</h1>
            <p>Audits of database exports settings rewrites role adjustments and administrative overrides</p>
          </div>
        </section>

        <AdminPanel className="p-0 overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Timestamp</th>
                <th style={S.th}>Executor</th>
                <th style={S.th}>Target Scope</th>
                <th style={S.th}>Action Details</th>
              </tr>
            </thead>
            <tbody>
              {actions.map(a => (
                <tr key={a.id}>
                  <td style={S.td}>{a.time}</td>
                  <td style={S.td}><strong>{a.user}</strong></td>
                  <td style={S.td}><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', background: '#fef0c7', color: '#b54708', fontWeight: '600' }}>{a.scope}</span></td>
                  <td style={S.td}>{a.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminActionLogs;
