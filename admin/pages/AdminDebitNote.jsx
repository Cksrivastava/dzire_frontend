import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Calendar, Printer, MoreVertical, ChevronDown, Plus, Eye, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import './AdminDashboard.css';
import './AdminPurchase.css';

const AdminDebitNote = () => {
  const navigate = useNavigate();
  const [debitList, setDebitList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('Last 365 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const menuRef = useRef(null);

  const fetchDebitNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/debit-notes');
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : (Array.isArray(data.debitNotes) ? data.debitNotes : []);
      setDebitList(list);
    } catch (err) {
      console.error('Failed to load debit notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebitNotes();
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
    const deb = filteredDebitNotes[indexToDelete];
    const targetId = deb._id || deb.id || deb.debitNo;
    try {
      const res = await fetch(`https://dzire-backend.onrender.com/api/admin/debit-notes/${encodeURIComponent(targetId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setDebitList(prev => prev.filter(item => (item._id || item.id || item.debitNo) !== targetId && item.debitNo !== deb.debitNo));
        showToast(`Debit Note ${deb.debitNo} deleted successfully.`);
      } else {
        showToast(data.message || 'Failed to delete debit note');
      }
    } catch (err) {
      setDebitList(prev => prev.filter(item => item.debitNo !== deb.debitNo));
      showToast(`Debit Note ${deb.debitNo} deleted.`);
    }
    setOpenMenuIndex(null);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setOpenMenuIndex(null);
  };

  const handleEdit = (item) => {
    setOpenMenuIndex(null);
    navigate('/admin/debit-note/add', { state: { debitToEdit: item } });
  };

  const filteredDebitNotes = debitList.filter(item => {
    const s = searchTerm.toLowerCase();
    const noMatches = (item.debitNo || '').toLowerCase().includes(s);
    const partyMatches = (item.party || '').toLowerCase().includes(s);
    const purchaseMatches = (item.purchaseNo || '').toLowerCase().includes(s);
    const statusMatches = (item.status || '').toLowerCase().includes(s);
    return noMatches || partyMatches || purchaseMatches || statusMatches;
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
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Debit Note Details</h3>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="purchase-modal-grid">
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Debit Note Number</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#2563eb' }}>{selectedItem.debitNo}</p>
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
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Purchase Inv Ref</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.purchaseNo}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Amount</p>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#16a34a' }}>{selectedItem.amount}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Status</p>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: selectedItem.status === 'Settled' ? '#dcfce7' : '#fee2e2',
                    color: selectedItem.status === 'Settled' ? '#16a34a' : '#ef4444'
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
                  <Edit2 size={14} /> Edit Debit Note
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
          <h2 className="purchase-header-title">Debit Note</h2>
          <div className="purchase-header-actions">
            <ExportDropdown
              fileName="Debit_Notes_Report"
              title="Debit Notes Report"
              buttonLabel="Export"
              headers={['Date', 'Debit Note No', 'Party Name', 'Original Purchase No', 'Amount', 'Status']}
              rows={filteredDebitNotes.map(item => [
                item.date,
                item.debitNo,
                item.party,
                item.purchaseNo,
                item.amount,
                item.status
              ])}
              onExportSuccess={(format) => showToast(`Exported ${format} successfully!`)}
            />
            <button 
              onClick={() => navigate('/admin/debit-note/add')} 
              className="purchase-btn-primary"
            >
              <Plus size={16} /> Create Debit Note
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
                  placeholder="Search Debit Notes..."
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
              Total: {filteredDebitNotes.length} record{filteredDebitNotes.length === 1 ? '' : 's'}
            </div>
          </div>

          {/* Table */}
          <div className="purchase-table-wrapper">
            <table className="purchase-table">
              <thead>
                <tr>
                  <th style={{ minWidth: '110px' }}>Date <span style={{ fontSize: '10px' }}>↕</span></th>
                  <th style={{ minWidth: '150px' }}>Debit Note Number</th>
                  <th style={{ minWidth: '170px' }}>Party Name</th>
                  <th style={{ minWidth: '140px' }}>Purchase No</th>
                  <th style={{ minWidth: '120px' }}>Amount</th>
                  <th style={{ minWidth: '120px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDebitNotes.map((item, idx) => (
                  <tr key={idx} style={{ position: 'relative' }}>
                    <td>{item.date}</td>
                    <td 
                      style={{ color: '#2563eb', fontWeight: '500', cursor: 'pointer' }}
                      onClick={() => handleView(item)}
                    >
                      {item.debitNo}
                    </td>
                    <td style={{ color: '#1e293b', fontWeight: '500' }}>{item.party}</td>
                    <td>{item.purchaseNo}</td>
                    <td style={{ color: '#1e293b', fontWeight: '500' }}>{item.amount}</td>
                    
                    {/* Status with 3 dots and Dropdown */}
                    <td style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          background: item.status === 'Settled' ? '#dcfce7' : '#fee2e2', 
                          color: item.status === 'Settled' ? '#16a34a' : '#ef4444', 
                          fontSize: '11px', 
                          fontWeight: '600', 
                          borderRadius: '4px' 
                        }}>
                          {item.status}
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
                {filteredDebitNotes.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: 0, border: 'none' }}>
                      <div className="purchase-empty-state">
                        <Search size={36} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                        <p style={{ margin: 0, fontWeight: '600', color: '#64748b', fontSize: '14px' }}>No debit notes found</p>
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

export default AdminDebitNote;
