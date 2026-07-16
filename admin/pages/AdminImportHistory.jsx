import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { FileSpreadsheet, Download, RefreshCcw } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminImportHistory = () => {
  const [history] = useState([
    { id: 1, date: '09 Jul 12:45 PM', fileName: 'products-update-v2.csv', user: 'Admin User', records: 120, status: 'Success' },
    { id: 2, date: '08 Jul 11:20 AM', fileName: 'inventory-mumbai.xlsx', user: 'Inventory Mgr', records: 80, status: 'Success' },
    { id: 3, date: '07 Jul 16:30 PM', fileName: 'customers-welcome.csv', user: 'Super Admin', records: 450, status: 'Success' }
  ]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Import History logs</h1>
            <p>Review logs of recently parsed files records statistics and download skipped logs sheets</p>
          </div>
        </section>

        <AdminPanel className="p-0 overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Date &amp; Time</th>
                <th style={S.th}>Spreadsheet File</th>
                <th style={S.th}>Uploaded By</th>
                <th style={S.th}>Records count</th>
                <th style={S.th}>Import Status</th>
                <th style={S.th}>Report</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id}>
                  <td style={S.td}>{item.date}</td>
                  <td style={S.td}><span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileSpreadsheet size={16} style={{ color: '#12b76a' }} /> {item.fileName}</span></td>
                  <td style={S.td}>{item.user}</td>
                  <td style={S.td}>{item.records} records</td>
                  <td style={S.td}><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', background: '#e3fcef', color: '#12b76a', fontWeight: '600' }}>{item.status}</span></td>
                  <td style={S.td}>
                    <button onClick={() => alert('Downloading log parsing report...')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff6600', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}>
                      <Download size={14} /> Download
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

export default AdminImportHistory;
