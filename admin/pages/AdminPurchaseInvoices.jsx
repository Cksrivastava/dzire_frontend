import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import DateRangeFilter from '../components/DateRangeFilter';
import { Search, Calendar, ChevronDown, MoreVertical, FileText, Plus, Eye, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminPurchaseInvoices = () => {
  const navigate = useNavigate();
  const [invoicesList, setInvoicesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    fromDate: '',
    toDate: '',
    activePreset: 'all',
    label: 'All Time',
    isFiltered: false
  });

  const menuRef = useRef(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/purchase/invoices');
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : (Array.isArray(data.invoices) ? data.invoices : []);
      setInvoicesList(list);
    } catch (err) {
      console.error('Failed to load purchase invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDelete = async (indexToDelete) => {
    const inv = filteredInvoices[indexToDelete];
    const targetId = inv._id || inv.id || inv.inv;
    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/purchase/invoices/${encodeURIComponent(targetId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setInvoicesList(prev => prev.filter(item => (item._id || item.id || item.inv) !== targetId && item.inv !== inv.inv));
        showToast(`Purchase Invoice ${inv.inv} deleted successfully.`);
      } else {
        showToast(data.message || 'Failed to delete invoice');
      }
    } catch (err) {
      setInvoicesList(prev => prev.filter(item => item.inv !== inv.inv));
      showToast(`Purchase Invoice ${inv.inv} deleted.`);
    }
    setOpenMenuIndex(null);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setOpenMenuIndex(null);
  };

  const handleEdit = (item) => {
    setOpenMenuIndex(null);
    navigate('/admin/purchase-invoices/add', { state: { invoiceToEdit: item } });
  };

  const getInvoiceDate = (inv) => {
    const val = inv.createdAt || inv.date || inv.invoiceDate;
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  const invoicesInDateRange = invoicesList.filter((inv) => {
    if (!dateRange.isFiltered) return true;
    const d = getInvoiceDate(inv);
    if (!d) return false;
    if (dateRange.fromDate) {
      const parts = dateRange.fromDate.split("-");
      const fromObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0, 0);
      if (d < fromObj) return false;
    }
    if (dateRange.toDate) {
      const parts = dateRange.toDate.split("-");
      const toObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 23, 59, 59, 999);
      if (d > toObj) return false;
    }
    return true;
  });

  // Calculations for KPI summary cards
  const totalPurchaseNum = invoicesInDateRange.reduce((acc, inv) => {
    const val = typeof inv.totalAmount === 'number' 
      ? inv.totalAmount 
      : (parseFloat(String(inv.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return acc + val;
  }, 0);

  const totalPaidNum = invoicesInDateRange.reduce((acc, inv) => {
    if (typeof inv.paidAmount === 'number') return acc + inv.paidAmount;
    if (inv.status === 'Paid') {
      const val = typeof inv.totalAmount === 'number' 
        ? inv.totalAmount 
        : (parseFloat(String(inv.amount || '0').replace(/[^0-9.]/g, '')) || 0);
      return acc + val;
    }
    return acc;
  }, 0);

  const totalUnpaidNum = Math.max(0, totalPurchaseNum - totalPaidNum);

  const filteredInvoices = invoicesInDateRange.filter(item => {
    const s = searchTerm.toLowerCase();
    const invMatches = (item.inv || '').toLowerCase().includes(s);
    const partyMatches = (item.party || '').toLowerCase().includes(s);
    const statusMatches = (item.status || '').toLowerCase().includes(s);
    const amountMatches = (item.amount || '').toLowerCase().includes(s);
    return invMatches || partyMatches || statusMatches || amountMatches;
  });

  return (
    <AdminLayout>
      <div style={{ background: '#fff', minHeight: '100vh', position: 'relative' }}>

        {/* Toast Alert */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#16a34a',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 9999
          }}>
            <CheckCircle2 size={18} /> {toastMessage}
          </div>
        )}

        {/* View Modal */}
        {selectedItem && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998
          }}>
            <div style={{ background: '#fff', borderRadius: '12px', width: '500px', maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Purchase Invoice Details</h3>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Invoice Number</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#2563eb' }}>{selectedItem.inv}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Date</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.date}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Party Name</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.party}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Due In</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.dueIn}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Total Amount</p>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#16a34a' }}>{selectedItem.amount}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Payment Status</p>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: selectedItem.status === 'Paid' ? '#dcfce7' : '#fee2e2',
                    color: selectedItem.status === 'Paid' ? '#16a34a' : '#ef4444'
                  }}>
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => {
                    const item = selectedItem;
                    setSelectedItem(null);
                    handleEdit(item);
                  }}
                  style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit2 size={14} /> Edit Invoice
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Purchase Invoices</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <ExportDropdown
              fileName="Purchase_Invoices_Report"
              title="Purchase Invoices Report"
              buttonLabel="Export"
              headers={['Date', 'Invoice No', 'Vendor Name', 'Due In', 'Total Amount', 'Status']}
              rows={filteredInvoices.map(item => [
                item.date,
                item.inv,
                item.party,
                item.dueIn,
                item.amount,
                item.status
              ])}
              onExportSuccess={(format) => showToast(`Exported ${format} successfully!`)}
            />
            <button
              onClick={() => navigate('/admin/purchase-invoices/add')}
              style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(255, 102, 0, 0.2)' }}
            >
              <Plus size={16} /> Add Purchase Invoice
            </button>
          </div>
        </div>

        <div style={{ padding: '24px' }}>

          {/* Date Filter Bar */}
          <div style={{ marginBottom: '24px' }}>
            <DateRangeFilter
              title="Purchase Invoices Date Filter"
              idPrefix="purchase-invoices-date-filter"
              onFilterChange={(filter) => {
                setDateRange(filter);
              }}
            />
          </div>

          {/* Summary Cards */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div style={{ flex: '1', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: '#e0e7ff', padding: '4px', borderRadius: '4px' }}>
                  <FileText size={14} color="#4f46e5" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#4f46e5' }}>Total Purchase</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                ₹ {totalPurchaseNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ flex: '1', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: '#dcfce7', padding: '4px', borderRadius: '4px' }}>
                  <FileText size={14} color="#16a34a" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a' }}>Paid</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                ₹ {totalPaidNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ flex: '1', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: '#fee2e2', padding: '4px', borderRadius: '4px' }}>
                  <FileText size={14} color="#dc2626" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#dc2626' }}>Unpaid</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                ₹ {totalUnpaidNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '9px' }} />
                <input
                  type="text"
                  placeholder="Search Purchase Invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '6px 12px 6px 32px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', width: '260px' }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#ff6600', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Date <span style={{ fontSize: '10px' }}>↕</span></th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Invoice Number</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Party Name</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Due In</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{inv.date}</td>
                    <td 
                      style={{ padding: '12px 16px', fontSize: '13px', color: '#2563eb', fontWeight: '500', cursor: 'pointer' }}
                      onClick={() => handleView(inv)}
                    >
                      {inv.inv}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>{inv.party}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: inv.dueIn === 'Due Today' ? '#ef4444' : '#64748b', fontWeight: '500' }}>{inv.dueIn}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>
                      {inv.amount}
                      {inv.status === 'Unpaid' && <div style={{ fontSize: '11px', color: '#64748b' }}>(₹ {inv.amount.replace('₹ ', '')} unpaid)</div>}
                    </td>

                    {/* Status with 3 dots and Dropdown */}
                    <td style={{ padding: '12px 16px', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: inv.status === 'Paid' ? '#dcfce7' : '#fee2e2',
                          color: inv.status === 'Paid' ? '#16a34a' : '#ef4444',
                          border: `1px solid ${inv.status === 'Paid' ? '#bbf7d0' : '#fecaca'}`
                        }}>
                          {inv.status}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuIndex(openMenuIndex === idx ? null : idx);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#64748b'
                          }}
                          title="Actions"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {openMenuIndex === idx && (
                        <div
                          ref={menuRef}
                          style={{
                            position: 'absolute',
                            right: '16px',
                            top: '40px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                            zIndex: 100,
                            minWidth: '130px',
                            padding: '4px 0'
                          }}
                        >
                          <div
                            onClick={() => handleView(inv)}
                            style={{
                              padding: '8px 14px',
                              fontSize: '13px',
                              color: '#1e293b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                          >
                            <Eye size={14} color="#3b82f6" /> View
                          </div>

                          <div
                            onClick={() => handleEdit(inv)}
                            style={{
                              padding: '8px 14px',
                              fontSize: '13px',
                              color: '#1e293b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                          >
                            <Edit2 size={14} color="#f59e0b" /> Edit
                          </div>

                          <div
                            onClick={() => handleDelete(idx)}
                            style={{
                              padding: '8px 14px',
                              fontSize: '13px',
                              color: '#ef4444',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              borderTop: '1px solid #f1f5f9'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                          >
                            <Trash2 size={14} color="#ef4444" /> Delete
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                      No purchase invoices found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPurchaseInvoices;
