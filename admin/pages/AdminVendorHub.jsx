import React from 'react';
import AdminLayout from './AdminLayout';
import { Store, UserCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminVendorHub = () => {
  const links = [
    { title: 'Manage Vendors', path: '/admin/vendors/manage', icon: Store, desc: 'View and manage all your vendors', color: '#ff6600' },
    { title: 'Vendor Profile', path: '/admin/vendors/profile', icon: UserCircle, desc: 'Detailed profiles and ledger statements', color: '#6366f1' },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #eef2f6' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Vendor Management</h2>
          </div>
          <div style={{ padding: '24px', background: '#fafafa' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {links.map((link, idx) => (
                <NavLink key={idx} to={link.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', transition: 'all 0.2s', cursor: 'pointer', height: '100%' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = link.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${link.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: link.color }}>
                      <link.icon size={24} />
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#111' }}>{link.title}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#667085' }}>{link.desc}</p>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVendorHub;
