import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Database, Search, ArrowLeftRight } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const S = {
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
};

const AdminDataChangeLogs = () => {
  const [changes] = useState([
    { id: 1, time: '09 Jul 12:45 PM', user: 'Admin User', type: 'Product Price', target: 'Traditional CTR Shoes', oldVal: '₹1,399', newVal: '₹1,499' },
    { id: 2, time: '09 Jul 11:20 AM', user: 'Inventory Mgr', type: 'Stock Unit Count', target: 'Verge 45L Backpack', oldVal: '10', newVal: '15' },
    { id: 3, time: '08 Jul 16:30 PM', user: 'Marketing Mgr', type: 'Coupon Discount', target: 'WINTER300', oldVal: '₹300', newVal: '₹400' }
  ]);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Data Change Logs</h1>
            <p>Verify catalog modifications, stock level increments, and database adjustments</p>
          </div>
        </section>

        <AdminPanel className="p-0 overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Timestamp</th>
                <th style={S.th}>Modified By</th>
                <th style={S.th}>Data Type</th>
                <th style={S.th}>Target SKU/Field</th>
                <th style={S.th}>Original Value</th>
                <th style={S.th}>New Value</th>
              </tr>
            </thead>
            <tbody>
              {changes.map(c => (
                <tr key={c.id}>
                  <td style={S.td}>{c.time}</td>
                  <td style={S.td}><strong>{c.user}</strong></td>
                  <td style={S.td}>{c.type}</td>
                  <td style={S.td}>{c.target}</td>
                  <td style={{ ...S.td, textDecoration: 'line-through', color: '#f04438' }}>{c.oldVal}</td>
                  <td style={{ ...S.td, color: '#12b76a', fontWeight: '700' }}>{c.newVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminDataChangeLogs;
