import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Calendar, Printer, MoreVertical, ChevronDown, Plus, Eye, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import './AdminDashboard.css';
import './AdminPurchase.css';

const AdminPaymentOut = () => {
  const navigate = useNavigate();
  const [paymentList, setPaymentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('Last 365 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const menuRef = useRef(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/payments-out');
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : (Array.isArray(data.payments) ? data.payments : []);
      setPaymentList(list);
    } catch (err) {
      console.error('Failed to load payments out:', err);
    } finally {
      setLoading(false);
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
    const pay = filteredPaymentOuts[indexToDelete];
    const targetId = pay._id || pay.id || pay.paymentNo;
    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/payments-out/${encodeURIComponent(targetId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setPaymentList(prev => prev.filter(item => (item._id || item.id || item.paymentNo) !== targetId && item.paymentNo !== pay.paymentNo));
        showToast(`Payment Out ${pay.paymentNo} deleted successfully.`);
      } else {
        showToast(data.message || 'Failed to delete payment');
      }
    } catch (err) {
      setPaymentList(prev => prev.filter(item => item.paymentNo !== pay.paymentNo));
      showToast(`Payment Out ${pay.paymentNo} deleted.`);
    }
    setOpenMenuIndex(null);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setOpenMenuIndex(null);
  };

  const handleEdit = (item) => {
    setOpenMenuIndex(null);
    navigate('/admin/payment-out/add', { state: { paymentToEdit: item } });
  };

  const filteredPaymentOuts = paymentList.filter(item => {
    const s = searchTerm.toLowerCase();
    const noMatches = (item.paymentNo || '').toLowerCase().includes(s);
    const partyMatches = (item.party || '').toLowerCase().includes(s);
    const modeMatches = (item.mode || '').toLowerCase().includes(s);
    const statusMatches = (item.status || '').toLowerCase().includes(s);
    return noMatches || partyMatches || modeMatches || statusMatches;
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
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Payment Out Details</h3>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="purchase-modal-grid">
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Payment Number</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#2563eb' }}>{selectedItem.paymentNo}</p>
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
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Payment Mode</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.mode}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Total Amount Settled</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.totalAmountSettled}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Amount Paid</p>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#16a34a' }}>{selectedItem.amountPaid}</p>
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

        {/* Header */}
        <div className="purchase-header-bar">
          <h2 className="purchase-header-title">Payment Out</h2>
          <div className="purchase-header-actions">
            <ExportDropdown
              fileName="Payment_Out_Report"
              title="Payment Out Report"
              buttonLabel="Export"
              headers={['Date', 'Payment No', 'Party Name', 'Settled Amount', 'Amount Paid', 'Payment Mode', 'Status']}
              rows={filteredPaymentOuts.map(item => [
                item.date,
                item.paymentNo,
                item.party,
                item.totalAmountSettled,
                item.amountPaid,
                item.mode,
                item.status
              ])}
              onExportSuccess={(format) => showToast(`Exported ${format} successfully!`)}
            />
            <button 
              onClick={() => navigate('/admin/payment-out/add')} 
              className="purchase-btn-primary"
            >
              <Plus size={16} /> Create Payment Out
            </button>
          </div>
        </div>

        <div className="purchase-content-area">
          {/* Filters & Count */}
          <div className="purchase-filter-bar">
            <div className="purchase-filter-left">
              <div className="purchase-search-wrap">
                <Search size={16} className="purchase-search-icon" />
                <input
                  type="text"
                  placeholder="Search Payment Out..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="purchase-search-input"
                />
              </div>
              <button className="purchase-filter-dropdown-btn">
                <Calendar size={14} /> Last 365 Days <ChevronDown size={14} />
              </button>
            </div>
            <div className="purchase-record-count">
              Total: {filteredPaymentOuts.length} record{filteredPaymentOuts.length === 1 ? '' : 's'}
            </div>
          </div>

          {/* Table */}
          <div className="purchase-table-wrapper">
            <table className="purchase-table">
              <thead>
                <tr>
                  <th style={{ minWidth: '110px' }}>Date <span style={{ fontSize: '10px' }}>↕</span></th>
                  <th style={{ minWidth: '150px' }}>Payment Number</th>
                  <th style={{ minWidth: '170px' }}>Party Name</th>
                  <th style={{ minWidth: '150px' }}>Total Amount Settled</th>
                  <th style={{ minWidth: '130px' }}>Amount Paid</th>
                  <th style={{ minWidth: '130px' }}>Payment Mode</th>
                  <th style={{ minWidth: '130px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPaymentOuts.map((item, idx) => (
                  <tr key={idx} style={{ position: 'relative' }}>
                    <td>{item.date}</td>
                    <td 
                      style={{ color: '#2563eb', fontWeight: '500', cursor: 'pointer' }}
                      onClick={() => handleView(item)}
                    >
                      {item.paymentNo}
                    </td>
                    <td style={{ color: '#1e293b', fontWeight: '500' }}>{item.party}</td>
                    <td style={{ color: '#1e293b', fontWeight: '500' }}>{item.totalAmountSettled}</td>
                    <td style={{ color: '#16a34a', fontWeight: '600' }}>{item.amountPaid}</td>
                    <td>
                      <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                        {item.mode}
                      </span>
                    </td>
                    
                    {/* Status with 3 dots and Dropdown */}
                    <td style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          background: '#dcfce7', 
                          color: '#16a34a', 
                          fontSize: '11px', 
                          fontWeight: '600', 
                          borderRadius: '4px' 
                        }}>
                          {item.status || 'Paid'}
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
                            onClick={() => handleView(item)}
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
                            onClick={() => handleEdit(item)}
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
                {filteredPaymentOuts.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: 0, border: 'none' }}>
                      <div className="purchase-empty-state">
                        <Search size={36} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                        <p style={{ margin: 0, fontWeight: '600', color: '#64748b', fontSize: '14px' }}>No payment out records found</p>
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
    </AdminLayout>
  );
};

export default AdminPaymentOut;
