import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { ShieldCheck, AlertTriangle, AlertCircle, Play, CheckCircle2 } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const sampleAudits = {
  errors: [
    { id: 1, title: 'Missing Alt Text', detail: '14 product detail pages are missing descriptive image alt tags.', impact: 'High' },
    { id: 2, title: 'Duplicate Meta Description', detail: '/collections/trekking and /collections/hiking share identical metadata.', impact: 'Medium' }
  ],
  warnings: [
    { id: 3, title: 'Long URL Paths', detail: '3 paths exceed recommended 80 character length limits.', impact: 'Low' },
    { id: 4, title: 'H1 Header Missing', detail: '/pages/contact page does not define a top-level H1 element.', impact: 'Medium' }
  ],
  passed: [
    { id: 5, title: 'Sitemap.xml Presence', detail: 'Valid sitemap index detected and accessible.' },
    { id: 6, title: 'Robots.txt Configuration', detail: 'Proper user-agent crawler directives set.' }
  ]
};

const AdminSeoAudit = () => {
  const [running, setRunning] = useState(false);
  const [audits, setAudits] = useState(sampleAudits);

  const handleScan = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      alert('SEO audit completed! Found 2 errors, 2 warnings.');
    }, 2500);
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        
        {/* Header control */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#101828' }}>Site-wide SEO Audit Scan</h2>
            <span style={{ fontSize: '13px', color: '#667085' }}>Last fully scanned: 2 hours ago</span>
          </div>
          <button
            onClick={handleScan}
            disabled={running}
            style={{ padding: '10px 18px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
          >
            <Play size={16} /> {running ? 'Scanning codebase...' : 'Start SEO Audit'}
          </button>
        </div>

        {/* Audit categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Errors list */}
          <AdminPanel style={{ padding: '20px 24px', borderLeft: '4px solid #b91c1c' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} /> Critical Fixes ({audits.errors.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {audits.errors.map(err => (
                <div key={err.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#fef2f2', padding: '14px 16px', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#991b1b', display: 'block' }}>{err.title}</strong>
                    <span style={{ fontSize: '13px', color: '#7f1d1d' }}>{err.detail}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', padding: '2px 8px', background: '#fecaca', color: '#991b1b', borderRadius: '12px' }}>
                    {err.impact} Impact
                  </span>
                </div>
              ))}
            </div>
          </AdminPanel>

          {/* Warnings list */}
          <AdminPanel style={{ padding: '20px 24px', borderLeft: '4px solid #b45309' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#b45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} /> Optimization Warnings ({audits.warnings.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {audits.warnings.map(warn => (
                <div key={warn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#fffbeb', padding: '14px 16px', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#92400e', display: 'block' }}>{warn.title}</strong>
                    <span style={{ fontSize: '13px', color: '#78350f' }}>{warn.detail}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', padding: '2px 8px', background: '#fef3c7', color: '#92400e', borderRadius: '12px' }}>
                    {warn.impact} Impact
                  </span>
                </div>
              ))}
            </div>
          </AdminPanel>

          {/* Passed Audits */}
          <AdminPanel style={{ padding: '20px 24px', borderLeft: '4px solid #047857' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#047857', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> Passed Checks ({audits.passed.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {audits.passed.map(pass => (
                <div key={pass.id} style={{ display: 'flex', flexDirection: 'column', background: '#ecfdf5', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                  <strong style={{ fontSize: '13px', color: '#065f46' }}>✓ {pass.title}</strong>
                  <span style={{ fontSize: '12px', color: '#047857' }}>{pass.detail}</span>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminSeoAudit;
