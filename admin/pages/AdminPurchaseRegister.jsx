import React from 'react';
import AdminLayout from '../pages/AdminLayout';
import { Search, Download, RefreshCcw, FileText } from 'lucide-react';

const purchases = [
  { date: 'Jul 10, 2026', invoiceNo: 'INV-2026-A9', supplier: 'Apex Sports Distributors', rawPO: 'PO-520', tax: '₹756', baseVal: '₹4,200', total: '₹4,956' },
  { date: 'Jul 09, 2026', invoiceNo: 'INV-2026-A8', supplier: 'FitLife Equipment Corp', rawPO: 'PO-515', tax: '₹324', baseVal: '₹1,800', total: '₹2,124' },
  { date: 'Jul 08, 2026', invoiceNo: 'INV-2026-A7', supplier: 'SportPro Supplies', rawPO: 'PO-510', tax: '₹1,170', baseVal: '₹6,500', total: '₹7,670' },
];

const AdminPurchaseRegister = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={24} color="#ff6600" />
              Purchase Register
            </h1>
            <p>Verify incoming trade purchase invoices, supplier billing histories, and input GST credits.</p>
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Inward Purchase Ledger</h3>
            <button
              type="button"
              onClick={() => alert('Exporting Purchase Register Ledger...')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
            >
              <Download size={14} /> Export Register
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Supplier Invoice</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Supplier Name</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Ref PO</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Base Value</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>GST Credit</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((item) => (
                  <tr key={item.invoiceNo} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px' }}>{item.date}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.invoiceNo}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '500' }}>{item.supplier}</td>
                    <td style={{ padding: '16px 20px', color: '#175cd3' }}>{item.rawPO}</td>
                    <td style={{ padding: '16px 20px' }}>{item.baseVal}</td>
                    <td style={{ padding: '16px 20px', color: '#12b76a', fontWeight: '500' }}>+ {item.tax}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#111' }}>{item.total}</td>
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

export default AdminPurchaseRegister;
