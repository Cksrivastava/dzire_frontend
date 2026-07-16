import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useSearchParams } from 'react-router-dom';
import { Printer, ScanBarcode, RefreshCcw, Search, Settings, History, Package, Download, Wifi } from 'lucide-react';

/* ── Shared styles ──────────────────────────────────────────────── */
const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '14px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' },
  inp: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  btn: (primary) => ({
    padding: '9px 18px', background: primary ? '#ff6600' : 'white',
    color: primary ? 'white' : '#374151', border: primary ? 'none' : '1px solid #d1d5db',
    borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px'
  }),
};

/* ── Mock data ─────────────────────────────────────────────────── */
const barcodeProducts = [
  { id: 1, name: 'Premium Backpack (Orange)', sku: 'BAG-PREM-ORG', barcode: '8901234567890', price: 2499, category: 'Bags' },
  { id: 2, name: 'Trekking Shoes', sku: 'SHOE-TRK-001', barcode: '8901234567891', price: 3299, category: 'Footwear' },
  { id: 3, name: 'Camping Tent', sku: 'TENT-CAMP-002', barcode: '8901234567892', price: 8500, category: 'Camping' },
  { id: 4, name: 'Water Bottle 1L', sku: 'BOT-1L-003', barcode: '8901234567893', price: 450, category: 'Accessories' },
  { id: 5, name: 'Hydration Pack 5L', sku: 'HY-PK-5L-004', barcode: '8901234567894', price: 1799, category: 'Bags' },
];

/* ── Barcode SVG preview ────────────────────────────────────────── */
const BarcodePreview = ({ product, qty }) => (
  <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '10px', width: '240px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#374151' }}>DZIRE STORE</p>
    <p style={{ margin: '0 0 10px', fontSize: '10px', color: '#667085' }}>{product.name}</p>
    <div style={{ height: '56px', width: '100%', background: '#111', maskImage: 'repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 5px)', WebkitMaskImage: 'repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 5px)', borderRadius: '2px' }} />
    <p style={{ margin: '6px 0 0', fontSize: '10px', letterSpacing: '2px', color: '#374151' }}>{product.barcode}</p>
    <p style={{ margin: '6px 0 0', fontSize: '16px', fontWeight: '700', color: '#ff6600' }}>₹{product.price.toLocaleString()}</p>
    {qty > 1 && <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ca3af' }}>× {qty} labels</p>}
  </div>
);

