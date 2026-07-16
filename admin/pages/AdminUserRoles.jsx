import React from 'react';
import AdminLayout from './AdminLayout';
import { ShieldAlert, Users, ShieldCheck, Layers } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminUserRoles = () => {
  const roles = [
    { name: "Super Admin", level: "L1 (Root)", count: 2, desc: "Full root access overrides to settings catalog inventory and reports" },
    { name: "Store Manager", level: "L2 (Operations)", count: 4, desc: "Manage catalog brands stock audits refunds POS invoices and offline sales" },
    { name: "Accountant", level: "L3 (Finance)", count: 1, desc: "Access reports payments GST calculations and download invoice logs" },
    { name: "Cashier POS", level: "L4 (Sales Only)", count: 5, desc: "Access POS checkout screen offline billing cart and store refunds" }
  ];

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>User Roles &amp; Groups</h1>
            <p>Review system authorization tier hierarchies and user allocation metrics</p>
          </div>
        </section>

        <AdminPanel className="p-0 overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Authorization Role</th>
                <th style={S.th}>Access Tier</th>
                <th style={S.th}>Active Users</th>
                <th style={S.th}>Description &amp; Access Scope</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.name}>
                  <td style={S.td}><strong>{r.name}</strong></td>
                  <td style={S.td}><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', background: '#eff8ff', color: '#175cd3', fontWeight: '600' }}>{r.level}</span></td>
                  <td style={S.td}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} style={{ color: '#ff6600' }} /> {r.count} users</span></td>
                  <td style={S.td}>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminUserRoles;
