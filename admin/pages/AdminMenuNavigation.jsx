import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Menu, Plus, Trash2, Edit, Save, Link as LinkIcon } from 'lucide-react';

const S = {
  card: { background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' },
  inp: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  saveBtn: { padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' },
};

const initialMenus = [
  { id: 1, title: 'Header Navbar Link Menu', links: 'Home, Shop, Brands, Categories, Contact Us' },
  { id: 2, title: 'Footer Info Column Menu', links: 'About Us, Privacy Policy, Terms, Return Guidelines' },
  { id: 3, title: 'Mobile Menu Extra Links', links: 'Track Order, Support Chat, Gift Cards' }
];

const AdminMenuNavigation = () => {
  const [menus, setMenus] = useState(initialMenus);
  const [targetMenu, setTargetMenu] = useState('Header Navbar Link Menu');
  const [label, setLabel] = useState('');
  const [path, setPath] = useState('');

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!label || !path) return;
    setMenus(menus.map(m => {
      if (m.title === targetMenu) {
        return {
          ...m,
          links: m.links + ', ' + label
        };
      }
      return m;
    }));
    setLabel('');
    setPath('');
    alert('Navigation link item successfully added to menu list!');
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Menu Navigation Builder</h1>
            <p>Customize storefront header navbar link structures and footer information maps</p>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Navigation Menus List */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Storefront Navigation Menus</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {menus.map((m) => (
                <div key={m.id} style={{ padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '14px' }}>{m.title}</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#667085' }}>Links: {m.links}</p>
                  </div>
                  <button onClick={() => alert('Configuring link lists for: ' + m.title)} style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Configure</button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Menu Link Form */}
          <div style={S.card}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Configure Menu Item Link</h3>
            <form onSubmit={handleAddLink}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={S.label}>Select Target Menu</label>
                  <select value={targetMenu} onChange={e => setTargetMenu(e.target.value)} style={S.inp}>
                    {menus.map(m => <option key={m.id} value={m.title}>{m.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Menu Label Text</label>
                  <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Hiking Gear" style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Destination Route Type</label>
                  <select style={S.inp}>
                    <option>All Category page</option>
                    <option>All Collections page</option>
                    <option>Custom URL / Redirect</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Link URL Path</label>
                  <input type="text" value={path} onChange={e => setPath(e.target.value)} placeholder="e.g. /shop/hiking" style={S.inp} required />
                </div>
                <button type="submit" style={S.saveBtn}>Add Link Item</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMenuNavigation;
