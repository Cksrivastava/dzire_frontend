import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Filter, Eye, CheckCircle, XCircle, RefreshCcw, X, CheckCircle2, Plus, Trash2 } from 'lucide-react';

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
      <div className="dashboard-wrapper" style={{ position: 'relative' }}>

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
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Return Request Details</h3>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
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

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => handleDelete(selectedItem.id)}
                  style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
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
            <div style={{ background: '#fff', borderRadius: '12px', width: '480px', maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                    style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Save Return
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                {isDefective ? 'Defective & Damaged Returns' : 'Return Requests'}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> {isDefective ? 'Add Defective Return' : 'Add Return'}
              </button>
              <button
                type="button"
                onClick={() => {
                  fetchReturns();
                  showToast("Return requests refreshed!");
                }}
                style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCcw size={16} /> Refresh Data
              </button>
            </div>
          </div>
          <div style={{ padding: '24px', background: '#fafafa' }}>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#667085' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search Request ID or Order..."
                    style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '300px' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters((value) => !value)}
                  style={{ padding: '8px 12px', background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}`, borderRadius: '6px', cursor: 'pointer' }}
                  aria-label="Toggle return filters"
                >
                  <Filter size={16} color="#667085" />
                </button>
              </div>

              {showFilters && (
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f9fafb' }}>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
                  >
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={clearFilters}
                    style={{ padding: '8px 12px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#344054' }}
                  >
                    Clear
                  </button>
                </div>
              )}

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#ff6600', textAlign: 'left', fontSize: '12px', color: '#ffffff', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Req ID & Date</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Items</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Amount</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Type</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((item) => (
                    <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.id}</p>
                        <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#667085' }}>{item.orderId}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>{item.date}</p>
                      </td>

                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111' }}>{item.cust}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#667085' }}>{Array.isArray(item.items) ? item.items.length : (item.items || 1)} Item(s)</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600' }}>{item.amount}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#f04438' }}>{item.type}</td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: (item.status || '').includes('Pending') ? '#fef0c7' : '#e3fcef',
                            color: (item.status || '').includes('Pending') ? '#f79009' : '#12b76a'
                          }}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button 
                            onClick={() => setSelectedItem(item)} 
                            title="View Details"
                            style={{ color: '#667085', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
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
                    <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td colSpan="7" style={{ padding: '28px 20px', textAlign: 'center', fontSize: '14px', color: '#667085' }}>
                        No return requests found.
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

export default AdminReturns;
