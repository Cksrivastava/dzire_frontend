import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Printer, ScanBarcode, RefreshCcw } from 'lucide-react';
import ExportDropdown from '../components/ExportDropdown';

const barcodeProducts = [
  { id: 1, name: 'Premium Backpack (Orange)', sku: 'BAG-PREM-ORG', barcode: '8901234567890', price: 2499 },
  { id: 2, name: 'Trekking Shoes', sku: 'SHOE-TRK-001', barcode: '8901234567891', price: 3299 },
  { id: 3, name: 'Camping Tent', sku: 'TENT-CAMP-002', barcode: '8901234567892', price: 8500 },
  { id: 4, name: 'Water Bottle 1L', sku: 'BOT-1L-003', barcode: '8901234567893', price: 450 }
];

const AdminBarcode = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(barcodeProducts[0]);
  const [labelCount, setLabelCount] = useState(1);
  const [generatedProduct, setGeneratedProduct] = useState(barcodeProducts[0]);
  const [generatedLabelCount, setGeneratedLabelCount] = useState(1);
  const [message, setMessage] = useState('');
  const [showProductList, setShowProductList] = useState(false);
  const productSearchRef = useRef(null);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return barcodeProducts;
    }

    return barcodeProducts.filter((product) => (
      [product.name, product.sku, product.barcode].some((value) => value.toLowerCase().includes(query))
    ));
  }, [searchQuery]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (productSearchRef.current && !productSearchRef.current.contains(event.target)) {
        setShowProductList(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearchQuery(product.name);
    setMessage('');
    setShowProductList(false);
  };

  const handleLabelCountChange = (event) => {
    const value = Math.max(1, Number(event.target.value || 1));

    setLabelCount(value);
    setMessage('');
  };

  const handleGenerateBarcode = () => {
    if (!selectedProduct) {
      setMessage('Please select a product.');
      return;
    }

    setGeneratedProduct(selectedProduct);
    setGeneratedLabelCount(labelCount);
    setMessage(`${labelCount} label${labelCount > 1 ? 's' : ''} generated for ${selectedProduct.name}.`);
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
      <section className="admin-hero" style={{ marginBottom: '24px' }}>
        <div>
          <h1>Barcode</h1>
          <p>Generate and print barcodes for products and variants</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ExportDropdown
            fileName="Product_Barcodes_Report"
            title="Product Barcodes & SKU Directory"
            headers={['Product Name', 'SKU', 'EAN / Barcode No', 'Selling Price']}
            rows={barcodeProducts.map((p) => [
              p.name,
              p.sku,
              p.barcode,
              `₹${p.price.toLocaleString()}`
            ])}
          />
          <button
            className="admin-primary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw size={18} />
            Refresh Data
          </button>
        </div>
      </section>

      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Select Product</h3>
          <div ref={productSearchRef} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Search Product or SKU</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setMessage('');
                setShowProductList(true);
              }}
              onFocus={() => setShowProductList(true)}
              placeholder="Start typing..."
              style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
            />
            {showProductList && (
              <div style={{ marginTop: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto' }}>
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelectProduct(product)}
                    style={{ width: '100%', padding: '10px 12px', background: selectedProduct?.id === product.id ? '#fff4ed' : 'white', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111' }}>{product.name}</span>
                    <span style={{ display: 'block', fontSize: '12px', color: '#667085' }}>{product.sku} | {product.barcode}</span>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <div style={{ padding: '12px', fontSize: '14px', color: '#667085' }}>No products found.</div>
                )}
              </div>
            )}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Number of Labels</label>
            <input
              type="number"
              min="1"
              value={labelCount}
              onChange={handleLabelCountChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>
          {message && (
            <p style={{ margin: '0 0 12px 0', color: message.includes('Please') ? '#f04438' : '#12b76a', fontSize: '13px' }}>{message}</p>
          )}
          <button
            type="button"
            onClick={handleGenerateBarcode}
            style={{ width: '100%', padding: '12px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <ScanBarcode size={18} /> Generate Barcode
          </button>
        </div>

        <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px dashed #d1d5db', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '24px', width: '250px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '500' }}>Dzire Store</p>
            <p style={{ margin: '0 0 12px 0', fontSize: '10px', color: '#667085' }}>{generatedProduct.name}</p>
            <div style={{ height: '60px', width: '100%', backgroundColor: '#111', maskImage: 'repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px)', WebkitMaskImage: 'repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px)' }}></div>
            <p style={{ margin: '4px 0 0 0', fontSize: '10px', letterSpacing: '2px' }}>{generatedProduct.barcode}</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: '700' }}>₹{generatedProduct.price.toLocaleString()}</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#667085' }}>Labels: {generatedLabelCount}</p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            style={{ padding: '10px 24px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}
          >
            <Printer size={16} /> Print Labels
          </button>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminBarcode;
