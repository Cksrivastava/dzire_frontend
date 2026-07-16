import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Upload, Copy, Trash2, Search, Image as ImageIcon } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  inp: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  btn: { padding: '10px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
};

const initialFiles = [
  { id: 1, name: 'trekking-backpack-main.jpg', url: 'https://dzirestore.com/assets/trekking-backpack-main.jpg', size: '142 KB', dim: '1200 x 1200' },
  { id: 2, name: 'camping-tent-orange.jpg', url: 'https://dzirestore.com/assets/camping-tent-orange.jpg', size: '284 KB', dim: '1600 x 1200' },
  { id: 3, name: 'sleeping-bag-close.jpg', url: 'https://dzirestore.com/assets/sleeping-bag-close.jpg', size: '98 KB', dim: '1000 x 1000' },
  { id: 4, name: 'brand-banner-wildcraft.png', url: 'https://dzirestore.com/assets/brand-banner-wildcraft.png', size: '64 KB', dim: '400 x 800' }
];

const AdminMediaLibrary = () => {
  const [files, setFiles] = useState(initialFiles);
  const [search, setSearch] = useState('');

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('Image link URL copied to clipboard!');
  };

  const deleteFile = (id) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    setFiles(files.filter(f => f.id !== id));
  };

  const handleUpload = () => {
    alert('Simulating File Upload...\nFile uploaded to local cloud storage bucket!');
    setFiles([...files, {
      id: Date.now(),
      name: 'new-uploaded-asset.jpg',
      url: 'https://dzirestore.com/assets/new-uploaded-asset.jpg',
      size: '150 KB',
      dim: '1200 x 1200'
    }]);
  };

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Media Library</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Manage, upload and retrieve all catalog product images, banner slides, and brand icons</p>
          </div>
          <button onClick={handleUpload} style={S.btn}>
            <Upload size={16} /> Upload New File
          </button>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Search size={18} style={{ color: '#9ca3af' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search media by name..." style={{ border: 'none', outline: 'none', fontSize: '14px', width: '100%' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {filtered.map(f => (
            <div key={f.id} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ height: '140px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <ImageIcon size={36} style={{ color: '#d1d5db' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <strong style={{ display: 'block', fontSize: '14px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{f.name}</strong>
                <span style={{ fontSize: '12px', color: '#667085', display: 'block', marginTop: '2px' }}>{f.size} • {f.dim}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={() => copyUrl(f.url)} style={{ flex: 1, padding: '6px', background: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Copy size={12} /> Copy URL
                </button>
                <button onClick={() => deleteFile(f.id)} style={{ padding: '6px', background: '#fef3f2', color: '#f04438', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>No assets found matching query</p>}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMediaLibrary;
