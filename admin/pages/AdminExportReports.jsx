import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Download, Calendar, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminExportReports = () => {
  const [success, setSuccess] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('CSV');

  const handleExport = (reportName) => {
    setSuccess(reportName);
    setTimeout(() => {
      setSuccess(false);
      alert(`${reportName} downloaded successfully in ${selectedFormat} format!`);
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        {/* Header */}
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Export Reports Console</h1>
            <p>Compile and download full relational database analytics logs in CSV or Excel spreadsheets</p>
          </div>
        </section>

        {/* Configurations grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Main List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AdminPanel style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Available Datasets to Export</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { name: 'Sales Performance Log', desc: 'Full order-wise transactional ledger records with payment references.' },
                  { name: 'Inventory Movement Log', desc: 'Product restock schedules, adjustments logs, and storage branch snapshots.' },
                  { name: 'Customer Activity Registry', desc: 'Complete audience registry records containing lifetime orders and spend indices.' },
                  { name: 'Vendor Ledger Report', desc: 'All commission charges, purchase orders, and supplier return transactions.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: '#fff4ed', color: '#ff6600', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileSpreadsheet size={20} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#101828', display: 'block' }}>{item.name}</strong>
                        <span style={{ fontSize: '12px', color: '#667085' }}>{item.desc}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleExport(item.name)}
                      style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Download size={14} /> Export
                    </button>
                  </div>
                ))}
              </div>
            </AdminPanel>
          </div>

          {/* Config Panel */}
          <AdminPanel style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Export Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>Date Range Selection</label>
                <select style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                  <option>This Financial Year</option>
                  <option>Custom Date Range</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>Export File Format</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['CSV', 'Excel (.xlsx)', 'JSON'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid',
                        fontWeight: '600',
                        fontSize: '12px',
                        cursor: 'pointer',
                        background: selectedFormat === fmt ? '#ff6600' : 'white',
                        borderColor: selectedFormat === fmt ? '#ff6600' : '#d1d5db',
                        color: selectedFormat === fmt ? 'white' : '#475569'
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AdminPanel>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminExportReports;
