import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, ShieldAlert, CheckCircle2, RefreshCcw, HelpCircle } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const sampleSlugs = [
  { id: 1, type: 'Product', originalName: 'Air Zoom Running Shoes', slug: '/products/air-zoom-running-shoes', status: 'Clean' },
  { id: 2, type: 'Product', originalName: 'Oudh Concentrated Attar - 100ml Special', slug: '/products/oudh_concentrated_attar_100ml_special', status: 'Warning', issue: 'Uses underscores' },
  { id: 3, type: 'Collection', originalName: 'CAMPING TENTS & ACCS', slug: '/collections/CAMPING-TENTS-&-ACCS', status: 'Critical', issue: 'Uppercase & Special chars' },
  { id: 4, type: 'Page', originalName: 'Privacy & Terms of Service', slug: '/pages/privacy-and-terms-of-service', status: 'Clean' },
];

const AdminSeoSlugs = () => {
  const [slugs, setSlugs] = useState(sampleSlugs);
  const [search, setSearch] = useState('');

  const getStatusBadge = (item) => {
    if (item.status === 'Clean') {
      return <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: '#ecfdf5', color: '#047857' }}>Clean</span>;
    }
    if (item.status === 'Warning') {
      return <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: '#fffbeb', color: '#b45309' }} title={item.issue}>⚠️ {item.issue}</span>;
    }
    return <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: '#fef2f2', color: '#b91c1c' }} title={item.issue}>🚫 {item.issue}</span>;
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        {/* Helper Banner */}
        <div style={{ background: '#f0f9ff', border: '1px solid #e0f2fe', borderRadius: '12px', padding: '16px', marginBottom: '20px', fontSize: '13px', color: '#0369a1' }}>
          💡 <strong>Best Practice:</strong> Slugs should be strictly lowercase, contain only alphanumeric characters and hyphens (-), and avoid stop words (a, an, the, and).
        </div>

        {/* Action controls */}
        <div style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search slugs or names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 38px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <button style={{ padding: '9px 16px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            Analyze All Slugs
          </button>
        </div>

        {/* Slugs Table */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', fontSize: '12px', color: '#374151', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Item Type</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Original Name</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Slug Path</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {slugs
                .filter(s => s.originalName.toLowerCase().includes(search.toLowerCase()) || s.slug.includes(search))
                .map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #eaecf0', fontSize: '13px' }}>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#f3f4f6', fontWeight: '600', fontSize: '11px', color: '#475569' }}>
                        {s.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: '500', color: '#101828' }}>{s.originalName}</td>
                    <td style={{ padding: '16px', fontFamily: 'monospace', color: '#344054' }}>{s.slug}</td>
                    <td style={{ padding: '16px' }}>{getStatusBadge(s)}</td>
                    <td style={{ padding: '16px' }}>
                      {s.status !== 'Clean' ? (
                        <button style={{ padding: '4px 10px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                          Auto-Fix
                        </button>
                      ) : (
                        <span style={{ color: '#98a2b3', fontSize: '11px' }}>No action required</span>
                      )}
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

export default AdminSeoSlugs;