/* ════════════════════════════════════════════════════════════════
   Main Component
════════════════════════════════════════════════════════════════ */
const AdminBarcode = () => {
  const [searchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'Generate Barcode';

  /* Generate Barcode state */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(barcodeProducts[0]);
  const [labelCount, setLabelCount] = useState(1);
  const [generatedProduct, setGeneratedProduct] = useState(barcodeProducts[0]);
  const [generatedLabelCount, setGeneratedLabelCount] = useState(1);
  const [message, setMessage] = useState('');
  const [showProductList, setShowProductList] = useState(false);
  const productSearchRef = useRef(null);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return !q ? barcodeProducts : barcodeProducts.filter(p => [p.name, p.sku, p.barcode].some(v => v.toLowerCase().includes(q)));
  }, [searchQuery]);

  useEffect(() => {
    const fn = (e) => { if (productSearchRef.current && !productSearchRef.current.contains(e.target)) setShowProductList(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSelectProduct = (p) => { setSelectedProduct(p); setSearchQuery(p.name); setMessage(''); setShowProductList(false); };

  const handleGenerate = () => {
    if (!selectedProduct) { setMessage('Please select a product.'); return; }
    setGeneratedProduct(selectedProduct);
    setGeneratedLabelCount(labelCount);
    setMessage(`${labelCount} label${labelCount > 1 ? 's' : ''} generated for ${selectedProduct.name}.`);
  };

  /* ── Scan History mock ───────────────────────────────────────── */
  const scanHistory = [
    { time: '11:42 AM', product: 'Premium Backpack (Orange)', sku: 'BAG-PREM-ORG', action: 'Sale', operator: 'POS Terminal' },
    { time: '11:30 AM', product: 'Water Bottle 1L',          sku: 'BOT-1L-003',   action: 'Stock Audit', operator: 'Rahul K.' },
    { time: '10:55 AM', product: 'Camping Tent',              sku: 'TENT-CAMP-002', action: 'Sale', operator: 'POS Terminal' },
    { time: '10:20 AM', product: 'Trekking Shoes',            sku: 'SHOE-TRK-001', action: 'Return Scan', operator: 'Priya M.' },
    { time: '09:45 AM', product: 'Hydration Pack 5L',         sku: 'HY-PK-5L-004', action: 'Stock Inward', operator: 'Warehouse' },
  ];

  const renderSubContent = () => {
    switch (activeSub) {

      /* ── Generate Barcode ─────────────────────────────── */
      case 'Generate Barcode':
      default:
        return (
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            {/* Config Panel */}
            <div style={{ flex: 1, ...S.card }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600' }}>Configure Barcode Label</h3>

              <div ref={productSearchRef} style={{ marginBottom: '18px' }}>
                <label style={S.label}>Search Product or SKU</label>
                <div style={{ position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '11px', color: '#9ca3af' }} />
                  <input type="text" value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setMessage(''); setShowProductList(true); }}
                    onFocus={() => setShowProductList(true)}
                    placeholder="Start typing product name or SKU…"
                    style={{ ...S.inp, paddingLeft: '32px' }} />
                </div>
                {showProductList && (
                  <div style={{ marginTop: '6px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                    {filteredProducts.length === 0
                      ? <div style={{ padding: '12px', fontSize: '13px', color: '#9ca3af' }}>No products found</div>
                      : filteredProducts.map(p => (
                        <button key={p.id} type="button"
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => handleSelectProduct(p)}
                          style={{ width: '100%', padding: '10px 14px', background: selectedProduct?.id === p.id ? '#fff4ed' : 'white', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left' }}>
                          <span style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111' }}>{p.name}</span>
                          <span style={{ display: 'block', fontSize: '12px', color: '#9ca3af' }}>{p.sku} · {p.barcode}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={S.label}>Label Size</label>
                <select style={S.inp}>
                  <option>Standard (40mm × 25mm)</option>
                  <option>Large (60mm × 40mm)</option>
                  <option>Small (30mm × 15mm)</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={S.label}>Number of Labels</label>
                <input type="number" min={1} value={labelCount} onChange={e => { setLabelCount(Math.max(1, Number(e.target.value))); setMessage(''); }} style={S.inp} />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={S.label}>Label Options</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Show Product Name', 'Show Price', 'Show SKU', 'Show Store Logo'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked /> {opt}
                    </label>
                  ))}
                </div>
              </div>

              {message && <p style={{ margin: '0 0 12px', color: message.includes('Please') ? '#f04438' : '#12b76a', fontSize: '13px', fontWeight: '500' }}>{message}</p>}

              <button onClick={handleGenerate} style={{ ...S.btn(true), width: '100%', justifyContent: 'center', padding: '12px' }}>
                <ScanBarcode size={18} /> Generate Barcode
              </button>
            </div>

            {/* Preview Panel */}
            <div style={{ flex: 1, ...S.card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', minHeight: '360px', justifyContent: 'center', borderStyle: 'dashed' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Preview</p>
              <BarcodePreview product={generatedProduct} qty={generatedLabelCount} />
              <button onClick={() => window.print()} style={S.btn(false)}>
                <Printer size={16} /> Print {generatedLabelCount} Label{generatedLabelCount > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        );

      /* ── Print Barcode ────────────────────────────────── */
      case 'Print Barcode':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600' }}>Print Barcode Labels</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={S.label}>Printer</label>
                  <select style={S.inp}><option>Zebra ZD421 (USB)</option><option>TSC TTP-245C</option><option>Generic Thermal Printer</option></select>
                </div>
                <div>
                  <label style={S.label}>Paper Size</label>
                  <select style={S.inp}><option>40mm × 25mm Roll</option><option>60mm × 40mm Roll</option><option>A4 Sheet (4 cols)</option></select>
                </div>
                <div>
                  <label style={S.label}>Copies per SKU</label>
                  <input type="number" defaultValue={1} min={1} style={S.inp} />
                </div>
                <div>
                  <label style={S.label}>Print Quality</label>
                  <select style={S.inp}><option>High (600 DPI)</option><option>Standard (300 DPI)</option><option>Draft (200 DPI)</option></select>
                </div>
              </div>
              <button onClick={() => window.print()} style={{ ...S.btn(true), padding: '11px 24px' }}>
                <Printer size={16} /> Send to Printer
              </button>
            </div>
            <div style={S.panel}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb' }}><strong>Print Queue</strong></div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Product', 'SKU', 'Qty', 'Size', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { name: 'Premium Backpack (Orange)', sku: 'BAG-PREM-ORG', qty: 10, size: '40mm×25mm', status: 'Queued' },
                    { name: 'Trekking Shoes', sku: 'SHOE-TRK-001', qty: 6, size: '40mm×25mm', status: 'Printed' },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td style={S.td}>{r.name}</td>
                      <td style={{ ...S.td, color: '#9ca3af' }}>{r.sku}</td>
                      <td style={S.td}>{r.qty}</td>
                      <td style={{ ...S.td, color: '#667085' }}>{r.size}</td>
                      <td style={S.td}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: r.status === 'Printed' ? '#e3fcef' : '#eff8ff', color: r.status === 'Printed' ? '#12b76a' : '#175cd3', display: 'inline-block' }}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      /* ── Barcode List ─────────────────────────────────── */
      case 'Barcode List':
        return (
          <div style={S.panel}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>All Product Barcodes</strong>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
                  <input placeholder="Search…" style={{ padding: '7px 10px 7px 30px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', width: '200px' }} />
                </div>
                <button onClick={() => alert('Exported')} style={S.btn(false)}><Download size={14} /> Export</button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Product', 'SKU', 'Category', 'Barcode', 'Price', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {barcodeProducts.map(p => (
                  <tr key={p.id}>
                    <td style={{ ...S.td, fontWeight: '500' }}>{p.name}</td>
                    <td style={{ ...S.td, color: '#9ca3af', fontFamily: 'monospace' }}>{p.sku}</td>
                    <td style={{ ...S.td, color: '#667085' }}>{p.category}</td>
                    <td style={{ ...S.td, fontFamily: 'monospace', fontSize: '12px', color: '#374151', letterSpacing: '1px' }}>{p.barcode}</td>
                    <td style={{ ...S.td, fontWeight: '600', color: '#ff6600' }}>₹{p.price.toLocaleString()}</td>
                    <td style={S.td}>
                      <button onClick={() => alert('Print ' + p.sku)} style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>Print</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      /* ── Bulk Barcode Generation ──────────────────────── */
      case 'Bulk Barcode Generation':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600' }}>Bulk Barcode Generation</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={S.label}>Filter by Category</label>
                  <select style={S.inp}><option>All Categories</option><option>Bags</option><option>Footwear</option><option>Camping</option><option>Accessories</option></select>
                </div>
                <div>
                  <label style={S.label}>Labels Per Product</label>
                  <input type="number" defaultValue={5} min={1} style={S.inp} />
                </div>
              </div>
              <div style={{ padding: '14px', background: '#f9fafb', borderRadius: '8px', marginBottom: '16px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>📦 <strong>5 products</strong> selected · <strong>25 total labels</strong> will be generated</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => alert('Barcodes generated!')} style={{ ...S.btn(true), padding: '11px 24px' }}>
                  <ScanBarcode size={16} /> Generate All Barcodes
                </button>
                <button onClick={() => window.print()} style={{ ...S.btn(false), padding: '11px 24px' }}>
                  <Printer size={16} /> Print All
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {barcodeProducts.map(p => (
                <div key={p.id} style={{ ...S.card, padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <BarcodePreview product={p} qty={1} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked /> Include
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      /* ── Scan History ──────────────────────────────────── */
      case 'Scan History':
        return (
          <div style={S.panel}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Barcode Scan History</strong>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>Today — 09 Jul 2026</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select style={{ padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }}>
                  <option>All Actions</option><option>Sale</option><option>Stock Audit</option><option>Return Scan</option><option>Stock Inward</option>
                </select>
                <button style={S.btn(false)}><Download size={14} /> Export</button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Time', 'Product', 'SKU', 'Action', 'Operator'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {scanHistory.map((r, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, color: '#9ca3af', fontFamily: 'monospace' }}>{r.time}</td>
                    <td style={{ ...S.td, fontWeight: '500' }}>{r.product}</td>
                    <td style={{ ...S.td, color: '#9ca3af', fontFamily: 'monospace', fontSize: '12px' }}>{r.sku}</td>
                    <td style={S.td}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', display: 'inline-block',
                        background: r.action === 'Sale' ? '#e3fcef' : r.action === 'Return Scan' ? '#fef3f2' : '#eff8ff',
                        color: r.action === 'Sale' ? '#12b76a' : r.action === 'Return Scan' ? '#f04438' : '#175cd3',
                      }}>{r.action}</span>
                    </td>
                    <td style={{ ...S.td, color: '#667085' }}>{r.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      /* ── Barcode Settings ─────────────────────────────── */
      case 'Barcode Settings':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600' }}>Barcode Format Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={S.label}>Barcode Format</label>
                  <select style={S.inp}><option>EAN-13 (Default)</option><option>Code 128</option><option>QR Code</option><option>UPC-A</option><option>ITF-14</option></select>
                </div>
                <div>
                  <label style={S.label}>Auto-generate Barcode on Product Create</label>
                  <select style={S.inp}><option>Yes (Auto)</option><option>No (Manual entry)</option></select>
                </div>
                <div>
                  <label style={S.label}>Barcode Prefix (for auto-gen)</label>
                  <input type="text" defaultValue="890" placeholder="e.g. 890" style={S.inp} />
                </div>
                <div>
                  <label style={S.label}>Default Label Size</label>
                  <select style={S.inp}><option>40mm × 25mm</option><option>60mm × 40mm</option><option>30mm × 15mm</option></select>
                </div>
                <div>
                  <label style={S.label}>Show on Label</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Store Name', 'Product Name', 'SKU Code', 'MRP / Sale Price', 'Barcode Number'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked /> {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <button onClick={() => alert('Settings saved!')} style={{ ...S.btn(true), padding: '11px 20px' }}>Save Settings</button>
              </div>
            </div>
          </div>
        );

      /* ── POS Integration ──────────────────────────────── */
      case 'POS Integration':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {[
                { label: 'Scanner Status', val: 'Connected', note: 'Zebra DS2208 USB', col: '#12b76a', icon: '🟢' },
                { label: 'Scans Today',    val: '142',      note: 'Across all sessions', col: '#ff6600', icon: '📊' },
                { label: 'POS Terminal',   val: 'Online',   note: 'Terminal T-01 active', col: '#6366f1', icon: '💻' },
              ].map(k => (
                <div key={k.label} style={S.card}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>{k.icon}</div>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#667085' }}>{k.label}</p>
                  <h3 style={{ margin: '0 0 4px', fontSize: '20px', color: k.col, fontWeight: '700' }}>{k.val}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{k.note}</p>
                </div>
              ))}
            </div>

            <div style={S.card}>
              <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600' }}>Scanner Configuration</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={S.label}>Scanner Model</label>
                  <select style={S.inp}><option>Zebra DS2208 (USB)</option><option>Honeywell Voyager 1400g</option><option>Generic HID Scanner</option></select>
                </div>
                <div>
                  <label style={S.label}>Connection Type</label>
                  <select style={S.inp}><option>USB HID</option><option>Bluetooth</option><option>Serial / RS232</option></select>
                </div>
                <div>
                  <label style={S.label}>Scan Mode</label>
                  <select style={S.inp}><option>Manual Trigger</option><option>Auto-detect</option><option>Presentation Mode</option></select>
                </div>
                <div>
                  <label style={S.label}>Beep on Scan</label>
                  <select style={S.inp}><option>Enabled</option><option>Disabled</option></select>
                </div>
              </div>
              <div style={{ marginTop: '20px', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#15803d', fontSize: '14px' }}>✓ Scanner Connected</strong>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#16a34a' }}>Zebra DS2208 · Last scan: 11:42 AM</p>
                </div>
                <button onClick={() => alert('Scanner test passed!')} style={{ padding: '7px 14px', background: 'white', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#15803d' }}>Test Scanner</button>
              </div>
              <button onClick={() => alert('Config saved!')} style={{ ...S.btn(true), marginTop: '16px' }}>Save Config</button>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>{activeSub}</h1>
            <p>Generate, print and manage barcodes for all products and variants</p>
          </div>
          {activeSub === 'Generate Barcode' && (
            <button className="admin-primary-button" onClick={() => window.location.reload()}>
              <RefreshCcw size={18} /> Refresh
            </button>
          )}
        </section>
        {renderSubContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminBarcode;
