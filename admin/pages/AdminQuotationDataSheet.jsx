import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Calendar, ChevronDown, MoreVertical, FileText, Printer, Plus, Eye, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import './AdminDashboard.css';

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
      <div style={{ background: '#fff', minHeight: '100vh', padding: '0', position: 'relative' }}>

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
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Quotation Details</h3>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
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

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => {
                    const item = selectedItem;
                    setSelectedItem(null);
                    handleEdit(item);
                  }}
                  style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit2 size={14} /> Edit Quotation
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
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Quotations</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
              style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(255, 102, 0, 0.2)' }}
            >
              <Plus size={16} /> Create Quotation
            </button>
          </div>
        </div>

        <div style={{ padding: '24px' }}>

          {/* Summary Cards */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div style={{ flex: '1', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: '#e0e7ff', padding: '4px', borderRadius: '4px' }}>
                  <FileText size={14} color="#4f46e5" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#4f46e5' }}>Total Quotations</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>₹ {totalQuotations.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>

            <div style={{ flex: '1', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: '#dcfce7', padding: '4px', borderRadius: '4px' }}>
                  <FileText size={14} color="#16a34a" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a' }}>Approved</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>₹ {approvedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>

            <div style={{ flex: '1', background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: '#fef9c3', padding: '4px', borderRadius: '4px' }}>
                  <FileText size={14} color="#ca8a04" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#ca8a04' }}>Pending</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>₹ {pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>

            <div style={{ flex: '1', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: '#fee2e2', padding: '4px', borderRadius: '4px' }}>
                  <FileText size={14} color="#dc2626" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#dc2626' }}>Expired</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>₹ {expiredAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '9px' }} />
                <input
                  type="text"
                  placeholder="Search Quotations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '6px 12px 6px 32px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', width: '220px' }}
                />
              </div>
              <button 
                type="button"
                onClick={() => fetchQuotations()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', color: '#64748b', cursor: 'pointer' }}
              >
                <Calendar size={14} /> Last 365 Days <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
    </AdminLayout>
  );
};

export default AdminQuotationDataSheet;
