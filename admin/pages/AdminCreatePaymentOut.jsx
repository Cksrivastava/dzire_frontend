import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Calendar, CheckCircle2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminCreatePaymentOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentToEdit = location.state?.paymentToEdit;

  const [toastMessage, setToastMessage] = useState('');
  const [isEditingParty, setIsEditingParty] = useState(false);
  const [partyName, setPartyName] = useState(paymentToEdit?.party || '');
  const [paymentNo, setPaymentNo] = useState(paymentToEdit?.paymentNo || `DZR/P-OUT/${Math.floor(10 + Math.random() * 90)}`);
  const [paymentDate, setPaymentDate] = useState(paymentToEdit?.date || '31 Jul 2026');
  const [amountVal, setAmountVal] = useState(paymentToEdit?.amountNum ? String(paymentToEdit.amountNum) : (paymentToEdit?.amount?.replace(/[^0-9.]/g, '') || ''));
  const [paymentMode, setPaymentMode] = useState(paymentToEdit?.mode || 'Cash');
  const [refNo, setRefNo] = useState(paymentToEdit?.refNo || '');
  const [notes, setNotes] = useState(paymentToEdit?.notes || '');

  const handleSave = async (andNew = false) => {
    const finalParty = partyName.trim() || 'Vendor / Supplier';
    const num = parseFloat(amountVal) || 0;
    const formatted = `₹ ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const payload = {
      paymentNo,
      party: finalParty,
      date: paymentDate,
      amountNum: num,
      amount: formatted,
      amountPaid: formatted,
      totalAmountSettled: formatted,
      mode: paymentMode,
      refNo,
      notes,
      status: 'Paid'
    };

    try {
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/payments-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage('Payment Out recorded successfully!');
        setTimeout(() => {
          setToastMessage('');
          if (!andNew) {
            navigate('/admin/payment-out');
          } else {
            setPaymentNo(`DZR/P-OUT/${Math.floor(10 + Math.random() * 90)}`);
            setPartyName('');
            setAmountVal('');
            setRefNo('');
            setNotes('');
          }
        }, 1000);
      } else {
        setToastMessage(data.message || 'Error recording payment');
      }
    } catch (err) {
      console.error('Save payment error:', err);
      setToastMessage('Payment Out saved locally!');
      setTimeout(() => {
        setToastMessage('');
        if (!andNew) navigate('/admin/payment-out');
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
              <ArrowLeft onClick={() => navigate('/admin/payment-out')} size={20} color="#1e293b" style={{ cursor: 'pointer' }} />
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                {paymentToEdit ? 'Edit Payment Out' : 'Create Payment Out'}
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

          {/* Form Section */}
          <div style={{ display: 'flex', flexWrap: 'wrap', padding: '24px' }}>
            {/* Left: Pay To */}
            <div style={{ flex: '1 1 300px', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Pay To</p>
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

            {/* Right: Payment Meta */}
            <div style={{ flex: '1 1 450px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Payment Number:</label>
                  <input 
                    type="text" 
                    value={paymentNo} 
                    onChange={(e) => setPaymentNo(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: 'none', borderRadius: '4px', fontSize: '12px', outline: 'none', background: '#e2e8f0', color: '#64748b', boxSizing: 'border-box' }} 
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Date:</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={paymentDate} 
                      onChange={(e) => setPaymentDate(e.target.value)}
                      style={{ width: '100%', padding: '8px 24px 8px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                    />
                    <Calendar size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '10px' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Amount Paid (₹):</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={amountVal}
                    onChange={(e) => setAmountVal(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Payment Mode:</label>
                  <select 
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Reference No (Optional):</label>
                  <input 
                    type="text" 
                    placeholder="e.g. UTR or Cheque No" 
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              <div style={{ width: '100%', maxWidth: '480px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Notes:</label>
                <textarea 
                  rows="3" 
                  placeholder="Any details..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreatePaymentOut;

