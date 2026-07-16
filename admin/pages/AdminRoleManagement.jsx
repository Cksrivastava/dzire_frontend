import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, Plus, Shield, Trash } from 'lucide-react';
import { Input, Button } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const AdminRoleManagement = () => {
  const [customRoles, setCustomRoles] = useState([
    { id: 1, name: "Inventory Auditor", type: "Catalog & Stock", users: 1 },
    { id: 2, name: "Marketing Coordinator", type: "Coupons & Banners", users: 2 }
  ]);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleType, setNewRoleType] = useState("Operations");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newRoleName) return;
    setCustomRoles([
      ...customRoles,
      { id: Date.now(), name: newRoleName, type: newRoleType, users: 0 }
    ]);
    setNewRoleName("");
  };

  const handleDelete = (id) => {
    setCustomRoles(customRoles.filter(r => r.id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Role &amp; Group Provisioning</h1>
            <p>Define custom roles, authorization levels and assign user scopes</p>
          </div>
        </section>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <AdminPanel className="p-6 max-w-[400px] h-fit flex-1" style={{ minWidth: '300px' }}>
            <form onSubmit={handleAdd} className="space-y-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                <Plus size={18} style={{ color: '#ff6600' }} />
                <strong>Define New Group</strong>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Group Role Name</label>
                <Input value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="e.g. Content Publisher" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Functional Category</label>
                <select value={newRoleType} onChange={e => setNewRoleType(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}>
                  <option>Operations</option>
                  <option>Content &amp; Marketing</option>
                  <option>Logistics</option>
                  <option>Financials</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-[#ff6600] text-white rounded-xl h-10 font-bold">Create Group Role</Button>
            </form>
          </AdminPanel>

          <AdminPanel className="p-6 flex-[2]" style={{ minWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <Shield size={20} style={{ color: '#ff6600' }} />
              <strong>Custom Organizational Roles</strong>
            </div>

            <div className="space-y-3">
              {customRoles.map(role => (
                <div key={role.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>{role.name}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>Type: {role.type} • {role.users} active members</p>
                  </div>
                  <button onClick={() => handleDelete(role.id)} style={{ background: 'none', border: 'none', color: '#f04438', cursor: 'pointer' }}>
                    <Trash size={18} />
                  </button>
                </div>
              ))}
              {customRoles.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No custom roles defined yet.</p>}
            </div>
          </AdminPanel>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRoleManagement;
