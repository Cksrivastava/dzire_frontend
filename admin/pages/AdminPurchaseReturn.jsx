import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Calendar, ChevronDown, MoreVertical, FileText, Plus, Eye, Edit2, Trash2, X, CheckCircle2, Download, Printer, Filter, RotateCcw } from 'lucide-react';
import './AdminDashboard.css';
import './AdminPurchase.css';

const AdminPurchaseReturn = () => {
  const navigate = useNavigate();
  const [returnsList, setReturnsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const menuRef = useRef(null);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/purchase-returns');
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : (Array.isArray(data.returns) ? data.returns : []);
      setReturnsList(list);
    } catch (err) {
      console.error('Failed to load purchase returns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
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
    const itemToDelete = filteredReturns[indexToDelete];
    const targetId = itemToDelete._id || itemToDelete.id || itemToDelete.returnNo;
    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/purchase-returns/${encodeURIComponent(targetId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setReturnsList(prev => prev.filter(item => (item._id || item.id || item.returnNo) !== targetId && item.returnNo !== itemToDelete.returnNo));
        showToast(`Purchase Return ${itemToDelete.returnNo} deleted successfully.`);
      } else {
        showToast(data.message || 'Failed to delete return');
      }
    } catch (err) {
      setReturnsList(prev => prev.filter(item => item.returnNo !== itemToDelete.returnNo));
      showToast(`Purchase Return ${itemToDelete.returnNo} deleted.`);
    }
    setOpenMenuIndex(null);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setOpenMenuIndex(null);
  };

  const handleEdit = (item) => {
    setOpenMenuIndex(null);
    navigate('/admin/purchase-return/add', { state: { returnToEdit: item } });
  };

  // Dynamic calculations for KPI summary cards
  const totalReturnsAmount = returnsList.reduce((acc, it) => {
    const val = typeof it.totalAmount === 'number' 
      ? it.totalAmount 
      : (parseFloat(String(it.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return acc + val;
  }, 0);

  const settledList = returnsList.filter(it => (it.status || '').toLowerCase() === 'settled');
  const settledAmount = settledList.reduce((acc, it) => {
    const val = typeof it.totalAmount === 'number' 
      ? it.totalAmount 
      : (parseFloat(String(it.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return acc + val;
  }, 0);

  const pendingList = returnsList.filter(it => (it.status || '').toLowerCase() !== 'settled');
  const pendingAmount = pendingList.reduce((acc, it) => {
    const val = typeof it.totalAmount === 'number' 
      ? it.totalAmount 
      : (parseFloat(String(it.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return acc + val;
  }, 0);

  const exportToExcel = () => {
    const headers = ['Return Date', 'Return No', 'Original Invoice', 'Vendor / Party Name', 'Items Qty', 'Return Amount', 'Refund Mode', 'Status', 'Reason'];
    const rows = filteredReturns.map(item => [
      item.date,
      item.returnNo,
      item.originalInvoice,
      `"${item.party}"`,
      item.itemsCount,
      `"${item.amount}"`,
      item.refundMode,
      item.status,
      `"${item.reason}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Purchase_Returns_Sheet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Purchase Returns Excel sheet downloaded successfully!');
  };

  const filteredReturns = returnsList.filter(item => {
    const matchesSearch = item.returnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalInvoice.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="purchase-page-wrapper">

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
          <div className="purchase-modal-overlay">
            <div className="purchase-modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '700' }}>Purchase Return Details</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Complete transaction breakdown</p>
                </div>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="purchase-modal-grid">
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Return Number</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#ff6600' }}>{selectedItem.returnNo}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Return Date</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.date}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Vendor / Party Name</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.party}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Original Invoice</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#2563eb' }}>{selectedItem.originalInvoice}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Returned Items Qty</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.itemsCount} Items</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Total Refund Amount</p>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#16a34a' }}>{selectedItem.amount}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Refund Mode</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.refundMode}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Status</p>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: selectedItem.status === 'Settled' ? '#dcfce7' : '#fef3c7',
                    color: selectedItem.status === 'Settled' ? '#16a34a' : '#d97706'
                  }}>
                    {selectedItem.status}
                  </span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Return Reason</p>
                  <p style={{ margin: 0, fontWeight: '500', color: '#334155', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    {selectedItem.reason}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => {
                    const item = selectedItem;
                    setSelectedItem(null);
                    handleEdit(item);
                  }}
                  className="purchase-btn-primary"
                >
                  <Edit2 size={14} /> Edit Return
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

        {/* Header Bar */}
        <div className="purchase-header-bar">
          <div className="purchase-header-title">
            <h2>Purchase Returns</h2>
            <p>Excel sheet and records of all vendor purchase returns</p>
          </div>
          <div className="purchase-header-actions">
            <ExportDropdown
              fileName="Purchase_Returns_Report"
              title="Purchase Returns Report"
              buttonLabel="Export"
              headers={['Date', 'Return No', 'Original Inv', 'Vendor Name', 'Items Qty', 'Refund Mode', 'Amount', 'Status', 'Reason']}
              rows={filteredReturns.map(item => [
                item.date,
                item.returnNo,
                item.originalInvoice,
                item.party,
                item.itemsCount,
                item.refundMode,
                item.amount,
                item.status,
                item.reason
              ])}
              onExportSuccess={(format) => showToast(`Exported ${format} successfully!`)}
            />
            <button
              onClick={() => navigate('/admin/purchase-return/add')}
              className="purchase-btn-primary"
            >
              <Plus size={16} /> Create Purchase Return
            </button>
          </div>
        </div>

        <div className="purchase-content-area">

          {/* Summary KPI Cards */}
          <div className="purchase-kpi-grid">
            <div className="purchase-kpi-card" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
              <div className="purchase-kpi-head">
                <div className="purchase-kpi-icon" style={{ background: '#ffedd5' }}>
                  <FileText size={15} color="#ea580c" />
                </div>
                <span className="purchase-kpi-label" style={{ color: '#ea580c' }}>Total Purchase Returns</span>
              </div>
              <div className="purchase-kpi-val">
                ₹ {totalReturnsAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="purchase-kpi-sub" style={{ color: '#9a3412' }}>
                {returnsList.length} Total Return Invoices
              </span>
            </div>

            <div className="purchase-kpi-card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className="purchase-kpi-head">
                <div className="purchase-kpi-icon" style={{ background: '#dcfce7' }}>
                  <CheckCircle2 size={15} color="#16a34a" />
                </div>
                <span className="purchase-kpi-label" style={{ color: '#16a34a' }}>Settled / Adjusted</span>
              </div>
              <div className="purchase-kpi-val">
                ₹ {settledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="purchase-kpi-sub" style={{ color: '#166534' }}>
                {settledList.length} Returns Settled
              </span>
            </div>

            <div className="purchase-kpi-card" style={{ background: '#fefce8', border: '1px solid #fef08a' }}>
              <div className="purchase-kpi-head">
                <div className="purchase-kpi-icon" style={{ background: '#fef9c3' }}>
                  <RotateCcw size={15} color="#ca8a04" />
                </div>
                <span className="purchase-kpi-label" style={{ color: '#ca8a04' }}>In Process / Pending</span>
              </div>
              <div className="purchase-kpi-val">
                ₹ {pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="purchase-kpi-sub" style={{ color: '#854d0e' }}>
                {pendingList.length} Returns in Process
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="purchase-filter-bar">
            <div className="purchase-filter-left">
              <div className="purchase-search-wrap">
                <Search size={16} className="purchase-search-icon" />
                <input
                  type="text"
                  placeholder="Search Return No, Vendor, Invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="purchase-search-input"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} color="#64748b" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="purchase-filter-select"
                >
                  <option value="All">All Status</option>
                  <option value="Settled">Settled</option>
                  <option value="In Process">In Process</option>
                </select>
              </div>

              <button className="purchase-filter-dropdown-btn">
                <Calendar size={14} /> Last 365 Days <ChevronDown size={14} />
              </button>
            </div>

            <div className="purchase-record-count">
              Showing <strong>{filteredReturns.length}</strong> of <strong>{returnsList.length}</strong> records
            </div>
          </div>

          {/* Responsive Data Sheet Table */}
          <div className="purchase-table-wrapper">
            <table className="purchase-table">
              <thead>
                <tr>
                  <th style={{ minWidth: '105px' }}>Date</th>
                  <th style={{ minWidth: '135px' }}>Return Number</th>
                  <th style={{ minWidth: '135px' }}>Original Inv No.</th>
                  <th style={{ minWidth: '160px' }}>Vendor / Party Name</th>
                  <th style={{ minWidth: '95px', textAlign: 'center' }}>Items Qty</th>
                  <th style={{ minWidth: '115px' }}>Refund Mode</th>
                  <th style={{ minWidth: '125px' }}>Return Amount</th>
                  <th style={{ minWidth: '110px' }}>Status</th>
                  <th style={{ minWidth: '70px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ padding: '0' }}>
                      <div className="purchase-empty-state">
                        <FileText size={32} style={{ color: '#94a3b8' }} />
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#334155' }}>
                          No purchase return records match your filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReturns.map((item, idx) => (
                    <tr key={item.id}>
                      <td style={{ color: '#64748b' }}>{item.date}</td>
                      <td style={{ color: '#ff6600', fontWeight: '600' }}>{item.returnNo}</td>
                      <td style={{ color: '#2563eb', fontWeight: '500' }}>{item.originalInvoice}</td>
                      <td style={{ color: '#1e293b', fontWeight: '600' }}>{item.party}</td>
                      <td style={{ color: '#475569', textAlign: 'center' }}>{item.itemsCount}</td>
                      <td style={{ color: '#64748b' }}>{item.refundMode}</td>
                      <td style={{ color: '#16a34a', fontWeight: '700' }}>{item.amount}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: item.status === 'Settled' ? '#dcfce7' : '#fef3c7',
                          color: item.status === 'Settled' ? '#16a34a' : '#d97706'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', position: 'relative' }}>
                        <button
                          onClick={() => setOpenMenuIndex(openMenuIndex === idx ? null : idx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b' }}
                          title="Actions"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Action Dropdown Menu */}
                        {openMenuIndex === idx && (
                          <div
                            ref={menuRef}
                            style={{
                              position: 'absolute',
                              right: '24px',
                              top: '36px',
                              background: '#fff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              zIndex: 10,
                              width: '130px',
                              textAlign: 'left'
                            }}
                          >
                            <div
                              onClick={() => handleView(item)}
                              style={{ padding: '8px 12px', fontSize: '12px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                            >
                              <Eye size={14} color="#3b82f6" /> View Details
                            </div>
                            <div
                              onClick={() => handleEdit(item)}
                              style={{ padding: '8px 12px', fontSize: '12px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                            >
                              <Edit2 size={14} color="#ff6600" /> Edit Return
                            </div>
                            <div
                              onClick={() => handleDelete(idx)}
                              style={{ padding: '8px 12px', fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                            >
                              <Trash2 size={14} color="#ef4444" /> Delete
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPurchaseReturn;
