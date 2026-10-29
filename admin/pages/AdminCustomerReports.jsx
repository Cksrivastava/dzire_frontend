import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Users, UserCheck, RefreshCw, Award, HeartHandshake, Phone, Mail } from 'lucide-react';
import './AdminDashboard.css';
import './AdminReports.css';

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
      <div className="dashboard-wrapper reports-page-wrapper">
        {/* Top KPI Cards */}
        <div className="reports-kpi-grid">
          <div className="reports-kpi-card">
            <div className="reports-kpi-card-header">
              <span className="reports-kpi-label">Registered Customers</span>
              <div className="reports-kpi-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <Users size={20} />
              </div>
            </div>
            <div className="reports-kpi-value">{totalRegistered.toLocaleString('en-IN')}</div>
            <div className="reports-kpi-meta" style={{ color: '#2563eb' }}>Total customer database</div>
          </div>

          <div className="reports-kpi-card">
            <div className="reports-kpi-card-header">
              <span className="reports-kpi-label">Active Shoppers (Month)</span>
              <div className="reports-kpi-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <UserCheck size={20} />
              </div>
            </div>
            <div className="reports-kpi-value">{activeThisMonth} Users</div>
            <div className="reports-kpi-meta" style={{ color: '#10b981' }}>+12% new acquisitions</div>
          </div>

          <div className="reports-kpi-card">
            <div className="reports-kpi-card-header">
              <span className="reports-kpi-label">Repeat Purchase Rate</span>
              <div className="reports-kpi-icon" style={{ background: '#fff7ed', color: '#ff6600' }}>
                <RefreshCw size={20} />
              </div>
            </div>
            <div className="reports-kpi-value" style={{ color: '#ff6600' }}>{repeatRate}</div>
            <div className="reports-kpi-meta" style={{ color: '#ff6600' }}>High loyalty retention</div>
          </div>

          <div className="reports-kpi-card">
            <div className="reports-kpi-card-header">
              <span className="reports-kpi-label">Avg Customer LTV</span>
              <div className="reports-kpi-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <Award size={20} />
              </div>
            </div>
            <div className="reports-kpi-value">{avgLifetimeValue}</div>
            <div className="reports-kpi-meta" style={{ color: '#7c3aed' }}>Lifetime spend per buyer</div>
          </div>
        </div>

        {/* Customer Data Table Container */}
        <div className="reports-table-card">
          <div className="reports-filter-bar">
            <div className="reports-filter-left">
              <div className="reports-search-box">
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search customer name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="reports-select"
              >
                <option value="All">All Customer Segments</option>
                <option value="VIP">VIP Customers</option>
                <option value="Frequent">Frequent Shoppers</option>
                <option value="Regular">Regular</option>
                <option value="New Buyer">New Buyers</option>
              </select>
            </div>

            <div className="reports-filter-right">
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

          <div className="reports-table-scroll">
            <table className="reports-table">
              <thead>
                <tr style={{ background: '#ff6600', color: '#ffffff' }}>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Customer</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Contact</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Segment</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Orders</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Total Spent</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Avg Order Value</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Last Active</th>
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
