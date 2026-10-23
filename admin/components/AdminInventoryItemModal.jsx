import React, { useState, useEffect } from 'react';
import { X, Search, Check, Plus, Store, Globe } from 'lucide-react';

export const initialInventoryProducts = [];

const AdminInventoryItemModal = ({ isOpen, onClose, onSelectItem, selectedItems = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.products || []);
          const mapped = list.map(p => ({
            id: p.id || p._id,
            name: p.name || 'Product',
            sku: p.sku || `SKU-${p.id || p._id}`,
            hsn: p.hsn || '65010090',
            vendor: p.vendor || p.brand || 'Dzire Sport',
            stock: p.stock !== undefined ? p.stock : 10,
            price: Number(p.price) || 0,
            mrp: Number(p.oldPrice || p.mrp || p.price) || 0,
            cost: Number(p.cost || (p.price ? p.price * 0.7 : 0)) || 0,
            visibility: p.section === 'outdoor' ? 'web' : 'in-store',
            action: 'Select Item'
          }));
          setProductsList(mapped);
          return;
        }
      } catch (e) {
        console.warn('Failed to load products for inventory modal:', e);
      }
      setProductsList([]);
    };
    fetchProducts();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = productsList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddSingleItem = (item) => {
    if (onSelectItem) {
      onSelectItem(item);
    }
    onClose();
  };

  const handleAddSelectedItems = () => {
    const itemsToAdd = productsList.filter(item => selectedIds.includes(item.id));
    if (itemsToAdd.length > 0 && onSelectItem) {
      itemsToAdd.forEach(item => onSelectItem(item));
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
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
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff'
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
              Select Item from Inventory
            </h2>
            <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
              Choose products from your existing inventory to add to this invoice
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search products by Name, SKU, or Vendor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
                background: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={handleAddSelectedItems}
              style={{
                padding: '8px 16px',
                background: '#ff6600',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Check size={16} /> Add Selected ({selectedIds.length})
            </button>
          )}
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1, minHeight: '320px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#ff6600', color: '#ffffff', position: 'sticky', top: 0, zIndex: 10 }}>
                <th style={{ padding: '12px 14px', width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filteredProducts.map(p => p.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '12px 14px', fontWeight: '600', minWidth: '220px' }}>Product Name & SKU</th>
                <th style={{ padding: '12px 14px', fontWeight: '600', minWidth: '160px' }}>Vendor</th>
                <th style={{ padding: '12px 14px', fontWeight: '600', textAlign: 'center', width: '70px' }}>Stock</th>
                <th style={{ padding: '12px 14px', fontWeight: '600', textAlign: 'right', minWidth: '95px' }}>Sell Price</th>
                <th style={{ padding: '12px 14px', fontWeight: '600', textAlign: 'right', minWidth: '95px' }}>MRP</th>
                <th style={{ padding: '12px 14px', fontWeight: '600', textAlign: 'right', minWidth: '105px' }}>Purchase Price</th>
                <th style={{ padding: '12px 14px', fontWeight: '600', textAlign: 'center', minWidth: '130px' }}>Channel Visibility</th>
                <th style={{ padding: '12px 14px', fontWeight: '600', textAlign: 'center', minWidth: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }}>
                    No products found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => {
                  const isChecked = selectedIds.includes(product.id);
                  const isLowStock = product.stock === 0;

                  return (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: isChecked ? '#fff7ed' : isLowStock ? '#fffbeb' : idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                        transition: 'background 0.15s'
                      }}
                    >
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(product.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{product.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>(SKU: {product.sku})</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ color: '#334155' }}>
                          {product.vendor.replace(' [PO]', '')} <span style={{ color: '#ff6600', fontWeight: '600', fontSize: '11px' }}>[PO]</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight: '600',
                            color: product.stock === 0 ? '#ef4444' : product.stock < 30 ? '#f59e0b' : '#10b981'
                          }}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '600', color: '#0f172a' }}>
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748b' }}>
                        ₹{product.mrp.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748b' }}>
                        ₹{product.cost.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        {product.visibility === 'web' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: '500',
                              background: '#dcfce7',
                              color: '#15803d',
                              border: '1px solid #bbf7d0'
                            }}
                          >
                            <Store size={12} /> + Website
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: '500',
                              background: '#f3e8ff',
                              color: '#7e22ce',
                              border: '1px solid #e9d5ff'
                            }}
                          >
                            <Store size={12} /> In-Store Only
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleAddSingleItem(product)}
                          style={{
                            padding: '6px 14px',
                            background: '#ff6600',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseOver={e => e.currentTarget.style.background = '#e65c00'}
                          onMouseOut={e => e.currentTarget.style.background = '#ff6600'}
                        >
                          <Plus size={14} /> Add Item
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#64748b' }}>
            Showing <strong>{filteredProducts.length}</strong> items in inventory
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleAddSelectedItems}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  background: '#ff6600',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add Selected Items ({selectedIds.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryItemModal;
