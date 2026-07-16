import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, History, Search } from 'lucide-react';

const initialLogs = [
  { id: 1, timestamp: "2026-07-10 11:20:14", user: "Admin User", role: "Super Admin", action: "Price Updated", target: "CTR OD4 Shoes", details: "Changed selling price from 1399 to 1499 Rs" },
  { id: 2, timestamp: "2026-07-10 10:45:00", user: "Inventory Mgr", role: "Inventory Manager", action: "Stock Adjustment", target: "Verge 45L Backpack", details: "Manually adjusted sellable stock from 10 to 15 units" },
  { id: 3, timestamp: "2026-07-10 09:12:30", user: "Cashier POS", role: "Cashier", action: "POS Refund Created", target: "Order #DZ-1002", details: "Initiated partial refund of 799 Rs back to Store Credit wallet" },
  { id: 4, timestamp: "2026-07-09 17:34:11", user: "Admin User", role: "Super Admin", action: "Credit Adjustments", target: "Customer ID 1092", details: "Manually awarded welcome bonus of 50 loyalty points" },
  { id: 5, timestamp: "2026-07-09 16:22:45", user: "Marketing Mgr", role: "Marketing Manager", action: "Coupon Created", target: "MONSOON500", details: "Added coupon code with 500 Rs flat discount and minimum spend 5000 Rs" },
];

const AdminAllActivities = () => {
  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => 
    !search.trim() || [l.user, l.action, l.target, l.details].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History color="#ff6600" />
              All Activities Feed
            </h1>
            <p>Chronological security and operation event log registry tracking all system modifications.</p>
          </div>
          <button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} /> Refresh Logs
          </button>
        </section>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Recent Operations Log</h3>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#667085' }} />
              <input 
                type="text" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search log logs..." 
                style={{ padding: '8px 12px 8px 32px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '250px' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Timestamp</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>User &amp; Role</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Action Type</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Target Item</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Audit details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{l.timestamp}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <strong style={{ color: '#111' }}>{l.user}</strong> <br/>
                      <span style={{ fontSize: '11px', color: '#667085' }}>{l.role}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#f3f4f6', color: '#374151' }}>
                        {l.action}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600' }}>{l.target}</td>
                    <td style={{ padding: '16px 20px', color: '#475569' }}>{l.details}</td>
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

export default AdminAllActivities;
