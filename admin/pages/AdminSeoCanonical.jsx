import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Info, CheckCircle2, AlertTriangle, Edit2 } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const sampleCanonicals = [
  { id: 1, url: '/products/verge-45l-backpack', canonical: 'https://dzire.in/products/verge-45l-backpack', status: 'Self-Referencing (Good)' },
  { id: 2, url: '/products/verge-45l-backpack?color=blue', canonical: 'https://dzire.in/products/verge-45l-backpack', status: 'Parameterized (Good)' },
  { id: 3, url: '/collections/trekking-bags', canonical: '', status: 'Missing Canonical Tag' },
  { id: 4, url: '/pages/contact-us', canonical: 'https://dzire.in/pages/contact', status: 'Mismatch (Warning)' }
];

const AdminSeoCanonical = () => {
  const [canonicals, setCanonicals] = useState(sampleCanonicals);
  const [search, setSearch] = useState('');

  const getStatusColor = (status) => {
    if (status.includes('Good')) return '#047857';
    if (status.includes('Warning') || status.includes('Mismatch')) return '#b45309';
    return '#b91c1c';
  };

  const getStatusBg = (status) => {
    if (status.includes('Good')) return '#ecfdf5';
    if (status.includes('Warning') || status.includes('Mismatch')) return '#fffbeb';
    return '#fef2f2';
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        {/* Info card */}
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', padding: '16px', marginBottom: '20px', fontSize: '13px', color: '#b45309', display: 'flex', gap: '10px' }}>
          <Info size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Why Canonical URLs matter:</strong> Canonical tags prevent duplicate content issues in search engines by specifying the "preferred" version of a web page.
          </div>
        </div>

        {/* Action bar */}
        <div style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by page URL or canonical..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 38px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <button style={{ padding: '9px 16px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            Audit Canonical Tags
          </button>
        </div>

        {/* Canonical Table */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', fontSize: '12px', color: '#374151', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Page URL</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Canonical Link Tag</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status / Check</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {canonicals
                .filter(c => c.url.includes(search) || c.canonical.includes(search))
                .map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #eaecf0', fontSize: '13px' }}>
                    <td style={{ padding: '16px', fontWeight: '500', color: '#101828', fontFamily: 'monospace' }}>{c.url}</td>
                    <td style={{ padding: '16px', fontFamily: 'monospace', color: c.canonical ? '#095c91' : '#b91c1c' }}>
                      {c.canonical || '[Empty / Not Set]'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: getStatusBg(c.status), color: getStatusColor(c.status) }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', padding: '4px' }} title="Edit Canonical">
                        <Edit2 size={16} />
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

export default AdminSeoCanonical;
