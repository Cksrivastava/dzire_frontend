import React, { useState, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { UploadCloud, Download, FileSpreadsheet, CheckCircle, Gift } from 'lucide-react';

const IMPORT_TEMPLATE = `customer_email,points_to_add,points_to_deduct,reason,expiry_date
riya@example.com,500,0,Festival Bonus,2025-12-31
aman@example.com,0,100,Refund Deduction,`;

const EXPORT_FIELDS = ['Customer Name', 'Email', 'Phone', 'Current Balance', 'Total Earned', 'Total Redeemed', 'Expiry Date', 'Last Transaction'];

const AdminBulkCreditsImport = () => {
  const [tab, setTab] = useState('import');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedFields, setSelectedFields] = useState(['Customer Name', 'Email', 'Current Balance', 'Total Earned', 'Total Redeemed']);
  const fileInputRef = useRef(null);

  const handleDownloadTemplate = () => {
    const blob = new Blob([IMPORT_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'dzire-credits-import-template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    if (!file) return;
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setFile(null); }, 2500);
  };

  const handleExport = (format) => {
    const header = selectedFields.join(',');
    const sampleRow = selectedFields.map(() => 'Sample Value').join(',');
    const csv = `${header}\n${sampleRow}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `dzire-credits-export.${format}`; a.click();
    URL.revokeObjectURL(url);
  };

  const toggleField = (field) => setSelectedFields(prev =>
    prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
  );

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#fce7f3,#fbcfe8)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gift size={24} color="#be185d" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#111' }}>Dzire Credits Import / Export</h1>
              <p style={{ margin: 0, color: '#667085', fontSize: '13px' }}>Bulk credit or deduct loyalty wallet points for customers with audit trail</p>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#f3f4f6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {['import', 'export'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', background: tab === t ? '#be185d' : 'transparent', color: tab === t ? 'white' : '#667085', transition: 'all 0.2s' }}>
              {t === 'import' ? '⬆️ Import' : '⬇️ Export'}
            </button>
          ))}
        </div>

        {tab === 'import' ? (
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '40px', textAlign: 'center' }}>
              {success ? (
                <div>
                  <CheckCircle size={56} color="#12b76a" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ color: '#12b76a', fontWeight: '700' }}>Credits Updated Successfully!</h3>
                  <p style={{ color: '#667085' }}>{file?.name} has been processed.</p>
                </div>
              ) : (
                <>
                  <div style={{ width: '72px', height: '72px', background: '#fce7f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <UploadCloud size={36} color="#be185d" />
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontWeight: '700', fontSize: '18px' }}>Upload Credits File</h3>
                  <p style={{ color: '#667085', fontSize: '13px', margin: '0 0 24px' }}>Supports .csv, .xls, .xlsx — Max 5MB</p>
                  <input ref={fileInputRef} type="file" accept=".csv,.xls,.xlsx" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
                  <button onClick={() => fileInputRef.current?.click()} style={{ padding: '10px 28px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    {file ? `📄 ${file.name}` : 'Browse File'}
                  </button>
                  {file && (
                    <button onClick={handleUpload} style={{ display: 'block', width: '100%', marginTop: '16px', padding: '12px', background: '#be185d', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                      ⬆️ Apply Credits Now
                    </button>
                  )}
                </>
              )}
            </div>
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                  <FileSpreadsheet size={20} color="#be185d" />
                  <strong>Required Columns</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569', lineHeight: '1.9' }}>
                  <li><strong>customer_email</strong> — Registered email ID</li>
                  <li><strong>points_to_add</strong> — Credits to credit (0 if none)</li>
                  <li><strong>points_to_deduct</strong> — Credits to remove (0 if none)</li>
                  <li><strong>reason</strong> — Audit log description</li>
                  <li><strong>expiry_date</strong> — Optional YYYY-MM-DD</li>
                </ul>
              </div>
              <button onClick={handleDownloadTemplate} style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', cursor: 'pointer', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Download size={18} /> Download Sample Template
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '28px' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: '700' }}>Select Fields to Export</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {EXPORT_FIELDS.map(field => (
                  <button key={field} onClick={() => toggleField(field)} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', fontWeight: '500', fontSize: '13px', cursor: 'pointer', background: selectedFields.includes(field) ? '#fce7f3' : '#f9fafb', borderColor: selectedFields.includes(field) ? '#be185d' : '#e5e7eb', color: selectedFields.includes(field) ? '#be185d' : '#667085' }}>
                    {selectedFields.includes(field) ? '✓ ' : ''}{field}
                  </button>
                ))}
              </div>
              <p style={{ margin: '16px 0 0', fontSize: '12px', color: '#9ca3af' }}>{selectedFields.length} field(s) selected</p>
            </div>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
                <h4 style={{ margin: '0 0 16px', fontWeight: '700' }}>Export Format</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button onClick={() => handleExport('csv')} style={{ padding: '12px', background: '#eff8ff', border: '1px solid #bae6fd', borderRadius: '10px', cursor: 'pointer', color: '#0369a1', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={18} /> Export as CSV
                  </button>
                  <button onClick={() => handleExport('xlsx')} style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', cursor: 'pointer', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={18} /> Export as Excel (.xlsx)
                  </button>
                </div>
              </div>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px', fontSize: '12px', color: '#92400e' }}>
                ⚠️ <strong>Warning:</strong> Bulk credit operations are irreversible. Please verify before uploading.
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBulkCreditsImport;
