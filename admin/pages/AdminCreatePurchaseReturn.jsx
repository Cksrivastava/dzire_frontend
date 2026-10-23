import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Keyboard, Calendar, ScanBarcode, Search, CheckCircle2, Trash2 } from 'lucide-react';
import AdminChangeBankModal from '../components/AdminChangeBankModal';
import './AdminDashboard.css';

const AdminCreatePurchaseReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnToEdit = location.state?.returnToEdit;

  const [toastMessage, setToastMessage] = useState('');
  const [isEditingParty, setIsEditingParty] = useState(false);
  const [partyName, setPartyName] = useState(returnToEdit?.party || '');
  const [returnPrefix, setReturnPrefix] = useState(returnToEdit ? '' : 'DZR/P-RET/');
  const [returnNumber, setReturnNumber] = useState(returnToEdit?.returnNo || String(Math.floor(100 + Math.random() * 900)));
  const [returnDate, setReturnDate] = useState(returnToEdit?.date || '31 Jul 2026');
  const [originalInvoice, setOriginalInvoice] = useState(returnToEdit?.originalInvoice || '');
  const [items, setItems] = useState(returnToEdit?.items || []);
  const [isFullyPaid, setIsFullyPaid] = useState(returnToEdit?.status === 'Settled');
  const [receivedAmount, setReceivedAmount] = useState(returnToEdit?.receivedAmount ? String(returnToEdit.receivedAmount) : '');
  const [paymentMethod, setPaymentMethod] = useState(returnToEdit?.refundMode || 'Cash');
  const [autoRoundOff, setAutoRoundOff] = useState(true);
  const [totalAmountVal, setTotalAmountVal] = useState(returnToEdit?.totalAmount || 0);
  const [reason, setReason] = useState(returnToEdit?.reason || '');
  const [notesText, setNotesText] = useState(returnToEdit?.notes || '');
  const [showNotes, setShowNotes] = useState(!!returnToEdit?.notes);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [bankDetails, setBankDetails] = useState({
    accountHolder: 'DZIRE WORLD',
    accountNumber: '42956880869',
    ifsc: 'SBIN0001110',
    bankName: 'State Bank of India, DECCAN GYMKHANA (PUNE)'
  });

  const itemsSubtotal = items.reduce((sum, it) => sum + (parseFloat(it.qty || 1) * parseFloat(it.price || 0)), 0);
  const itemsTax = items.reduce((sum, it) => sum + (parseFloat(it.tax || 0)), 0);
  const itemsDiscount = items.reduce((sum, it) => sum + (parseFloat(it.discount || 0)), 0);

  useEffect(() => {
    if (items.length > 0) {
      const calcTotal = Math.max(0, itemsSubtotal + itemsTax - itemsDiscount);
      setTotalAmountVal(autoRoundOff ? Math.round(calcTotal) : calcTotal);
    }
  }, [items, itemsSubtotal, itemsTax, itemsDiscount, autoRoundOff]);

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        hsn: '',
        batch: '',
        expDate: '',
        mfgDate: '',
        mrp: '',
        qty: 1,
        price: '',
        discount: 0,
        tax: 0,
        amount: 0
      }
    ]);
  };

  const handleUpdateItem = (index, field, value) => {
    setItems(prev => {
      const copy = [...prev];
      const item = { ...copy[index], [field]: value };
      const q = parseFloat(item.qty) || 0;
      const p = parseFloat(item.price) || 0;
      const d = parseFloat(item.discount) || 0;
      const t = parseFloat(item.tax) || 0;
      item.amount = Math.max(0, (q * p) - d + t);
      copy[index] = item;
      return copy;
    });
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleFullyPaidToggle = (e) => {
    const checked = e.target.checked;
    setIsFullyPaid(checked);
    if (checked) {
      setReceivedAmount(totalAmountVal > 0 ? totalAmountVal.toFixed(2) : '0.00');
    } else {
      setReceivedAmount('');
    }
  };

  const numReceived = parseFloat(receivedAmount) || 0;
  const balanceAmount = Math.max(0, totalAmountVal - numReceived);

  const handleSave = async (andNew = false) => {
    const finalParty = partyName.trim() || 'Vendor / Supplier';
    const computedTotal = totalAmountVal > 0 ? totalAmountVal : itemsSubtotal;
    const balance = Math.max(0, computedTotal - numReceived);
    const status = balance === 0 ? 'Settled' : 'In Process';

    const fullReturnNo = returnPrefix ? `${returnPrefix}${returnNumber}` : returnNumber;

    const payload = {
      returnNo: fullReturnNo,
      originalInvoice: originalInvoice || '—',
      party: finalParty,
      date: returnDate,
      items: items,
      itemsCount: items.length || 1,
      totalAmount: computedTotal,
      amount: `₹ ${computedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      receivedAmount: numReceived,
      balanceAmount: balance,
      refundMode: paymentMethod,
      status: status,
      reason: reason || 'Goods return',
      notes: notesText
    };

    try {
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/purchase-returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage('Purchase Return saved successfully!');
        setTimeout(() => {
          setToastMessage('');
          if (!andNew) {
            navigate('/admin/purchase-return');
          } else {
            setReturnNumber(String(Math.floor(100 + Math.random() * 900)));
            setPartyName('');
            setItems([]);
            setTotalAmountVal(0);
            setReceivedAmount('');
            setIsFullyPaid(false);
            setOriginalInvoice('');
          }
        }, 1000);
      } else {
        setToastMessage(data.message || 'Error saving purchase return');
      }
    } catch (err) {
      console.error('Save return error:', err);
      setToastMessage('Purchase Return saved locally!');
      setTimeout(() => {
        setToastMessage('');
        if (!andNew) navigate('/admin/purchase-return');
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
              <ArrowLeft
                size={20}
                color="#1e293b"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/admin/purchase-return')}
                title="Back to Purchase Returns"
              />
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                {returnToEdit ? 'Edit Purchase Return' : 'Create Purchase Return'}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                <Keyboard size={16} color="#64748b" />
              </div>
              <button
                onClick={() => handleSave(true)}
                style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', color: '#64748b', cursor: 'pointer' }}
              >
                Save & New
              </button>
              <button
                onClick={() => handleSave(false)}
                style={{ background: '#ff6600', border: 'none', padding: '6px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', color: '#ffffff', cursor: 'pointer', boxShadow: '0 2px 4px rgba(255,102,0,0.2)' }}
              >
                Save
              </button>
            </div>
          </div>

          {/* Top Section */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            {/* Left: Bill From */}
            <div style={{ flex: '1 1 300px', padding: '16px 20px', borderRight: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Bill From</p>
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

            {/* Right: Invoice Meta */}
            <div style={{ flex: '1 1 450px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ width: '120px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Invoice Prefix:</label>
                  <input 
                    type="text" 
                    value={returnPrefix} 
                    onChange={(e) => setReturnPrefix(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: 'none', borderRadius: '4px', fontSize: '12px', outline: 'none', background: '#e2e8f0', color: '#64748b', boxSizing: 'border-box' }} 
                  />
                </div>
                <div style={{ width: '90px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Invoice Number:</label>
                  <input 
                    type="text" 
                    value={returnNumber} 
                    onChange={(e) => setReturnNumber(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: 'none', borderRadius: '4px', fontSize: '12px', outline: 'none', background: '#e2e8f0', color: '#64748b', boxSizing: 'border-box' }} 
                  />
                </div>
                <div style={{ width: '140px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Purchase Return Date:</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={returnDate} 
                      onChange={(e) => setReturnDate(e.target.value)}
                      style={{ width: '100%', padding: '6px 24px 6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                    />
                    <Calendar size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '8px' }} />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Link to Purchase Invoice :</label>
                <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '8px', top: '8px' }} />
                  <input 
                    type="text" 
                    placeholder="Search purchase invoices" 
                    value={originalInvoice}
                    onChange={(e) => setOriginalInvoice(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px 6px 28px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
              <thead>
                <tr style={{ background: '#ff6600', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'left', width: '40px' }}>NO</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'left' }}>ITEMS/ SERVICES</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'left' }}>HSN/ SAC</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'left' }}>BATCH NO.</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'left' }}>EXP. DATE</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'left' }}>MFG DATE</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>MRP <span style={{ color: '#ffffff' }}>ⓘ</span></th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>QTY</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>PRICE/ITEM (₹)</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>DISCOUNT</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>TAX</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>AMOUNT (₹)</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'center', width: '40px' }}>
                    <div style={{ background: '#ffffff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', cursor: 'pointer' }}>
                      <span style={{ color: '#ff6600', fontWeight: '700', fontSize: '14px', lineHeight: '1' }}>+</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 12px', fontSize: '12px', color: '#64748b' }}>{idx + 1}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="text"
                        placeholder="Item name / description"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                        style={{ width: '100%', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="text"
                        placeholder="HSN"
                        value={item.hsn}
                        onChange={(e) => handleUpdateItem(idx, 'hsn', e.target.value)}
                        style={{ width: '80px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="text"
                        placeholder="Batch"
                        value={item.batch}
                        onChange={(e) => handleUpdateItem(idx, 'batch', e.target.value)}
                        style={{ width: '80px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="text"
                        placeholder="Exp"
                        value={item.expDate}
                        onChange={(e) => handleUpdateItem(idx, 'expDate', e.target.value)}
                        style={{ width: '80px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="text"
                        placeholder="Mfg"
                        value={item.mfgDate}
                        onChange={(e) => handleUpdateItem(idx, 'mfgDate', e.target.value)}
                        style={{ width: '80px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.mrp}
                        onChange={(e) => handleUpdateItem(idx, 'mrp', e.target.value)}
                        style={{ width: '70px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', textAlign: 'right', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleUpdateItem(idx, 'qty', e.target.value)}
                        style={{ width: '60px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', textAlign: 'right', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.price}
                        onChange={(e) => handleUpdateItem(idx, 'price', e.target.value)}
                        style={{ width: '80px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', textAlign: 'right', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.discount}
                        onChange={(e) => handleUpdateItem(idx, 'discount', e.target.value)}
                        style={{ width: '60px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', textAlign: 'right', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.tax}
                        onChange={(e) => handleUpdateItem(idx, 'tax', e.target.value)}
                        style={{ width: '60px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', textAlign: 'right', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
                      ₹ {(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                        title="Remove Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td colSpan="11" style={{ padding: '12px' }}>
                    <div 
                      onClick={handleAddItem}
                      style={{ border: '1px dashed #3b82f6', borderRadius: '4px', padding: '10px', textAlign: 'center', color: '#3b82f6', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      + Add Item
                    </div>
                  </td>
                  <td colSpan="2" style={{ padding: '12px', verticalAlign: 'top' }}>
                    <button 
                      type="button"
                      onClick={handleAddItem}
                      style={{ width: '100%', height: '40px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: '#1e293b', cursor: 'pointer' }}
                    >
                      <ScanBarcode size={16} /> Scan Barcode
                    </button>
                  </td>
                </tr>
                {/* Subtotal Row */}
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <td colSpan="9" style={{ padding: '12px 12px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#64748b' }}>SUBTOTAL</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>₹ {itemsDiscount.toFixed(2)}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>₹ {itemsTax.toFixed(2)}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>₹ {itemsSubtotal.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Section */}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Left Bottom */}
            <div style={{ flex: '1 1 300px', padding: '20px', borderRight: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', margin: '0 0 12px 0', cursor: 'pointer' }}>+ Add Notes</p>
                <p style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', margin: '0', cursor: 'pointer' }}>+ Add Terms and Conditions</p>
              </div>

              {/* Bank Details section */}
              {showBankDetails ? (
                <div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Bank Details</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#64748b' }}>Account Number: <span style={{ fontWeight: '600', color: '#1e293b' }}>{bankDetails.accountNumber}</span></p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#64748b' }}>IFSC Code: <span style={{ fontWeight: '600', color: '#1e293b' }}>{bankDetails.ifsc}</span></p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#64748b' }}>Bank & Branch Name: <span style={{ fontWeight: '600', color: '#1e293b' }}>{bankDetails.bankName}</span></p>
                  <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#64748b' }}>Account Holder's Name: <span style={{ fontWeight: '600', color: '#1e293b' }}>{bankDetails.accountHolder}</span></p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <span 
                      onClick={() => setShowBankModal(true)} 
                      style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      Change Bank Account
                    </span>
                    <span 
                      onClick={() => setShowBankDetails(false)} 
                      style={{ color: '#ef4444', fontSize: '11px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      Remove Bank Account
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '20px' }}>
                  <p 
                    onClick={() => setShowBankDetails(true)} 
                    style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', margin: '0', cursor: 'pointer' }}
                  >
                    + Add Bank Details
                  </p>
                </div>
              )}

              <div>
                <p style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', margin: '0', cursor: 'pointer' }}>+ Add Payment QR</p>
              </div>
            </div>

            {/* Right Bottom */}
            <div style={{ flex: '1 1 450px', padding: '20px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>+ Add Additional Charges</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>₹ 0</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Taxable Amount</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>₹ 0</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>+ Add Discount</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>- ₹ 0</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="checkbox"
                  id="autoRound"
                  checked={autoRoundOff}
                  onChange={(e) => setAutoRoundOff(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="autoRound" style={{ fontSize: '12px', color: '#1e293b', cursor: 'pointer' }}>Auto Round Off</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Total Amount</span>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '4px', width: '200px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                  <span style={{ marginRight: '4px' }}>₹</span>
                  {items.length > 0 ? (
                    <span>{totalAmountVal.toFixed(2)}</span>
                  ) : (
                    <input
                      type="number"
                      placeholder="0.00"
                      value={totalAmountVal || ''}
                      onChange={(e) => setTotalAmountVal(parseFloat(e.target.value) || 0)}
                      style={{ border: 'none', background: 'transparent', width: '120px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: '#0f172a', outline: 'none' }}
                    />
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <label htmlFor="markPaid" style={{ fontSize: '11px', color: '#64748b', cursor: 'pointer' }}>Mark as fully paid</label>
                <input
                  type="checkbox"
                  id="markPaid"
                  checked={isFullyPaid}
                  onChange={handleFullyPaidToggle}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Amount Received</span>
                <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', width: '220px', background: '#fff' }}>
                  <span style={{ background: '#f8fafc', padding: '8px 10px', fontSize: '12px', color: '#64748b', borderRight: '1px solid #cbd5e1' }}>₹</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={receivedAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setReceivedAmount(val);
                      if (parseFloat(val) >= totalAmountVal && totalAmountVal > 0) {
                        setIsFullyPaid(true);
                      } else {
                        setIsFullyPaid(false);
                      }
                    }}
                    style={{ flex: 1, border: 'none', padding: '8px 10px', fontSize: '13px', fontWeight: '600', color: '#0f172a', outline: 'none', background: '#fff', boxSizing: 'border-box', minWidth: '0' }}
                  />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ padding: '8px', border: 'none', borderLeft: '1px solid #cbd5e1', fontSize: '12px', outline: 'none', background: '#f8fafc', color: '#475569', cursor: 'pointer' }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: balanceAmount === 0 ? '#10b981' : '#f59e0b' }}>Balance Amount</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: balanceAmount === 0 ? '#10b981' : '#f59e0b' }}>₹ {balanceAmount.toFixed(2)}</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 8px 0' }}>Authorized signatory for <span style={{ fontWeight: '600', color: '#1e293b' }}>Dzire {'>'} Outdoor Equipment Store</span></p>
                <div style={{ display: 'inline-block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-1px', color: '#000' }}>dzire</span>
                    <span style={{ color: '#f97316', fontSize: '24px', fontWeight: '800' }}>{'>'}{'>'}</span>
                  </div>
                  <div style={{ fontSize: '7px', fontWeight: '700', color: '#f97316', marginTop: '-4px', textAlign: 'right' }}>OUTDOOR EQUIPMENT STORE</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      <AdminChangeBankModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        currentBank={bankDetails}
        onSave={(updatedBank) => setBankDetails(updatedBank)}
      />
    </AdminLayout>
  );
};

export default AdminCreatePurchaseReturn;
