import React, { useMemo, useState } from 'react';
import AdminLayout from '../pages/AdminLayout';
import { Search, Filter, Download, RefreshCcw, FileText, CheckCircle, Clock, Percent } from 'lucide-react';

const gstSummary = [
  { month: 'June 2026', outwardTaxable: '₹14,20,500', inwardTaxable: '₹6,80,000', cgstOutward: '₹1,27,845', sgstOutward: '₹1,27,845', igstOutward: '₹0', cgstInward: '₹61,200', sgstInward: '₹61,200', netGstPayable: '₹1,33,290', status: 'Filed' },
  { month: 'May 2026', outwardTaxable: '₹12,45,000', inwardTaxable: '₹5,10,000', cgstOutward: '₹1,12,050', sgstOutward: '₹1,12,050', igstOutward: '₹0', cgstInward: '₹45,900', sgstInward: '₹45,900', netGstPayable: '₹1,32,300', status: 'Filed' },
  { month: 'April 2026', outwardTaxable: '₹10,12,000', inwardTaxable: '₹4,80,000', cgstOutward: '₹91,080', sgstOutward: '₹91,080', igstOutward: '₹0', cgstInward: '₹43,200', sgstInward: '₹43,200', netGstPayable: '₹95,760', status: 'Filed' },
];

const AdminGstReports = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Percent size={24} color="#ff6600" />
              GST Reports
            </h1>
            <p>Review monthly GST liabilities, Input Tax Credit (ITC) reconciliation, and filed GSTR history.</p>
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

        {/* GST Statistics Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Outward GST Liability (Q1)', value: '₹6,61,950', color: '#ff6600' },
            { label: 'Input Tax Credit (ITC)', value: '₹3,00,600', color: '#12b76a' },
            { label: 'Net Payable GST Paid', value: '₹3,61,350', color: '#175cd3' },
            { label: 'Last Filing Date', value: 'Jul 08, 2026', color: '#344054' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '16px 20px' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#667085', fontWeight: '500', textTransform: 'uppercase' }}>{stat.label}</p>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Monthly Tax Summary</h3>
            <button
              type="button"
              onClick={() => alert('Downloading Excel Tax Ledger...')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
            >
              <Download size={14} /> Export GST Ledger
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Month</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Outward Taxable</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Inward Taxable</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>CGST (Out)</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>SGST (Out)</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>CGST (In)</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>SGST (In)</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Net Payable GST</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {gstSummary.map((item) => (
                  <tr key={item.month} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.month}</td>
                    <td style={{ padding: '16px 20px' }}>{item.outwardTaxable}</td>
                    <td style={{ padding: '16px 20px' }}>{item.inwardTaxable}</td>
                    <td style={{ padding: '16px 20px', color: '#f04438' }}>{item.cgstOutward}</td>
                    <td style={{ padding: '16px 20px', color: '#f04438' }}>{item.sgstOutward}</td>
                    <td style={{ padding: '16px 20px', color: '#12b76a' }}>{item.cgstInward}</td>
                    <td style={{ padding: '16px 20px', color: '#12b76a' }}>{item.sgstInward}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#ff6600' }}>{item.netGstPayable}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', background: '#f0fdf4', color: '#15803d' }}>
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

export default AdminGstReports;
