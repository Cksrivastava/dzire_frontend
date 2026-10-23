import React, { useState, useEffect } from 'react';
import { X, Building2, Check, Plus } from 'lucide-react';

const DEFAULT_ACCOUNTS = [
  {
    id: 'bank-1',
    accountHolder: 'DZIRE WORLD',
    accountNumber: '42956880869',
    ifsc: 'SBIN0001110',
    bankName: 'State Bank of India, DECCAN GYMKHANA (PUNE)',
    isDefault: true
  },
  {
    id: 'bank-2',
    accountHolder: 'DZIRE WORLD PRIVATE LIMITED',
    accountNumber: '50200088991234',
    ifsc: 'HDFC0000120',
    bankName: 'HDFC Bank, FC Road Pune',
    isDefault: false
  },
  {
    id: 'bank-3',
    accountHolder: 'DZIRE WORLD',
    accountNumber: '003905001234',
    ifsc: 'ICIC0000039',
    bankName: 'ICICI Bank, Shivajinagar Pune',
    isDefault: false
  }
];

const AdminChangeBankModal = ({ isOpen, onClose, currentBank, onSave }) => {
  const [bankList, setBankList] = useState(DEFAULT_ACCOUNTS);
  const [selectedId, setSelectedId] = useState('bank-1');
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [formData, setFormData] = useState({
    accountHolder: 'DZIRE WORLD',
    accountNumber: '42956880869',
    ifsc: 'SBIN0001110',
    bankName: 'State Bank of India, DECCAN GYMKHANA (PUNE)'
  });

  useEffect(() => {
    if (isOpen) {
      if (currentBank) {
        setFormData({
          accountHolder: currentBank.accountHolder || 'DZIRE WORLD',
          accountNumber: currentBank.accountNumber || '42956880869',
          ifsc: currentBank.ifsc || 'SBIN0001110',
          bankName: currentBank.bankName || 'State Bank of India, DECCAN GYMKHANA (PUNE)'
        });
        const match = bankList.find(b => b.accountNumber === currentBank.accountNumber);
        if (match) {
          setSelectedId(match.id);
          setIsEditingCustom(false);
        } else {
          setIsEditingCustom(true);
        }
      }
    }
  }, [isOpen, currentBank]);

  if (!isOpen) return null;

  const handleSelectPreset = (acc) => {
    setSelectedId(acc.id);
    setFormData({
      accountHolder: acc.accountHolder,
      accountNumber: acc.accountNumber,
      ifsc: acc.ifsc,
      bankName: acc.bankName
    });
    setIsEditingCustom(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.accountNumber.trim() || !formData.ifsc.trim()) {
      alert('Please fill in Account Number and IFSC Code');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Building2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Change Bank Account</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Select or enter bank details for this document</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} style={{ padding: '20px' }}>
          {/* Quick Select Preset Accounts */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
              Saved Bank Accounts
            </label>
            <div style={{ display: 'grid', gap: '8px' }}>
              {bankList.map((acc) => {
                const isSelected = !isEditingCustom && selectedId === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectPreset(acc)}
                    style={{
                      padding: '10px 14px',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#0f172a' }}>{acc.bankName}</span>
                        {acc.isDefault && (
                          <span style={{ fontSize: '10px', background: '#e2e8f0', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>Primary</span>
                        )}
                      </div>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>
                        A/C: <span style={{ fontWeight: '600', color: '#1e293b' }}>{acc.accountNumber}</span> &bull; IFSC: <span style={{ fontWeight: '600', color: '#1e293b' }}>{acc.ifsc}</span>
                      </p>
                    </div>
                    {isSelected && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: '1px dashed #e2e8f0', margin: '16px 0', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '0 8px', fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
              OR EDIT DETAILS
            </span>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                Account Holder's Name *
              </label>
              <input
                type="text"
                required
                value={formData.accountHolder}
                onChange={(e) => {
                  setFormData({ ...formData, accountHolder: e.target.value });
                  setIsEditingCustom(true);
                }}
                placeholder="e.g. DZIRE WORLD"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                  Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.accountNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, accountNumber: e.target.value });
                    setIsEditingCustom(true);
                  }}
                  placeholder="e.g. 42956880869"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                  IFSC Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ifsc}
                  onChange={(e) => {
                    setFormData({ ...formData, ifsc: e.target.value.toUpperCase() });
                    setIsEditingCustom(true);
                  }}
                  placeholder="e.g. SBIN0001110"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    textTransform: 'uppercase'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                Bank & Branch Name *
              </label>
              <input
                type="text"
                required
                value={formData.bankName}
                onChange={(e) => {
                  setFormData({ ...formData, bankName: e.target.value });
                  setIsEditingCustom(true);
                }}
                placeholder="e.g. State Bank of India, DECCAN GYMKHANA (PUNE)"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: '600',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 20px',
                border: 'none',
                background: '#ff5722',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: '600',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(255, 87, 34, 0.3)'
              }}
            >
              Save Bank Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminChangeBankModal;
