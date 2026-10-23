import React from 'react';
import AdminLayout from './AdminLayout';
import AdminCouponsView from '../components/AdminCouponsView';

const AdminCoupons = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container" style={{ padding: '24px' }}>
        <AdminCouponsView />
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
