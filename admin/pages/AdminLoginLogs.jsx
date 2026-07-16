import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Shield, Search, Terminal } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const AdminLoginLogs = () => {
  const [logins] = useState([
    { id: 1, time: '09 Jul 12:45 PM', user: 'admin@dzire.in', status: 'Success', method: 'Token Validation' },
    { id: 2, time: '09 Jul 11:20 AM', user: 'inventory@dzire.in', status: 'Success', method: 'Password Verification' },
    { id: 3, time: '08 Jul 16:30 PM', user: 'hacker@malicious.com', status: 'Failed', method: 'Invalid Password' }
  ]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Session &amp; Login Logs</h1>
            <p>Track administrator login attempts, authentication methods, and block suspicious IPs</p>
          </div>
        </section>

        <AdminPanel className="p-0 overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Timestamp</th>
                <th style={S.th}>Username Email</th>
                <th style={S.th}>Auth Outcome</th>
                <th style={S.th}>Verification Method</th>
              </tr>
            </thead>
            <tbody>
              {logins.map(l => (
                <tr key={l.id}>
                  <td style={S.td}>{l.time}</td>
                  <td style={S.td}><strong>{l.user}</strong></td>
                  <td style={S.td}>
                    <span style={S.badge(l.status === 'Success' ? '#e3fcef' : '#fef3f2', l.status === 'Success' ? '#12b76a' : '#f04438')}>{l.status}</span>
                  </td>
                  <td style={S.td}>{l.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminLoginLogs;
