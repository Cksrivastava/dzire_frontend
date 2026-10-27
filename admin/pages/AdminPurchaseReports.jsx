import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, ShoppingCart, FileText, CheckCircle2, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import './AdminDashboard.css';

const AdminPurchaseReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [vendorFilter, setVendorFilter] = useState('All');

  const purchaseInvoices = [
    {
      id: 'PINV-2026-081',
      poRef: 'PO-2026-045',
      vendor: 'Tripole Gears Pvt Ltd',
      date: '2026-10-22',
      itemsCount: 120,
      subtotal: 385000,
      taxGst: 46200,
      total: 431200,
      status: 'Paid',
      dueDate: '2026-11-20'
    },
    {
      id: 'PINV-2026-080',
      poRef: 'PO-2026-044',
      vendor: 'Rocksport Supplies Co.',
      date: '2026-10-18',
      itemsCount: 85,
      subtotal: 215000,
      taxGst: 25800,
      total: 240800,
      status: 'Paid',
      dueDate: '2026-11-15'
    },
    {
      id: 'PINV-2026-079',
      poRef: 'PO-2026-042',
      vendor: 'Himalayan Footwear Ltd',
      date: '2026-10-15',
      itemsCount: 200,
      subtotal: 540000,
      taxGst: 64800,
      total: 604800,
      status: 'Partial',
      dueDate: '2026-10-30'
    },
    {
      id: 'PINV-2026-078',
      poRef: 'PO-2026-039',
      vendor: 'Apex Trekking Equipments',
      date: '2026-10-10',
      itemsCount: 60,
      subtotal: 160000,
      taxGst: 19200,
      total: 179200,
      status: 'Pending',
      dueDate: '2026-10-28'
    },
    {
      id: 'PINV-2026-077',
      poRef: 'PO-2026-037',
      vendor: 'Vanguard Textiles & Apparel',
      date: '2026-10-04',
      itemsCount: 150,
      subtotal: 310000,
      taxGst: 37200,
      total: 347200,
      status: 'Paid',
      dueDate: '2026-11-01'
    }
  ];

  const filteredInvoices = purchaseInvoices.filter((inv) => {
    const matchSearch =
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.poRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchVendor = vendorFilter === 'All' || inv.vendor === vendorFilter;
    return matchSearch && matchStatus && matchVendor;
  });

  const totalProcurement = purchaseInvoices.reduce((acc, p) => acc + p.total, 0);
  const totalTaxITC = purchaseInvoices.reduce((acc, p) => acc + p.taxGst, 0);
  const pendingAmount = purchaseInvoices
    .filter((p) => p.status === 'Pending' || p.status === 'Partial')
    .reduce((acc, p) => acc + (p.status === 'Partial' ? p.total / 2 : p.total), 0);

  const vendorsList = Array.from(new Set(purchaseInvoices.map((p) => p.vendor)));

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Purchase Spend</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>₹{totalProcurement.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '4px', fontWeight: '500' }}>Month to Date (MTD)</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Inbound Invoices</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{purchaseInvoices.length} Bills</div>
            <div style={{ fontSize: '12px', color: '#7c3aed', marginTop: '4px', fontWeight: '500' }}>{vendorsList.length} Active Suppliers</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>GST Input Tax (ITC)</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>₹{totalTaxITC.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: '500' }}>Claimable against output tax</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Outstanding Payables</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#e11d48' }}>₹{pendingAmount.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '12px', color: '#e11d48', marginTop: '4px', fontWeight: '500' }}>Pending vendor settlements</div>
          </div>
        </div>

        {/* Invoices Table Card */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #eef2f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '280px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search invoice #, PO #, vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>

              <select
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
              >
                <option value="All">All Vendors</option>
                {vendorsList.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ExportDropdown
                fileName="Purchase_Procurement_Report"
                title="Vendor Purchase & Procurement Invoices Report"
                headers={['Invoice ID', 'PO Reference', 'Vendor Name', 'Invoice Date', 'Due Date', 'Net Amount', 'GST Tax', 'Total Amount', 'Payment Status']}
                rows={filteredInvoices.map((inv) => [
                  inv.id,
                  inv.poRef,
                  inv.vendor,
                  inv.date,
                  inv.dueDate,
                  `₹${inv.subtotal.toLocaleString('en-IN')}`,
                  `₹${inv.taxGst.toLocaleString('en-IN')}`,
                  `₹${inv.total.toLocaleString('en-IN')}`,
                  inv.status
                ])}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6', color: '#64748b' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Invoice & PO #</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Vendor Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Invoice Date</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Taxable Value</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>GST / ITC</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Total Bill</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{inv.id}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>PO: {inv.poRef}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#334155', fontWeight: '500' }}>{inv.vendor}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{inv.date}</td>
                    <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: '500' }}>₹{inv.subtotal.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: '600' }}>₹{inv.taxGst.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', color: '#ff6600', fontWeight: '700' }}>₹{inv.total.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background:
                            inv.status === 'Paid'
                              ? '#dcfce7'
                              : inv.status === 'Partial'
                              ? '#fef3c7'
                              : '#fee2e2',
                          color:
                            inv.status === 'Paid'
                              ? '#15803d'
                              : inv.status === 'Partial'
                              ? '#b45309'
                              : '#b91c1c'
                        }}
                      >
                        {inv.status}
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

export default AdminPurchaseReports;
