import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, Building } from 'lucide-react';
import { Button, Input, Textarea } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const AdminStoreSettings = () => {
  const [storeName, setStoreName] = useState("Dzire Store");
  const [storeEmail, setStoreEmail] = useState("support@dzirestore.com");
  const [storePhone, setStorePhone] = useState("+91 98765 43210");
  const [storeAddress, setStoreAddress] = useState("123, MG Road, Outer Ring Road, Bangalore - 560001");

  const handleSave = (e) => {
    e.preventDefault();
    alert("Store Profile Settings successfully updated!");
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Store Profile Settings</h1>
            <p>Configure storefront metadata, contact phone, support email, and primary warehouse address</p>
          </div>
          <button onClick={handleSave} className="admin-primary-button" style={{ background: '#ff6600' }}>
            <Save size={18} /> Save Settings
          </button>
        </section>

        <AdminPanel className="p-6 max-w-[640px] space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <Building size={20} style={{ color: '#ff6600' }} />
            <strong>Store Configuration Profile</strong>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Company / Store Name</label>
              <Input value={storeName} onChange={e => setStoreName(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Support Contact Email</label>
                <Input value={storeEmail} onChange={e => setStoreEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Store Helpline Phone</label>
                <Input value={storePhone} onChange={e => setStorePhone(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Registered Billing Address</label>
              <Textarea value={storeAddress} onChange={e => setStoreAddress(e.target.value)} style={{ minHeight: '80px' }} />
            </div>
          </div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminStoreSettings;
