import React from 'react';
import AdminLayout from './AdminLayout';
import AdminRolesPermissionsView from '../components/AdminRolesPermissionsView';

const AdminRolesPermissions = () => {
  return (
    <AdminLayout>
      <AdminRolesPermissionsView />
    </AdminLayout>
  );
};

export default AdminRolesPermissions;
