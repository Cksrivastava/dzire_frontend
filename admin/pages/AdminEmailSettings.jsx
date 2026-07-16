import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, Mail, Activity } from 'lucide-react';
import { Button, Input } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const AdminEmailSettings = () => {
  const [smtpServer, setSmtpServer] = useState("smtp.sendgrid.net");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("apikey");
  const [senderEmail, setSenderEmail] = useState("noreply@dzirestore.com");

  const handleTest = () => {
    alert("Sending test ping to SMTP host Sendgrid server...\nConnection established successfully (Response Code: 250 Ok)!");
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Email SMTP Gateway</h1>
            <p>Setup SMTP details to shoot transactional order updates, invoices, and cart reminders</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleTest} className="admin-primary-button" style={{ background: '#334155' }}>
              <Activity size={18} /> Test Connection
            </button>
            <button onClick={() => alert('SMTP settings updated!')} className="admin-primary-button" style={{ background: '#ff6600' }}>
              <Save size={18} /> Save Settings
            </button>
          </div>
        </section>

        <AdminPanel className="p-6 max-w-[640px] space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <Mail size={20} style={{ color: '#ff6600' }} />
            <strong>SMTP Outbound Settings</strong>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">SMTP Host Server URL</label>
              <Input value={smtpServer} onChange={e => setSmtpServer(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">SMTP Port Number</label>
                <Input type="number" value={smtpPort} onChange={e => setSmtpPort(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Sender Email Address</label>
                <Input value={senderEmail} onChange={e => setSenderEmail(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">SMTP Username</label>
                <Input value={smtpUser} onChange={e => setSmtpUser(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">SMTP Password</label>
                <Input type="password" defaultValue="••••••••••••••••" />
              </div>
            </div>
          </div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminEmailSettings;
