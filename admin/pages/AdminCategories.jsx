import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, X, RefreshCw } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' },
  inp: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  saveBtn: { padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const initialCategories = [
  { id: 1, name: 'Running', type: 'Parent Category', count: 14, status: 'Active' },
  { id: 2, name: 'Cycling', type: 'Parent Category', count: 8, status: 'Active' },
  { id: 3, name: 'Hiking', type: 'Parent Category', count: 12, status: 'Active' }
];

const AdminCategories = () => {
  const [searchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'All Categories';

  const [categories, setCategories] = useState(initialCategories);
  const [catName, setCatName] = useState('');
  const [parentCat, setParentCat] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!catName) return;
    setCategories([...categories, {
      id: Date.now(),
      name: catName,
      type: parentCat ? `Subcategory (Parent: ${parentCat})` : 'Parent Category',
      count: 0,
      status: 'Active'
    }]);
    setCatName('');
    alert('Category created successfully!');
  };

  const renderSubContent = () => {
    switch (activeSub) {
      case 'All Categories':
      default:
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>All Categories List</strong>
              <button onClick={() => alert('Add category')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>+ New Category</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={S.th}>Category Name</th>
                  <th style={S.th}>Type</th>
                  <th style={S.th}>Product Count</th>
                  <th style={S.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td style={S.td}><strong>{c.name}</strong></td>
                    <td style={{ ...S.td, color: '#667085' }}>{c.type}</td>
                    <td style={S.td}>{c.count} Products</td>
                    <td style={S.td}><span style={S.badge('#e3fcef', '#12b76a')}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Add / Edit Category':
        return (
          <div style={{ ...S.card, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Create Category</h3>
            <form onSubmit={handleAddCategory}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={S.label}>Category Name</label>
                  <input type="text" value={catName} onChange={e => setCatName(e.target.value)} placeholder="e.g. Hiking Gear" style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Parent Category</label>
                  <select value={parentCat} onChange={e => setParentCat(e.target.value)} style={S.inp}>
                    <option value="">None (Top Level Category)</option>
                    <option value="Running">Running</option>
                    <option value="Cycling">Cycling</option>
                  </select>
                </div>
                <button type="submit" style={S.saveBtn}>Save Category</button>
              </div>
            </form>
          </div>
        );

      case 'Parent Categories':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Top Level Parent Categories</strong>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={S.th}>Name</th>
                  <th style={S.th}>Active Products</th>
                  <th style={S.th}>Total Subcategories</th>
                </tr>
              </thead>
              <tbody>
                {categories.filter(c => c.type === 'Parent Category').map(c => (
                  <tr key={c.id}>
                    <td style={S.td}><strong>{c.name}</strong></td>
                    <td style={S.td}>{c.count} Products</td>
                    <td style={S.td}>2 subcategories</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Sub Categories':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Mapped Subcategories</strong>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>Running Shoes (Parent: Running)</div>
              <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>Running Jackets (Parent: Running)</div>
            </div>
          </div>
        );

      case 'Category Image':
        return (
          <div style={S.card}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Category Banners</h3>
            <div style={{ border: '2px dashed #ff6600', height: '140px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff6600', fontWeight: '600' }}>
              + Upload Banner
            </div>
          </div>
        );

      case 'Category Description':
        return (
          <div style={{ ...S.card, maxWidth: '600px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Category Page Description</h3>
            <textarea placeholder="Write category details here..." style={{ ...S.inp, minHeight: '120px' }} />
            <button onClick={() => alert('Description updated')} style={S.saveBtn}>Save Description</button>
          </div>
        );

      case 'Category SEO':
        return (
          <div style={{ ...S.card, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>SEO Meta Data</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Meta Title" style={S.inp} />
              <textarea placeholder="Meta Description" style={{ ...S.inp, minHeight: '80px' }} />
              <button onClick={() => alert('SEO Saved')} style={S.saveBtn}>Save Meta Tags</button>
            </div>
          </div>
        );

      case 'Display Settings':
        return (
          <div style={{ ...S.card, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Category Display Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Visible on Storefront Nav Menu
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" /> Show in Homepage Sections Grid
              </label>
              <button onClick={() => alert('Settings applied')} style={S.saveBtn}>Save Settings</button>
            </div>
          </div>
        );

      case 'Bulk Actions':
        return (
          <div style={S.card}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Bulk Categories Management</h3>
            <button onClick={() => alert('Categories Exported')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
              Export All Categories (CSV)
            </button>
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>{activeSub}</h1>
            <p>Manage product categories parent alignments and storefront display orders</p>
          </div>
        </section>

        {renderSubContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
