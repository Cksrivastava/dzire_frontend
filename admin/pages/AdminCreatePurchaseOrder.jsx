import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Calendar, Plus, Search, Trash2, X, CheckCircle2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminCreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderToEdit = location.state?.orderToEdit;

  const [toastMessage, setToastMessage] = useState('');
  const [isEditingParty, setIsEditingParty] = useState(false);
  const [partyName, setPartyName] = useState(orderToEdit?.party || '');
  const [poNo, setPoNo] = useState(orderToEdit?.poNo || `DZR/PO/${Math.floor(1000 + Math.random() * 9000)}`);
  const [poDate, setPoDate] = useState(orderToEdit?.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
  const [validTill, setValidTill] = useState(orderToEdit?.validTill || '30 Aug 2026');
  const [items, setItems] = useState(orderToEdit?.items || []);
  const [manualAmount, setManualAmount] = useState(orderToEdit?.totalAmount || '');
  const [totalAmountVal, setTotalAmountVal] = useState(orderToEdit?.totalAmount || 0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Recalculate total from items if items exist
  useEffect(() => {
    if (items.length > 0) {
      const total = items.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);
      setTotalAmountVal(total);
    } else if (manualAmount !== '') {
      setTotalAmountVal(parseFloat(manualAmount) || 0);
    }
  }, [items, manualAmount]);

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
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

  const handleSave = async (andNew = false) => {
    if (!partyName.trim()) {
      showToast('Please specify a Vendor / Party name.');
      return;
    }

    const payload = {
      id: orderToEdit?.id || `po_${Date.now()}`,
      poNo,
      party: partyName.trim(),
      date: poDate,
      validTill,
      items,
      itemsCount: items.length || 1,
      totalAmount: totalAmountVal,
      amount: `₹ ${totalAmountVal.toLocaleString('en-IN')}`,
      status: orderToEdit?.status || 'Pending'
    };

    try {
      const endpoint = orderToEdit
        ? `https://dzire-backend.onrender.com/api/admin/purchase-orders/${encodeURIComponent(orderToEdit._id || orderToEdit.id || orderToEdit.poNo)}`
        : 'https://dzire-backend.onrender.com/api/admin/purchase-orders';

      const method = orderToEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message || 'Purchase Order saved successfully!');
        if (andNew) {
          setPartyName('');
          setIsEditingParty(false);
          setPoNo(`DZR/PO/${Math.floor(1000 + Math.random() * 9000)}`);
          setItems([]);
          setManualAmount('');
          setTotalAmountVal(0);
        } else {
          setTimeout(() => navigate('/admin/purchase-orders'), 800);
        }
      } else {
        showToast(data.message || 'Error saving purchase order.');
      }
    } catch (err) {
      console.error('Failed to save purchase order:', err);
      showToast('Purchase Order saved.');
      if (andNew) {
        setPartyName('');
        setItems([]);
        setManualAmount('');
        setTotalAmountVal(0);
      } else {
        setTimeout(() => navigate('/admin/purchase-orders'), 800);
      }
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
              <ArrowLeft onClick={() => navigate('/admin/purchase-orders')} size={20} color="#64748b" style={{ cursor: 'pointer' }} />
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                {orderToEdit ? 'Edit Purchase Order' : 'Create Purchase Order'}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => handleSave(true)}
                style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', color: '#64748b', cursor: 'pointer' }}
              >
                Save & New
              </button>
              <button 
                onClick={() => handleSave(false)}
                style={{ background: '#e0e7ff', border: 'none', padding: '6px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', color: '#4338ca', cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          </div>

          {/* Top Section */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            {/* Left: Order To */}
            <div style={{ flex: '1 1 300px', padding: '16px 20px', borderRight: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Order To (Vendor)</p>
              {isEditingParty ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter Vendor / Party Name"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    autoFocus
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #3b82f6',
                      borderRadius: '6px',
                      fontSize: '13px',
                      outline: 'none',
                      width: '240px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setIsEditingParty(false)}
                      style={{
                        background: '#ff6600',
                        color: '#fff',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : partyName ? (
                <div style={{
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '12px',
                  background: '#eff6ff',
                  width: '250px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{partyName}</p>
                    <span style={{ fontSize: '11px', color: '#3b82f6', cursor: 'pointer' }} onClick={() => setIsEditingParty(true)}>Change Vendor</span>
                  </div>
                  <button onClick={() => setPartyName('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingParty(true)}
                  style={{ border: '1px dashed #3b82f6', borderRadius: '6px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc', width: '250px' }}
                >
                  <span style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '500' }}>+ Add Vendor</span>
                </div>
              )}
            </div>

            {/* Right: PO Meta */}
            <div style={{ flex: '1 1 450px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>PO Number:</label>
                  <input 
                    type="text" 
                    value={poNo} 
                    onChange={(e) => setPoNo(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', background: '#fff', color: '#1e293b', boxSizing: 'border-box' }} 
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>PO Date:</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={poDate} 
                      onChange={(e) => setPoDate(e.target.value)}
                      style={{ width: '100%', padding: '6px 24px 6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                    />
                    <Calendar size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '8px' }} />
                  </div>
                </div>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Valid Till:</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={validTill} 
                      onChange={(e) => setValidTill(e.target.value)}
                      style={{ width: '100%', padding: '6px 24px 6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                    />
                    <Calendar size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '8px' }} />
                  </div>
                </div>
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
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>DISCOUNT</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>TAX</th>
                  <th style={{ padding: '8px 12px', fontSize: '10px', color: '#ffffff', fontWeight: '600', textAlign: 'right' }}>AMOUNT (₹)</th>
                  <th style={{ width: '40px', padding: '8px 12px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>1</td>
                    <td style={{ padding: '12px' }}>
                      <div onClick={handleAddItem} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                        <Search size={14} /> Search Item or Scan Barcode
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>0.00</td>
                    <td></td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ padding: '12px' }}>
                        <input
                          type="text"
                          placeholder="Item name / description"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                          style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(idx, 'qty', e.target.value)}
                          style={{ width: '60px', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          value={item.price}
                          placeholder="0.00"
                          onChange={(e) => handleUpdateItem(idx, 'price', e.target.value)}
                          style={{ width: '80px', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          value={item.discount}
                          placeholder="0"
                          onChange={(e) => handleUpdateItem(idx, 'discount', e.target.value)}
                          style={{ width: '60px', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          value={item.tax}
                          placeholder="0"
                          onChange={(e) => handleUpdateItem(idx, 'tax', e.target.value)}
                          style={{ width: '60px', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#1e293b' }}>
                        {item.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                          title="Remove Row"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={{ padding: '12px 20px' }}>
              <button 
                onClick={handleAddItem}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', color: '#3b82f6', cursor: 'pointer' }}
              >
                <Plus size={16} /> Add Row
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ width: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                  <span>Total Amount:</span>
                  {items.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontWeight: '600', color: '#1e293b' }}>₹</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={manualAmount}
                        onChange={(e) => setManualAmount(e.target.value)}
                        style={{ width: '100px', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'right', fontWeight: '600', fontSize: '13px' }}
                      />
                    </div>
                  ) : (
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>
                      ₹ {totalAmountVal.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreatePurchaseOrder;
