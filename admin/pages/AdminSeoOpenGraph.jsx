import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Eye, Share2, HelpCircle, FileImage } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const sampleOgList = [
  { id: 1, url: '/', title: 'Dzire Store - Premium Trekking & Backpacking Gear', desc: 'Shop top quality outdoor products.', image: 'https://dzire.in/assets/og-home.jpg', type: 'website' },
  { id: 2, url: '/products/verge-45l-backpack', title: 'Verge 45L Backpack | Dzire India', desc: 'Adventure awaits with Verge 45L Waterproof Backpack.', image: 'https://dzire.in/assets/products/verge-45l.jpg', type: 'product' }
];

const AdminSeoOpenGraph = () => {
  const [ogList, setOgList] = useState(sampleOgList);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeOg = ogList[activeIndex] || ogList[0];

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'start' }}>
          {/* Form & List */}
          <AdminPanel style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Open Graph Meta Config</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>Target Route</label>
                <select
                  onChange={(e) => setActiveIndex(Number(e.target.value))}
                  value={activeIndex}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: 'white' }}
                >
                  {ogList.map((item, index) => (
                    <option key={item.id} value={index}>{item.url}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>og:title</label>
                <input
                  type="text"
                  value={activeOg.title}
                  onChange={(e) => {
                    const newList = [...ogList];
                    newList[activeIndex].title = e.target.value;
                    setOgList(newList);
                  }}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>og:description</label>
                <textarea
                  value={activeOg.desc}
                  onChange={(e) => {
                    const newList = [...ogList];
                    newList[activeIndex].desc = e.target.value;
                    setOgList(newList);
                  }}
                  rows={3}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>og:image URL</label>
                <input
                  type="text"
                  value={activeOg.image}
                  onChange={(e) => {
                    const newList = [...ogList];
                    newList[activeIndex].image = e.target.value;
                    setOgList(newList);
                  }}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>
            </div>
          </AdminPanel>

          {/* Social Preview simulator */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} color="#0284c7" /> Live Social Share Preview
            </h3>
            
            {/* Facebook Style Share Card */}
            <div style={{ background: '#f0f2f5', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#65676b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Facebook Feed Preview</span>
              <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #dddfe2', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                {activeOg.image ? (
                  <div style={{ height: '220px', background: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={activeOg.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                ) : (
                  <div style={{ height: '220px', background: '#f2f3f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#8d949e' }}>
                    <FileImage size={40} />
                    <span style={{ fontSize: '12px', marginTop: '8px' }}>No Image URL Provided</span>
                  </div>
                )}
                <div style={{ padding: '12px', background: '#f2f3f5', borderTop: '1px solid #e5e5e5' }}>
                  <span style={{ fontSize: '12px', color: '#606770', textTransform: 'uppercase' }}>dzire.in</span>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#1c1e21', margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeOg.title || 'No Title'}</div>
                  <div style={{ fontSize: '12px', color: '#606770', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {activeOg.desc || 'No description provided. Facebook will automatically try to scrape default body text.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSeoOpenGraph;
