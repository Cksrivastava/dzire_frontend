import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { BookOpen, Plus, Image as ImageIcon, Trash2, Edit } from 'lucide-react';

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

const initialPosts = [
  { id: 1, title: 'Top 10 Trekking Destinations in Himalayas (2026)', author: 'Admin User', date: '04 Jul 2026', views: 342, status: 'Published' },
  { id: 2, title: 'Ultimate Guide to Choosing the Right Camping Tent', author: 'Content Writer', date: '01 Jul 2026', views: 189, status: 'Published' },
  { id: 3, title: 'Tips for Hiking in Monsoon Season safely', author: 'Wilderness Coach', date: '—', views: 0, status: 'Draft' }
];

const AdminBlog = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Admin User');
  const [content, setContent] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!title) return;
    setPosts([...posts, {
      id: Date.now(),
      title,
      author,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      views: 0,
      status: 'Published'
    }]);
    setTitle('');
    setContent('');
    alert('Blog post published successfully!');
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Blog Management</h1>
            <p>Publish adventure articles, brand stories and hiking guides for customers</p>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Blog posts list */}
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>All Articles</strong>
              <button onClick={() => alert('New blog post details form')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>+ New Article</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={S.th}>Article Title</th>
                  <th style={S.th}>Author</th>
                  <th style={S.th}>Date</th>
                  <th style={S.th}>Status</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id}>
                    <td style={S.td}><strong>{p.title}</strong></td>
                    <td style={S.td}>{p.author}</td>
                    <td style={S.td}>{p.date}</td>
                    <td style={S.td}>
                      <span style={S.badge(p.status === 'Published' ? '#e3fcef' : '#f3f4f6', p.status === 'Published' ? '#12b76a' : '#667085')}>{p.status}</span>
                    </td>
                    <td style={{ ...S.td, textAlign: 'right' }}>
                      <button onClick={() => alert('Edit ' + p.title)} style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}><Edit size={16} /></button>
                      <button onClick={() => setPosts(posts.filter(item => item.id !== p.id))} style={{ color: '#f04438', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Article Form */}
          <div style={S.card}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Publish New Article</h3>
            <form onSubmit={handleCreatePost}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={S.label}>Article Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Choosing your first sleeping bag" style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Author Name</label>
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)} style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Article Content</label>
                  <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write article content in Markdown format..." style={{ ...S.inp, minHeight: '160px' }} required />
                </div>
                <button type="submit" style={S.saveBtn}>Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
