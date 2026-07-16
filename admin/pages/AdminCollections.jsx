import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useSearchParams } from 'react-router-dom';
import { Bookmark, Sliders, Calendar, Download, Plus } from 'lucide-react';

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

const AdminCollections = () => {
  const [searchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'All Collections';

  const renderSubContent = () => {
    switch (activeSub) {
      case 'All Collections':
      default:
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>All Smart Collections</strong>
              <button onClick={() => alert('New collection')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>+ New Collection</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={S.th}>Collection Name</th>
                  <th style={S.th}>Products</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Live Date</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Summer Essentials', count: 12, status: 'Active', date: '01 Jun 2025' },
                  { name: 'New Arrivals', count: 8, status: 'Active', date: '15 Jun 2025' },
                  { name: 'Trail Running Bundle', count: 5, status: 'Draft', date: '—' },
                ].map((c, i) => (
                  <tr key={i}>
                    <td style={S.td}><strong>{c.name}</strong></td>
                    <td style={S.td}>{c.count} products</td>
                    <td style={S.td}>
                      <span style={S.badge(c.status === 'Active' ? '#e3fcef' : '#f8f9fa', c.status === 'Active' ? '#12b76a' : '#667085')}>{c.status}</span>
                    </td>
                    <td style={S.td}>{c.date}</td>
                    <td style={{ ...S.td, textAlign: 'right' }}>
                      <button onClick={() => alert('Edit ' + c.name)} style={{ color: '#ff6600', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer' }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Add / Edit Collection':
        return (
          <div style={{ ...S.card, maxWidth: '560px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Create / Edit Collection</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={S.label}>Collection Name</label>
                <input type="text" placeholder="e.g. Summer Essentials" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>URL Slug</label>
                <input type="text" placeholder="summer-essentials" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>Short Description</label>
                <textarea placeholder="Brief description of this collection..." style={{ ...S.inp, minHeight: '80px' }} />
              </div>
              <button onClick={() => alert('Collection saved!')} style={S.saveBtn}>Save Collection</button>
            </div>
          </div>
        );

      case 'Collection Products':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Products in Collection</strong>
              <button onClick={() => alert('Add Product')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>+ Add Product</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={S.th}>Product Name</th>
                  <th style={S.th}>SKU</th>
                  <th style={S.th}>Sort Order</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Trail Running Vest', sku: 'RN-VS-BLU', order: 1 },
                  { name: 'Hydration Pack 5L', sku: 'HY-PK-5L', order: 2 },
                  { name: 'Sports Sunscreen SPF70', sku: 'SK-SC-70', order: 3 },
                ].map((p, i) => (
                  <tr key={i}>
                    <td style={S.td}><strong>{p.name}</strong></td>
                    <td style={{ ...S.td, color: '#667085' }}>{p.sku}</td>
                    <td style={S.td}>
                      <input type="number" defaultValue={p.order} style={{ width: '60px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                    </td>
                    <td style={{ ...S.td, textAlign: 'right' }}>
                      <button onClick={() => alert('Removed')} style={{ color: '#f04438', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Collection Banners':
        return (
          <div style={S.card}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Collection Banner Images</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ border: '2px dashed #ff6600', height: '140px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff6600', fontWeight: '600', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>+</span>
                <span style={{ fontSize: '13px' }}>Upload Desktop Banner</span>
              </div>
              <div style={{ border: '2px dashed #d1d5db', height: '140px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>+</span>
                <span style={{ fontSize: '13px' }}>Upload Mobile Banner</span>
              </div>
            </div>
          </div>
        );

      case 'Display Settings':
        return (
          <div style={{ ...S.card, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Collection Display Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Show on Homepage
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" /> Feature in Navigation Menu
              </label>
              <div>
                <label style={S.label}>Grid Layout</label>
                <select style={S.inp}>
                  <option>4-Column Grid</option>
                  <option>3-Column Grid</option>
                  <option>Horizontal Scroll</option>
                </select>
              </div>
              <button onClick={() => alert('Display Settings saved')} style={S.saveBtn}>Save Settings</button>
            </div>
          </div>
        );

      case 'Priority & Sorting':
        return (
          <div style={{ ...S.card, maxWidth: '560px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Collection Priority &amp; Sort Order</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Summer Essentials', priority: 1 },
                { name: 'New Arrivals', priority: 2 },
                { name: 'Trail Running Bundle', priority: 3 },
                { name: 'Cycling Gear Pack', priority: 4 },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fafafa' }}>
                  <span style={{ fontSize: '14px', flex: 1, fontWeight: '500' }}>{c.name}</span>
                  <input type="number" defaultValue={c.priority} style={{ width: '60px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }} />
                </div>
              ))}
              <button onClick={() => alert('Order saved!')} style={S.saveBtn}>Save Order</button>
            </div>
          </div>
        );

      case 'Scheduling':
        return (
          <div style={{ ...S.card, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Collection Scheduling</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={S.label}>Go-Live Date &amp; Time</label>
                <input type="datetime-local" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>Expire / End Date (optional)</label>
                <input type="datetime-local" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>Target Audience</label>
                <select style={S.inp}>
                  <option>All Customers</option>
                  <option>Men Only</option>
                  <option>Women Only</option>
                  <option>Loyalty Members</option>
                </select>
              </div>
              <button onClick={() => alert('Schedule saved!')} style={S.saveBtn}>Save Schedule</button>
            </div>
          </div>
        );

      case 'Bulk Actions':
        return (
          <div style={S.card}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Bulk Collections Operations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { label: 'Export All Collections', note: 'Download as CSV' },
                { label: 'Activate All', note: 'Mark all collections visible' },
                { label: 'Deactivate All', note: 'Hide all from storefront' },
              ].map((a, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }} onClick={() => alert(a.label)}>
                  <strong style={{ fontSize: '14px' }}>{a.label}</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#667085' }}>{a.note}</p>
                </div>
              ))}
            </div>
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
            <p>Group catalog products dynamically and configure live countdown schedules</p>
          </div>
        </section>

        {renderSubContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminCollections;
