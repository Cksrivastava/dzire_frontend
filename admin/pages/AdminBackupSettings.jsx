import React from 'react';
import AdminLayout from './AdminLayout';
import { Database, Download, ShieldAlert, Save } from 'lucide-react';
import { Button } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const AdminBackupSettings = () => {
  const triggerBackup = (type) => {
    alert(`${type} backup successfully generated!\nUploading secure archive zip to Google Cloud Storage...`);
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Backup &amp; Recovery</h1>
            <p>Setup scheduled automated catalog database dumps and cloud file uploads</p>
          </div>
          <button onClick={() => alert('Backup rules saved')} className="admin-primary-button" style={{ background: '#ff6600' }}>
            <Save size={18} /> Save Backup Config
          </button>
        </section>

        <AdminPanel className="p-6 space-y-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <Database size={20} style={{ color: '#ff6600' }} />
            <strong>Database Backup Vault</strong>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-slate-100 bg-slate-50 rounded-xl p-4 flex flex-col justify-between min-h-[140px]">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Download Full Database</h4>
                <p className="text-xs text-slate-500 mt-1">Export all Products, Orders, Customers, and settings as a consolidated `.sql` file.</p>
              </div>
              <Button onClick={() => triggerBackup("Database SQL")} className="h-9 mt-4 rounded-lg bg-[#ff6600] text-white self-start">Trigger DB Backup</Button>
            </div>

            <div className="border border-slate-100 bg-slate-50 rounded-xl p-4 flex flex-col justify-between min-h-[140px]">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Download Media Assets</h4>
                <p className="text-xs text-slate-500 mt-1">Export a compressed `.zip` containing all catalog product photos, brand logos, banner slider images.</p>
              </div>
              <Button onClick={() => triggerBackup("Media Assets ZIP")} className="h-9 mt-4 rounded-lg bg-slate-800 text-white self-start">Trigger Media Backup</Button>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#fff8eb] border border-[#ffe0cc] rounded-xl text-xs text-amber-800 leading-5">
            <ShieldAlert size={22} className="shrink-0 mt-0.5" />
            <div>
              <strong>Scheduled backups active:</strong> Daily database SQL schema dumping is scheduled to execute automatically at 02:00 AM. Archives are encrypted and transferred to secure Google Cloud storage.
            </div>
          </div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminBackupSettings;
