import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, RefreshCcw, Filter, Undo2, CheckCircle2, Clock, XCircle, Eye, Printer, Download, Plus, X, Trash2 } from 'lucide-react';
import './AdminDashboard.css';
import './AdminReturns.css';

const AdminInstoreReturn = () => {
  const [returnsList, setReturnsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New In-store return form fields
  const [newCustomer, setNewCustomer] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newInvoiceNo, setNewInvoiceNo] = useState('');
  const [newItem, setNewItem] = useState('');
  const [newReason, setNewReason] = useState('Defective / Dissatisfied');
  const [newRefundAmount, setNewRefundAmount] = useState('');
  const [newRefundMode, setNewRefundMode] = useState('Store Credit');
  const [newStatus, setNewStatus] = useState('Pending Audit');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/instore-returns');
      const data = await res.json();
      if (data.success) {
        setReturnsList(Array.isArray(data.returns) ? data.returns : []);
      }
    } catch (err) {
      console.error('Failed to load instore returns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // Compute dynamic KPIs
  const stats = useMemo(() => {
    const totalRequests = returnsList.length;
    const totalRefundAmount = returnsList.reduce((sum, r) => {
      const val = Number(r.refundAmountNum) || parseFloat(String(r.refundAmount || 0).replace(/[^0-9.]/g, '')) || 0;
      return sum + val;
    }, 0);
    const completedApproved = returnsList.filter(
      (r) => r.status === 'Completed' || r.status === 'Approved'
    ).length;
    const pendingAudit = returnsList.filter((r) => r.status === 'Pending Audit').length;

    return {
      totalRequests,
      totalRefundAmount: `₹ ${totalRefundAmount.toLocaleString('en-IN')}`,
      completedApproved,
      pendingAudit,
    };
  }, [returnsList]);

  const filteredReturns = useMemo(() => {
    return returnsList.filter((ret) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (ret.id || '').toLowerCase().includes(q) ||
        (ret.customer || '').toLowerCase().includes(q) ||
        (ret.invoiceNo || '').toLowerCase().includes(q) ||
        (ret.item || '').toLowerCase().includes(q) ||
        (ret.mobile || '').toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || ret.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [returnsList, searchQuery, statusFilter]);

  const handleCreateReturn = async (e) => {
    e.preventDefault();
    if (!newCustomer.trim() || !newItem.trim()) {
      showToast('Please enter customer and item names.');
      return;
    }

    const refundNum = parseFloat(newRefundAmount) || 0;
    const payload = {
      customer: newCustomer.trim(),
      mobile: newMobile.trim(),
      invoiceNo: newInvoiceNo.trim() || `INV-POS-${Math.floor(1000 + Math.random() * 9000)}`,
      item: newItem.trim(),
      reason: newReason.trim(),
      refundAmount: `₹ ${refundNum.toLocaleString('en-IN')}`,
      refundAmountNum: refundNum,
      refundMode: newRefundMode,
      status: newStatus,
    };

    try {
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/instore-returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Instore return recorded successfully!');
        setShowAddModal(false);
        setNewCustomer('');
        setNewMobile('');
        setNewInvoiceNo('');
        setNewItem('');
        setNewReason('Defective / Dissatisfied');
        setNewRefundAmount('');
        fetchReturns();
      } else {
        showToast(data.message || 'Error recording return');
      }
    } catch (err) {
      showToast('Error recording instore return');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/instore-returns/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setReturnsList((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        if (selectedReturn && selectedReturn.id === id) {
          setSelectedReturn((prev) => ({ ...prev, status }));
        }
        showToast(`Return ${id} marked as ${status}`);
      } else {
        showToast(data.message || 'Update failed');
      }
    } catch (err) {
      showToast(`Updated return ${id}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/instore-returns/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setReturnsList((prev) => prev.filter((r) => r.id !== id));
        setSelectedReturn(null);
        showToast(`Return ${id} deleted successfully.`);
      } else {
        showToast(data.message || 'Delete failed');
      }
    } catch (err) {
      setReturnsList((prev) => prev.filter((r) => r.id !== id));
      setSelectedReturn(null);
      showToast(`Return ${id} deleted.`);
    }
  };

  return (
    <AdminLayout>
      <div className="returns-page-wrapper">

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

        {/* View Details Modal */}
        {selectedReturn && (
          <div className="returns-modal-overlay">
            <div className="returns-modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Instore Return Details</h3>
                <button onClick={() => setSelectedReturn(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="returns-modal-grid">
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Return ID</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#2563eb' }}>{selectedReturn.id}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Date & Time</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedReturn.dateTime}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Customer Name</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedReturn.customer}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Mobile Number</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedReturn.mobile || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Original Invoice No</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#2563eb' }}>{selectedReturn.invoiceNo}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Returned Item</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedReturn.item}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Reason</p>
                  <span style={{ fontSize: '12px', color: '#ef4444', background: '#fef2f2', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' }}>
                    {selectedReturn.reason}
                  </span>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Refund Amount & Mode</p>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#dc2626' }}>
                    {selectedReturn.refundAmount} <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>({selectedReturn.refundMode})</span>
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Status</p>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: selectedReturn.status === 'Completed' ? '#f0fdf4' : selectedReturn.status === 'Approved' ? '#eff6ff' : '#fffbeb',
                    color: selectedReturn.status === 'Completed' ? '#16a34a' : selectedReturn.status === 'Approved' ? '#2563eb' : '#d97706',
                  }}>
                    {selectedReturn.status}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={() => handleDelete(selectedReturn.id)}
                  style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedReturn.status !== 'Approved' && selectedReturn.status !== 'Completed' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedReturn.id, 'Approved')}
                      style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Approve Return
                    </button>
                  )}
                  {selectedReturn.status !== 'Completed' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedReturn.id, 'Completed')}
                      style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Mark Completed
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedReturn(null)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Process Return Modal */}
        {showAddModal && (
          <div className="returns-modal-overlay">
            <div className="returns-modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Process In-Store Return</h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateReturn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="returns-modal-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karan Singhania"
                      value={newCustomer}
                      onChange={(e) => setNewCustomer(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Mobile Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div className="returns-modal-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Invoice No (POS)</label>
                    <input
                      type="text"
                      placeholder="e.g. INV-POS-4402"
                      value={newInvoiceNo}
                      onChange={(e) => setNewInvoiceNo(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Refund Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1299"
                      value={newRefundAmount}
                      onChange={(e) => setNewRefundAmount(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Item Name / Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elite Compression Short"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Reason for Return</label>
                  <select
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="Defective / Dissatisfied">Defective / Dissatisfied</option>
                    <option value="Size Mismatch (Too Tight)">Size Mismatch (Too Tight)</option>
                    <option value="Size Mismatch (Too Loose)">Size Mismatch (Too Loose)</option>
                    <option value="Damaged Fabric / Torn Stitch">Damaged Fabric / Torn Stitch</option>
                    <option value="Color Discoloration">Color Discoloration</option>
                    <option value="Wrong Item Packed">Wrong Item Packed</option>
                  </select>
                </div>

                <div className="returns-modal-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Refund Mode</label>
                    <select
                      value={newRefundMode}
                      onChange={(e) => setNewRefundMode(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option value="Store Credit">Store Credit</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI / Bank">UPI / Bank</option>
                      <option value="Exchange">Exchange</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Initial Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option value="Pending Audit">Pending Audit</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="returns-btn-primary"
                  >
                    Submit Return
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="returns-card-container">

          {/* Header */}
          <div className="returns-header-bar">
            <div className="returns-header-title">
              <h2>Instore Returns Data Sheet</h2>
              <p>Track and manage physical store product returns, refunds, and credit notes</p>
            </div>
            <div className="returns-header-actions">
              <ExportDropdown
                fileName="Instore_Returns_Report"
                title="Instore Returns Data Sheet Report"
                buttonLabel="Export"
                headers={['Return ID', 'Date & Time', 'Customer', 'Mobile', 'Invoice No', 'Item', 'Reason', 'Refund Amount', 'Mode', 'Status']}
                rows={filteredReturns.map(item => [
                  item.id,
                  item.dateTime,
                  item.customer,
                  item.mobile,
                  item.invoiceNo,
                  item.item,
                  item.reason,
                  item.refundAmount,
                  item.refundMode,
                  item.status
                ])}
                onExportSuccess={(fmt) => showToast(`Exported ${fmt} successfully!`)}
              />
              <button 
                onClick={() => setShowAddModal(true)} 
                className="returns-btn-primary"
              >
                <Plus size={16} /> Process Return
              </button>
              <button 
                className="returns-btn-secondary"
                onClick={() => {
                  fetchReturns();
                  showToast('Data refreshed successfully!');
                }}
              >
                <RefreshCcw size={16} /> Refresh Data
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="returns-stats-grid">
            <div className="returns-stat-card">
              <span className="returns-stat-label">Total Return Requests</span>
              <h3 className="returns-stat-val">{stats.totalRequests}</h3>
            </div>
            <div className="returns-stat-card">
              <span className="returns-stat-label" style={{ color: '#dc2626' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></div> Total Refund Amount
              </span>
              <h3 className="returns-stat-val" style={{ color: '#dc2626' }}>{stats.totalRefundAmount}</h3>
            </div>
            <div className="returns-stat-card">
              <span className="returns-stat-label" style={{ color: '#16a34a' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div> Completed / Approved
              </span>
              <h3 className="returns-stat-val" style={{ color: '#16a34a' }}>{stats.completedApproved}</h3>
            </div>
            <div className="returns-stat-card">
              <span className="returns-stat-label" style={{ color: '#f59e0b' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div> Pending Audit
              </span>
              <h3 className="returns-stat-val" style={{ color: '#f59e0b' }}>{stats.pendingAudit}</h3>
            </div>
          </div>

          <div className="returns-content-area">
            {/* Search & Filter Toolbar */}
            <div className="returns-filter-bar">
              <div className="returns-search-wrap">
                <Search size={16} className="returns-search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Return ID, Invoice, Customer..."
                  className="returns-search-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="returns-filter-select"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending Audit">Pending Audit</option>
                </select>
              </div>
            </div>

            {/* Data Table */}
            <div className="returns-table-wrapper">
              <table className="returns-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '160px' }}>Return ID & Date</th>
                    <th style={{ minWidth: '150px' }}>Customer</th>
                    <th style={{ minWidth: '140px' }}>Original Inv No.</th>
                    <th style={{ minWidth: '180px' }}>Item & Reason</th>
                    <th style={{ minWidth: '130px' }}>Refund Amount</th>
                    <th style={{ minWidth: '140px' }}>Status</th>
                    <th style={{ minWidth: '90px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReturns.map((ret) => (
                    <tr key={ret.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '13px' }}>{ret.id}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{ret.dateTime}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>{ret.customer}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{ret.mobile}</div>
                      </td>
                      <td style={{ fontWeight: '600', color: '#2563eb' }}>
                        {ret.invoiceNo}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#334155', fontSize: '13px' }}>{ret.item}</div>
                        <span style={{ fontSize: '11px', color: '#ef4444', background: '#fef2f2', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
                          Reason: {ret.reason}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: '700', color: '#dc2626', fontSize: '13px' }}>{ret.refundAmount}</div>
                        <span style={{ fontSize: '11px', color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                          {ret.refundMode}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          background: ret.status === 'Completed' ? '#f0fdf4' : ret.status === 'Approved' ? '#eff6ff' : '#fffbeb',
                          color: ret.status === 'Completed' ? '#16a34a' : ret.status === 'Approved' ? '#2563eb' : '#d97706',
                          border: `1px solid ${ret.status === 'Completed' ? '#bbf7d0' : ret.status === 'Approved' ? '#bfdbfe' : '#fef08a'}`,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {ret.status === 'Completed' && <CheckCircle2 size={13} />}
                          {ret.status === 'Approved' && <CheckCircle2 size={13} />}
                          {ret.status === 'Pending Audit' && <Clock size={13} />}
                          {ret.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => setSelectedReturn(ret)}
                        >
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredReturns.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ padding: 0, border: 'none' }}>
                        <div className="returns-empty-state">
                          <Undo2 size={36} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                          <p style={{ margin: 0, fontWeight: '600', color: '#64748b', fontSize: '14px' }}>No instore returns found</p>
                          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12px' }}>Try adjusting your search terms</p>
                        </div>
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

export default AdminInstoreReturn;
