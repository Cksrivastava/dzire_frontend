import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Users, UserCheck, RefreshCw, Award, HeartHandshake, Phone, Mail } from 'lucide-react';
import './AdminDashboard.css';

const AdminCustomerReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('All');

  const customersList = [
    { id: 1, name: 'Ananya Deshmukh', email: 'ananya.d@gmail.com', phone: '+91 98201 44521', segment: 'VIP', orders: 14, totalSpent: 64200, aov: 4585, lastActive: '2026-10-24' },
    { id: 2, name: 'Vikramaditya Rao', email: 'vikram.rao@outlook.com', phone: '+91 94481 23908', segment: 'VIP', orders: 11, totalSpent: 52800, aov: 4800, lastActive: '2026-10-22' },
    { id: 3, name: 'Sneha Patel', email: 'sneha.patel@yahoo.com', phone: '+91 99042 88123', segment: 'Frequent', orders: 8, totalSpent: 31400, aov: 3925, lastActive: '2026-10-20' },
    { id: 4, name: 'Mohit Saxena', email: 'mohit.saxena@gmail.com', phone: '+91 98110 55431', segment: 'Frequent', orders: 6, totalSpent: 24600, aov: 4100, lastActive: '2026-10-18' },
    { id: 5, name: 'Pooja Kashyap', email: 'pooja.kashyap@gmail.com', phone: '+91 97172 66019', segment: 'Regular', orders: 3, totalSpent: 11200, aov: 3733, lastActive: '2026-10-15' },
    { id: 6, name: 'Devendra Joshi', email: 'dev.joshi@gmail.com', phone: '+91 93214 77800', segment: 'New Buyer', orders: 1, totalSpent: 4200, aov: 4200, lastActive: '2026-10-25' },
    { id: 7, name: 'Priyanka Sen', email: 'priyanka.sen@rediffmail.com', phone: '+91 98302 11984', segment: 'New Buyer', orders: 1, totalSpent: 3899, aov: 3899, lastActive: '2026-10-26' },
  ];

  const filteredCustomers = customersList.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchSegment = segmentFilter === 'All' || c.segment === segmentFilter;
    return matchSearch && matchSegment;
  });

  const totalRegistered = 3450;
  const activeThisMonth = 355;
  const repeatRate = '42.8%';
  const avgLifetimeValue = '₹8,450';

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        {/* Top KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Registered Customers</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{totalRegistered.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '4px', fontWeight: '500' }}>Total customer database</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Active Shoppers (Month)</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{activeThisMonth} Users</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: '500' }}>+12% new acquisitions</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Repeat Purchase Rate</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff7ed', color: '#ff6600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ff6600' }}>{repeatRate}</div>
            <div style={{ fontSize: '12px', color: '#ff6600', marginTop: '4px', fontWeight: '500' }}>High loyalty retention</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Avg Customer LTV</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{avgLifetimeValue}</div>
            <div style={{ fontSize: '12px', color: '#7c3aed', marginTop: '4px', fontWeight: '500' }}>Lifetime spend per buyer</div>
          </div>
        </div>

        {/* Customer Data Table Container */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #eef2f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '280px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search customer name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
              >
                <option value="All">All Customer Segments</option>
                <option value="VIP">VIP Customers</option>
                <option value="Frequent">Frequent Shoppers</option>
                <option value="Regular">Regular</option>
                <option value="New Buyer">New Buyers</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ExportDropdown
                fileName="Customer_Demographics_Report"
                title="Customer Demographics & Retention Analytics Report"
                headers={['Customer Name', 'Email', 'Phone', 'Segment', 'Total Orders', 'Total Spent', 'Avg Order Value', 'Last Active']}
                rows={filteredCustomers.map((c) => [
                  c.name,
                  c.email,
                  c.phone,
                  c.segment,
                  c.orders,
                  `₹${c.totalSpent.toLocaleString('en-IN')}`,
                  `₹${c.aov.toLocaleString('en-IN')}`,
                  c.lastActive
                ])}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6', color: '#64748b' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Contact</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Segment</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Orders</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Total Spent</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Avg Order Value</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{c.name}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>
                      <div style={{ fontSize: '12px' }}>{c.email}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.phone}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background:
                            c.segment === 'VIP'
                              ? '#fef3c7'
                              : c.segment === 'Frequent'
                              ? '#eff6ff'
                              : c.segment === 'Regular'
                              ? '#f1f5f9'
                              : '#ecfdf5',
                          color:
                            c.segment === 'VIP'
                              ? '#b45309'
                              : c.segment === 'Frequent'
                              ? '#1d4ed8'
                              : c.segment === 'Regular'
                              ? '#475569'
                              : '#15803d'
                        }}
                      >
                        {c.segment}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>{c.orders} orders</td>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: '#ff6600' }}>₹{c.totalSpent.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', fontWeight: '500', color: '#0f172a' }}>₹{c.aov.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{c.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomerReports;
