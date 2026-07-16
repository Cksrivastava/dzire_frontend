import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useSearchParams } from 'react-router-dom';
import { Search, ScanLine, ShoppingCart, Trash2, Printer, RefreshCcw, X, CreditCard, Gift, Ticket, History, ArrowRightLeft, ArrowLeftRight } from 'lucide-react';

const products = [
  { id: 1, name: 'Premium Backpack', sku: 'BAG-PREM-01', barcode: '890100000001', price: 2499, stock: 45 },
  { id: 2, name: 'Trekking Shoes', sku: 'SHOE-TRK-02', barcode: '890100000002', price: 3299, stock: 45 },
  { id: 3, name: 'Camping Tent', sku: 'TENT-CAMP-03', barcode: '890100000003', price: 8500, stock: 45 },
  { id: 4, name: 'Water Bottle 1L', sku: 'BOT-1L-04', barcode: '890100000004', price: 450, stock: 45 },
  { id: 5, name: 'Hiking Poles', sku: 'POLE-HIKE-05', barcode: '890100000005', price: 1200, stock: 45 },
  { id: 6, name: 'Flashlight LED', sku: 'LIGHT-LED-06', barcode: '890100000006', price: 899, stock: 45 }
];

const S = {
  card: { background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' },
  inp: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  saveBtn: { padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const AdminPOS = () => {
  const [searchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'POS Dashboard';

  const [cart, setCart] = useState([
    { id: 101, name: 'Premium Hiking Backpack', price: 2499, qty: 1 }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [barcodeError, setBarcodeError] = useState('');
  const [showBarcodePopup, setShowBarcodePopup] = useState(false);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [generatedBill, setGeneratedBill] = useState(null);
  const [billCounter, setBillCounter] = useState(1001);

  // Additional states for sub-options
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [appliedCredits, setAppliedCredits] = useState(0);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => (
      [product.name, product.sku, product.barcode].some((value) => value.toLowerCase().includes(query))
    ));
  }, [searchQuery]);

  const addToCart = (product) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discount = appliedCoupon === 'DISCOUNT10' ? Math.round(subtotal * 0.1) : 0;
  const creditsValue = appliedCredits > 0 ? Math.min(appliedCredits, Math.round(subtotal * 0.1)) : 0;
  const tax = Math.round((subtotal - discount - creditsValue) * 0.18);
  const total = subtotal - discount - creditsValue + tax;

  const handleBarcodeAdd = () => {
    const query = barcodeQuery.trim().toLowerCase();
    if (!query) {
      setBarcodeError('Enter barcode or SKU.');
      return;
    }
    const product = products.find((item) => (
      item.barcode.toLowerCase() === query || item.sku.toLowerCase() === query || item.name.toLowerCase().includes(query)
    ));
    if (product) {
      addToCart(product);
      setBarcodeQuery('');
      setBarcodeError('');
      setShowBarcodePopup(false);
    } else {
      setBarcodeError('Product not found.');
    }
  };

  const handleGenerateBill = () => {
    const bill = {
      billNo: `POS-${billCounter}`,
      date: 'Generated now',
      paymentMode,
      items: cart,
      subtotal,
      discount,
      creditsValue,
      tax,
      total
    };
    setGeneratedBill(bill);
    setBillCounter((value) => value + 1);
    setCart([]);
  };

  const renderSubContent = () => {
    switch (activeSub) {
      case 'POS Dashboard':
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { label: 'POS Today Sales', val: '₹48,250', sub: '18 bills generated' },
                { label: 'Cash Drawer', val: '₹14,500', sub: 'Opening: ₹5,000' },
                { label: 'UPI / Card Sales', val: '₹33,750', sub: 'Digital payments' },
                { label: 'Active Terminal', val: 'Term-01 (Active)', sub: 'Operator: Cashier Pooja' }
              ].map((k, i) => (
                <div key={i} style={S.card}>
                  <span style={{ fontSize: '13px', color: '#667085' }}>{k.label}</span>
                  <h2 style={{ margin: '6px 0 4px', fontSize: '24px', fontWeight: '700', color: '#ff6600' }}>{k.val}</h2>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{k.sub}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              <div style={S.panel}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}><strong>Recent POS Bills</strong></div>
                <table style={S.table}>
                  <thead>
                    <tr>{['Bill #', 'Time', 'Payment', 'Amount', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[
                      { bill: 'POS-1004', time: '12:15 PM', pay: 'UPI', amt: '₹3,299', status: 'Completed' },
                      { bill: 'POS-1003', time: '11:40 AM', pay: 'Cash', amt: '₹850', status: 'Completed' },
                      { bill: 'POS-1002', time: '11:02 AM', pay: 'Card', amt: '₹12,400', status: 'Completed' }
                    ].map((r, i) => (
                      <tr key={i}>
                        <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{r.bill}</td>
                        <td style={S.td}>{r.time}</td>
                        <td style={S.td}>{r.pay}</td>
                        <td style={{ ...S.td, fontWeight: '700' }}>{r.amt}</td>
                        <td style={S.td}><span style={S.badge('#e3fcef', '#12b76a')}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={S.card}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>Quick POS Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button onClick={() => alert('Opening cash drawer...')} style={{ padding: '12px', background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500' }}>🔓 Open Cash Drawer</button>
                  <button onClick={() => alert('POS shift report print...')} style={{ padding: '12px', background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500' }}>🖨️ Print Shift Summary</button>
                  <button onClick={() => alert('Drawer cash drop configured')} style={{ padding: '12px', background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500' }}>💰 Safe Drop (Cash Out)</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'New Bill (POS)':
        return (
          <div style={{ display: 'flex', gap: '24px', height: '100%', width: '100%' }}>
            {/* Left side: Products Grid */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#667085' }} />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search product name or SKU..." style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                </div>
                <button onClick={() => setShowBarcodePopup(true)} style={{ padding: '10px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ScanLine size={16} /> Scan Barcode
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', overflowY: 'auto', maxHeight: '420px' }}>
                {filteredProducts.map((p) => (
                  <div key={p.id} style={{ ...S.card, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => addToCart(p)}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: '#111' }}>{p.name}</strong>
                      <span style={{ fontSize: '12px', color: '#667085', fontFamily: 'monospace' }}>{p.sku}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: '#ff6600' }}>₹{p.price}</span>
                      <span style={{ fontSize: '11px', color: p.stock > 10 ? '#12b76a' : '#f04438' }}>Stock: {p.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Shopping Cart & Checkout */}
            <div style={{ flex: 1.2, background: 'white', borderLeft: '1px solid #e5e7eb', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={18} /> POS Checkout Cart ({cart.length} items)
              </h3>
              
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', minHeight: '180px' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ flex: 1, marginRight: '10px' }}>
                      <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '500' }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#ff6600', fontWeight: '600' }}>₹{item.price} × {item.qty}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#f04438', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
                {cart.length === 0 && (
                  <p style={{ color: '#667085', fontSize: '13px', textAlign: 'center', margin: '30px 0' }}>Cart is empty</p>
                )}
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Subtotal:</span><strong>₹{subtotal}</strong></div>
                {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#12b76a' }}><span>Discount (10%):</span><strong>−₹{discount}</strong></div>}
                {creditsValue > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6366f1' }}><span>Dzire Credits:</span><strong>−₹{creditsValue}</strong></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>GST (18%):</span><strong>₹{tax}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', borderTop: '1px dashed #e5e7eb', paddingTop: '10px', color: '#ff6600' }}><span>Grand Total:</span><span>₹{total}</span></div>

                <div style={{ margin: '10px 0' }}>
                  <label style={S.label}>Payment Method</label>
                  <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} style={S.inp}>
                    <option>Cash</option><option>UPI (PhonePe/GPay)</option><option>Credit/Debit Card</option><option>Split Payment</option>
                  </select>
                </div>

                <button onClick={handleGenerateBill} disabled={cart.length === 0} style={{ padding: '12px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Printer size={16} /> Print &amp; Complete Bill
                </button>
              </div>
            </div>
          </div>
        );

      case 'Barcode Scan':
        return (
          <div style={{ ...S.formCard, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Scanner Configuration</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={S.label}>POS Scanner Device</label>
                <select style={S.inp}><option>Zebra DS2208 USB</option><option>Honeywell Voyager 1400g</option><option>Generic Bluetooth Scanner</option></select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#e3fcef', borderRadius: '8px' }}>
                <span style={{ fontSize: '16px' }}>🟢</span>
                <span style={{ fontSize: '13px', color: '#15803d', fontWeight: '500' }}>USB scanner connected and listening</span>
              </div>
              <button onClick={() => alert('Scanner test signal sent')} style={S.saveBtn}>Test Connection</button>
            </div>
          </div>
        );

      case 'Product Search':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <input type="text" placeholder="Start typing SKU, Barcode, or Name..." style={S.inp} />
            </div>
            <table style={S.table}>
              <thead>
                <tr>{['Product', 'SKU', 'Barcode', 'Price', 'Available Stock'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={S.td}><strong>{p.name}</strong></td>
                    <td style={{ ...S.td, fontFamily: 'monospace' }}>{p.sku}</td>
                    <td style={{ ...S.td, fontFamily: 'monospace' }}>{p.barcode}</td>
                    <td style={{ ...S.td, fontWeight: '600', color: '#ff6600' }}>₹{p.price}</td>
                    <td style={S.td}><span style={S.badge('#e3fcef', '#12b76a')}>{p.stock} units</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Cart Management':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}><strong>Current Active Cart</strong></div>
            <table style={S.table}>
              <thead>
                <tr>{['Item', 'Original Price', 'Quantity', 'Total Line Price'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {cart.map((c, i) => (
                  <tr key={i}>
                    <td style={S.td}>{c.name}</td>
                    <td style={S.td}>₹{c.price}</td>
                    <td style={S.td}>{c.qty}</td>
                    <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>₹{c.price * c.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Apply Coupon':
        return (
          <div style={{ ...S.formCard, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Apply Discount Code</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={S.label}>Enter Coupon Code</label>
                <input type="text" placeholder="e.g. DISCOUNT10" style={S.inp} onChange={e => setAppliedCoupon(e.target.value.toUpperCase())} />
              </div>
              <button onClick={() => { setAppliedCoupon('DISCOUNT10'); alert('Discount voucher WELCOME10/DISCOUNT10 applied successfully!'); }} style={S.saveBtn}>Apply Discount Code</button>
            </div>
          </div>
        );

      case 'Apply Dzire Credits':
        return (
          <div style={{ ...S.formCard, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Apply Loyalty Points</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={S.label}>Available Balance (Priya Sharma)</label>
                <input type="text" value="650 Points (Max allowed redemption: 10% of cart value)" readOnly style={{ ...S.inp, background: '#f9fafb' }} />
              </div>
              <div>
                <label style={S.label}>Credits to Redeem</label>
                <input type="number" defaultValue={150} style={S.inp} onChange={e => setAppliedCredits(Number(e.target.value))} />
              </div>
              <button onClick={() => { setAppliedCredits(150); alert('Credits balance successfully applied to checkout'); }} style={S.saveBtn}>Apply Balance</button>
            </div>
          </div>
        );

      case 'Payment (Cash/UPI/Card)':
        return (
          <div style={{ ...S.formCard, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Complete Checkout Payment</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={S.label}>Total Amount Due</label>
                <input type="text" value={`₹${total}`} readOnly style={{ ...S.inp, background: '#f9fafb', fontSize: '18px', fontWeight: '700', color: '#ff6600' }} />
              </div>
              <div>
                <label style={S.label}>Select Gateway Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {['Cash', 'UPI Gateway', 'Card Swipe'].map(m => (
                    <button key={m} style={{ padding: '12px 6px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>{m}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => alert('Payment completed!')} style={S.saveBtn}>Finalize Payment &amp; Print Receipt</button>
            </div>
          </div>
        );

      case 'Split Payments':
        return (
          <div style={{ ...S.formCard, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Split Bill Payment</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={S.label}>Cash Amount</label>
                <input type="number" placeholder="₹0" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>UPI Amount</label>
                <input type="number" placeholder="₹0" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>Card Swipe Amount</label>
                <input type="number" placeholder="₹0" style={S.inp} />
              </div>
              <button onClick={() => alert('Split payment saved')} style={S.saveBtn}>Submit Split Payments</button>
            </div>
          </div>
        );

      case 'POS Returns':
      case 'POS Exchange':
        return (
          <div style={{ ...S.formCard, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>POS Return / Exchange RMA</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={S.label}>Enter Bill Number</label>
                <input type="text" placeholder="e.g. POS-1004" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>Return Reason</label>
                <select style={S.inp}><option>Sizing Defect</option><option>Quality Issue</option><option>Wrong Product</option></select>
              </div>
              <button onClick={() => alert('RMA completed')} style={S.saveBtn}>{activeSub.includes('Return') ? 'Process Return Refund' : 'Initiate Exchange Bill'}</button>
            </div>
          </div>
        );

      case 'Sales History':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Today's POS Sales Logs</strong>
            </div>
            <table style={S.table}>
              <thead>
                <tr>{['Bill Number', 'Time', 'Payment Gateway', 'Subtotal', 'Tax', 'Grand Total'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[
                  { bill: 'POS-1004', time: '12:15 PM', gateway: 'PhonePe UPI', sub: '₹2,499', tax: '₹450', tot: '₹2,949' },
                  { bill: 'POS-1003', time: '11:40 AM', gateway: 'Cash Drawer', sub: '₹720', tax: '₹130', tot: '₹850' },
                  { bill: 'POS-1002', time: '11:02 AM', gateway: 'PineLabs Card Swipe', sub: '₹10,500', tax: '₹1,900', tot: '₹12,400' }
                ].map((r, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{r.bill}</td>
                    <td style={S.td}>{r.time}</td>
                    <td style={S.td}>{r.gateway}</td>
                    <td style={S.td}>{r.sub}</td>
                    <td style={S.td}>{r.tax}</td>
                    <td style={{ ...S.td, fontWeight: '700' }}>{r.tot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <p>Generate customer checkout invoices, process split payments and return item exchanges</p>
          </div>
        </section>

        {renderSubContent()}
      </div>

      {showBarcodePopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', width: '400px', position: 'relative' }}>
            <button onClick={() => setShowBarcodePopup(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>Scan Product Barcode</h2>
            <p style={{ color: '#667085', fontSize: '14px', marginBottom: '24px' }}>Enter product barcode sequence or SKU code manually</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <input type="text" value={barcodeQuery} onChange={e => setBarcodeQuery(e.target.value)} placeholder="e.g. 890100000001" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                {barcodeError && <p style={{ color: '#f04438', fontSize: '12px', margin: '4px 0 0' }}>{barcodeError}</p>}
              </div>
              <button onClick={handleBarcodeAdd} style={{ padding: '12px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPOS;
