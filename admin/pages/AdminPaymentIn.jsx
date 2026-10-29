import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, RefreshCcw, HandCoins, CheckCircle2, Clock, Download, Eye, Printer, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import './AdminDashboard.css';
import './AdminPaymentIn.css';

const fallbackPaymentsData = [];

const AdminPaymentIn = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const menuRef = useRef(null);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments-in');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.payments)) {
          const cleaned = data.payments.filter(p => !p.id?.startsWith('PAY-IN-2026-'));
          setPaymentsData(cleaned);
          localStorage.setItem('dzire_admin_payments_in', JSON.stringify(cleaned));
        }
      }
    } catch (e) {
      console.warn('PaymentsIn API fallback to local cache:', e);
    }
  };

  useEffect(() => {
    fetchPayments();
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
    const pay = filteredPayments[indexToDelete];
    if (!pay) return;

    try {
      await fetch(`/api/admin/payments-in/${encodeURIComponent(pay.id)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('API error deleting payment:', e);
    }

    const updated = paymentsData.filter(item => item.id !== pay.id);
    setPaymentsData(updated);
    localStorage.setItem('dzire_admin_payments_in', JSON.stringify(updated));
    setOpenMenuIndex(null);
    showToast(`Payment ${pay.id} deleted successfully.`);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setOpenMenuIndex(null);
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setOpenMenuIndex(null);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      await fetch(`/api/admin/payments-in/${encodeURIComponent(editingItem.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
    } catch (e) {
      console.warn('API error updating payment:', e);
    }

    const updated = paymentsData.map(item => item.id === editingItem.id ? editingItem : item);
    setPaymentsData(updated);
    localStorage.setItem('dzire_admin_payments_in', JSON.stringify(updated));
    setEditingItem(null);
    showToast('Payment record updated successfully.');
  };

  const totalIncoming = paymentsData.reduce((sum, p) => {
    const num = p.numAmount !== undefined ? Number(p.numAmount) : (parseFloat(String(p.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + num;
  }, 0);

  const receivedCleared = paymentsData.filter(p => p.status === 'Received').reduce((sum, p) => {
    const num = p.numAmount !== undefined ? Number(p.numAmount) : (parseFloat(String(p.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + num;
  }, 0);

  const pendingClearance = paymentsData.filter(p => p.status === 'Pending Clearance').reduce((sum, p) => {
    const num = p.numAmount !== undefined ? Number(p.numAmount) : (parseFloat(String(p.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + num;
  }, 0);

  const filteredPayments = paymentsData.filter(pay => {
    const matchesSearch = (pay.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pay.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pay.invoiceNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pay.txnRef || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMode = modeFilter === 'All' || (pay.mode || '').includes(modeFilter);

    return matchesSearch && matchesMode;
  });

  return (
    <AdminLayout>
      <div className="dashboard-wrapper payin-page-wrapper" style={{ position: 'relative' }}>

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
          <div className="payin-modal-overlay">
            <div className="payin-modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Payment Receipt Details</h3>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="payin-modal-grid">
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Payment ID</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#2563eb' }}>{selectedItem.id}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Date & Time</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.dateTime}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Customer Name</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.customer}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Invoice Number</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.invoiceNo}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Payment Mode</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.mode}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Transaction Ref</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#64748b' }}>{selectedItem.txnRef}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Amount</p>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '18px', color: '#16a34a' }}>{selectedItem.amount}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Status</p>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: selectedItem.status === 'Received' ? '#f0fdf4' : '#fffbeb',
                    color: selectedItem.status === 'Received' ? '#16a34a' : '#d97706',
                    border: `1px solid ${selectedItem.status === 'Received' ? '#bbf7d0' : '#fef08a'}`
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
                  <Edit2 size={14} /> Edit Payment
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

        {/* Edit Modal */}
        {editingItem && (
          <div className="payin-modal-overlay">
            <div className="payin-modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Edit Payment Record</h3>
                <button onClick={() => setEditingItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="payin-modal-grid">
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#64748b' }}>Customer Name</label>
                  <input
                    type="text"
                    value={editingItem.customer}
                    onChange={(e) => setEditingItem({ ...editingItem, customer: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#64748b' }}>Amount</label>
                  <input
                    type="text"
                    value={editingItem.amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
                      setEditingItem({ ...editingItem, amount: val, numAmount: num });
                    }}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#64748b' }}>Payment Mode</label>
                  <input
                    type="text"
                    value={editingItem.mode}
                    onChange={(e) => setEditingItem({ ...editingItem, mode: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#64748b' }}>Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                  >
                    <option value="Received">Received</option>
                    <option value="Pending Clearance">Pending Clearance</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setEditingItem(null)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="payin-card-container">

          {/* Header */}
          <div className="payin-header-bar">
            <div className="payin-title-group">
              <div className="payin-title-text">
                <h2>Payment In Data Sheet</h2>
                <p>Record and manage incoming customer payments, UPI, Cash, and Card settlements</p>
              </div>
            </div>
            <div className="payin-header-actions">
              <ExportDropdown
                fileName="Payment_In_Report"
                title="Payment In Transactions Report"
                buttonLabel="Export"
                headers={['Payment ID', 'Customer', 'Mobile', 'Date & Time', 'Invoice No', 'Payment Mode', 'Txn Ref', 'Amount', 'Status']}
                rows={filteredPayments.map(item => [
                  item.id,
                  item.customer,
                  item.mobile,
                  item.dateTime,
                  item.invoiceNo,
                  item.mode,
                  item.txnRef,
                  item.amount,
                  item.status
                ])}
                onExportSuccess={(format) => showToast(`Exported ${format} successfully!`)}
              />
              <button 
                className="payin-btn-primary" 
                onClick={() => {
                  fetchPayments();
                  showToast('Data refreshed!');
                }}
              >
                <RefreshCcw size={16} /> Refresh Data
              </button>
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="payin-metrics-grid">
            <div className="payin-metric-card">
              <span className="payin-metric-label">Total Incoming Payments</span>
              <h3 className="payin-metric-val" style={{ color: '#111' }}>₹ {totalIncoming.toLocaleString('en-IN')}</h3>
            </div>
            <div className="payin-metric-card">
              <span className="payin-metric-label" style={{ color: '#16a34a' }}>
                <CheckCircle2 size={14} color="#16a34a" /> Received (Cleared)
              </span>
              <h3 className="payin-metric-val" style={{ color: '#16a34a' }}>₹ {receivedCleared.toLocaleString('en-IN')}</h3>
            </div>
            <div className="payin-metric-card">
              <span className="payin-metric-label" style={{ color: '#d97706' }}>
                <Clock size={14} color="#d97706" /> Pending Clearance
              </span>
              <h3 className="payin-metric-val" style={{ color: '#d97706' }}>₹ {pendingClearance.toLocaleString('en-IN')}</h3>
            </div>
            <div className="payin-metric-card">
              <span className="payin-metric-label">Total Receipts</span>
              <h3 className="payin-metric-val" style={{ color: '#111' }}>{paymentsData.length}</h3>
            </div>
          </div>

          {/* Table Container */}
          <div className="payin-content-area">
            <div className="payin-filter-bar">
              <div className="payin-search-group">
                <div className="payin-search-wrap">
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search by Payment ID, Customer, Invoice..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="payin-search-input"
                  />
                </div>
                <div className="payin-modes-wrap">
                  {['All', 'UPI', 'Cash', 'Card', 'Bank'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setModeFilter(mode)}
                      className={`payin-mode-btn ${modeFilter === mode ? 'active' : ''}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="payin-table-wrapper">
              <table className="payin-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Date & Time</th>
                    <th>Customer Name</th>
                    <th>Invoice Ref</th>
                    <th>Payment Mode</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((pay, idx) => (
                    <tr key={pay.id} style={{ borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#2563eb', fontSize: '13px', cursor: 'pointer' }} onClick={() => handleView(pay)}>
                        {pay.id}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px' }}>
                        {pay.dateTime}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>{pay.customer}</div>
                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>{pay.mobile}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                        {pay.invoiceNo}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                          {pay.mode}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#16a34a', fontSize: '14px' }}>
                        {pay.amount}
                      </td>
                      
                      {/* Status with 3 dots and Dropdown */}
                      <td style={{ padding: '14px 16px', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{
                            background: pay.status === 'Received' ? '#f0fdf4' : '#fffbeb',
                            color: pay.status === 'Received' ? '#16a34a' : '#d97706',
                            border: `1px solid ${pay.status === 'Received' ? '#bbf7d0' : '#fef08a'}`,
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {pay.status === 'Received' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                            {pay.status}
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
                              onClick={() => handleView(pay)}
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
                              onClick={() => handleEdit(pay)}
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
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                        No payment records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentIn;
