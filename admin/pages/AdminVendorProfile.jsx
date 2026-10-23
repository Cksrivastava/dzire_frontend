import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { ArrowLeft, ChevronDown, Download, Printer, Share2, Plus, Edit2, Check, X, Save } from 'lucide-react';
import ExportDropdown from '../components/ExportDropdown';
import './AdminDashboard.css';

const AdminVendorProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const initialData = {
    partyName: 'Tripole Gears Pvt. Ltd.',
    partyType: 'Supplier',
    mobileNumber: '+91 98765 43210',
    partyCategory: 'Bag & Accessories',
    email: 'contact@tripolegears.com',
    openingBalance: '0',
    creditPeriod: '30 Days',
    creditLimit: '₹ 50,000',
    gstin: '09AAACT1234F1Z5',
    panNumber: 'AAACT1234F',
    billingAddress: 'Plot No. 42, Sector 58, Industrial Area, Phase 2, Delhi NCR, 110001',
    shippingAddress: 'Plot No. 42, Sector 58, Industrial Area, Phase 2, Delhi NCR, 110001'
  };

  const [vendorData, setVendorData] = useState(() => {
    try {
      const saved = localStorage.getItem('vendor_profile_tripole');
      return saved ? { ...initialData, ...JSON.parse(saved) } : initialData;
    } catch {
      return initialData;
    }
  });

  const [formData, setFormData] = useState(vendorData);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleEdit = () => {
    setFormData(vendorData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(vendorData);
    setIsEditing(false);
  };

  const handleSave = () => {
    setVendorData(formData);
    try {
      localStorage.setItem('vendor_profile_tripole', JSON.stringify(formData));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#1e293b',
    background: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    marginTop: '4px'
  };

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        {/* Toast Notification */}
        {showToast && (
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
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease'
          }}>
            <Check size={18} /> Profile details saved successfully!
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden', padding: '0' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <a href="/admin/vendors" style={{ color: '#1e293b', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} /></a>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                  {vendorData.partyName || 'Tripole Gears Pvt. Ltd.'}
                </h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Category: {vendorData.partyCategory}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  style={{
                    background: '#ff6600',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit2 size={15} /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    style={{
                      background: '#fff',
                      border: '1px solid #cbd5e1',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <X size={15} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      background: '#16a34a',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)'
                    }}
                  >
                    <Save size={15} /> Save Changes
                  </button>
                </>
              )}
              <button style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Create Purchase Invoice <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '24px', padding: '0 24px', borderBottom: '1px solid #eef2f6' }}>
            <button
              onClick={() => setActiveTab('transactions')}
              style={{ background: 'none', border: 'none', padding: '16px 0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: activeTab === 'transactions' ? '#6d28d9' : '#000000', borderBottom: activeTab === 'transactions' ? '2px solid #6d28d9' : '2px solid transparent' }}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              style={{ background: 'none', border: 'none', padding: '16px 0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: activeTab === 'profile' ? '#6d28d9' : '#000000', borderBottom: activeTab === 'profile' ? '2px solid #6d28d9' : '2px solid transparent' }}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              style={{ background: 'none', border: 'none', padding: '16px 0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: activeTab === 'ledger' ? '#6d28d9' : '#000000', borderBottom: activeTab === 'ledger' ? '2px solid #6d28d9' : '2px solid transparent' }}
            >
              Ledger (Statement)
            </button>
            <button
              onClick={() => setActiveTab('item-report')}
              style={{ background: 'none', border: 'none', padding: '16px 0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: activeTab === 'item-report' ? '#6d28d9' : '#000000', borderBottom: activeTab === 'item-report' ? '2px solid #6d28d9' : '2px solid transparent' }}
            >
              Item Wise Report
            </button>
          </div>

          <div style={{ padding: '24px', minHeight: '500px', background: '#fafafa' }}>

            {activeTab === 'profile' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* General Details */}
                  <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #eef2f6', fontSize: '13px', fontWeight: '600', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>General Details</span>
                      {isEditing && <span style={{ fontSize: '11px', color: '#ff6600', fontWeight: '600' }}>[ Editing Mode ]</span>}
                    </div>
                    <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Party Name</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.partyName}
                            onChange={(e) => handleChange('partyName', e.target.value)}
                            style={inputStyle}
                            placeholder="Enter Party Name"
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>{vendorData.partyName || '-'}</p>
                        )}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Party Type</p>
                        {isEditing ? (
                          <select
                            value={formData.partyType}
                            onChange={(e) => handleChange('partyType', e.target.value)}
                            style={inputStyle}
                          >
                            <option value="Supplier">Supplier</option>
                            <option value="Manufacturer">Manufacturer</option>
                            <option value="Wholesale">Wholesale</option>
                            <option value="Distributor">Distributor</option>
                          </select>
                        ) : (
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>{vendorData.partyType || '-'}</p>
                        )}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Mobile Number</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.mobileNumber}
                            onChange={(e) => handleChange('mobileNumber', e.target.value)}
                            style={inputStyle}
                            placeholder="Enter Mobile Number"
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>{vendorData.mobileNumber || '-'}</p>
                        )}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Party Category</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.partyCategory}
                            onChange={(e) => handleChange('partyCategory', e.target.value)}
                            style={inputStyle}
                            placeholder="Enter Party Category"
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>{vendorData.partyCategory || '-'}</p>
                        )}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Email</p>
                        {isEditing ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            style={inputStyle}
                            placeholder="Enter Email Address"
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>{vendorData.email || '-'}</p>
                        )}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Opening Balance</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.openingBalance}
                            onChange={(e) => handleChange('openingBalance', e.target.value)}
                            style={inputStyle}
                            placeholder="e.g. 0"
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>
                            {String(vendorData.openingBalance).startsWith('₹') ? vendorData.openingBalance : `₹ ${vendorData.openingBalance || '0'}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Credit Details */}
                  <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #eef2f6', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Credit Details</div>
                    <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Credit Period</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.creditPeriod}
                            onChange={(e) => handleChange('creditPeriod', e.target.value)}
                            style={inputStyle}
                            placeholder="e.g. 30 Days"
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>{vendorData.creditPeriod || '-'}</p>
                        )}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Credit Limit</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.creditLimit}
                            onChange={(e) => handleChange('creditLimit', e.target.value)}
                            style={inputStyle}
                            placeholder="e.g. ₹ 50,000"
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>{vendorData.creditLimit || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Business Details */}
                  <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #eef2f6', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Business Details</div>
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>GSTIN</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.gstin}
                              onChange={(e) => handleChange('gstin', e.target.value)}
                              style={inputStyle}
                              placeholder="e.g. 09AAACT1234F1Z5"
                            />
                          ) : (
                            <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>{vendorData.gstin || '-'}</p>
                          )}
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>PAN Number</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.panNumber}
                              onChange={(e) => handleChange('panNumber', e.target.value)}
                              style={inputStyle}
                              placeholder="e.g. AAACT1234F"
                            />
                          ) : (
                            <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>{vendorData.panNumber || '-'}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Billing Address</p>
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={formData.billingAddress}
                            onChange={(e) => handleChange('billingAddress', e.target.value)}
                            style={{ ...inputStyle, resize: 'vertical' }}
                            placeholder="Enter billing address"
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', background: '#f8fafc', padding: '12px', borderRadius: '4px', lineHeight: '1.4' }}>
                            {vendorData.billingAddress || 'No billing address provided'}
                          </p>
                        )}
                      </div>
                      <div style={{ marginTop: '20px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Shipping Address</p>
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={formData.shippingAddress}
                            onChange={(e) => handleChange('shippingAddress', e.target.value)}
                            style={{ ...inputStyle, resize: 'vertical' }}
                            placeholder="Enter shipping address"
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', background: '#f8fafc', padding: '12px', borderRadius: '4px', lineHeight: '1.4' }}>
                            {vendorData.shippingAddress || 'No shipping address provided'}
                          </p>
                        )}
                      </div>
                      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>Manage Shipping Addresses</a>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleChange('shippingAddress', formData.billingAddress)}
                            style={{ background: 'none', border: '1px dashed #94a3b8', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: '#64748b', cursor: 'pointer' }}
                          >
                            Same as Billing Address
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Custom Fields */}
                  <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #eef2f6', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Custom Fields</div>
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Now you can add custom item fields like Colour, Size, ID Number, etc.</p>
                      <button style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Plus size={16} color="#64748b" /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f6' }}>
                  <select style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}>
                    <option>Last 365 Days</option>
                  </select>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}>
                      <option>Select Transaction Type</option>
                    </select>
                    <select style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}>
                      <option>Select Status</option>
                    </select>
                  </div>
                </div>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transaction Type</th>
                      <th>Transaction Number</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>17-Jul-2026</td><td>Payment Out</td><td>DZR/P-OUT/13</td><td>₹ 1,200</td><td>-</td></tr>
                    <tr><td>11-Jul-2026</td><td>Purchase Invoices</td><td>DZR/PI/64</td><td>₹ 4,500</td><td><span className="badge danger" style={{ color: '#dc2626', background: '#fef2f2' }}>Unpaid</span></td></tr>
                    <tr><td>11-Jul-2026</td><td>Purchase Orders</td><td>DZR/PO/14</td><td>₹ 4,500</td><td>-</td></tr>
                    <tr><td>30-Jun-2026</td><td>Payment Out</td><td>DZR/P-OUT/12</td><td>₹ 800</td><td>-</td></tr>
                    <tr><td>16-Jun-2026</td><td>Purchase Invoices</td><td>DZR/PI/62</td><td>₹ 12,000</td><td><span className="badge success">Paid</span></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'ledger' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  <div style={{ background: '#fff', border: '1px solid #eef2f6', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748b' }}>Total Payable Amount</p>
                    <h3 style={{ margin: 0, fontSize: '20px' }}>₹ 4,500</h3>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #eef2f6', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#f59e0b' }}>Overdue Amount</p>
                    <h3 style={{ margin: 0, fontSize: '20px' }}>₹ 0</h3>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #eef2f6', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ff6600' }}>Total Sales Amount</p>
                    <h3 style={{ margin: 0, fontSize: '20px' }}>₹ 0</h3>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #eef2f6', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#16a34a' }}>Total Received Amount</p>
                    <h3 style={{ margin: 0, fontSize: '20px' }}>₹ 0</h3>
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f6' }}>
                    <select style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}>
                      <option>Last 365 Days</option>
                    </select>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <ExportDropdown
                        fileName={`${formData.partyName.replace(/\s+/g, '_')}_Statement`}
                        title={`Vendor Ledger Statement - ${formData.partyName}`}
                        headers={['Date', 'Voucher', 'Sr No', 'Payment Mode', 'Credit Amount', 'Debit Amount', 'Balance', 'Due Date']}
                        rows={[
                          ['2026-10-15', 'Purchase Invoice', 'PI-901', 'Bank Transfer', '₹45,000', '₹0', '₹45,000 Due', '2026-11-15'],
                          ['2026-10-20', 'Payment Out', 'PAY-402', 'NEFT', '₹0', '₹30,000', '₹15,000 Due', '-'],
                          ['2026-10-25', 'Purchase Return', 'PR-101', 'Debit Note', '₹0', '₹5,000', '₹10,000 Due', '-']
                        ]}
                      />
                    </div>
                  </div>
                  <table className="dash-table small">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Voucher</th>
                        <th>Sr No</th>
                        <th>Payment Mode</th>
                        <th>Credit</th>
                        <th>Debit</th>
                        <th>Balance</th>
                        <th>Due Date (Overdue by)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>-</td>
                        <td>Opening Balance</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>₹ 0</td>
                        <td>₹ 0</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>09 Oct 2025</td>
                        <td>Purchase Invoices</td>
                        <td>DZR/PI/21</td>
                        <td>Upi</td>
                        <td>-</td>
                        <td>₹ 1,200</td>
                        <td>₹ 1,200</td>
                        <td style={{ color: '#16a34a' }}>Paid</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'item-report' && (
              <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', overflow: 'hidden', padding: '24px', textAlign: 'center', color: '#64748b' }}>
                Item Wise Report Placeholder
              </div>
            )}

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVendorProfile;
