import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { FileText, Plus, Eye, Trash2, Edit } from 'lucide-react';

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

const initialPages = [
  { id: 1, title: 'About Us', slug: 'about-us', status: 'Published', date: '01 Jan 2026' },
  { id: 2, title: 'Privacy Policy', slug: 'privacy-policy', status: 'Published', date: '10 Jan 2026' },
  { id: 3, title: 'Refunds & Returns Guidelines', slug: 'refunds-returns', status: 'Draft', date: '—' }
];

const AdminCustomPages = () => {
  const [pages, setPages] = useState(initialPages);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

  const handleCreatePage = (e) => {
    e.preventDefault();
    if (!title || !slug) return;
    setPages([...pages, {
      id: Date.now(),
      title,
      slug,
      status: 'Published',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }]);
    setTitle('');
    setSlug('');
    setContent('');
    alert('Custom storefront page published successfully!');
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Custom Storefront Pages</h1>
            <p>Create and edit dynamic pages (like FAQ, Contact, policies) with rich-text content</p>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Custom Pages List */}
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Custom Pages List</strong>
              <button onClick={() => alert('New page details form')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>+ New Page</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={S.th}>Page Title</th>
                  <th style={S.th}>Slug path</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Published Date</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(p => (
                  <tr key={p.id}>
                    <td style={S.td}><strong>{p.title}</strong></td>
                    <td style={{ ...S.td, fontFamily: 'monospace', color: '#ff6600' }}>/{p.slug}</td>
                    <td style={S.td}>
                      <span style={S.badge(p.status === 'Published' ? '#e3fcef' : '#f3f4f6', p.status === 'Published' ? '#12b76a' : '#667085')}>{p.status}</span>
                    </td>
                    <td style={S.td}>{p.date}</td>
                    <td style={{ ...S.td, textAlign: 'right' }}>
                      <button onClick={() => alert('Editing ' + p.title)} style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}><Edit size={16} /></button>
                      <button onClick={() => setPages(pages.filter(item => item.id !== p.id))} style={{ color: '#f04438', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create Page Form */}
          <div style={S.card}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Publish New Page</h3>
            <form onSubmit={handleCreatePage}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={S.label}>Page Title</label>
                  <input type="text" value={title} onChange={e => {
                    setTitle(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }} placeholder="e.g. Terms of Service" style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>URL Path Slug</label>
                  <input type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="terms-of-service" style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Page Markup / HTML Content</label>
                  <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write rich text content here..." style={{ ...S.inp, minHeight: '160px' }} required />
                </div>
                <button type="submit" style={S.saveBtn}>Publish Page</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomPages;
