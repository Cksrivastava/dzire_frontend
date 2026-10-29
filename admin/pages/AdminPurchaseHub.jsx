import React from 'react';
import AdminLayout from './AdminLayout';
import { ShoppingBag, Undo2, CreditCard, Receipt, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './AdminPurchase.css';

const AdminPurchaseHub = () => {
  const links = [
    { title: 'Purchase Invoices', path: '/admin/purchase/invoices', icon: ShoppingBag, desc: 'Manage purchase invoices', color: '#ff6600' },
    { title: 'Purchase Return', path: '/admin/purchase-return', icon: Undo2, desc: 'Handle purchase returns', color: '#ef4444' },
    { title: 'Payment Out', path: '/admin/payment-out', icon: CreditCard, desc: 'Record outgoing payments', color: '#10b981' },
    { title: 'Debit Note', path: '/admin/debit-note', icon: Receipt, desc: 'Manage debit notes', color: '#f59e0b' },
    { title: 'Purchase Order', path: '/admin/purchase-orders', icon: FileText, desc: 'Manage purchase orders', color: '#3b82f6' },
  ];

  return (
    <AdminLayout>
      <div className="purchase-page-wrapper">
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div className="purchase-header-bar">
            <h2 className="purchase-header-title">Purchase Management</h2>
          </div>
          <div className="purchase-content-area" style={{ background: '#fafafa' }}>
            <div className="purchase-hub-grid">
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

export default AdminPurchaseHub;
