import React from 'react';
import AdminLayout from '../pages/AdminLayout';
import { Search, Download, RefreshCcw, FileText } from 'lucide-react';

const creditNotes = [
  { id: 'CN-9010', date: 'Jul 10, 2026', cust: 'Rahul Mehta', refOrder: '#ONL-5012', reason: 'Product returned', value: '₹1,499', status: 'Active' },
  { id: 'CN-9009', date: 'Jul 09, 2026', cust: 'Ananya Iyer', refOrder: '#ONL-5010', reason: 'Wrong item shipped', value: '₹2,899', status: 'Active' },
  { id: 'CN-9008', date: 'Jul 08, 2026', cust: 'Vikram Singh', refOrder: '#ONL-4920', reason: 'Partial return', value: '₹1,299', status: 'Redeemed' },
];

const AdminCreditNotesList = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={24} color="#ff6600" />
              Credit Notes List (Accounting)
            </h1>
            <p>Full financial audit ledger of customer credit adjustments, issued vouchers and wallet adjustments.</p>
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
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Issued Credit Notes Summary</h3>
            <button
              type="button"
              onClick={() => alert('Exporting Credit Notes Ledger...')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
            >
              <Download size={14} /> Export Credit Notes
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Note ID</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Ref Order</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Reason</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Value</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {creditNotes.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#111' }}>{item.id}</td>
                    <td style={{ padding: '16px 20px' }}>{item.date}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '500' }}>{item.cust}</td>
                    <td style={{ padding: '16px 20px', color: '#175cd3' }}>{item.refOrder}</td>
                    <td style={{ padding: '16px 20px' }}>{item.reason}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#111' }}>{item.value}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        background: item.status === 'Active' ? '#f0fdf4' : '#f3f4f6',
                        color: item.status === 'Active' ? '#15803d' : '#374151'
                      }}>
                        {item.status}
                      </span>
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

export default AdminCreditNotesList;
