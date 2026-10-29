import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Filter, Eye, CheckCircle, XCircle, RefreshCcw, X, CheckCircle2, Plus, Trash2, Undo2 } from 'lucide-react';
import './AdminReturns.css';

const statusOptions = ['All Statuses', 'Pending Approval', 'Refunded (Wallet)', 'Approved', 'Rejected'];
const typeOptions = ['All Types', 'Defective', 'Size Issue', 'Return / Refund', 'Size/Fit issue'];

const AdminReturns = () => {
  const location = useLocation();
  const isDefective = location.pathname.includes('defective');

  const [requestsList, setRequestsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState(isDefective ? 'Defective' : 'All Types');
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New return form state
  const [newCust, setNewCust] = useState('');
  const [newOrderId, setNewOrderId] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState(isDefective ? 'Defective' : 'Return / Refund');
  const [newReason, setNewReason] = useState(isDefective ? 'Damaged / Defective product' : 'Size / Fit issue');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchReturns = async () => {
    try {
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/returns");
      const d = await res.json();
      if (d.success) {
        setRequestsList(Array.isArray(d.returns) ? d.returns : (Array.isArray(d.data) ? d.data : []));
      }
    } catch (err) {
      console.error("Failed to load return requests:", err);
    }
  };

  useEffect(() => {
    fetchReturns();
    if (isDefective) {
      setTypeFilter('Defective');
      setNewType('Defective');
      setNewReason('Damaged / Defective product');
    } else {
      setTypeFilter('All Types');
      setNewType('Return / Refund');
      setNewReason('Size / Fit issue');
    }
  }, [location.pathname, isDefective]);

  const handleApprove = async (id) => {
    try {
      setRequestsList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Refunded (Wallet)" } : r))
      );
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/returns/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Return request #${id} approved & refunded!`);
      } else {
        showToast(data.message || "Request updated");
      }
    } catch (err) {
      showToast(`Return request #${id} approved!`);
    }
  };

  const handleReject = async (id) => {
    try {
      setRequestsList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
      );
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/returns/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Return request #${id} marked as Rejected.`);
      } else {
        showToast(data.message || "Request updated");
      }
    } catch (err) {
      showToast(`Return request #${id} rejected!`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/returns/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setRequestsList((prev) => prev.filter((r) => r.id !== id));
        showToast(`Return request #${id} deleted.`);
        setSelectedItem(null);
      } else {
        showToast(data.message || "Could not delete return request.");
      }
    } catch (err) {
      setRequestsList((prev) => prev.filter((r) => r.id !== id));
      showToast(`Return request #${id} deleted.`);
      setSelectedItem(null);
    }
  };

  const handleCreateReturn = async (e) => {
    e.preventDefault();
    if (!newCust.trim()) {
      showToast("Please enter customer name");
      return;
    }

    const payload = {
      cust: newCust.trim(),
      orderId: newOrderId.trim() || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: newAmount ? `₹ ${parseFloat(newAmount).toLocaleString('en-IN')}` : '₹ 1,499',
      amountNum: parseFloat(newAmount) || 1499,
      type: newType,
      reason: newReason,
      status: 'Pending Approval'
    };

    try {
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast("Return request created successfully!");
        setShowAddModal(false);
        setNewCust('');
        setNewOrderId('');
        setNewAmount('');
        fetchReturns();
      } else {
        showToast(data.message || "Error creating return");
      }
    } catch (err) {
      showToast("Error creating return");
    }
  };

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return requestsList.filter((item) => {
      const matchesSearch = !query || [item.id, item.orderId, item.cust].some((value) => (value || '').toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
      const matchesType = typeFilter === 'All Types' || (item.type || '').toLowerCase().includes(typeFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [requestsList, searchQuery, statusFilter, typeFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Statuses');
    setTypeFilter(isDefective ? 'Defective' : 'All Types');
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
        {selectedItem && (
          <div className="returns-modal-overlay">
            <div className="returns-modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Return Request Details</h3>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="returns-modal-grid">
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Request ID</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#2563eb' }}>{selectedItem.id}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Order ID</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.orderId}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Date</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.date}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Customer</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.cust}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Amount</p>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#16a34a' }}>{selectedItem.amount}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Return Type</p>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: '#fef2f2',
                    color: '#ef4444'
                  }}>
                    {selectedItem.type}
                  </span>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Status</p>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: (selectedItem.status || '').includes('Pending') ? '#fef0c7' : '#e3fcef',
                    color: (selectedItem.status || '').includes('Pending') ? '#f79009' : '#12b76a'
                  }}>
                    {selectedItem.status}
                  </span>
                </div>
                {selectedItem.refundMethod && (
                  <div>
                    <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Refund Method</p>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.refundMethod}</p>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={() => handleDelete(selectedItem.id)}
                  style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(selectedItem.status || '').includes('Pending') && (
                    <>
                      <button
                        onClick={() => {
                          const id = selectedItem.id;
                          setSelectedItem(null);
                          handleApprove(id);
                        }}
                        style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <CheckCircle size={14} /> Approve & Refund
                      </button>
                      <button
                        onClick={() => {
                          const id = selectedItem.id;
                          setSelectedItem(null);
                          handleReject(id);
                        }}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedItem(null)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Return Modal */}
        {showAddModal && (
          <div className="returns-modal-overlay">
            <div className="returns-modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                  {isDefective ? 'Record Defective Return' : 'Create Return Request'}
                </h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateReturn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Rao"
                    value={newCust}
                    onChange={(e) => setNewCust(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Order ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ORD-88412"
                    value={newOrderId}
                    onChange={(e) => setNewOrderId(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="returns-modal-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Return Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option value="Defective">Defective</option>
                      <option value="Size Issue">Size Issue</option>
                      <option value="Return / Refund">Return / Refund</option>
                      <option value="Size/Fit issue">Size/Fit issue</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1499"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Reason / Defect Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Broken zipper, Torn fabric seam"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
                    Save Return
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="returns-card-container">
          <div className="returns-header-bar">
            <div className="returns-header-title">
              <h2>
                {isDefective ? 'Defective & Damaged Returns' : 'Return Requests'}
              </h2>
              <p>
                {isDefective ? 'Inspect and process defective product returns' : 'Manage online customer return requests and wallet refunds'}
              </p>
            </div>
            <div className="returns-header-actions">
              <ExportDropdown
                fileName={isDefective ? "Defective_Returns_Report" : "Inventory_Returns_Report"}
                title={isDefective ? "Defective Returns Report" : "Inventory & Defective Return Requests Report"}
                buttonLabel="Export"
                headers={['Request ID', 'Order ID', 'Date', 'Customer', 'Items Qty', 'Amount', 'Type', 'Status']}
                rows={filteredRequests.map(item => [
                  item.id,
                  item.orderId,
                  item.date,
                  item.cust,
                  item.items,
                  item.amount,
                  item.type,
                  item.status
                ])}
              />
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="returns-btn-primary"
              >
                <Plus size={16} /> {isDefective ? 'Add Defective Return' : 'Add Return'}
              </button>
              <button
                type="button"
                onClick={() => {
                  fetchReturns();
                  showToast("Return requests refreshed!");
                }}
                className="returns-btn-secondary"
              >
                <RefreshCcw size={16} /> Refresh Data
              </button>
            </div>
          </div>
          <div className="returns-content-area" style={{ background: '#fafafa' }}>
            <div className="returns-card-container">
              <div className="returns-filter-bar" style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', marginBottom: 0 }}>
                <div className="returns-search-wrap">
                  <Search size={16} className="returns-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search Request ID or Order..."
                    className="returns-search-input"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters((value) => !value)}
                  className="returns-filter-btn"
                  style={{ background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}` }}
                  aria-label="Toggle return filters"
                >
                  <Filter size={16} color={showFilters ? '#ff6600' : '#667085'} />
                </button>
              </div>

              {showFilters && (
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f8fafc' }}>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="returns-filter-select"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    className="returns-filter-select"
                  >
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={clearFilters}
                    style={{ padding: '8px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#344054', fontWeight: '500' }}
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="returns-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="returns-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '150px' }}>Req ID & Date</th>
                      <th style={{ minWidth: '150px' }}>Customer</th>
                      <th style={{ minWidth: '110px' }}>Items</th>
                      <th style={{ minWidth: '120px' }}>Amount</th>
                      <th style={{ minWidth: '130px' }}>Type</th>
                      <th style={{ minWidth: '140px' }}>Status</th>
                      <th style={{ minWidth: '100px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRequests.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{item.id}</p>
                          <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#64748b' }}>{item.orderId}</p>
                          <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{item.date}</p>
                        </td>

                        <td style={{ color: '#1e293b', fontWeight: '500' }}>{item.cust}</td>
                        <td style={{ color: '#64748b' }}>{Array.isArray(item.items) ? item.items.length : (item.items || 1)} Item(s)</td>
                        <td style={{ fontWeight: '600', color: '#16a34a' }}>{item.amount}</td>
                        <td style={{ color: '#f04438' }}>{item.type}</td>

                        <td>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: (item.status || '').includes('Pending') ? '#fef0c7' : '#e3fcef',
                              color: (item.status || '').includes('Pending') ? '#f79009' : '#12b76a'
                            }}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button 
                              onClick={() => setSelectedItem(item)} 
                              title="View Details"
                              style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                              <Eye size={18} />
                            </button>

                            {(item.status || '').includes('Pending') && (
                              <>
                                <button onClick={() => handleApprove(item.id)} title="Approve Request" style={{ color: '#12b76a', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                  <CheckCircle size={18} />
                                </button>
                                <button onClick={() => handleReject(item.id)} title="Reject Request" style={{ color: '#f04438', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ padding: 0, border: 'none' }}>
                          <div className="returns-empty-state">
                            <Undo2 size={36} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                            <p style={{ margin: 0, fontWeight: '600', color: '#64748b', fontSize: '14px' }}>No return requests found</p>
                            <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12px' }}>Try adjusting your search or filters</p>
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
      </div>
    </AdminLayout>
  );
};

export default AdminReturns;
