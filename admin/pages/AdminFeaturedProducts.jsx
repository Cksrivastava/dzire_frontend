import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Plus, Trash2, Pin, Search } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  inp: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  btn: { padding: '10px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
};

const AdminFeaturedProducts = () => {
  const [featured, setFeatured] = useState([
    { id: 1, name: 'Verge 45L Backpack', sku: 'BAG-VRG-45L', price: '₹4,500', stock: 12 },
    { id: 2, name: 'Trek High-Ankle Hiking Shoes', sku: 'SH-TRK-HA', price: '₹1,499', stock: 8 },
    { id: 3, name: 'Coleman 4-Person Dome Tent', sku: 'TNT-COL-4P', price: '₹8,900', stock: 4 }
  ]);

  const handleAddProduct = () => {
    alert('Product search popup opened!\nSelect items to pin to the frontpage.');
    setFeatured([...featured, {
      id: Date.now(),
      name: 'Wildcraft Trail Vest 10L',
      sku: 'BAG-WLD-10L',
      price: '₹2,100',
      stock: 15
    }]);
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Featured Products Slider</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Pin best-selling items to the homepage featured showcase slider</p>
          </div>
          <button onClick={handleAddProduct} style={S.btn}>
            <Plus size={16} /> Pin Product
          </button>
        </div>

        <div style={S.panel}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Pinned Products List</strong>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Product Name</th>
                <th style={S.th}>SKU</th>
                <th style={S.th}>Unit Price</th>
                <th style={S.th}>Available Stock</th>
                <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {featured.map(f => (
                <tr key={f.id}>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Pin size={14} style={{ color: '#ff6600' }} />
                      <strong>{f.name}</strong>
                    </div>
                  </td>
                  <td style={{ ...S.td, fontFamily: 'monospace' }}>{f.sku}</td>
                  <td style={{ ...S.td, color: '#ff6600', fontWeight: '700' }}>{f.price}</td>
                  <td style={S.td}>{f.stock} units</td>
                  <td style={{ ...S.td, textAlign: 'right' }}>
                    <button onClick={() => setFeatured(featured.filter(item => item.id !== f.id))} style={{ color: '#f04438', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFeaturedProducts;
