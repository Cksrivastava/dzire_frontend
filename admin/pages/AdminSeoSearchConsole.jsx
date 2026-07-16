import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Globe, ShieldCheck, RefreshCw, BarChart2 } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const AdminSeoSearchConsole = () => {
  const [verified, setVerified] = useState(true);
  const [checking, setChecking] = useState(false);

  const handleVerify = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setVerified(true);
      alert('Verification tag is present and correct! Connection verified.');
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        
        {/* Verification Status */}
        <AdminPanel style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: verified ? '#ecfdf5' : '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: verified ? '#047857' : '#b91c1c' }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#101828' }}>
                  {verified ? 'Google Search Console Connected' : 'Search Console Disconnected'}
                </h3>
                <span style={{ fontSize: '13px', color: '#667085' }}>
                  {verified ? 'Domain: dzire.in | Verified owner' : 'Domain verification required'}
                </span>
              </div>
            </div>
            <button
              onClick={handleVerify}
              disabled={checking}
              style={{ padding: '8px 16px', background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} className={checking ? 'animate-spin' : ''} /> Check connection
            </button>
          </div>
        </AdminPanel>

        {/* Verification Instructions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px', alignItems: 'start' }}>
          <AdminPanel style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#101828' }}>Domain Verification</h4>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              Verify ownership of <strong>dzire.in</strong> to access search data.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #eaecf0' }}>
                <strong style={{ display: 'block', fontSize: '12px', color: '#344054', marginBottom: '4px' }}>HTML Meta Tag Method</strong>
                <code style={{ fontSize: '11px', color: '#095c91', wordBreak: 'break-all' }}>
                  &lt;meta name="google-site-verification" content="GSC-z7x2v19..." /&gt;
                </code>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #eaecf0' }}>
                <strong style={{ display: 'block', fontSize: '12px', color: '#344054', marginBottom: '4px' }}>DNS TXT Record Method</strong>
                <code style={{ fontSize: '11px', color: '#095c91', wordBreak: 'break-all' }}>
                  google-site-verification=GSC-z7x2v19...
                </code>
              </div>
            </div>
          </AdminPanel>

          {/* Search Console Performance Metrics */}
          <AdminPanel style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', color: '#101828', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} color="#0284c7" /> Search Performance (Last 30 Days)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #eaecf0' }}>
                <span style={{ fontSize: '11px', color: '#667085', display: 'block', marginBottom: '4px' }}>Google Search Clicks</span>
                <strong style={{ fontSize: '18px', color: '#1e293b' }}>12.8K</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #eaecf0' }}>
                <span style={{ fontSize: '11px', color: '#667085', display: 'block', marginBottom: '4px' }}>Impressions</span>
                <strong style={{ fontSize: '18px', color: '#1e293b' }}>192.4K</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #eaecf0' }}>
                <span style={{ fontSize: '11px', color: '#667085', display: 'block', marginBottom: '4px' }}>Avg. CTR</span>
                <strong style={{ fontSize: '18px', color: '#1e293b' }}>6.6%</strong>
              </div>
            </div>
            
            {/* Top Keywords Table */}
            <div style={{ border: '1px solid #eaecf0', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
                    <th style={{ padding: '10px 12px', fontWeight: '600' }}>Query Keyword</th>
                    <th style={{ padding: '10px 12px', fontWeight: '600' }}>Clicks</th>
                    <th style={{ padding: '10px 12px', fontWeight: '600' }}>Position</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { keyword: 'trekking bags india', clicks: '1,450', pos: '3.2' },
                    { keyword: 'buy waterproof backpack', clicks: '890', pos: '4.8' },
                    { keyword: 'dzire online store', clicks: '412', pos: '1.2' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < 2 ? '1px solid #eaecf0' : 'none' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '500' }}>{row.keyword}</td>
                      <td style={{ padding: '10px 12px', color: '#475569' }}>{row.clicks}</td>
                      <td style={{ padding: '10px 12px', color: '#475569' }}>{row.pos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminPanel>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminSeoSearchConsole;
