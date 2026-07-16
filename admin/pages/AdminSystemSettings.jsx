import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, Settings } from 'lucide-react';
import { Button } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const AdminSystemSettings = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);

  const handleSave = (e) => {
    e.preventDefault();
    alert("System preference parameters successfully updated!");
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>System Settings</h1>
            <p>Toggle maintenance mode, configure session timeouts, and adjust server limits</p>
          </div>
          <button onClick={handleSave} className="admin-primary-button" style={{ background: '#ff6600' }}>
            <Save size={18} /> Save Settings
          </button>
        </section>

        <AdminPanel className="p-6 max-w-[640px] space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <Settings size={20} style={{ color: '#ff6600' }} />
            <strong>System Engine Preferences</strong>
          </div>
          <div className="grid gap-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#374151' }}>Storefront Maintenance Mode</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#667085' }}>Display a beautiful landing page to buyers during updates</p>
              </div>
              <input type="checkbox" checked={maintenance} onChange={e => setMaintenance(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Session Timeout Expiry (Minutes)</label>
              <input type="number" value={sessionTimeout} onChange={e => setSessionTimeout(Number(e.target.value))} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} />
            </div>
          </div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminSystemSettings;
