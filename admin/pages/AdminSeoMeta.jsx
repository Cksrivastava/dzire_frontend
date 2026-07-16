import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Edit, FileText, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const sampleMetaList = [
  { id: 1, url: '/', title: 'Dzire Store | Premium Bags, Camping Gear & Accessories', desc: 'Shop premium bags, camping gear, and lifestyle products at best prices in India. Fast shipping and easy returns.', titleLen: 54, descLen: 104, status: 'Good' },
  { id: 2, url: '/products/verge-45l-backpack', title: 'Verge 45L Backpack - Trekking Bag', desc: 'Buy Verge 45L Backpack online.', titleLen: 33, descLen: 29, status: 'Too Short' },
  { id: 3, url: '/collections/trekking', title: 'Trekking Gears, Hiking Gear Equipment and Accessories Online Shopping in India - Dzire E-commerce Store', desc: 'Find hiking shoes, bags, gear, clothing, maps, and trekking gear online. Safe checkout.', titleLen: 108, descLen: 87, status: 'Title Too Long' },
  { id: 4, url: '/pages/about', title: 'About Us | Dzire', desc: '', titleLen: 17, descLen: 0, status: 'Missing Description' },
];

const AdminSeoMeta = () => {
  const [search, setSearch] = useState('');
  const [metaList, setMetaList] = useState(sampleMetaList);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Good':
        return <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: '#ecfdf5', color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Good</span>;
      case 'Too Short':
      case 'Title Too Long':
        return <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: '#fffbeb', color: '#b45309', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12} /> {status}</span>;
      default:
        return <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: '#fef2f2', color: '#b91c1c', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        {/* Actions bar */}
        <div style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by URL or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 38px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <button style={{ padding: '9px 16px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            Batch Analyze Pages
          </button>
        </div>

        {/* Table container */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', fontSize: '12px', color: '#374151', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Page Route</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Meta Title</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Meta Description</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {metaList
                .filter(m => m.url.includes(search) || m.title.toLowerCase().includes(search.toLowerCase()))
                .map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #eaecf0', fontSize: '13px' }}>
                    <td style={{ padding: '16px', fontWeight: '500', color: '#095c91', fontFamily: 'monospace' }}>{m.url}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '500', color: '#101828' }}>{m.title || <span style={{ color: '#b91c1c', fontStyle: 'italic' }}>Missing</span>}</div>
                      <span style={{ fontSize: '11px', color: m.titleLen > 70 ? '#b45309' : '#667085' }}>
                        {m.titleLen} chars (Recommended: 50-60)
                      </span>
                    </td>
                    <td style={{ padding: '16px', maxWidth: '300px' }}>
                      <div style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.desc || <span style={{ color: '#b91c1c', fontStyle: 'italic' }}>Missing</span>}
                      </div>
                      <span style={{ fontSize: '11px', color: m.descLen > 160 ? '#b45309' : '#667085' }}>
                        {m.descLen} chars (Recommended: 120-160)
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>{getStatusBadge(m.status)}</td>
                    <td style={{ padding: '16px' }}>
                      <button style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', padding: '4px' }} title="Edit Meta Tags">
                        <Edit size={16} />
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

export default AdminSeoMeta;
