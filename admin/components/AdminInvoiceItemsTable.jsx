import React from 'react';
import { Search, X, MoreVertical, ScanBarcode, GripVertical } from 'lucide-react';

const AdminInvoiceItemsTable = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onOpenInventoryModal
}) => {
  const taxOptions = [
    { label: '0%', value: 0 },
    { label: '5%', value: 5 },
    { label: '12%', value: 12 },
    { label: '18%', value: 18 },
    { label: '28%', value: 28 }
  ];

  const handleFieldChange = (index, field, value) => {
    const item = { ...items[index] };
    const numVal = parseFloat(value) || 0;

    if (field === 'description') {
      item.description = value;
    } else if (field === 'hsn') {
      item.hsn = value;
    } else if (field === 'batchNo') {
      item.batchNo = value;
    } else if (field === 'expDate') {
      item.expDate = value;
    } else if (field === 'mfgDate') {
      item.mfgDate = value;
    } else if (field === 'mrp') {
      item.mrp = numVal;
    } else if (field === 'qty') {
      item.qty = Math.max(1, numVal);
      // Recalculate discount if percent is used
      if (item.discountPercent) {
        item.discount = ((item.price * item.qty) * (item.discountPercent / 100));
      }
    } else if (field === 'unit') {
      item.unit = value;
    } else if (field === 'price') {
      item.price = numVal;
      if (item.discountPercent) {
        item.discount = ((numVal * item.qty) * (item.discountPercent / 100));
      }
    } else if (field === 'discount') {
      item.discount = numVal;
      const baseTotal = (item.price || 0) * (item.qty || 1);
      item.discountPercent = baseTotal > 0 ? parseFloat(((numVal / baseTotal) * 100).toFixed(2)) : 0;
    } else if (field === 'discountPercent') {
      item.discountPercent = numVal;
      const baseTotal = (item.price || 0) * (item.qty || 1);
      item.discount = parseFloat(((baseTotal * numVal) / 100).toFixed(2));
    } else if (field === 'taxRate') {
      item.taxRate = numVal;
    }

    // Recompute total amount
    const qty = item.qty || 1;
    const price = item.price || 0;
    const discount = item.discount || 0;
    const taxable = Math.max(0, (price * qty) - discount);
    const taxRate = item.taxRate || 0;
    const taxAmount = (taxable * (taxRate / 100));
    item.taxAmount = parseFloat(taxAmount.toFixed(2));
    item.amount = parseFloat((taxable + taxAmount).toFixed(2));

    onUpdateItem(index, item);
  };

  const totalDiscount = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const totalTax = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div style={{ overflowX: 'auto', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'center', width: '45px' }}>NO</th>
            <th style={{ padding: '10px 12px', fontSize: '11px', fontWeight: '600', textAlign: 'left', minWidth: '240px' }}>ITEMS</th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'left', width: '120px' }}>HSN</th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'left', width: '100px' }}>BATCH NO.</th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'left', width: '100px' }}>EXP. DATE</th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'left', width: '100px' }}>MFG DATE</th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'left', width: '125px' }}>
              MRP <span style={{ color: '#94a3b8', fontSize: '11px' }}>ⓘ</span>
            </th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'left', width: '110px' }}>QTY</th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'left', width: '125px' }}>PRICE/ITEM (₹)</th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'left', width: '120px' }}>DISCOUNT</th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'left', width: '110px' }}>TAX</th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'left', width: '125px' }}>AMOUNT (₹)</th>
            <th style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '600', textAlign: 'center', width: '50px' }}>
              <div
                onClick={onOpenInventoryModal}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                title="Add Item from Inventory"
              >
                <span style={{ color: '#ff6600', fontWeight: '700', fontSize: '14px', lineHeight: '1' }}>+</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const mrp = parseFloat(item.mrp) || 0;
            const price = parseFloat(item.price) || 0;
            const discountOffPercent = mrp > price && mrp > 0
              ? (((mrp - price) / mrp) * 100).toFixed(2)
              : null;

            return (
              <tr
                key={index}
                style={{
                  borderBottom: '1px solid #eef2f6',
                  background: index % 2 === 1 ? '#fbfaff' : '#ffffff',
                  verticalAlign: 'top'
                }}
              >
                {/* NO */}
                <td style={{ padding: '14px 8px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                    <GripVertical size={12} color="#cbd5e1" style={{ cursor: 'grab' }} />
                    <span style={{ fontWeight: '500' }}>{index + 1}</span>
                  </div>
                </td>

                {/* ITEMS */}
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b', marginBottom: '6px' }}>
                    {item.name}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Enter Description (optional)"
                    value={item.description || ''}
                    onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      color: '#334155',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      background: '#ffffff'
                    }}
                  />
                </td>

                {/* HSN */}
                <td style={{ padding: '10px 8px' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={item.hsn || ''}
                      onChange={(e) => handleFieldChange(index, 'hsn', e.target.value)}
                      placeholder="HSN"
                      style={{
                        width: '100%',
                        padding: '6px 24px 6px 8px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: '#ffffff'
                      }}
                    />
                    <Search size={12} color="#3b82f6" style={{ position: 'absolute', right: '6px', top: '9px', pointerEvents: 'none' }} />
                  </div>
                </td>

                {/* BATCH NO */}
                <td style={{ padding: '10px 8px' }}>
                  <input
                    type="text"
                    value={item.batchNo || ''}
                    onChange={(e) => handleFieldChange(index, 'batchNo', e.target.value)}
                    placeholder=""
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff'
                    }}
                  />
                </td>

                {/* EXP. DATE */}
                <td style={{ padding: '10px 8px' }}>
                  <input
                    type="text"
                    value={item.expDate || ''}
                    onChange={(e) => handleFieldChange(index, 'expDate', e.target.value)}
                    placeholder=""
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff'
                    }}
                  />
                </td>

                {/* MFG DATE */}
                <td style={{ padding: '10px 8px' }}>
                  <input
                    type="text"
                    value={item.mfgDate || ''}
                    onChange={(e) => handleFieldChange(index, 'mfgDate', e.target.value)}
                    placeholder=""
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff'
                    }}
                  />
                </td>

                {/* MRP */}
                <td style={{ padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', overflow: 'hidden' }}>
                    <span style={{ padding: '6px 4px 6px 8px', fontSize: '12px', color: '#64748b' }}>₹</span>
                    <input
                      type="number"
                      step="any"
                      value={item.mrp !== undefined ? item.mrp : ''}
                      onChange={(e) => handleFieldChange(index, 'mrp', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 6px 6px 2px',
                        border: 'none',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  {discountOffPercent && (
                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>
                      ({discountOffPercent}% OFF)
                    </div>
                  )}
                </td>

                {/* QTY */}
                <td style={{ padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', overflow: 'hidden' }}>
                    <input
                      type="number"
                      min="1"
                      value={item.qty || 1}
                      onChange={(e) => handleFieldChange(index, 'qty', e.target.value)}
                      style={{
                        width: '50px',
                        padding: '6px 4px 6px 8px',
                        border: 'none',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <span style={{ padding: '6px 8px', fontSize: '11px', color: '#64748b', background: '#f8fafc', borderLeft: '1px solid #e2e8f0', fontWeight: '500' }}>
                      {item.unit || 'PCS'}
                    </span>
                  </div>
                </td>

                {/* PRICE/ITEM */}
                <td style={{ padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', overflow: 'hidden' }}>
                    <span style={{ padding: '6px 4px 6px 8px', fontSize: '12px', color: '#64748b' }}>₹</span>
                    <input
                      type="number"
                      step="any"
                      value={item.price !== undefined ? item.price : ''}
                      onChange={(e) => handleFieldChange(index, 'price', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 6px 6px 2px',
                        border: 'none',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </td>

                {/* DISCOUNT */}
                <td style={{ padding: '10px 8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', overflow: 'hidden' }}>
                      <span style={{ padding: '4px 4px 4px 8px', fontSize: '11px', color: '#64748b' }}>₹</span>
                      <input
                        type="number"
                        step="any"
                        value={item.discount !== undefined ? item.discount : 0}
                        onChange={(e) => handleFieldChange(index, 'discount', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '4px 4px',
                          border: 'none',
                          fontSize: '11.5px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', overflow: 'hidden' }}>
                      <input
                        type="number"
                        step="any"
                        value={item.discountPercent !== undefined ? item.discountPercent : 0}
                        onChange={(e) => handleFieldChange(index, 'discountPercent', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '4px 4px 4px 8px',
                          border: 'none',
                          fontSize: '11.5px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ padding: '4px 8px', fontSize: '11px', color: '#64748b', background: '#f8fafc', borderLeft: '1px solid #e2e8f0' }}>%</span>
                    </div>
                  </div>
                </td>

                {/* TAX */}
                <td style={{ padding: '10px 8px' }}>
                  <select
                    value={item.taxRate !== undefined ? item.taxRate : 5}
                    onChange={(e) => handleFieldChange(index, 'taxRate', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      background: '#ffffff',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    {taxOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>
                    (₹ {item.taxAmount !== undefined ? item.taxAmount : 0})
                  </div>
                </td>

                {/* AMOUNT */}
                <td style={{ padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', overflow: 'hidden' }}>
                    <span style={{ padding: '6px 4px 6px 8px', fontSize: '12px', color: '#64748b' }}>₹</span>
                    <input
                      type="number"
                      step="any"
                      value={item.amount !== undefined ? item.amount : 0}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '6px 6px 6px 2px',
                        border: 'none',
                        fontSize: '12.5px',
                        fontWeight: '600',
                        color: '#0f172a',
                        outline: 'none',
                        background: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </td>

                {/* ACTIONS */}
                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                      title="More options"
                    >
                      <MoreVertical size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                      title="Remove row"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {/* Add Item Row */}
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td colSpan="11" style={{ padding: '12px' }}>
              <div
                onClick={onOpenInventoryModal}
                style={{
                  border: '1px dashed #3b82f6',
                  borderRadius: '4px',
                  padding: '10px',
                  textAlign: 'center',
                  color: '#3b82f6',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  background: '#f8fafc',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#eff6ff')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#f8fafc')}
              >
                + Add Item
              </div>
            </td>
            <td colSpan="2" style={{ padding: '12px', verticalAlign: 'top' }}>
              <button
                type="button"
                style={{
                  width: '100%',
                  height: '40px',
                  background: '#fff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#1e293b',
                  cursor: 'pointer'
                }}
              >
                <ScanBarcode size={16} /> Scan Barcode
              </button>
            </td>
          </tr>

          {/* Subtotal Row */}
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <td colSpan="9" style={{ padding: '12px 12px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#64748b' }}>
              SUBTOTAL
            </td>
            <td style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>
              ₹ {totalDiscount.toFixed(2)}
            </td>
            <td style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>
              ₹ {totalTax.toFixed(2)}
            </td>
            <td style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
              ₹ {subtotal.toFixed(2)}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminInvoiceItemsTable;
