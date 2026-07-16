import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, UserPlus, Shield } from 'lucide-react';
import { Input, Button } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const AdminAddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Store Manager");
  const [branch, setBranch] = useState("Main Warehouse");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Name and Email are required!");
      return;
    }
    alert(`Admin User "${name}" successfully invited as ${role}!`);
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Create Admin User</h1>
            <p>Provision backend panel access credentials for employee managers, staff cashiers and accountants</p>
          </div>
        </section>

        <AdminPanel className="p-6 max-w-[640px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <UserPlus size={20} style={{ color: '#ff6600' }} />
              <strong>User Account Provisioning</strong>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Sharma" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Official Email Address</label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. rahul@dzire.in" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +91 90000 00000" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">System Authorization Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}>
                    <option>Super Admin</option>
                    <option>Store Manager</option>
                    <option>Accountant</option>
                    <option>Cashier POS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Warehouse / Branch Assignment</label>
                  <select value={branch} onChange={e => setBranch(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}>
                    <option>Main Warehouse</option>
                    <option>Delhi Branch Store</option>
                    <option>Mumbai Express Center</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-[#ff6600] text-white rounded-xl h-10 px-6 font-bold flex items-center gap-2">
                <Save size={16} /> Save Admin User
              </Button>
            </div>
          </form>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminAddUser;
