import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Globe, Shield, RefreshCw } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminIpLogs = () => {
  const [ips] = useState([
    { id: 1, time: '09 Jul 12:45 PM', ip: '192.168.1.14', location: 'Bangalore, India', action: 'GST Settings Edit' },
    { id: 2, time: '09 Jul 11:20 AM', ip: '106.51.24.11', location: 'Mumbai, India', action: 'Stock Level Modification' },
    { id: 3, time: '08 Jul 16:30 PM', ip: '185.220.101.4', location: 'Tor Exit Node, Unknown', action: 'Failed Auth Attempt' }
  ]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>IP Tracking &amp; Geolocation Logs</h1>
            <p>Track request IP addresses, geolocations, and highlight high-risk proxy requests</p>
          </div>
        </section>

        <AdminPanel className="p-0 overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Timestamp</th>
                <th style={S.th}>IP Address</th>
                <th style={S.th}>Detected Geolocation</th>
                <th style={S.th}>Request Access Scope</th>
              </tr>
            </thead>
            <tbody>
              {ips.map(item => (
                <tr key={item.id}>
                  <td style={S.td}>{item.time}</td>
                  <td style={{ ...S.td, fontFamily: 'monospace', fontWeight: '600' }}>{item.ip}</td>
                  <td style={S.td}>{item.location}</td>
                  <td style={S.td}>{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminIpLogs;
