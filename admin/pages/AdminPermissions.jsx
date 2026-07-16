import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { ShieldCheck, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminPermissions = () => {
  const [matrix, setMatrix] = useState([
    { module: "Dashboard & Insights", superAdmin: true, storeManager: true, accountant: true, cashier: false },
    { module: "Product Catalog Edit", superAdmin: true, storeManager: true, accountant: false, cashier: false },
    { module: "Inventory Stock Audit", superAdmin: true, storeManager: true, accountant: false, cashier: false },
    { module: "Settings & API Keys", superAdmin: true, storeManager: false, accountant: false, cashier: false },
    { module: "POS Offline Billing", superAdmin: true, storeManager: true, accountant: false, cashier: true },
    { module: "Financial Invoices Logs", superAdmin: true, storeManager: true, accountant: true, cashier: false },
  ]);

  const toggle = (index, role) => {
    const updated = [...matrix];
    updated[index][role] = !updated[index][role];
    setMatrix(updated);
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Global Access Matrix</h1>
            <p>Customize granular module permission maps for different administrator classes</p>
          </div>
          <button onClick={() => alert('Permissions matrix successfully saved!')} className="admin-primary-button" style={{ background: '#ff6600' }}>
            <Save size={18} /> Save Grid Matrix
          </button>
        </section>

        <AdminPanel className="p-0 overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Access Module</th>
                <th style={S.th}>Super Admin</th>
                <th style={S.th}>Store Manager</th>
                <th style={S.th}>Accountant</th>
                <th style={S.th}>Cashier POS</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, idx) => (
                <tr key={row.module}>
                  <td style={S.td}><strong>{row.module}</strong></td>
                  <td style={S.td}>
                    <button type="button" onClick={() => toggle(idx, "superAdmin")} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {row.superAdmin ? <ToggleRight size={30} style={{ color: '#12b76a' }} /> : <ToggleLeft size={30} style={{ color: '#667085' }} />}
                    </button>
                  </td>
                  <td style={S.td}>
                    <button type="button" onClick={() => toggle(idx, "storeManager")} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {row.storeManager ? <ToggleRight size={30} style={{ color: '#12b76a' }} /> : <ToggleLeft size={30} style={{ color: '#667085' }} />}
                    </button>
                  </td>
                  <td style={S.td}>
                    <button type="button" onClick={() => toggle(idx, "accountant")} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {row.accountant ? <ToggleRight size={30} style={{ color: '#12b76a' }} /> : <ToggleLeft size={30} style={{ color: '#667085' }} />}
                    </button>
                  </td>
                  <td style={S.td}>
                    <button type="button" onClick={() => toggle(idx, "cashier")} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {row.cashier ? <ToggleRight size={30} style={{ color: '#12b76a' }} /> : <ToggleLeft size={30} style={{ color: '#667085' }} />}
                    </button>
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

export default AdminPermissions;
