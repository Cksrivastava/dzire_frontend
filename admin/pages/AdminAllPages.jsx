import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { FileText, Plus, Eye, Trash2, Edit } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const initialPages = [
  { id: 1, title: 'About Us', slug: 'about-us', status: 'Published', date: '01 Jan 2026', views: 840 },
  { id: 2, title: 'Privacy Policy', slug: 'privacy-policy', status: 'Published', date: '10 Jan 2026', views: 423 },
  { id: 3, title: 'Refunds & Returns Guidelines', slug: 'refunds-returns', status: 'Draft', date: '—', views: 0 },
  { id: 4, title: 'Frequently Asked Questions (FAQ)', slug: 'faq', status: 'Published', date: '15 Feb 2026', views: 1205 }
];

const AdminAllPages = () => {
  const [pages, setPages] = useState(initialPages);

  const deletePage = (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    setPages(pages.filter(p => p.id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>All Storefront Pages</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>List of all policy pages, FAQ hubs, and custom contact interfaces</p>
          </div>
          <button onClick={() => alert('New Custom Page form')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            + Create New Page
          </button>
        </div>

        <div style={S.panel}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Page Title</th>
                <th style={S.th}>URL Path Slug</th>
                <th style={S.th}>Lifetime Views</th>
                <th style={S.th}>Publish Date</th>
                <th style={S.th}>Status</th>
                <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(p => (
                <tr key={p.id}>
                  <td style={S.td}><strong>{p.title}</strong></td>
                  <td style={{ ...S.td, fontFamily: 'monospace', color: '#ff6600' }}>/{p.slug}</td>
                  <td style={S.td}>{p.views.toLocaleString()} views</td>
                  <td style={S.td}>{p.date}</td>
                  <td style={S.td}>
                    <span style={S.badge(p.status === 'Published' ? '#e3fcef' : '#f3f4f6', p.status === 'Published' ? '#12b76a' : '#667085')}>{p.status}</span>
                  </td>
                  <td style={{ ...S.td, textAlign: 'right' }}>
                    <button onClick={() => alert('Editing ' + p.title)} style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}><Edit size={16} /></button>
                    <button onClick={() => deletePage(p.id)} style={{ color: '#f04438', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
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

export default AdminAllPages;
