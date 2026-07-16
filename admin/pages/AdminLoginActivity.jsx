import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { History, Shield, Smartphone, Globe } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminLoginActivity = () => {
  const [sessions] = useState([
    { id: 1, time: '09 Jul 12:45 PM', user: 'admin@dzire.in', device: 'Chrome / Windows 11', ip: '106.51.24.11', state: 'Active' },
    { id: 2, time: '09 Jul 11:20 AM', user: 'inventory@dzire.in', device: 'Safari / iPhone 15', ip: '192.168.1.14', state: 'Expired' },
    { id: 3, time: '08 Jul 16:30 PM', user: 'cashier1@dzire.in', device: 'Edge / Windows 10', ip: '106.51.24.12', state: 'Expired' }
  ]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Session Login Activity</h1>
            <p>Monitor active administrator sessions and verify device platforms</p>
          </div>
        </section>

        <AdminPanel className="p-0 overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Access Time</th>
                <th style={S.th}>User Email</th>
                <th style={S.th}>Device Client</th>
                <th style={S.th}>IP Location Address</th>
                <th style={S.th}>Session State</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <td style={S.td}>{s.time}</td>
                  <td style={S.td}><strong>{s.user}</strong></td>
                  <td style={S.td}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Smartphone size={14} /> {s.device}</span></td>
                  <td style={{ ...S.td, fontFamily: 'monospace' }}>{s.ip}</td>
                  <td style={S.td}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                      background: s.state === 'Active' ? '#e3fcef' : '#f2f4f7',
                      color: s.state === 'Active' ? '#12b76a' : '#475569'
                    }}>{s.state}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminLoginActivity;
