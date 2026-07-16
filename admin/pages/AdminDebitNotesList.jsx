import React from 'react';
import AdminLayout from '../pages/AdminLayout';
import { Search, Download, RefreshCcw, FileText } from 'lucide-react';

const debitNotes = [
  { id: 'DN-8010', date: 'Jul 10, 2026', supplier: 'Apex Sports Distributors', refPO: 'PO-520', reason: 'Goods damaged in transit', value: '₹4,200', status: 'Active' },
  { id: 'DN-8009', date: 'Jul 09, 2026', supplier: 'FitLife Equipment Corp', refPO: 'PO-515', reason: 'Short supply on order', value: '₹1,800', status: 'Active' },
  { id: 'DN-8008', date: 'Jul 08, 2026', supplier: 'SportPro Supplies', refPO: 'PO-510', reason: 'Quality rejection – batch 22', value: '₹6,500', status: 'Adjusted' },
];

const AdminDebitNotesList = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={24} color="#ff6600" />
              Debit Notes List (Accounting)
            </h1>
            <p>Full financial audit ledger of debit adjustments raised against suppliers for returns/rejections.</p>
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Issued Debit Notes Summary</h3>
            <button
              type="button"
              onClick={() => alert('Exporting Debit Notes Ledger...')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
            >
              <Download size={14} /> Export Debit Notes
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Note ID</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Supplier</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Ref PO</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Reason</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Value</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {debitNotes.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#111' }}>{item.id}</td>
                    <td style={{ padding: '16px 20px' }}>{item.date}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '500' }}>{item.supplier}</td>
                    <td style={{ padding: '16px 20px', color: '#175cd3' }}>{item.refPO}</td>
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

export default AdminDebitNotesList;
