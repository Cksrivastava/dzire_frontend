import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Calendar, ChevronDown, MoreVertical, FileText, Printer, Plus, Eye, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import './AdminDashboard.css';
import './AdminCreditNote.css';

const fallbackCreditNotes = [];

const AdminCreditNoteDataSheet = () => {
  const navigate = useNavigate();
  const [creditNotesList, setCreditNotesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const menuRef = useRef(null);

  const fetchCreditNotes = async () => {
    try {
      const res = await fetch('/api/admin/credit-notes');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.creditNotes)) {
          const cleaned = data.creditNotes.filter(c => !['DZR/CN/12', 'DZR/CN/11', 'DZR/CN/10', 'DZR/CN/09'].includes(c.cnNo) && ![1, 2, 3, 4, '1', '2', '3', '4'].includes(c.id));
          setCreditNotesList(cleaned);
          localStorage.setItem('dzire_admin_credit_notes', JSON.stringify(cleaned));
        }
      }
    } catch (e) {
      console.warn('Credit notes API fallback to local cache:', e);
    }
  };

  useEffect(() => {
    fetchCreditNotes();
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
    const cn = filteredCreditNotes[indexToDelete];
    if (!cn) return;

    try {
      await fetch(`/api/admin/credit-notes/${encodeURIComponent(cn.id || cn.cnNo)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('API error deleting credit note:', e);
    }

    const updated = creditNotesList.filter(item => (item.id || item.cnNo) !== (cn.id || cn.cnNo));
    setCreditNotesList(updated);
    localStorage.setItem('dzire_admin_credit_notes', JSON.stringify(updated));
    setOpenMenuIndex(null);
    showToast(`Credit Note ${cn.cnNo} deleted successfully.`);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setOpenMenuIndex(null);
  };

  const handleEdit = (item) => {
    setOpenMenuIndex(null);
    navigate(`/admin/credit-note/create?id=${encodeURIComponent(item.id || item.cnNo)}`);
  };

  const totalCreditNotes = creditNotesList.reduce((sum, item) => {
    const val = item.totalAmount !== undefined ? Number(item.totalAmount) : (parseFloat(String(item.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + val;
  }, 0);

  const settledAmount = creditNotesList.filter(item => item.status === 'Settled').reduce((sum, item) => {
    const val = item.totalAmount !== undefined ? Number(item.totalAmount) : (parseFloat(String(item.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + val;
  }, 0);

  const openAmount = creditNotesList.filter(item => item.status === 'Open').reduce((sum, item) => {
    const val = item.totalAmount !== undefined ? Number(item.totalAmount) : (parseFloat(String(item.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + val;
  }, 0);

  const filteredCreditNotes = creditNotesList.filter(item => {
    return (item.cnNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.party || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.invoiceNo || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="cn-page-wrapper">

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
          <div className="cn-modal-overlay">
            <div className="cn-modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Credit Note Details</h3>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="cn-modal-grid">
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Credit Note Number</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#2563eb' }}>{selectedItem.cnNo}</p>
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
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Invoice Number</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.invoiceNo}</p>
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
                    background: selectedItem.status === 'Settled' ? '#dcfce7' : '#fef3c7',
                    color: selectedItem.status === 'Settled' ? '#16a34a' : '#d97706'
                  }}>
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              {selectedItem.notes && (
                <div style={{ marginTop: '16px', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569' }}>
                  <strong>Notes:</strong> {selectedItem.notes}
                </div>
              )}

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const item = selectedItem;
                    setSelectedItem(null);
                    handleEdit(item);
                  }}
                  className="cn-btn-primary"
                >
                  <Edit2 size={14} /> Edit Credit Note
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="cn-btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="cn-card-container">
          {/* Header */}
          <div className="cn-header-bar">
            <div className="cn-title-group">
              <div className="cn-title-icon">
                <FileText size={20} />
              </div>
              <div className="cn-title-text">
                <h2>Credit Note</h2>
                <p>Manage customer returns, balance settlements, and credit adjustments</p>
              </div>
            </div>
            <div className="cn-header-actions">
              <ExportDropdown
                fileName="Credit_Notes_Report"
                title="Credit Notes Report"
                buttonLabel="Export"
                headers={['Date', 'Credit Note No', 'Party Name', 'Invoice No', 'Amount', 'Status']}
                rows={filteredCreditNotes.map(item => [
                  item.date,
                  item.cnNo,
                  item.party,
                  item.invoiceNo,
                  item.amount,
                  item.status
                ])}
                onExportSuccess={(format) => showToast(`Exported ${format} successfully!`)}
              />
              <button 
                onClick={() => navigate('/admin/credit-note/create')} 
                className="cn-btn-primary"
              >
                <Plus size={16} /> Create Credit Note
              </button>
            </div>
          </div>

          <div style={{ padding: '20px', boxSizing: 'border-box' }}>

            {/* Summary Cards */}
            <div className="cn-metrics-grid">
              <div className="cn-metric-card total">
                <div className="cn-metric-header">
                  <div className="cn-metric-icon-wrap" style={{ background: '#e0e7ff' }}>
                    <FileText size={14} color="#4f46e5" />
                  </div>
                  <span className="cn-metric-label" style={{ color: '#4f46e5' }}>Total Credit Notes</span>
                </div>
                <div className="cn-metric-val">₹ {totalCreditNotes.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div className="cn-metric-card settled">
                <div className="cn-metric-header">
                  <div className="cn-metric-icon-wrap" style={{ background: '#dcfce7' }}>
                    <FileText size={14} color="#16a34a" />
                  </div>
                  <span className="cn-metric-label" style={{ color: '#16a34a' }}>Settled</span>
                </div>
                <div className="cn-metric-val">₹ {settledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div className="cn-metric-card open">
                <div className="cn-metric-header">
                  <div className="cn-metric-icon-wrap" style={{ background: '#fef9c3' }}>
                    <FileText size={14} color="#ca8a04" />
                  </div>
                  <span className="cn-metric-label" style={{ color: '#ca8a04' }}>Open</span>
                </div>
                <div className="cn-metric-val">₹ {openAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>

            {/* Filters */}
            <div className="cn-filter-bar">
              <div className="cn-filter-group">
                <div className="cn-search-wrap">
                  <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search Credit Notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="cn-search-input"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => fetchCreditNotes()}
                  className="cn-date-btn"
                >
                  <Calendar size={14} /> Last 365 Days <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="cn-table-wrapper">
              <table className="cn-table">
              <thead>
                <tr style={{ background: '#ff6600', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Date <span style={{ fontSize: '10px' }}>↕</span></th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Credit Note Number</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Party Name</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Invoice No</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreditNotes.map((item, idx) => (
                  <tr key={item.id || item.cnNo || idx} style={{ borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{item.date}</td>
                    <td 
                      style={{ padding: '12px 16px', fontSize: '13px', color: '#2563eb', fontWeight: '500', cursor: 'pointer' }}
                      onClick={() => handleView(item)}
                    >
                      {item.cnNo}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>{item.party}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{item.invoiceNo}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{item.amount}</td>
                    
                    {/* Status with 3 dots and Dropdown */}
                    <td style={{ padding: '12px 16px', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          background: item.status === 'Settled' ? '#dcfce7' : '#fef3c7', 
                          color: item.status === 'Settled' ? '#16a34a' : '#d97706', 
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
                {filteredCreditNotes.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                      No credit notes found matching your search.
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

export default AdminCreditNoteDataSheet;
