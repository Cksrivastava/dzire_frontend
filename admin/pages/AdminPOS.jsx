import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Keyboard, Calendar, ScanBarcode, PlusCircle, X, User, CheckCircle2 } from 'lucide-react';
import AdminAddCustomerModal from '../components/AdminAddCustomerModal';
import AdminInventoryItemModal from '../components/AdminInventoryItemModal';
import AdminInvoiceItemsTable from '../components/AdminInvoiceItemsTable';
import AdminChangeBankModal from '../components/AdminChangeBankModal';
import './AdminDashboard.css';

const AdminPOS = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editInvoiceId = searchParams.get('id');

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [bankDetails, setBankDetails] = useState({
    accountHolder: 'DZIRE WORLD',
    accountNumber: '42956880869',
    ifsc: 'SBIN0001110',
    bankName: 'State Bank of India, DECCAN GYMKHANA (PUNE)'
  });

  const [isCashSale, setIsCashSale] = useState(false);
  const [invoicePrefix, setInvoicePrefix] = useState('DZR/2026/');
  const [invoiceNumber, setInvoiceNumber] = useState(() => Math.floor(100 + Math.random() * 900).toString());
  const [invoiceDate, setInvoiceDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  });
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  });

  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [customDiscount, setCustomDiscount] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [termsText, setTermsText] = useState('');
  const [showPaymentQR, setShowPaymentQR] = useState(false);

  const [isFullyPaid, setIsFullyPaid] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [autoRoundOff, setAutoRoundOff] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load existing invoice if id param is provided
  useEffect(() => {
    if (!editInvoiceId) return;

    const loadInvoice = async () => {
      try {
        const res = await fetch(`/api/admin/pos/invoices/${encodeURIComponent(editInvoiceId)}`);
        let data = null;
        if (res.ok) {
          const json = await res.json();
          data = json.invoice;
        }
        if (!data) {
          const saved = localStorage.getItem('dzire_admin_pos_invoices');
          if (saved) {
            const list = JSON.parse(saved);
            data = list.find(i => i.id === editInvoiceId);
          }
        }
        if (data) {
          if (data.customer) {
            setSelectedCustomer({
              name: data.customer,
              phone: data.mobile || '',
              email: data.email || '',
              address: data.address || ''
            });
          }
          if (Array.isArray(data.items) && data.items.length > 0) {
            setInvoiceItems(data.items);
          }
          if (data.prefix) setInvoicePrefix(data.prefix);
          if (data.invoiceNo) setInvoiceNumber(data.invoiceNo);
          if (data.invoiceDate) setInvoiceDate(data.invoiceDate);
          if (data.paymentTerms) setPaymentTerms(data.paymentTerms);
          if (data.dueDate) setDueDate(data.dueDate);
          if (data.isCashSale !== undefined) setIsCashSale(data.isCashSale);
          if (data.mode) setPaymentMethod(data.mode);
          if (data.receivedAmount !== undefined) setReceivedAmount(String(data.receivedAmount));
          if (data.status === 'Paid') setIsFullyPaid(true);
          if (data.notes) {
            setNotesText(data.notes);
            setShowNotes(true);
          }
          if (data.terms) {
            setTermsText(data.terms);
            setShowTerms(true);
          }
          if (data.bankDetails) setBankDetails(data.bankDetails);
        }
      } catch (e) {
        console.warn('Failed to load invoice for editing:', e);
      }
    };

    loadInvoice();
  }, [editInvoiceId]);

  const handleAddItemFromInventory = (product) => {
    setInvoiceItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const currentItem = updated[existingIndex];
        const newQty = (currentItem.qty || 1) + 1;
        const price = currentItem.price || 0;
        const discount = currentItem.discount || 0;
        const taxable = Math.max(0, (price * newQty) - discount);
        const taxRate = currentItem.taxRate !== undefined ? currentItem.taxRate : 5;
        const taxAmount = parseFloat((taxable * (taxRate / 100)).toFixed(2));
        const amount = parseFloat((taxable + taxAmount).toFixed(2));

        updated[existingIndex] = {
          ...currentItem,
          qty: newQty,
          taxAmount,
          amount
        };
        return updated;
      }

      const price = product.price || 0;
      const qty = 1;
      const discount = 0;
      const taxRate = 5;
      const taxable = price * qty;
      const taxAmount = parseFloat((taxable * (taxRate / 100)).toFixed(2));
      const amount = parseFloat((taxable + taxAmount).toFixed(2));

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          sku: product.sku || `SKU-${product.id}`,
          description: '',
          hsn: product.hsn || '65010090',
          batchNo: '',
          expDate: '',
          mfgDate: '',
          mrp: product.mrp || product.price,
          qty: 1,
          unit: 'PCS',
          price: product.price,
          discount: 0,
          discountPercent: 0,
          taxRate: 5,
          taxAmount: taxAmount,
          amount: amount
        }
      ];
    });
  };

  const handleUpdateItem = (index, updatedItem) => {
    setInvoiceItems(prev => {
      const updated = [...prev];
      updated[index] = updatedItem;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const itemsDiscount = invoiceItems.reduce((sum, item) => sum + (Number(item.discount) || 0), 0);
  const totalDiscount = itemsDiscount + (Number(customDiscount) || 0);
  const totalTax = invoiceItems.reduce((sum, item) => sum + (Number(item.taxAmount) || 0), 0);
  const subtotal = invoiceItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const rawTotal = subtotal + (Number(additionalCharges) || 0) - (Number(customDiscount) || 0);
  const totalAmount = autoRoundOff ? Math.round(rawTotal * 100) / 100 : rawTotal;

  const handleFullyPaidToggle = (e) => {
    const checked = e.target.checked;
    setIsFullyPaid(checked);
    if (checked) {
      setReceivedAmount(totalAmount > 0 ? totalAmount.toFixed(2) : '0.00');
    } else {
      setReceivedAmount('');
    }
  };

  const numReceived = parseFloat(receivedAmount) || 0;
  const balanceAmount = Math.max(0, totalAmount - numReceived);

  const handleSaveInvoice = async (saveAndNew = false) => {
    if (invoiceItems.length === 0) {
      showToast('Please add at least one item to the invoice.');
      return;
    }

    setIsSaving(true);
    const invoiceId = editInvoiceId || `INV-2026-${invoiceNumber}`;
    const invoicePayload = {
      id: invoiceId,
      customer: selectedCustomer?.name || (isCashSale ? 'Cash Customer' : 'Walk-in Customer'),
      mobile: selectedCustomer?.phone || '',
      email: selectedCustomer?.email || '',
      address: selectedCustomer?.address || '',
      dateTime: `${invoiceDate}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`,
      prefix: invoicePrefix,
      invoiceNo: invoiceNumber,
      invoiceDate: invoiceDate,
      paymentTerms: paymentTerms,
      dueDate: dueDate,
      isCashSale: isCashSale,
      items: invoiceItems,
      itemsCount: invoiceItems.reduce((s, it) => s + (Number(it.qty) || 1), 0),
      subtotal: subtotal,
      totalDiscount: totalDiscount,
      totalTax: totalTax,
      totalAmount: totalAmount,
      amount: `₹ ${totalAmount.toLocaleString('en-IN')}`,
      mode: paymentMethod,
      receivedAmount: numReceived,
      balanceAmount: balanceAmount,
      status: balanceAmount === 0 || isFullyPaid ? 'Paid' : 'Pending',
      notes: notesText,
      terms: termsText,
      bankDetails: showBankDetails ? bankDetails : {}
    };

    try {
      const endpoint = editInvoiceId ? `/api/admin/pos/invoices/${encodeURIComponent(editInvoiceId)}` : '/api/admin/pos/invoices';
      const method = editInvoiceId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload)
      });

      // Update local storage backup
      const saved = localStorage.getItem('dzire_admin_pos_invoices');
      let list = saved ? JSON.parse(saved) : [];
      if (editInvoiceId) {
        list = list.map(item => item.id === editInvoiceId ? { ...item, ...invoicePayload } : item);
      } else {
        list = [invoicePayload, ...list];
      }
      localStorage.setItem('dzire_admin_pos_invoices', JSON.stringify(list));

      showToast(editInvoiceId ? 'Invoice updated successfully!' : 'Sales invoice created successfully!');

      if (saveAndNew) {
        // Reset form for new entry
        setInvoiceItems([]);
        setSelectedCustomer(null);
        setInvoiceNumber(Math.floor(100 + Math.random() * 900).toString());
        setReceivedAmount('');
        setIsFullyPaid(false);
        setNotesText('');
        setShowNotes(false);
      } else {
        setTimeout(() => {
          navigate('/admin/pos/sales-invoice');
        }, 800);
      }
    } catch (err) {
      console.warn('API error saving invoice, saved to local cache:', err);
      showToast('Invoice saved locally.');
      if (!saveAndNew) {
        setTimeout(() => {
          navigate('/admin/pos/sales-invoice');
        }, 800);
      }
    } finally {
      setIsSaving(false);
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
              <ArrowLeft size={20} color="#334155" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/pos/sales-invoice')} />
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                {editInvoiceId ? `Edit Sales Invoice (${editInvoiceId})` : 'Create Sales Invoice'}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Keyboard size={20} color="#64748b" style={{ cursor: 'pointer' }} />
              <button 
                type="button"
                onClick={() => handleSaveInvoice(true)}
                disabled={isSaving}
                style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', color: '#64748b', cursor: 'pointer' }}
              >
                Save & New
              </button>
              <button 
                type="button"
                onClick={() => handleSaveInvoice(false)}
                disabled={isSaving}
                style={{ background: '#e0e7ff', border: 'none', padding: '6px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', color: '#4338ca', cursor: 'pointer' }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Top Section */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            {/* Left: Bill To */}
            <div style={{ flex: '1 1 300px', padding: '16px 20px', borderRight: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Bill To</p>
                {selectedCustomer && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowCustomerModal(true)}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '11.5px', fontWeight: '500', cursor: 'pointer', padding: 0 }}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(null)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11.5px', fontWeight: '500', cursor: 'pointer', padding: 0 }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {!selectedCustomer ? (
                <div
                  onClick={() => setShowCustomerModal(true)}
                  style={{
                    border: '1px dashed #3b82f6',
                    borderRadius: '6px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    width: '250px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#eff6ff')}
                  onMouseOut={(e) => (e.currentTarget.style.background = '#f8fafc')}
                >
                  <span style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '500' }}>+ Add Customer</span>
                </div>
              ) : (
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    background: '#f8fafc',
                    width: '250px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} color="#ff5722" />
                    <span style={{ fontWeight: '600', fontSize: '13px', color: '#0f172a' }}>{selectedCustomer.name}</span>
                  </div>
                  {selectedCustomer.phone && (
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>{selectedCustomer.phone}</div>
                  )}
                  {selectedCustomer.email && (
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>{selectedCustomer.email}</div>
                  )}
                  {selectedCustomer.address && (
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{selectedCustomer.address}</div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Invoice Meta */}
            <div style={{ flex: '1 1 450px', padding: '16px 20px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', right: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="cashSale" 
                  checked={isCashSale}
                  onChange={(e) => setIsCashSale(e.target.checked)}
                  style={{ cursor: 'pointer' }} 
                />
                <label htmlFor="cashSale" style={{ fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>Set Cash Sale as default</label>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '100px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Invoice Prefix:</label>
                  <input 
                    type="text" 
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }} 
                  />
                </div>
                <div style={{ flex: 1, minWidth: '100px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Invoice Number:</label>
                  <input 
                    type="text" 
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }} 
                  />
                </div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Sales Invoice Date:</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      style={{ width: '100%', padding: '6px 24px 6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                    />
                    <Calendar size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '8px' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ width: '120px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Payment Terms:</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                    <input 
                      type="text" 
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      style={{ width: '60%', padding: '6px 8px', border: 'none', fontSize: '12px', outline: 'none', textAlign: 'center', boxSizing: 'border-box' }} 
                    />
                    <span style={{ background: '#f8fafc', padding: '6px 8px', fontSize: '12px', color: '#64748b', borderLeft: '1px solid #cbd5e1', width: '40%', textAlign: 'center' }}>days</span>
                  </div>
                </div>
                <div style={{ width: '140px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Due Date:</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      style={{ width: '100%', padding: '6px 24px 6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} 
                    />
                    <Calendar size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '8px' }} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Table Section with Editable Items */}
          <AdminInvoiceItemsTable
            items={invoiceItems}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onOpenInventoryModal={() => setShowInventoryModal(true)}
          />

          {/* Bottom Section */}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Left Bottom */}
            <div style={{ flex: '1 1 300px', padding: '20px', borderRight: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '24px' }}>
                {showNotes ? (
                  <div style={{ marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>Notes / Remarks</label>
                      <button 
                        type="button" 
                        onClick={() => { setShowNotes(false); setNotesText(''); }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: '500', cursor: 'pointer', padding: 0 }}
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Add customer remarks or notes..."
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: '#fff' }}
                    />
                  </div>
                ) : (
                  <p 
                    onClick={() => setShowNotes(true)}
                    style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', margin: '0 0 12px 0', cursor: 'pointer' }}
                  >
                    + Add Notes
                  </p>
                )}

                {showTerms ? (
                  <div style={{ marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>Terms and Conditions</label>
                      <button 
                        type="button" 
                        onClick={() => { setShowTerms(false); }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: '500', cursor: 'pointer', padding: 0 }}
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={termsText}
                      onChange={(e) => setTermsText(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: '#fff' }}
                    />
                  </div>
                ) : (
                  <p 
                    onClick={() => setShowTerms(true)}
                    style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', margin: '0', cursor: 'pointer' }}
                  >
                    + Add Terms and Conditions
                  </p>
                )}
              </div>

              {showBankDetails ? (
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>Bank Details</p>
                  <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.8' }}>
                    <p style={{ margin: 0 }}>Account Number: <span style={{ fontWeight: '600', color: '#1e293b' }}>{bankDetails.accountNumber}</span></p>
                    <p style={{ margin: 0 }}>IFSC Code: <span style={{ fontWeight: '600', color: '#1e293b' }}>{bankDetails.ifsc}</span></p>
                    <p style={{ margin: 0 }}>Bank & Branch Name: <span style={{ fontWeight: '600', color: '#1e293b' }}>{bankDetails.bankName}</span></p>
                    <p style={{ margin: 0 }}>Account Holder's Name: <span style={{ fontWeight: '600', color: '#1e293b' }}>{bankDetails.accountHolder}</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                    <span 
                      onClick={() => setShowBankModal(true)} 
                      style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      Change Bank Account
                    </span>
                    <span 
                      onClick={() => setShowBankDetails(false)} 
                      style={{ color: '#ef4444', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
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
                {showPaymentQR ? (
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>UPI Dynamic QR</span>
                      <button onClick={() => setShowPaymentQR(false)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>Close</button>
                    </div>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=42956880869@sbi&pn=DZIRE%20WORLD&am=${totalAmount.toFixed(2)}`}
                      alt="UPI QR"
                      style={{ width: '120px', height: '120px', borderRadius: '4px' }}
                    />
                    <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', marginTop: '4px' }}>Scan to Pay ₹{totalAmount.toFixed(2)}</div>
                  </div>
                ) : (
                  <p 
                    onClick={() => setShowPaymentQR(true)}
                    style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', margin: '0', cursor: 'pointer' }}
                  >
                    + Add Payment QR
                  </p>
                )}
              </div>
            </div>

            {/* Right Bottom */}
            <div style={{ flex: '1 1 450px', padding: '20px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span 
                  onClick={() => {
                    const promptVal = window.prompt('Enter additional charge amount in ₹:', additionalCharges.toString());
                    if (promptVal !== null) setAdditionalCharges(parseFloat(promptVal) || 0);
                  }}
                  style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                >
                  {additionalCharges > 0 ? 'Edit Additional Charges' : '+ Add Additional Charges'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>₹ {additionalCharges.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Taxable Amount</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>₹ {(subtotal - totalTax).toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span 
                  onClick={() => {
                    const promptVal = window.prompt('Enter additional discount amount in ₹:', customDiscount.toString());
                    if (promptVal !== null) setCustomDiscount(parseFloat(promptVal) || 0);
                  }}
                  style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                >
                  {customDiscount > 0 ? 'Edit Discount' : '+ Add Discount'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>- ₹ {totalDiscount.toFixed(2)}</span>
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Total Amount</span>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '4px', width: '200px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                  ₹ {totalAmount.toFixed(2)}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <label htmlFor="fullyPaid" style={{ fontSize: '11px', color: '#64748b', cursor: 'pointer' }}>Mark as fully paid</label>
                <input
                  type="checkbox"
                  id="fullyPaid"
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
                      if (parseFloat(val) >= totalAmount && totalAmount > 0) {
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
                  {/* Dzire Logo representation */}
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

      <AdminAddCustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSave={(cust) => setSelectedCustomer(cust)}
        initialData={selectedCustomer}
      />

      <AdminInventoryItemModal
        isOpen={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
        onSelectItem={handleAddItemFromInventory}
      />

      <AdminChangeBankModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        currentBank={bankDetails}
        onSave={(updatedBank) => setBankDetails(updatedBank)}
      />
    </AdminLayout>
  );
};

export default AdminPOS;
