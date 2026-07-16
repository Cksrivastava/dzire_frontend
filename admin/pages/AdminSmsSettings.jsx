import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, MessageSquare, PhoneCall } from 'lucide-react';
import { Button, Input } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const AdminSmsSettings = () => {
  const [twilioSid, setTwilioSid] = useState("AC8902834091a1z5");
  const [whatsappSender, setWhatsappSender] = useState("+91 90000 00000");

  const handleSave = (e) => {
    e.preventDefault();
    alert("SMS & WhatsApp Gateway settings updated successfully!");
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>SMS &amp; WhatsApp Settings</h1>
            <p>Configure automated WhatsApp receipt updates, customer dispatch alerts, and OTP phone integrations</p>
          </div>
          <button onClick={handleSave} className="admin-primary-button" style={{ background: '#ff6600' }}>
            <Save size={18} /> Save Configurations
          </button>
        </section>

        <AdminPanel className="p-6 max-w-[640px] space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <MessageSquare size={20} style={{ color: '#ff6600' }} />
            <strong>WhatsApp &amp; Twilio API Credentials</strong>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Twilio Account SID</label>
              <Input value={twilioSid} onChange={e => setTwilioSid(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Twilio Auth Token</label>
                <Input type="password" defaultValue="••••••••••••••••" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">WhatsApp Verified Sender Number</label>
                <Input value={whatsappSender} onChange={e => setWhatsappSender(e.target.value)} />
              </div>
            </div>
          </div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminSmsSettings;
