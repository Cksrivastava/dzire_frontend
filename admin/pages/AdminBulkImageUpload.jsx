import React, { useState, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { UploadCloud, CheckCircle, FolderArchive, Image, AlertCircle } from 'lucide-react';

const AdminBulkImageUpload = () => {
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleUpload = () => {
    if (!file) return;
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setSuccess(true);
        setTimeout(() => { setSuccess(false); setFile(null); setProgress(0); }, 3000);
      }
    }, 300);
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#fff7ed,#fed7aa)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image size={24} color="#ea580c" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#111' }}>Bulk Image Upload (ZIP)</h1>
              <p style={{ margin: 0, color: '#667085', fontSize: '13px' }}>Upload a ZIP archive of product images — they will be auto-matched by SKU filename</p>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Upload Area */}
          <div style={{ flex: 1, minWidth: '300px', background: 'white', borderRadius: '16px', border: '2px dashed #fed7aa', padding: '48px', textAlign: 'center' }}>
            {success ? (
              <div>
                <CheckCircle size={56} color="#12b76a" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ color: '#12b76a', fontWeight: '700' }}>Images Uploaded Successfully!</h3>
                <p style={{ color: '#667085' }}>{file?.name} extracted and matched with products.</p>
              </div>
            ) : (
              <>
                <div style={{ width: '80px', height: '80px', background: '#fff7ed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <FolderArchive size={40} color="#ea580c" />
                </div>
                <h3 style={{ margin: '0 0 8px', fontWeight: '700', fontSize: '18px' }}>Upload ZIP Archive</h3>
                <p style={{ color: '#667085', fontSize: '13px', margin: '0 0 24px' }}>Maximum ZIP size: 500MB &nbsp;|&nbsp; Formats: .jpg, .png, .webp inside ZIP</p>
                <input ref={fileInputRef} type="file" accept=".zip" style={{ display: 'none' }} onChange={e => { setFile(e.target.files?.[0] || null); setProgress(0); }} />
                <button onClick={() => fileInputRef.current?.click()} style={{ padding: '12px 32px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                  {file ? `📦 ${file.name}` : 'Select ZIP File'}
                </button>

                {file && progress === 0 && (
                  <button onClick={handleUpload} style={{ display: 'block', width: '100%', marginTop: '20px', padding: '14px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                    ⬆️ Upload & Extract Images
                  </button>
                )}

                {progress > 0 && progress < 100 && (
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ background: '#f3f4f6', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${progress}%`, background: '#ea580c', height: '100%', transition: 'width 0.3s', borderRadius: '8px' }} />
                    </div>
                    <p style={{ margin: '8px 0 0', color: '#667085', fontSize: '13px' }}>Processing... {progress}%</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Guide Panel */}
          <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                <UploadCloud size={20} color="#ea580c" />
                <strong>File Naming Convention</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569', lineHeight: '2' }}>
                <li>Name images by SKU: <strong>SKU-001.jpg</strong></li>
                <li>Multiple angles: <strong>SKU-001_2.jpg</strong>, <strong>SKU-001_3.jpg</strong></li>
                <li>Max 8 images per product</li>
                <li>Min resolution: <strong>800 × 800 px</strong></li>
                <li>Preferred format: <strong>.webp</strong> or <strong>.jpg</strong></li>
              </ul>
            </div>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '16px', fontSize: '13px', color: '#92400e' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong>Auto-Matching:</strong> Images are matched to products by their filename SKU. Unmatched images go to <em>Media Library → Unassigned</em>.
                </div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', fontSize: '13px' }}>
              <strong style={{ display: 'block', marginBottom: '10px' }}>Supported Image Formats</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['.jpg', '.jpeg', '.png', '.webp', '.gif'].map(fmt => (
                  <span key={fmt} style={{ padding: '4px 10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', fontWeight: '600', color: '#374151' }}>{fmt}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBulkImageUpload;
