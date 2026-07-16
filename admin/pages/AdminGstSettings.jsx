import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, Scale } from 'lucide-react';
import { Button, Input } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const AdminGstSettings = () => {
  const [gstNumber, setGstNumber] = useState("29ABCDE1234F1Z5");
  const [panNumber, setPanNumber] = useState("ABCDE1234F");
  const [defaultGstRate, setDefaultGstRate] = useState(18);

  const handleSave = (e) => {
    e.preventDefault();
    alert("Tax & GST Settings successfully updated!");
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>GST & Tax Settings</h1>
            <p>Configure tax identity parameters, automatic CGST/SGST invoice tax breaks and PAN records</p>
          </div>
          <button onClick={handleSave} className="admin-primary-button" style={{ background: '#ff6600' }}>
            <Save size={18} /> Save Settings
          </button>
        </section>

        <AdminPanel className="p-6 max-w-[640px] space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <Scale size={20} style={{ color: '#ff6600' }} />
            <strong>Tax & GSTIN Entity Setup</strong>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">GST Identification Number (GSTIN)</label>
              <Input value={gstNumber} onChange={e => setGstNumber(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Company PAN Registration Number</label>
              <Input value={panNumber} onChange={e => setPanNumber(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Default GST Rate (%)</label>
              <Input type="number" value={defaultGstRate} onChange={e => setDefaultGstRate(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Tax Calculation Type</label>
              <select style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}>
                <option>Inclusive of Price</option>
                <option>Exclusive of Price</option>
              </select>
            </div>
          </div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminGstSettings;
