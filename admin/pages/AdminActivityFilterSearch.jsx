import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, RefreshCcw, SlidersHorizontal } from 'lucide-react';

const mockLogs = [
  { id: 1, timestamp: "2026-07-10 11:20:14", user: "Admin User", role: "Super Admin", action: "Price Updated", target: "Traditional CTR OD4 Shoes", details: "Changed selling price from 1399 to 1499 Rs" },
  { id: 2, timestamp: "2026-07-10 10:45:00", user: "Inventory Mgr", role: "Inventory Manager", action: "Stock Adjustment", target: "Verge 45L Backpack", details: "Manually adjusted safety count (+5 units)" },
];

const AdminActivityFilterSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("all");

  const filtered = mockLogs.filter(log => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || log.user.toLowerCase().includes(q) || log.details.toLowerCase().includes(q) || log.target.toLowerCase().includes(q);
    const matchRole = role === 'all' || log.role === role;
    return matchSearch && matchRole;
  });

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal color="#ff6600" />
              Advanced Activity Search
            </h1>
            <p>Drill down into security audit logs using advanced query filters, user roles selectors, and custom parameters.</p>
          </div>
          <button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} /> Reset Filters
          </button>
        </section>

        {/* Filters panel */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#667085' }} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search log logs by user, action, target item, or change details..." 
                style={{ width: '100%', padding: '12px 12px 12px 38px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', fontSize: '14px' }}
            >
              <option value="all">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Inventory Manager">Inventory Manager</option>
            </select>
          </div>
        </div>

        {/* Results table */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Filtered Logs Results</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px' }}>Timestamp</th>
                <th style={{ padding: '12px 20px' }}>User &amp; Role</th>
                <th style={{ padding: '12px 20px' }}>Action</th>
                <th style={{ padding: '12px 20px' }}>Target</th>
                <th style={{ padding: '12px 20px' }}>details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                  <td style={{ padding: '16px 20px', color: '#667085' }}>{l.timestamp}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <strong>{l.user}</strong> <br/>
                    <span style={{ fontSize: '11px', color: '#667085' }}>{l.role}</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>{l.action}</td>
                  <td style={{ padding: '16px 20px', fontWeight: '600' }}>{l.target}</td>
                  <td style={{ padding: '16px 20px' }}>{l.details}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No logs match your filter criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityFilterSearch;
