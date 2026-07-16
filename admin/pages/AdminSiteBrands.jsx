import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Tag, Plus, Upload, Trash2 } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  btn: { padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
};

const AdminSiteBrands = () => {
  const [brands, setBrands] = useState([
    { id: 1, name: 'Wildcraft', products: 18, logo: 'WILDCRAFT' },
    { id: 2, name: 'Decathlon', products: 24, logo: 'DECATHLON' },
    { id: 3, name: 'Coleman', products: 12, logo: 'COLEMAN' }
  ]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Featured Brands Banners</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Manage brand logotypes and logos showcased in home-page sliders</p>
          </div>
          <button onClick={() => alert('New Brand Logo Upload')} style={S.btn}>
            <Upload size={16} /> Add Brand Logo
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {brands.map(b => (
            <div key={b.id} style={{ ...S.card, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ height: '80px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#ff6600', letterSpacing: '2px' }}>
                {b.logo}
              </div>
              <div>
                <strong style={{ fontSize: '15px', display: 'block' }}>{b.name}</strong>
                <span style={{ fontSize: '12px', color: '#667085' }}>{b.products} active items</span>
              </div>
              <button onClick={() => setBrands(brands.filter(item => item.id !== b.id))} style={{ padding: '6px', background: '#fef3f2', color: '#f04438', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
                <Trash2 size={14} /> Remove Brand
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSiteBrands;
