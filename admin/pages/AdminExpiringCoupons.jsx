import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, TicketPercent, Bell } from 'lucide-react';

const expiringCoupons = [
  { code: 'MONSOON500', type: 'Flat ₹500 Off', usageLimit: '820 / 1000 claims', expiry: 'In 48 Hours', date: 'Jul 12, 2026', severity: 'high' },
  { code: 'DZIREFEST', type: '15% Percentage Off', usageLimit: '145 / 500 claims', expiry: 'In 5 Days', date: 'Jul 15, 2026', severity: 'low' },
];

const AdminExpiringCoupons = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TicketPercent color="#ff6600" />
              Expiring Coupons
            </h1>
            <p>Monitor campaign discount codes reaching their end dates or absolute claims ceilings limits.</p>
          </div>
          <button
            className="admin-primary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw size={18} />
            Refresh Data
          </button>
        </section>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Active Discount Codes Expiring</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Coupon Code</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Benefit Type</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Claims Usage Ratio</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>End Expiry Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Time Remaining</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expiringCoupons.map((item) => (
                  <tr key={item.code} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#ff6600', fontFamily: 'monospace' }}>{item.code}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '500', color: '#111' }}>{item.type}</td>
                    <td style={{ padding: '16px 20px' }}>{item.usageLimit}</td>
                    <td style={{ padding: '16px 20px' }}>{item.date}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        background: item.severity === 'high' ? '#fef2f2' : '#fffbeb',
                        color: item.severity === 'high' ? '#ef4444' : '#b45309'
                      }}>
                        {item.expiry}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button onClick={() => alert('Extending campaign timeline...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#344054', fontWeight: '500' }}>
                        Extend Validity
                      </button>
                    </td>
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

export default AdminExpiringCoupons;
