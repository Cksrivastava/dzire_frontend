import React from 'react';
import AdminLayout from '../pages/AdminLayout';
import { Search, Download, RefreshCcw, Landmark } from 'lucide-react';

const hsnSummary = [
  { hsn: '6109.10.00', desc: 'Cotton T-Shirts & Apparel', rate: '12%', taxableValue: '₹5,00,000', cgst: '₹30,000', sgst: '₹30,000', igst: '₹0', totalTax: '₹60,000' },
  { hsn: '6203.42.00', desc: 'Cotton Trousers & Denim', rate: '12%', taxableValue: '₹3,50,000', cgst: '₹21,000', sgst: '₹21,000', igst: '₹0', totalTax: '₹42,000' },
  { hsn: '9506.91.90', desc: 'Gym & Sports Equipment', rate: '18%', taxableValue: '₹4,00,000', cgst: '₹36,000', sgst: '₹36,000', igst: '₹0', totalTax: '₹72,000' },
];

const AdminHsnSummary = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark size={24} color="#ff6600" />
              HSN Summary
            </h1>
            <p>Harmonized System of Nomenclature (HSN) sales distribution breakdown required for GSTR-1 filings.</p>
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>HSN Code Wise Tax Distribution</h3>
            <button
              type="button"
              onClick={() => alert('Exporting HSN Summary Report...')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
            >
              <Download size={14} /> Export Report
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>HSN Code</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Description</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>GST Rate</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Taxable Value</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>CGST</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>SGST</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>IGST</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Total GST Collected</th>
                </tr>
              </thead>
              <tbody>
                {hsnSummary.map((item) => (
                  <tr key={item.hsn} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#111' }}>{item.hsn}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '500' }}>{item.desc}</td>
                    <td style={{ padding: '16px 20px', color: '#175cd3', fontWeight: '600' }}>{item.rate}</td>
                    <td style={{ padding: '16px 20px' }}>{item.taxableValue}</td>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{item.cgst}</td>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{item.sgst}</td>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{item.igst}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#ff6600' }}>{item.totalTax}</td>
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

export default AdminHsnSummary;
