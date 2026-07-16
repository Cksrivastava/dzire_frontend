import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { History, Search, RefreshCw, User } from 'lucide-react';
import { Input } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const S = {
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminUserActivityLogs = () => {
  const [logs] = useState([
    { id: 1, time: '09 Jul 12:45 PM', user: 'Admin User', role: 'Super Admin', task: 'Updated price of Verge 45L Backpack' },
    { id: 2, time: '09 Jul 11:20 AM', user: 'Inventory Mgr', role: 'Inventory Manager', task: 'Added stock count to Verge 45L (+10)' },
    { id: 3, time: '09 Jul 09:15 AM', user: 'Cashier POS', role: 'POS Cashier', task: 'Initiated POS refund for Bill #8812' }
  ]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>User Activity Logs</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Audits of admin and manager activity log timestamps across settings, inventory, and accounts</p>
          </div>
          <button onClick={() => alert('Logs Synced')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500' }}>
            <RefreshCw size={16} /> Sync Logs
          </button>
        </div>

        <AdminPanel className="p-0 overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Timestamp</th>
                <th style={S.th}>User Email</th>
                <th style={S.th}>Role Group</th>
                <th style={S.th}>Activity Performed</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id}>
                  <td style={S.td}>{l.time}</td>
                  <td style={S.td}><strong>{l.user}</strong></td>
                  <td style={S.td}><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', background: '#eff8ff', color: '#175cd3', fontWeight: '600' }}>{l.role}</span></td>
                  <td style={S.td}>{l.task}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminUserActivityLogs;
