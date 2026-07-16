import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, ArrowLeftRight } from 'lucide-react';

const returnLogs = [
  { id: 1, timestamp: "2026-07-10 09:12:30", user: "Cashier POS", action: "Refund Settled", target: "Order #DZ-1002", details: "Initiated partial refund of 799 Rs back to Store Credit loyalty wallet" },
  { id: 2, timestamp: "2026-07-09 15:40:11", user: "Returns Officer", action: "Return Checked", target: "RET-1001", details: "Inspected returned items at warehouse; items verified in resaleable condition" },
];

const AdminReturnActivities = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeftRight color="#ff6600" />
              Return Activities Log
            </h1>
            <p>Track return intake requests verification status, inspections, and refund payouts.</p>
          </div>
          <button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} /> Refresh Logs
          </button>
        </section>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Return &amp; Refund Logs</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Timestamp</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Officer / Actor</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Target Claim</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Action</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>details</th>
                </tr>
              </thead>
              <tbody>
                {returnLogs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{l.timestamp}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{l.user}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#ff6600' }}>{l.target}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#fef2f2', color: '#ef4444' }}>
                        {l.action}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>{l.details}</td>
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

export default AdminReturnActivities;
