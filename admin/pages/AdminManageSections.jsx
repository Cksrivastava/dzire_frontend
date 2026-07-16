import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Layout, MoveUp, MoveDown, Eye, EyeOff } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  saveBtn: { padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
};

const initialSections = [
  { id: 'hero', name: 'Hero Banner Slider', visible: true, order: 1 },
  { id: 'promo', name: 'Promotional Promo Grid', visible: true, order: 2 },
  { id: 'featured', name: 'Featured Products Rack', visible: true, order: 3 },
  { id: 'explore', name: 'Wide Explore Banner', visible: true, order: 4 },
  { id: 'blogs', name: 'Latest Stories Feed', visible: false, order: 5 }
];

const AdminManageSections = () => {
  const [sections, setSections] = useState(initialSections);

  const toggleVisibility = (id) => {
    setSections(sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const move = (index, direction) => {
    const next = [...sections];
    if (direction === 'up' && index > 0) {
      [next[index], next[index - 1]] = [next[index - 1], next[index]];
    }
    if (direction === 'down' && index < next.length - 1) {
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
    }
    setSections(next.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Manage Home Sections</h1>
            <p>Customize the display order and visibility of active segments on the storefront homepage</p>
          </div>
        </section>

        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map((s, idx) => (
            <div key={s.id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#ff6600' }}>#{s.order}</span>
                <div>
                  <strong style={{ fontSize: '15px' }}>{s.name}</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#667085' }}>ID: {s.id}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => toggleVisibility(s.id)} style={{ padding: '8px', background: s.visible ? '#e3fcef' : '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', color: s.visible ? '#12b76a' : '#667085' }}>
                  {s.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button onClick={() => move(idx, 'up')} disabled={idx === 0} style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: idx === 0 ? 0.5 : 1 }}>
                  <MoveUp size={16} />
                </button>
                <button onClick={() => move(idx, 'down')} disabled={idx === sections.length - 1} style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: idx === sections.length - 1 ? 0.5 : 1 }}>
                  <MoveDown size={16} />
                </button>
              </div>
            </div>
          ))}

          <button onClick={() => alert('Homepage sections layout successfully updated!')} style={{ ...S.saveBtn, alignSelf: 'flex-start', marginTop: '8px' }}>
            Save Sections Order
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminManageSections;
