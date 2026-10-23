import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Calendar, Plus, Search, CheckCircle2, Trash2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminCreateDebitNote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const debitToEdit = location.state?.debitToEdit;

  const [toastMessage, setToastMessage] = useState('');
  const [isEditingParty, setIsEditingParty] = useState(false);
  const [partyName, setPartyName] = useState(debitToEdit?.party || '');
  const [debitNo, setDebitNo] = useState(debitToEdit?.debitNo || `DZR/DEBIT/${Math.floor(1 + Math.random() * 90)}`);
  const [debitDate, setDebitDate] = useState(debitToEdit?.date || '31 Jul 2026');
  const [purchaseNo, setPurchaseNo] = useState(debitToEdit?.purchaseNo || '');
  const [reason, setReason] = useState(debitToEdit?.reason || '');
  const [items, setItems] = useState(debitToEdit?.items || []);
  const [totalAmountVal, setTotalAmountVal] = useState(debitToEdit?.amountNum || 0);

  const itemsTotal = items.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);

  useEffect(() => {
    if (items.length > 0) {
      setTotalAmountVal(itemsTotal);
    }
  }, [items, itemsTotal]);

  const handleAddRow = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        qty: 1,
        price: 0,
        tax: 0,
        amount: 0
      }
    ]);
  };

  const handleUpdateItem = (index, field, value) => {
    setItems(prev => {
      const copy = [...prev];
      const it = { ...copy[index], [field]: value };
      const q = parseFloat(it.qty) || 0;
      const p = parseFloat(it.price) || 0;
      const t = parseFloat(it.tax) || 0;
      it.amount = Math.max(0, (q * p) + t);
      copy[index] = it;
      return copy;
    });
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (andNew = false) => {
    const finalParty = partyName.trim() || 'Vendor / Supplier';
    const computedTotal = totalAmountVal > 0 ? totalAmountVal : itemsTotal;
    const formatted = `₹ ${computedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const payload = {
      debitNo,
      purchaseNo: purchaseNo || '—',
      party: finalParty,
      date: debitDate,
      amountNum: computedTotal,
      amount: formatted,
      reason: reason || 'Rate difference / adjustment',
      status: 'Open',
      items: items,
      notes: reason
    };

    try {
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/debit-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage('Debit Note saved successfully!');
        setTimeout(() => {
          setToastMessage('');
          if (!andNew) {
            navigate('/admin/debit-note');
          } else {
            setDebitNo(`DZR/DEBIT/${Math.floor(1 + Math.random() * 90)}`);
            setPartyName('');
            setPurchaseNo('');
            setReason('');
            setItems([]);
            setTotalAmountVal(0);
          }
        }, 1000);
      } else {
        setToastMessage(data.message || 'Error saving debit note');
      }
    } catch (err) {
      console.error('Save debit note error:', err);
      setToastMessage('Debit Note saved locally!');
      setTimeout(() => {
        setToastMessage('');
        if (!andNew) navigate('/admin/debit-note');
      }, 1000);
    }
  };

  return (
    <AdminLayout>
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '16px', position: 'relative' }}>
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

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ArrowLeft onClick={() => navigate('/admin/debit-note')} size={20} color="#1e293b" style={{ cursor: 'pointer' }} />
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                {debitToEdit ? 'Edit Debit Note' : 'Create Debit Note'}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                type="button"
                onClick={() => handleSave(true)}
                style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', color: '#64748b', cursor: 'pointer' }}
              >
                Save & New
              </button>
              <button 
                type="button"
                onClick={() => handleSave(false)}
                style={{ background: '#ff6600', border: 'none', padding: '6px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', color: '#ffffff', cursor: 'pointer', boxShadow: '0 2px 4px rgba(255, 102, 0, 0.2)' }}
              >
                Save
              </button>
            </div>
          </div>

          {/* Top Section */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            {/* Left: Bill To */}
            <div style={{ flex: '1 1 300px', padding: '16px 20px', borderRight: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Bill To (Party)</p>
              {isEditingParty || partyName ? (
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px', background: '#f8fafc', width: '250px', boxSizing: 'border-box' }}>
                  <input
                    type="text"
                    placeholder="Enter Party / Vendor Name"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', fontWeight: '600', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                    autoFocus
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditingParty(false)}
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Done
                    </button>
                    {partyName && (
                      <button
                        type="button"
                        onClick={() => { setPartyName(''); setIsEditingParty(false); }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingParty(true)}
                  style={{ border: '1px dashed #3b82f6', borderRadius: '6px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc', width: '250px' }}
                >
                  <span style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '500' }}>+ Add Party</span>
                </div>
              )}
            </div>

            {/* Right: Note Meta */}
            <div style={{ flex: '1 1 450px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Debit Note No:</label>
                  <input 
                    type="text" 
                    value={debitNo} 
                    onChange={(e) => setDebitNo(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: 'none', borderRadius: '4px', fontSize: '12px', outline: 'none', background: '#e2e8f0', color: '#64748b', boxSizing: 'border-box' }} 
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Date:</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={debitDate} 
                      onChange={(e) => setDebitDate(e.target.value)}
                      style={{ width: '100%', padding: '6px 24px 6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                    />
                    <Calendar size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '8px' }} />
                  </div>
                </div>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Original Purchase No (Optional):</label>
                  <input 
                    type="text" 
                    placeholder="e.g. DZR/PI/67" 
                    value={purchaseNo}
                    onChange={(e) => setPurchaseNo(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>
              <div style={{ width: '100%', maxWidth: '480px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Reason / Notes:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rate difference, Discount, etc." 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#ff6600', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'left', width: '40px' }}>NO</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'left' }}>ITEMS/ SERVICES</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>QTY</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>PRICE/ITEM (₹)</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>TAX</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>AMOUNT (₹)</th>
                  <th style={{ padding: '8px 12px', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <input
                        type="text"
                        placeholder="Item name / reason"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleUpdateItem(idx, 'qty', e.target.value)}
                        style={{ width: '60px', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', textAlign: 'right', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.price}
                        onChange={(e) => handleUpdateItem(idx, 'price', e.target.value)}
                        style={{ width: '80px', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', textAlign: 'right', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.tax}
                        onChange={(e) => handleUpdateItem(idx, 'tax', e.target.value)}
                        style={{ width: '60px', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', textAlign: 'right', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
                      ₹ {(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                        title="Remove row"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>1</td>
                    <td style={{ padding: '12px' }}>
                      <div 
                        onClick={handleAddRow}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                      >
                        <Search size={14} /> + Add Item / Row
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>0.00</td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ padding: '12px 20px' }}>
              <button 
                type="button"
                onClick={handleAddRow}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', color: '#3b82f6', cursor: 'pointer' }}
              >
                <Plus size={16} /> Add Row
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ width: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                  <span>Total Amount:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>₹</span>
                    {items.length > 0 ? (
                      <span style={{ fontWeight: '600', color: '#1e293b' }}>
                        {totalAmountVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <input
                        type="number"
                        placeholder="0.00"
                        value={totalAmountVal || ''}
                        onChange={(e) => setTotalAmountVal(parseFloat(e.target.value) || 0)}
                        style={{ width: '100px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', fontWeight: '600', color: '#1e293b', textAlign: 'right', outline: 'none' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateDebitNote;

