import React, { useState } from 'react';
import AdminLayout from '../pages/AdminLayout';
import { Search, Download, RefreshCcw, Calculator } from 'lucide-react';

const salesRegister = [
  { date: 'Jul 10, 2026', totalOrders: 18, onlineRevenue: '₹42,390', posRevenue: '₹22,110', taxCollected: '₹11,610', netSales: '₹52,890' },
  { date: 'Jul 09, 2026', totalOrders: 22, onlineRevenue: '₹51,000', posRevenue: '₹18,400', taxCollected: '₹12,492', netSales: '₹56,908' },
  { date: 'Jul 08, 2026', totalOrders: 15, onlineRevenue: '₹34,500', posRevenue: '₹12,000', taxCollected: '₹8,370', netSales: '₹38,130' },
  { date: 'Jul 07, 2026', totalOrders: 20, onlineRevenue: '₹48,900', posRevenue: '₹25,600', taxCollected: '₹13,410', netSales: '₹61,090' },
];

const AdminSalesRegister = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={24} color="#ff6600" />
              Sales Register Ledger
            </h1>
            <p>Chronological record of total sales invoicing ledger, split by storefront channel.</p>
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Sales Register Daily Summaries</h3>
            <button
              type="button"
              onClick={() => alert('Exporting Sales Register to Excel...')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
            >
              <Download size={14} /> Export to Excel
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Total Orders</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Online Revenue</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>POS Revenue</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Tax Collected</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Net Sales Value</th>
                </tr>
              </thead>
              <tbody>
                {salesRegister.map((item) => (
                  <tr key={item.date} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.date}</td>
                    <td style={{ padding: '16px 20px' }}>{item.totalOrders}</td>
                    <td style={{ padding: '16px 20px', color: '#175cd3' }}>{item.onlineRevenue}</td>
                    <td style={{ padding: '16px 20px', color: '#7c3aed' }}>{item.posRevenue}</td>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{item.taxCollected}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#111' }}>{item.netSales}</td>
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

export default AdminSalesRegister;
