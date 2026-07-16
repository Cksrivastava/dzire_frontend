import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Plus, Trash, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const sampleRedirects = [
  { id: 1, source: '/old-verge-backpack', target: '/products/verge-45l-backpack', type: '301 Permanent', status: 'Active' },
  { id: 2, url: '/sale-2025', target: '/collections/clearance', type: '302 Temporary', status: 'Active' },
];

const AdminSeoRedirects = () => {
  const [redirects, setRedirects] = useState(sampleRedirects);
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [type, setType] = useState('301 Permanent');
  const [search, setSearch] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!source || !target) return;
    const newRedir = {
      id: Date.now(),
      source,
      target,
      type,
      status: 'Active'
    };
    setRedirects([newRedir, ...redirects]);
    setSource('');
    setTarget('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleDelete = (id) => {
    setRedirects(redirects.filter(r => r.id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        {showToast && (
          <div style={{ padding: '12px 16px', background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#047857', fontSize: '13px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> Redirect rule added successfully!
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
          {/* Add Redirect Form */}
          <AdminPanel style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Create Redirect Rule</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>Source Path (From)</label>
                <input
                  type="text"
                  placeholder="e.g. /old-product-page"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>Target Path (To)</label>
                <input
                  type="text"
                  placeholder="e.g. /products/new-backpack"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>Redirect Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: 'white' }}
                >
                  <option value="301 Permanent">301 Permanent</option>
                  <option value="302 Temporary">302 Temporary</option>
                </select>
              </div>

              <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                <Plus size={16} /> Add Redirect Rule
              </button>
            </form>
          </AdminPanel>

          {/* Redirect List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ color: '#9ca3af', marginRight: '10px' }} />
              <input
                type="text"
                placeholder="Search redirects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px' }}
              />
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', fontSize: '12px', color: '#374151', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Redirect Path Mapping</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Type</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {redirects
                    .filter(r => r.source?.includes(search) || r.target?.includes(search))
                    .map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #eaecf0', fontSize: '13px' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace' }}>
                            <span style={{ color: '#b91c1c' }}>{r.source}</span>
                            <ArrowRight size={14} color="#667085" />
                            <span style={{ color: '#047857' }}>{r.target}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', background: r.type.includes('301') ? '#eff8ff' : '#fffbeb', color: r.type.includes('301') ? '#0284c7' : '#b45309', fontSize: '11px', fontWeight: '600' }}>
                            {r.type}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', color: '#f04438', cursor: 'pointer', padding: '4px' }}>
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSeoRedirects;
