import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Plus, Terminal, Download, FileText, CreditCard, Undo2, HandCoins, Printer, Eye } from 'lucide-react';
import './AdminDashboard.css';

const fallbackSalesData = [];

const getCleanItemsCount = (item) => {
  if (!item) return 1;
  if (Array.isArray(item.items)) return item.items.length;
  if (item.itemsCount !== undefined && item.itemsCount !== null) {
    const n = Number(item.itemsCount);
    if (!isNaN(n) && n > 0) return n;
  }
  if (typeof item.items === 'number' && !isNaN(item.items)) return item.items;
  if (typeof item.items === 'string') {
    const n = parseInt(item.items, 10);
    if (!isNaN(n) && n > 0) return n;
  }
  return 1;
};

const AdminPOSDataSheet = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('All');
  const [posSalesData, setPosSalesData] = useState([]);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/admin/pos/invoices');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.invoices)) {
          const cleaned = data.invoices.filter(inv => !['INV-2026-084', 'INV-2026-083', 'INV-2026-082', 'INV-2026-081', 'INV-2026-080'].includes(inv.id));
          const formatted = cleaned.map(inv => ({
            ...inv,
            items: getCleanItemsCount(inv),
            amount: typeof inv.amount === 'string' ? inv.amount : `₹ ${(inv.totalAmount || 0).toLocaleString('en-IN')}`
          }));
          setPosSalesData(formatted);
          localStorage.setItem('dzire_admin_pos_invoices', JSON.stringify(formatted));
        }
      }
    } catch (e) {
      console.warn('POS invoices live fetch fallback to local:', e);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const totalSales = posSalesData.reduce((sum, sale) => {
    const val = sale.totalAmount !== undefined ? Number(sale.totalAmount) : (parseFloat(String(sale.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + val;
  }, 0);

  const transactionsCount = posSalesData.length;

  const paidAmount = posSalesData.reduce((sum, sale) => {
    if (sale.status === 'Paid') {
      const val = sale.totalAmount !== undefined ? Number(sale.totalAmount) : (parseFloat(String(sale.amount || '0').replace(/[^0-9.]/g, '')) || 0);
      return sum + val;
    }
    return sum + (Number(sale.receivedAmount) || 0);
  }, 0);

  const pendingAmount = posSalesData.reduce((sum, sale) => {
    if (sale.status === 'Pending') {
      const val = sale.totalAmount !== undefined ? Number(sale.totalAmount) : (parseFloat(String(sale.amount || '0').replace(/[^0-9.]/g, '')) || 0);
      return sum + val;
    }
    return sum + (Number(sale.balanceAmount) || 0);
  }, 0);

  const filteredSales = posSalesData.filter(sale => {
    const matchesSearch = (sale.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.mobile || '').includes(searchTerm);

    const matchesMode = paymentModeFilter === 'All' || sale.mode === paymentModeFilter;

    return matchesSearch && matchesMode;
  });

  const handlePrint = (sale) => {
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${sale.id} - DZIRE STORE</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 16px; }
            .title { font-size: 20px; font-weight: 800; color: #ff6600; margin: 0; }
            .sub { font-size: 11px; color: #64748b; margin-top: 4px; }
            .meta { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
            th { text-align: left; background: #f8fafc; padding: 8px; border-bottom: 1px solid #cbd5e1; }
            td { padding: 8px; border-bottom: 1px solid #f1f5f9; }
            .total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 16px; margin-top: 16px; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
            .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">DZIRE OUTDOOR STORE</h1>
            <p class="sub">Official POS Tax Invoice</p>
          </div>
          <div class="meta">
            <div>
              <strong>Invoice:</strong> ${sale.id}<br/>
              <strong>Date:</strong> ${sale.dateTime || new Date().toLocaleString()}
            </div>
            <div style="text-align: right;">
              <strong>Customer:</strong> ${sale.customer}<br/>
              <strong>Phone:</strong> ${sale.mobile || 'N/A'}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Mode</th>
                <th>Qty</th>
                <th>Status</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${sale.mode}</td>
                <td>${getCleanItemsCount(sale)} item(s)</td>
                <td>${sale.status}</td>
                <td style="text-align: right;">${sale.amount}</td>
              </tr>
            </tbody>
          </table>
          <div class="total-row">
            <span>Net Payable:</span>
            <span>${sale.amount}</span>
          </div>
          <div class="footer">
            Thank you for shopping at Dzire Outdoor Equipment Store!
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        {/* Data Sheet Table Container */}
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          
          {/* Header Action Bar */}
          <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f6', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flexShrink: 1 }}>
              <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '8px', background: '#fff0e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6600', flexShrink: 0 }}>
                <Terminal size={20} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap' }}>POS Billing Data Sheet</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Point of Sale transaction data sheet, invoices, and billing history</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
              <button 
                onClick={() => navigate('/admin/quotation')} 
                style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                <FileText size={16} color="#10b981" /> Quotation
              </button>
              <button 
                onClick={() => navigate('/admin/payment-in')} 
                style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                <HandCoins size={16} color="#3b82f6" /> Payment In
              </button>
              <ExportDropdown
                fileName="POS_Billing_Data_Sheet"
                title="POS Sales Invoices Billing Report"
                buttonLabel="Export POS Data"
                headers={['Invoice No', 'Customer', 'Mobile', 'Date & Time', 'Payment Mode', 'Items Qty', 'Amount', 'Status']}
                rows={filteredSales.map(item => [
                  item.id,
                  item.customer,
                  item.mobile,
                  item.dateTime,
                  item.mode,
                  getCleanItemsCount(item),
                  item.amount,
                  item.status
                ])}
              />
              <button 
                onClick={() => navigate('/admin/pos/create-sales-invoice')} 
                style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)', whiteSpace: 'nowrap' }}
              >
                <Plus size={16} /> Create Sales Invoice
              </button>
            </div>
          </div>

          {/* Metric Summary Cards Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#eef2f6', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ padding: '16px 24px', background: '#fff' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Total POS Sales</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#111' }}>₹ {totalSales.toLocaleString('en-IN')}</h3>
            </div>
            <div style={{ padding: '16px 24px', background: '#fff' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Transactions Count</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#6366f1' }}>{transactionsCount}</h3>
            </div>
            <div style={{ padding: '16px 24px', background: '#fff' }}>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div> Paid Amount
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#16a34a' }}>₹ {paidAmount.toLocaleString('en-IN')}</h3>
            </div>
            <div style={{ padding: '16px 24px', background: '#fff' }}>
              <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></div> Pending Amount
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#dc2626' }}>₹ {pendingAmount.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          {/* Controls Bar */}
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search invoice, customer..." 
                  style={{ width: '100%', padding: '7px 12px 7px 32px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff' }} 
                />
              </div>
              <select 
                value={paymentModeFilter}
                onChange={(e) => setPaymentModeFilter(e.target.value)}
                style={{ padding: '7px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff', color: '#334155' }}
              >
                <option value="All">All Payment Modes</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
          </div>

          {/* Table Sheet */}
          <table className="dash-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer Name</th>
                <th>Date & Time</th>
                <th>Payment Mode</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <button 
                      onClick={() => navigate(`/admin/pos/create-sales-invoice?id=${encodeURIComponent(sale.id)}`)}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', fontSize: '13px', padding: 0, cursor: 'pointer' }}
                    >
                      {sale.id}
                    </button>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>{sale.customer}</div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>{sale.mobile}</div>
                  </td>
                  <td style={{ color: '#475569', fontSize: '12px' }}>{sale.dateTime}</td>
                  <td>
                    <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                      {sale.mode}
                    </span>
                  </td>
                  <td style={{ color: '#475569' }}>{getCleanItemsCount(sale)} Items</td>
                  <td style={{ fontWeight: '700', color: '#111' }}>{sale.amount}</td>
                  <td>
                    <span style={{ 
                      background: sale.status === 'Paid' ? '#f0fdf4' : '#fef2f2',
                      color: sale.status === 'Paid' ? '#16a34a' : '#dc2626',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {sale.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '6px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => navigate(`/admin/pos/create-sales-invoice?id=${encodeURIComponent(sale.id)}`)}
                        title="View Invoice"
                        style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={13} /> View
                      </button>
                      <button 
                        onClick={() => handlePrint(sale)}
                        title="Print Invoice"
                        style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Printer size={13} /> Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    No POS invoices found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPOSDataSheet;
