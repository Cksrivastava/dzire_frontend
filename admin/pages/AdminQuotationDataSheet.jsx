import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Calendar, ChevronDown, MoreVertical, FileText, Printer, Plus, Eye, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import './AdminDashboard.css';
import './AdminQuotation.css';

const fallbackQuotations = [];

const AdminQuotationDataSheet = () => {
  const navigate = useNavigate();
  const [quotationList, setQuotationList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const menuRef = useRef(null);

  const fetchQuotations = async () => {
    try {
      const res = await fetch('/api/admin/quotations');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.quotations)) {
          const cleaned = data.quotations.filter(q => !['DZR/QTN/45', 'DZR/QTN/44', 'DZR/QTN/43', 'DZR/QTN/42', 'DZR/QTN/41'].includes(q.qtnNo) && ![1, 2, 3, 4, 5, '1', '2', '3', '4', '5'].includes(q.id));
          setQuotationList(cleaned);
          localStorage.setItem('dzire_admin_quotations', JSON.stringify(cleaned));
        }
      }
    } catch (e) {
      console.warn('Failed to fetch quotations, using local fallback:', e);
    }
  };

  useEffect(() => {
    fetchQuotations();
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
    const qtn = filteredQuotations[indexToDelete];
    if (!qtn) return;

    try {
      await fetch(`/api/admin/quotations/${encodeURIComponent(qtn.id || qtn.qtnNo)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('API error deleting quotation:', e);
    }

    const updated = quotationList.filter(q => (q.id || q.qtnNo) !== (qtn.id || qtn.qtnNo));
    setQuotationList(updated);
    localStorage.setItem('dzire_admin_quotations', JSON.stringify(updated));
    setOpenMenuIndex(null);
    showToast(`Quotation ${qtn.qtnNo} deleted successfully.`);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setOpenMenuIndex(null);
  };

  const handleEdit = (item) => {
    setOpenMenuIndex(null);
    navigate(`/admin/quotation/create?id=${encodeURIComponent(item.id || item.qtnNo)}`);
  };

  const totalQuotations = quotationList.reduce((sum, q) => {
    const val = q.totalAmount !== undefined ? Number(q.totalAmount) : (parseFloat(String(q.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + val;
  }, 0);

  const approvedAmount = quotationList.filter(q => q.status === 'Approved').reduce((sum, q) => {
    const val = q.totalAmount !== undefined ? Number(q.totalAmount) : (parseFloat(String(q.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + val;
  }, 0);

  const pendingAmount = quotationList.filter(q => q.status === 'Pending' || q.status === 'Open').reduce((sum, q) => {
    const val = q.totalAmount !== undefined ? Number(q.totalAmount) : (parseFloat(String(q.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + val;
  }, 0);

  const expiredAmount = quotationList.filter(q => q.status === 'Expired').reduce((sum, q) => {
    const val = q.totalAmount !== undefined ? Number(q.totalAmount) : (parseFloat(String(q.amount || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + val;
  }, 0);

  const filteredQuotations = quotationList.filter(item => {
    return (item.qtnNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.party || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="qtn-page-wrapper">

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
          <div className="qtn-modal-overlay">
            <div className="qtn-modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Quotation Details</h3>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="qtn-modal-grid">
                <div>
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Quotation Number</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#2563eb' }}>{selectedItem.qtnNo}</p>
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
                  <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '11px' }}>Valid Till</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{selectedItem.validTill}</p>
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
                    background: selectedItem.status === 'Approved' ? '#dcfce7' : selectedItem.status === 'Pending' ? '#fef3c7' : selectedItem.status === 'Open' ? '#e0e7ff' : '#fee2e2',
                    color: selectedItem.status === 'Approved' ? '#16a34a' : selectedItem.status === 'Pending' ? '#d97706' : selectedItem.status === 'Open' ? '#4338ca' : '#dc2626'
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
                  className="qtn-btn-primary"
                >
                  <Edit2 size={14} /> Edit Quotation
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="qtn-btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="qtn-card-container">
          {/* Header */}
          <div className="qtn-header-bar">
            <div className="qtn-title-group">
              <div className="qtn-title-icon">
                <FileText size={20} />
              </div>
              <div className="qtn-title-text">
                <h2>Quotations</h2>
                <p>Manage customer estimates, pricing, and validity status</p>
              </div>
            </div>
            <div className="qtn-header-actions">
              <ExportDropdown
                fileName="Quotations_Report"
                title="Quotations Summary Report"
                buttonLabel="Export"
                headers={['Date', 'Quotation No', 'Party Name', 'Valid Till', 'Amount', 'Status']}
                rows={filteredQuotations.map(item => [
                  item.date,
                  item.qtnNo,
                  item.party,
                  item.validTill,
                  item.amount,
                  item.status
                ])}
                onExportSuccess={(format) => showToast(`Exported ${format} successfully!`)}
              />
              <button 
                onClick={() => navigate('/admin/quotation/create')} 
                className="qtn-btn-primary"
              >
                <Plus size={16} /> Create Quotation
              </button>
            </div>
          </div>

          <div style={{ padding: '20px', boxSizing: 'border-box' }}>

            {/* Summary Cards */}
            <div className="qtn-metrics-grid">
              <div className="qtn-metric-card total">
                <div className="qtn-metric-header">
                  <div className="qtn-metric-icon-wrap" style={{ background: '#e0e7ff' }}>
                    <FileText size={14} color="#4f46e5" />
                  </div>
                  <span className="qtn-metric-label" style={{ color: '#4f46e5' }}>Total Quotations</span>
                </div>
                <div className="qtn-metric-val">₹ {totalQuotations.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div className="qtn-metric-card approved">
                <div className="qtn-metric-header">
                  <div className="qtn-metric-icon-wrap" style={{ background: '#dcfce7' }}>
                    <FileText size={14} color="#16a34a" />
                  </div>
                  <span className="qtn-metric-label" style={{ color: '#16a34a' }}>Approved</span>
                </div>
                <div className="qtn-metric-val">₹ {approvedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div className="qtn-metric-card pending">
                <div className="qtn-metric-header">
                  <div className="qtn-metric-icon-wrap" style={{ background: '#fef9c3' }}>
                    <FileText size={14} color="#ca8a04" />
                  </div>
                  <span className="qtn-metric-label" style={{ color: '#ca8a04' }}>Pending</span>
                </div>
                <div className="qtn-metric-val">₹ {pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div className="qtn-metric-card expired">
                <div className="qtn-metric-header">
                  <div className="qtn-metric-icon-wrap" style={{ background: '#fee2e2' }}>
                    <FileText size={14} color="#dc2626" />
                  </div>
                  <span className="qtn-metric-label" style={{ color: '#dc2626' }}>Expired</span>
                </div>
                <div className="qtn-metric-val">₹ {expiredAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>

            {/* Filters */}
            <div className="qtn-filter-bar">
              <div className="qtn-filter-group">
                <div className="qtn-search-wrap">
                  <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search Quotations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="qtn-search-input"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => fetchQuotations()}
                  className="qtn-date-btn"
                >
                  <Calendar size={14} /> Last 365 Days <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="qtn-table-wrapper">
              <table className="qtn-table">
              <thead>
                <tr style={{ background: '#ff6600', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Date <span style={{ fontSize: '10px' }}>↕</span></th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Quotation Number</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Party Name</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Valid Till</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.map((item, idx) => (
                  <tr key={item.id || item.qtnNo || idx} style={{ borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{item.date}</td>
                    <td 
                      style={{ padding: '12px 16px', fontSize: '13px', color: '#2563eb', fontWeight: '500', cursor: 'pointer' }}
                      onClick={() => handleView(item)}
                    >
                      {item.qtnNo}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>{item.party}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: item.status === 'Expired' ? '#ef4444' : '#64748b', fontWeight: '500' }}>{item.validTill}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{item.amount}</td>
                    
                    {/* Status with 3 dots and Dropdown */}
                    <td style={{ padding: '12px 16px', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          background: item.status === 'Approved' ? '#dcfce7' : item.status === 'Pending' ? '#fef3c7' : item.status === 'Open' ? '#fef3c7' : '#fee2e2', 
                          color: item.status === 'Approved' ? '#16a34a' : item.status === 'Pending' ? '#d97706' : item.status === 'Open' ? '#d97706' : '#dc2626', 
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
                {filteredQuotations.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                      No quotations found matching your search.
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

export default AdminQuotationDataSheet;
