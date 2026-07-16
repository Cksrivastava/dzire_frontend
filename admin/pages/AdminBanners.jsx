import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Image as ImageIcon, Upload, Trash2, Edit } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  btn: { padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
};

const AdminBanners = () => {
  const [banners, setBanners] = useState([
    { id: 1, type: 'Promo Sidebar Left', name: 'Winter Clearance Promo', size: '240 x 400', date: 'Live' },
    { id: 2, type: 'Promo Sidebar Right', name: 'New Hydration Packs', size: '240 x 400', date: 'Live' },
    { id: 3, type: 'Top Promo Bar', name: 'Free Shipping Banner', size: '1200 x 60', date: 'Inactive' }
  ]);

  const toggleStatus = (id) => {
    setBanners(banners.map(b => b.id === id ? { ...b, date: b.date === 'Live' ? 'Inactive' : 'Live' } : b));
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Promotional Banners</h1>
            <p>Manage secondary storefront layouts, left/right side promo column slides and announcement bars</p>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {banners.map(b => (
            <div key={b.id} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '120px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={32} style={{ color: '#d1d5db' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#ff6600', fontWeight: '700', textTransform: 'uppercase' }}>{b.type}</span>
                <strong style={{ display: 'block', fontSize: '15px', marginTop: '4px' }}>{b.name}</strong>
                <span style={{ fontSize: '12px', color: '#667085', display: 'block', marginTop: '2px' }}>Resolution: {b.size}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={() => toggleStatus(b.id)} style={{ flex: 1, padding: '8px', background: b.date === 'Live' ? '#e3fcef' : '#f3f4f6', color: b.date === 'Live' ? '#12b76a' : '#667085', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                  {b.date === 'Live' ? '✓ Live' : 'Enable'}
                </button>
                <button onClick={() => setBanners(banners.filter(item => item.id !== b.id))} style={{ padding: '8px', background: '#fef3f2', color: '#f04438', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div style={{ ...S.card, border: '2px dashed #ff6600', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px', cursor: 'pointer' }} onClick={() => alert('Trigger Banner Upload Form')}>
            <div style={{ textAlign: 'center', color: '#ff6600' }}>
              <Upload size={32} style={{ margin: '0 auto 10px' }} />
              <strong>Upload New Promo Banner</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#667085' }}>Supports PNG, JPEG up to 2MB</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
