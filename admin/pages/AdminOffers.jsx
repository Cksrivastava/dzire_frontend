import React from 'react';
import AdminLayout from './AdminLayout';
import AdminOffersView from '../components/AdminOffersView';

const AdminOffers = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container" style={{ padding: '24px' }}>
        <AdminOffersView />
      </div>
    </AdminLayout>
  );
};

export default AdminOffers;
