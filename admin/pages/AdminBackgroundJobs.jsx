import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCw, Play, Pause, Square } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminBackgroundJobs = () => {
  const [jobs, setJobs] = useState([
    { id: 101, type: 'Product Import', progress: '100%', status: 'Completed', rows: '120 rows processed' },
    { id: 102, type: 'Zip Image Extraction', progress: '45%', status: 'Running', rows: '45/100 images extracted' },
    { id: 103, type: 'SEO Metadata Update', progress: '0%', status: 'Queued', rows: 'Waiting in queue' }
  ]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Background Processing Queue</h1>
            <p>Monitor asynchronous bulk import and images extract server thread tasks</p>
          </div>
          <button onClick={() => alert('Syncing jobs')} className="admin-primary-button" style={{ background: '#ff6600' }}>
            <RefreshCw size={18} /> Refresh Queue
          </button>
        </section>

        <AdminPanel className="p-0 overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Job ID</th>
                <th style={S.th}>Job Process Type</th>
                <th style={S.th}>Status state</th>
                <th style={S.th}>Completion Rate</th>
                <th style={S.th}>Process Stats</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id}>
                  <td style={S.td}><strong>#{j.id}</strong></td>
                  <td style={S.td}>{j.type}</td>
                  <td style={S.td}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                      background: j.status === 'Completed' ? '#e3fcef' : j.status === 'Running' ? '#eff8ff' : '#f2f4f7',
                      color: j.status === 'Completed' ? '#12b76a' : j.status === 'Running' ? '#175cd3' : '#475569'
                    }}>{j.status}</span>
                  </td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '100px', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: j.progress, height: '100%', background: '#ff6600' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600' }}>{j.progress}</span>
                    </div>
                  </td>
                  <td style={S.td}>{j.rows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminBackgroundJobs;
