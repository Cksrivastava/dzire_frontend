import React from 'react';
import AdminLayout from './AdminLayout';
import { Undo2, ShieldAlert } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './AdminReturns.css';

const AdminReturnsHub = () => {
  const links = [
    { title: 'Inventory Returns', path: '/admin/returns/list', icon: Undo2, desc: 'Manage general inventory returns', color: '#ff6600' },
    { title: 'Defective & Normal', path: '/admin/returns/defective', icon: ShieldAlert, desc: 'Handle defective or damaged items', color: '#ef4444' },
  ];

  return (
    <AdminLayout>
      <div className="returns-page-wrapper">
        <div className="returns-card-container">
          <div className="returns-header-bar">
            <div className="returns-header-title">
              <h2>Returns Management</h2>
              <p>Select a category to view return requests and defective items</p>
            </div>
          </div>
          <div className="returns-content-area" style={{ background: '#fafafa' }}>
            <div className="returns-hub-grid">
              {links.map((link, idx) => (
                <NavLink key={idx} to={link.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', transition: 'all 0.2s', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = link.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
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

export default AdminReturnsHub;
