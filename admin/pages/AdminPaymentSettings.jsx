import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, CreditCard } from 'lucide-react';
import { Button, Input } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const AdminPaymentSettings = () => {
  const [rzpKey, setRzpKey] = useState("rzp_live_892347kjasd");
  const [rzpSecret, setRzpSecret] = useState("••••••••••••••••••••••••");
  const [payMode, setPayMode] = useState("Live Mode");

  const handleSave = (e) => {
    e.preventDefault();
    alert("Razorpay API credentials updated successfully!");
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Payment Gateways</h1>
            <p>Configure Razorpay live keys, Webhooks secret tokens, and payment flow overrides</p>
          </div>
          <button onClick={handleSave} className="admin-primary-button" style={{ background: '#ff6600' }}>
            <Save size={18} /> Save Credentials
          </button>
        </section>

        <AdminPanel className="p-6 max-w-[640px] space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <CreditCard size={20} style={{ color: '#ff6600' }} />
            <strong>Razorpay Integration Setup</strong>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Razorpay Environment</label>
              <select value={payMode} onChange={e => setPayMode(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}>
                <option>Live Mode</option>
                <option>Test Mode (Sandbox)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Razorpay Live Key ID</label>
              <Input value={rzpKey} onChange={e => setRzpKey(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Razorpay Secret Password</label>
              <Input type="password" value={rzpSecret} onChange={e => setRzpSecret(e.target.value)} />
            </div>
          </div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentSettings;
