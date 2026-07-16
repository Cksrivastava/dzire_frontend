import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { FileText, Play, Download, CheckCircle2, Settings, AlertCircle } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const sampleSitemaps = [
  { id: 1, name: 'sitemap-index.xml', type: 'Index', size: '2.4 KB', pages: '4 files reference', modified: '09 Jul 2026' },
  { id: 2, name: 'sitemap-products.xml', type: 'Products', size: '142.8 KB', pages: '1,240 pages', modified: '09 Jul 2026' },
  { id: 3, name: 'sitemap-categories.xml', type: 'Categories', size: '12.1 KB', pages: '84 pages', modified: '09 Jul 2026' },
  { id: 4, name: 'sitemap-pages.xml', type: 'Pages', size: '4.8 KB', pages: '12 pages', modified: '09 Jul 2026' },
];

const AdminSeoSitemap = () => {
  const [sitemaps, setSitemaps] = useState(sampleSitemaps);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setSuccess(false);
    setTimeout(() => {
      setGenerating(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    }, 2000);
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Main Sitemap Files list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AdminPanel style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>XML Sitemap Files</h3>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  style={{ padding: '8px 16px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {generating ? 'Regenerating...' : 'Regenerate Sitemaps'}
                </button>
              </div>

              {success && (
                <div style={{ padding: '12px 16px', background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#047857', fontSize: '13px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} /> Sitemaps successfully regenerated and pinged to search engines!
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sitemaps.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#f9fafb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: '#e0f2fe', color: '#0284c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#101828', display: 'block' }}>{s.name}</strong>
                        <span style={{ fontSize: '12px', color: '#667085' }}>{s.pages} | {s.size} | Last modified: {s.modified}</span>
                      </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', padding: '8px' }} title="Download File">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </AdminPanel>
          </div>

          {/* Config sidebar panel */}
          <AdminPanel style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} color="#0284c7" /> Sitemap Config
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Auto-Generation on updates</span>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Ping Google search console</span>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Ping Bing webmaster</span>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              </div>
              
              <div style={{ borderTop: '1px solid #eaecf0', paddingTop: '12px', marginTop: '4px' }}>
                <label style={{ display: 'block', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>Exclude URL Patterns</label>
                <textarea
                  defaultValue="/admin/*\n/cart\n/checkout\n/order-success"
                  rows={4}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </AdminPanel>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSeoSitemap;
