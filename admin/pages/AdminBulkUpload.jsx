import React, { useRef, useState } from 'react';
import AdminLayout from './AdminLayout';
import { UploadCloud, FileText, RefreshCcw, Save } from 'lucide-react';

const templates = [
  {
    title: 'Product Upload Template',
    subtitle: 'CSV format',
    color: '#175cd3',
    fileName: 'product-upload-template.csv',
    content: 'sku,name,category,brand,price,stock,description\nSKU-001,Sample Product,Camping,Dzire,999,25,Product details here\n'
  },
  {
    title: 'Inventory Update Template',
    subtitle: 'CSV format',
    color: '#12b76a',
    fileName: 'inventory-update-template.csv',
    content: 'sku,stock,location,low_stock_alert\nSKU-001,25,Main Warehouse,5\n'
  }
];

const AdminBulkUpload = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const handleBrowseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setSaveMessage('');
    }
  };

  const handleTemplateDownload = (template) => {
    const blob = new Blob([template.content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = template.fileName;
    link.click();
    URL.revokeObjectURL(url);
    setSelectedTemplate(template.title);
    setSaveMessage(`${template.title} downloaded.`);
  };

  const handleSave = () => {
    if (!selectedFile && !selectedTemplate) {
      setSaveMessage('Please select a file or download a template first.');
      return;
    }

    setSaveMessage(selectedFile ? `${selectedFile.name} saved for upload.` : `${selectedTemplate} saved.`);
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
      <section className="admin-hero" style={{ marginBottom: '24px' }}>
        <div>
          <h1>Bulk Upload</h1>
          <p>Upload products, images, and categories in bulk via CSV</p>
        </div>
        <button
          className="admin-primary-button"
          type="button"
          onClick={() => window.location.reload()}
        >
          <RefreshCcw size={18} />
          Refresh Data
        </button>
      </section>

      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '32px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#fff4ed', color: '#ff6600', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <UploadCloud size={32} />
          </div>
          <h2 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Upload CSV/Excel File</h2>
          <p style={{ color: '#667085', fontSize: '14px', margin: '0 0 24px 0' }}>Drag and drop your file here or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={handleBrowseFile}
            style={{ padding: '10px 24px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
          >
            Browse File
          </button>
          {selectedFile && (
            <p style={{ color: '#344054', fontSize: '14px', margin: '16px 0 0 0', fontWeight: '500' }}>
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        <div style={{ width: '350px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>Templates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {templates.map((template) => (
              <button
                key={template.fileName}
                type="button"
                onClick={() => handleTemplateDownload(template)}
                style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: selectedTemplate === template.title ? '#fff4ed' : '#f9fafb', border: `1px solid ${selectedTemplate === template.title ? '#ff6600' : '#e5e7eb'}`, borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}
              >
                <FileText size={20} color={template.color} />
                <div>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111' }}>{template.title}</span>
                  <span style={{ fontSize: '12px', color: '#667085' }}>{template.subtitle}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Save Bulk Upload</h3>
          <p style={{ margin: 0, fontSize: '14px', color: saveMessage.includes('Please') ? '#f04438' : '#667085' }}>
            {saveMessage || 'Select a file or template, then save.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          style={{ padding: '10px 18px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} />
          Save
        </button>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminBulkUpload;
