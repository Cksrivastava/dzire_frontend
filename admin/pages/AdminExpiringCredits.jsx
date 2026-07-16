import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, Gift, Mail } from 'lucide-react';

const expiringCredits = [
  { id: 1, cust: 'Aarav Mehta', email: 'aarav.m@example.com', expiringPoints: '1,500 Credits', expiryDate: 'Jun 30, 2026', valuation: '₹1,500 equivalent' },
  { id: 2, cust: 'Meera Nair', email: 'meera.nair@example.com', expiringPoints: '600 Credits', expiryDate: 'Jul 05, 2026', valuation: '₹600 equivalent' },
];

const AdminExpiringCredits = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gift color="#ff6600" />
              Expiring Credits
            </h1>
            <p>Onboard and monitor customers with loyalty store credit points scheduled to expire within 30 days.</p>
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Customers with Expiring Loyalty Credits</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer Email</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Expiring Points Balance</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Valuation</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Scheduled Expiry Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expiringCredits.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.cust}</td>
                    <td style={{ padding: '16px 20px' }}>{item.email}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#b45309' }}>{item.expiringPoints}</td>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{item.valuation}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600' }}>{item.expiryDate}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button onClick={() => alert('Sending credit expiry WhatsApp notification...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#344054', fontWeight: '500' }}>
                        <Mail size={14} /> Notify Customer
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

export default AdminExpiringCredits;
