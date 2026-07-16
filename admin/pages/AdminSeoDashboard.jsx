import React from 'react';
import AdminLayout from './AdminLayout';
import { Search, Globe, AlertCircle, BarChart3, ChevronRight, Activity, ShieldCheck } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const AdminSeoDashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#667085', fontWeight: '500' }}>SEO Health Score</span>
              <ShieldCheck size={20} color="#12b76a" />
            </div>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#101828' }}>94%</h3>
            <span style={{ fontSize: '12px', color: '#12b76a', fontWeight: '600' }}>↑ 2% from last week</span>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#667085', fontWeight: '500' }}>Indexed Pages</span>
              <Globe size={20} color="#0284c7" />
            </div>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#101828' }}>1,840</h3>
            <span style={{ fontSize: '12px', color: '#667085' }}>Total pages discovered</span>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#667085', fontWeight: '500' }}>Crawl Errors</span>
              <AlertCircle size={20} color="#f04438" />
            </div>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#101828' }}>14</h3>
            <span style={{ fontSize: '12px', color: '#f04438', fontWeight: '600' }}>↓ 3 fixed recently</span>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#667085', fontWeight: '500' }}>Avg. Ranking Position</span>
              <BarChart3 size={20} color="#7c3aed" />
            </div>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#101828' }}>12.4</h3>
            <span style={{ fontSize: '12px', color: '#12b76a', fontWeight: '600' }}>↑ 1.2 positions up</span>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Main Panel */}
          <AdminPanel style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#101828' }}>SEO Task Checklist</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Fix broken canonical tags on collections page', status: 'High Priority', color: '#f04438' },
                { title: 'Add missing alt text to 18 product images', status: 'Medium Priority', color: '#f79009' },
                { title: 'Optimize meta descriptions for camping gear categories', status: 'Low Priority', color: '#12b76a' },
                { title: 'Submit updated sitemap.xml to Google Search Console', status: 'Completed', color: '#98a2b3' },
              ].map((task, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #eaecf0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: task.color }} />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#344054' }}>{task.title}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: task.color }}>{task.status}</span>
                </div>
              ))}
            </div>
          </AdminPanel>

          {/* Sidebar Panel */}
          <AdminPanel style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#101828' }}>Googlebot Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Mobile Crawler', time: '14 mins ago', pages: '145 pages' },
                { label: 'Desktop Crawler', time: '2 hours ago', pages: '42 pages' },
                { label: 'Image Crawler', time: 'Yesterday', pages: '312 images' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={16} color="#0284c7" />
                    <div>
                      <strong style={{ display: 'block', color: '#344054' }}>{item.label}</strong>
                      <span style={{ color: '#667085', fontSize: '11px' }}>{item.time}</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: '600', color: '#101828' }}>{item.pages}</span>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSeoDashboard;
