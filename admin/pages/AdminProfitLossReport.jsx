import React from 'react';
import AdminLayout from '../pages/AdminLayout';
import { Download, RefreshCcw, TrendingUp } from 'lucide-react';

const AdminProfitLossReport = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={24} color="#ff6600" />
              Profit &amp; Loss Statement
            </h1>
            <p>Calculate total operating income, deduct COGS and overheads to evaluate net revenue margin percentages.</p>
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

        {/* P&L Snapshot */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '12px', color: '#667085' }}>Gross Revenue (Month)</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#175cd3' }}>₹14,20,500</h3>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '12px', color: '#667085' }}>Cost of Goods Sold (COGS)</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#f04438' }}>₹6,80,000</h3>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '12px', color: '#667085' }}>Net Profit Margin</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#12b76a' }}>52.1% (₹7,40,500)</h3>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Operating Statement Overview</h3>
            <button
              type="button"
              onClick={() => alert('Downloading PDF Financial Statement...')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
            >
              <Download size={14} /> Export Financial PDF
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { category: 'Operating Income', values: [{ name: 'Online Store Sales', val: '₹9,80,500' }, { name: 'POS Physical Sales', val: '₹4,40,000' }], subtotal: '₹14,20,500', subtotalColor: '#175cd3' },
              { category: 'Cost of Goods (COGS)', values: [{ name: 'Inventory Purchases', val: '₹6,12,000' }, { name: 'Inbound Logistics Freight', val: '₹68,000' }], subtotal: '₹6,80,000', subtotalColor: '#f04438' },
              { category: 'Operating Expenses', values: [{ name: 'Razorpay PG Fees', val: '₹19,610' }, { name: 'SMS & WhatsApp Gateway APIs', val: '₹4,500' }], subtotal: '₹24,110', subtotalColor: '#f04438' },
            ].map((section) => (
              <div key={section.category} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#111', fontWeight: '600' }}>{section.category}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                  {section.values.map((v) => (
                    <div key={v.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#667085' }}>
                      <span>{v.name}</span>
                      <span>{v.val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', fontWeight: '600', fontSize: '14px' }}>
                  <span>Total {section.category}</span>
                  <span style={{ color: section.subtotalColor }}>{section.subtotal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfitLossReport;
