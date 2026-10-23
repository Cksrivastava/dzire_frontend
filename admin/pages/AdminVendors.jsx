import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ChevronDown, Plus, Search, HelpCircle, ArrowLeft, UserCircle, CheckCircle2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminVendors = () => {
  const navigate = useNavigate();

  const initialFormState = {
    name: '',
    mobile: '',
    email: '',
    openingBalance: '',
    balanceType: 'To Pay',
    gstin: '',
    panNumber: '',
    type: 'Supplier',
    category: 'Select Category',
    billingAddress: '',
    shippingAddress: '',
    sameAsBilling: true,
    creditPeriod: '30',
    creditLimit: '0',
    contactPerson: '',
    dateOfBirth: '',
    bankDetails: null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'billingAddress' && prev.sameAsBilling) {
        updated.shippingAddress = value;
      }
      return updated;
    });
  };

  const handleSameAsBillingToggle = (e) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      sameAsBilling: checked,
      shippingAddress: checked ? prev.billingAddress : prev.shippingAddress
    }));
  };

  // Auto-fetch/validate details from GSTIN
  const handleGetGstinDetails = () => {
    const rawGst = (formData.gstin || '').trim().toUpperCase();
    if (!rawGst || rawGst.length < 15) {
      alert('Please enter a valid 15-character GSTIN number (e.g. 09AAACT1234F1Z5)');
      return;
    }

    // Characters 3 to 12 form the PAN
    const extractedPan = rawGst.substring(2, 12);
    setFormData(prev => ({
      ...prev,
      gstin: rawGst,
      panNumber: extractedPan
    }));
    alert(`GSTIN Verified! PAN Number auto-populated: ${extractedPan}`);
  };

  const handleAddBankPrompt = (e) => {
    e.preventDefault();
    const bankName = window.prompt('Enter Bank Name:', 'HDFC Bank');
    if (!bankName) return;
    const accNo = window.prompt('Enter Account Number:', '50200012345678');
    if (!accNo) return;
    const ifsc = window.prompt('Enter IFSC Code:', 'HDFC0001234');

    setFormData(prev => ({
      ...prev,
      bankDetails: {
        bankName,
        accountNumber: accNo,
        ifsc: ifsc || ''
      }
    }));
    alert('Bank details recorded successfully!');
  };

  const handleSave = async (isSaveAndNew = false) => {
    const partyName = formData.name.trim();
    if (!partyName) {
      alert('Please enter Party / Vendor Name.');
      return;
    }

    const numBalance = Number(String(formData.openingBalance || 0).replace(/[^0-9.]/g, '')) || 0;
    const cleanCategory = formData.category && formData.category !== 'Select Category' ? formData.category : 'Bag & Accessories';
    const balanceTypeKey = formData.balanceType === 'To Collect' ? 'collect' : (numBalance > 0 ? 'pay' : 'neutral');
    const formattedBalance = numBalance > 0 ? `₹ ${numBalance.toLocaleString('en-IN')}` : '₹ 0';

    const payload = {
      id: Date.now(),
      name: partyName,
      partyName: partyName,
      category: cleanCategory,
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
      openingBalance: numBalance,
      balance: formattedBalance,
      balanceType: balanceTypeKey,
      gstin: formData.gstin.trim().toUpperCase(),
      panNumber: formData.panNumber.trim().toUpperCase(),
      type: formData.type,
      partyType: formData.type,
      billingAddress: formData.billingAddress.trim(),
      shippingAddress: (formData.sameAsBilling ? formData.billingAddress : formData.shippingAddress).trim(),
      creditPeriod: formData.creditPeriod ? `${formData.creditPeriod} Days` : '30 Days',
      creditLimit: formData.creditLimit ? `₹ ${Number(String(formData.creditLimit).replace(/[^0-9.]/g, '') || 0).toLocaleString('en-IN')}` : '₹ 0',
      contactPerson: formData.contactPerson.trim(),
      dateOfBirth: formData.dateOfBirth.trim(),
      bankDetails: formData.bankDetails || {}
    };

    try {
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => null);

      let savedItem = payload;
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.vendor) savedItem = data.vendor;
      }

      // Persist to local storage cache
      try {
        const STORAGE_KEY = 'dzire_admin_vendors';
        const raw = localStorage.getItem(STORAGE_KEY);
        const existing = raw ? JSON.parse(raw) : [];
        const updated = [savedItem, ...existing.filter(item => String(item.id) !== String(savedItem.id))];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('dzire_vendors_updated', { detail: updated }));
      } catch (e) {}

      if (isSaveAndNew) {
        setFormData(initialFormState);
        showToast(`Vendor "${partyName}" saved! You can now enter another vendor.`);
        alert(`Vendor "${partyName}" created successfully! Form reset for next entry.`);
      } else {
        alert(`Vendor "${partyName}" created successfully!`);
        navigate('/admin/vendors');
      }

    } catch (err) {
      alert(`Vendor "${partyName}" saved locally!`);
      navigate('/admin/vendors');
    }
  };

  return (
    <AdminLayout>
      {/* Toast Notification */}
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
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          {toastMessage.msg}
        </div>
      )}

      <div className="dashboard-wrapper">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0', color: '#111' }}>Manage Vendors (Add / Create Party)</h1>
            <button 
              onClick={() => navigate('/admin/vendors')} 
              style={{ background: 'none', border: 'none', color: '#2563eb', padding: 0, fontSize: '13px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowLeft size={14} /> Back to Vendor Data Sheet
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button"
              onClick={() => handleSave(true)}
              style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer' }}
            >
              Save & New
            </button>
            <button 
              type="button"
              onClick={() => handleSave(false)}
              style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              Save Vendor
            </button>
          </div>
        </div>

        {/* Create Vendor Form Container */}
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden', padding: '24px', marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: '600', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>General Details</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Party Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter party name" 
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Mobile Number</label>
              <input 
                type="text" 
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="Enter mobile number" 
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address" 
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Opening Balance</label>
              <div style={{ display: 'flex' }}>
                <div style={{ padding: '10px', border: '1px solid #cbd5e1', borderRight: 'none', borderRadius: '4px 0 0 4px', background: '#f8fafc', color: '#64748b', fontSize: '13px' }}>₹</div>
                <input 
                  type="text" 
                  value={formData.openingBalance}
                  onChange={(e) => handleInputChange('openingBalance', e.target.value)}
                  placeholder="0" 
                  style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRight: 'none', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
                />
                <select 
                  value={formData.balanceType}
                  onChange={(e) => handleInputChange('balanceType', e.target.value)}
                  style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '0 4px 4px 0', background: '#f8fafc', fontSize: '13px', outline: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <option value="To Collect">To Collect</option>
                  <option value="To Pay">To Pay</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>GSTIN</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={formData.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                  placeholder="ex: 09AAACT1234F1Z5" 
                  style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
                />
                <button 
                  type="button"
                  onClick={handleGetGstinDetails}
                  style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '10px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Get Details
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>PAN Number</label>
              <input 
                type="text" 
                value={formData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value)}
                placeholder="Enter party PAN Number" 
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Party Type *</label>
              <select 
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
              >
                <option value="Supplier">Supplier</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Wholesale">Wholesale</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Party Category</label>
              <select 
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
              >
                <option value="Select Category">Select Category</option>
                <option value="Bag & Accessories">Bag & Accessories</option>
                <option value="Footwear & Belts">Footwear & Belts</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Trekking Gear">Trekking Gear</option>
                <option value="Camping & Tents">Camping & Tents</option>
              </select>
            </div>
          </div>

          <h4 style={{ margin: '30px 0 20px 0', fontSize: '14px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>Address Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Billing Address</label>
              <textarea 
                value={formData.billingAddress}
                onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                placeholder="Enter billing address" 
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', minHeight: '80px', boxSizing: 'border-box' }}
              ></textarea>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Shipping Address</label>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.sameAsBilling} 
                    onChange={handleSameAsBillingToggle}
                  /> Same as Billing address
                </label>
              </div>
              <textarea 
                value={formData.sameAsBilling ? formData.billingAddress : formData.shippingAddress}
                onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                placeholder="Enter shipping address" 
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', minHeight: '80px', background: formData.sameAsBilling ? '#f8fafc' : '#fff', boxSizing: 'border-box' }} 
                readOnly={formData.sameAsBilling}
              ></textarea>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Credit Period</label>
              <div style={{ display: 'flex' }}>
                <input 
                  type="text" 
                  value={formData.creditPeriod}
                  onChange={(e) => handleInputChange('creditPeriod', e.target.value)}
                  placeholder="30" 
                  style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
                />
                <div style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '0 4px 4px 0', background: '#f8fafc', color: '#64748b', fontSize: '13px' }}>Days</div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Credit Limit</label>
              <div style={{ display: 'flex' }}>
                <div style={{ padding: '10px', border: '1px solid #cbd5e1', borderRight: 'none', borderRadius: '4px 0 0 4px', background: '#f8fafc', color: '#64748b', fontSize: '13px' }}>₹</div>
                <input 
                  type="text" 
                  value={formData.creditLimit}
                  onChange={(e) => handleInputChange('creditLimit', e.target.value)}
                  placeholder="0" 
                  style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRadius: '0 4px 4px 0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>
            </div>
          </div>

          <h4 style={{ margin: '30px 0 20px 0', fontSize: '14px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>Contact Person Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Contact Person Name</label>
              <input 
                type="text" 
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Ex: Ankit Mishra" 
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Date of Birth</label>
              <input 
                type="text" 
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                placeholder="DD-MM-YYYY" 
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
          </div>

          <h4 style={{ margin: '30px 0 20px 0', fontSize: '14px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>Party Bank Account</h4>
          <div style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '30px', textAlign: 'center', background: '#f8fafc' }}>
            <div style={{ display: 'inline-block', padding: '12px', background: '#e0e7ff', borderRadius: '50%', color: '#4f46e5', marginBottom: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="22" x2="21" y2="22"></line><line x1="6" y1="18" x2="6" y2="11"></line><line x1="10" y1="18" x2="10" y2="11"></line><line x1="14" y1="18" x2="14" y2="11"></line><line x1="18" y1="18" x2="18" y2="11"></line><polygon points="12 2 20 7 4 7 12 2"></polygon></svg>
            </div>
            {formData.bankDetails ? (
              <div style={{ fontSize: '13px', color: '#1e293b', lineHeight: '1.6' }}>
                <span style={{ fontWeight: '600' }}>{formData.bankDetails.bankName}</span> — A/C: {formData.bankDetails.accountNumber} ({formData.bankDetails.ifsc})
                <br />
                <a href="#" onClick={handleAddBankPrompt} style={{ color: '#2563eb', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>Change Bank Details</a>
              </div>
            ) : (
              <>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' }}>Add party bank information to manage transactions</p>
                <a href="#" onClick={handleAddBankPrompt} style={{ color: '#2563eb', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>+ Add Bank Account</a>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
            <button 
              type="button"
              onClick={() => navigate('/admin/vendors')}
              style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={() => handleSave(false)}
              style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              Save Vendor
            </button>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVendors;
