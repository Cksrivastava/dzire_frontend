import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Plus, Mail, Phone, X, RefreshCcw, FileText, Download, TrendingUp, Award, Activity } from 'lucide-react';

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

const mockVendors = [
  { id: 1, name: 'Wildcraft India Pvt Ltd', gst: '27AABCW1234D1Z5', email: 'sales@wildcraft.in', phone: '+91 800-123-4567', payable: '₹45,000', status: 'Active', score: '94%', contactPerson: 'Sanjay Rawat' },
  { id: 2, name: 'Decathlon Sports India', gst: '29AABCD1234E1Z6', email: 'b2b@decathlon.in', phone: '+91 900-987-6543', payable: '₹0 (Settled)', status: 'Active', score: '88%', contactPerson: 'Marie Dupont' },
  { id: 3, name: 'Coleman Gear', gst: '27AACCB9876C1Z4', email: 'info@coleman.in', phone: '+91 888-777-6666', payable: '₹12,400', status: 'Active', score: '82%', contactPerson: 'Amit Mishra' }
];

const AdminVendors = () => {
  const [searchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'All Vendors';

  const [vendors, setVendors] = useState(mockVendors);
  const [showModal, setShowModal] = useState(false);

  const [newName, setNewName] = useState('');
  const [newGst, setNewGst] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!newName) return;
    setVendors([...vendors, {
      id: Date.now(),
      name: newName,
      gst: newGst || '—',
      email: newEmail || '—',
      phone: newPhone || '—',
      payable: '₹0 (Settled)',
      status: 'Active',
      score: '100%',
      contactPerson: '—'
    }]);
    setShowModal(false);
    setNewName('');
    setNewGst('');
    setNewEmail('');
    setNewPhone('');
    alert('Vendor created successfully!');
  };

  const renderSubContent = () => {
    switch (activeSub) {
      case 'All Vendors':
      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {vendors.map(v => (
              <div key={v.id} style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#111', fontWeight: '600' }}>{v.name}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#667085' }}>GST: {v.gst}</p>
                  </div>
                  <span style={S.badge('#e3fcef', '#12b76a')}>{v.status}</span>
                </div>
                
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginBottom: '16px' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0', fontSize: '13px', color: '#344054' }}>
                    <Mail size={14} color="#667085" /> {v.email}
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0', fontSize: '13px', color: '#344054' }}>
                    <Phone size={14} color="#667085" /> {v.phone}
                  </p>
                </div>

                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#667085' }}>Pending Payable</p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: v.payable.includes('0') ? '#12b76a' : '#f04438' }}>{v.payable}</p>
                  </div>
                  <Link to={`/admin/vendors?sub=Vendor%20Profile`} style={{ fontSize: '13px', color: '#ff6600', textDecoration: 'none', fontWeight: '500' }}>View Profile</Link>
                </div>
              </div>
            ))}
          </div>
        );

      case 'Vendor Profile':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px' }}>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>Wildcraft India Pvt Ltd</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <p><strong>Primary Contact:</strong> Sanjay Rawat (Sales Head)</p>
                <p><strong>GSTIN:</strong> 27AABCW1234D1Z5</p>
                <p><strong>Email:</strong> sales@wildcraft.in</p>
                <p><strong>Phone:</strong> +91 800-123-4567</p>
                <p><strong>Registered Address:</strong> Wildcraft Corporate Office, Outer Ring Road, Bangalore - 560048</p>
                <p><strong>Payable Balance:</strong> <span style={{ color: '#f04438', fontWeight: '700' }}>₹45,000</span></p>
              </div>
            </div>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>Supplier Brief Performance</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '12px', color: '#667085' }}>Fulfillment Score</span>
                  <strong style={{ display: 'block', fontSize: '20px', color: '#ff6600', mt: '4px' }}>94%</strong>
                </div>
                <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '12px', color: '#667085' }}>Total POs Issued</span>
                  <strong style={{ display: 'block', fontSize: '20px', color: '#ff6600', mt: '4px' }}>18</strong>
                </div>
                <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '12px', color: '#667085' }}>Lead Time (Avg)</span>
                  <strong style={{ display: 'block', fontSize: '20px', color: '#ff6600', mt: '4px' }}>4.8 Days</strong>
                </div>
              </div>
              <button onClick={() => alert('Editing details...')} style={{ ...S.btn, padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Edit Profile Information</button>
            </div>
          </div>
        );

      case 'GST Details':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Vendor GST Registration Information</strong>
            </div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Vendor</th>
                  <th style={S.th}>GSTIN</th>
                  <th style={S.th}>State Code</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Verification Date</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id}>
                    <td style={S.td}><strong>{v.name}</strong></td>
                    <td style={{ ...S.td, fontFamily: 'monospace' }}>{v.gst}</td>
                    <td style={S.td}>{v.gst.substring(0, 2)} (Maharashtra/Karnataka)</td>
                    <td style={S.td}><span style={S.badge('#e3fcef', '#12b76a')}>Verified</span></td>
                    <td style={{ ...S.td, color: '#667085' }}>14 Jan 2026</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Contact Details':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>B2B Supplier Contact Points</strong>
            </div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Vendor</th>
                  <th style={S.th}>Contact Person</th>
                  <th style={S.th}>Email Address</th>
                  <th style={S.th}>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id}>
                    <td style={S.td}><strong>{v.name}</strong></td>
                    <td style={S.td}>{v.contactPerson}</td>
                    <td style={{ ...S.td, color: '#175cd3' }}>{v.email}</td>
                    <td style={S.td}>{v.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Vendor Documents':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Verification & Agreement Documents</strong>
              <button onClick={() => alert('Upload File')} style={{ padding: '7px 14px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>+ Upload Document</button>
            </div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Vendor</th>
                  <th style={S.th}>Document Name</th>
                  <th style={S.th}>Type</th>
                  <th style={S.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Wildcraft India', doc: 'b2b-supply-agreement-2026.pdf', type: 'Agreement' },
                  { name: 'Decathlon Sports', doc: 'gst-certificate-verified.pdf', type: 'KYC Document' },
                  { name: 'Coleman Gear', doc: 'bank-mandate-form.pdf', type: 'Financial' }
                ].map((d, i) => (
                  <tr key={i}>
                    <td style={S.td}><strong>{d.name}</strong></td>
                    <td style={S.td}><span style={{ color: '#ff6600', fontWeight: '500' }}>{d.doc}</span></td>
                    <td style={S.td}>{d.type}</td>
                    <td style={S.td}>
                      <button onClick={() => alert('Download document')} style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Product Mapping':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Supplier SKU Catalog Mapping</strong>
              <button onClick={() => alert('New SKU map')} style={{ padding: '7px 14px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>+ Map SKU</button>
            </div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Internal Product</th>
                  <th style={S.th}>Internal SKU</th>
                  <th style={S.th}>Vendor</th>
                  <th style={S.th}>Vendor SKU / Code</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { prod: 'Premium Backpack (Orange)', sku: 'BAG-PREM-ORG', vendor: 'Wildcraft India', vsku: 'WLC-BP-0091-O' },
                  { prod: 'Trekking Shoes', sku: 'SHOE-TRK-001', vendor: 'Decathlon Sports', vsku: 'DEC-TS-9844' },
                  { prod: 'Camping Tent', sku: 'TENT-CAMP-002', vendor: 'Coleman Gear', vsku: 'CLM-CT-431' }
                ].map((m, i) => (
                  <tr key={i}>
                    <td style={S.td}><strong>{m.prod}</strong></td>
                    <td style={{ ...S.td, fontFamily: 'monospace' }}>{m.sku}</td>
                    <td style={S.td}>{m.vendor}</td>
                    <td style={{ ...S.td, fontFamily: 'monospace' }}>{m.vsku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Cost Price Management':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Cost Price Configuration Matrix</strong>
              <button onClick={() => alert('Batch update cost price')} style={{ padding: '7px 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Batch Update</button>
            </div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Product &amp; SKU</th>
                  <th style={S.th}>Vendor</th>
                  <th style={S.th}>Selling Price (MRP)</th>
                  <th style={S.th}>Cost Price (Supplier)</th>
                  <th style={S.th}>Calculated Margin</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Premium Backpack', sku: 'BAG-PREM-ORG', vendor: 'Wildcraft', mrp: '₹2,499', cost: '₹1,200', margin: '52%' },
                  { name: 'Trekking Shoes', sku: 'SHOE-TRK-001', vendor: 'Decathlon', mrp: '₹3,299', cost: '₹1,950', margin: '41%' },
                  { name: 'Camping Tent', sku: 'TENT-CAMP-002', vendor: 'Coleman Gear', mrp: '₹8,500', cost: '₹4,800', margin: '43.5%' }
                ].map((c, i) => (
                  <tr key={i}>
                    <td style={S.td}>
                      <strong>{c.name}</strong><br /><span style={{ fontSize: '12px', color: '#667085' }}>{c.sku}</span>
                    </td>
                    <td style={S.td}>{c.vendor}</td>
                    <td style={S.td}>{c.mrp}</td>
                    <td style={{ ...S.td, fontWeight: '600' }}><input type="text" defaultValue={c.cost} style={{ width: '90px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px' }} /></td>
                    <td style={{ ...S.td, color: '#12b76a', fontWeight: '700' }}>{c.margin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Vendor Performance':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Supplier Performance Evaluation Scorecard</strong>
            </div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Vendor</th>
                  <th style={S.th}>Fulfillment Rate</th>
                  <th style={S.th}>Avg Lead Days</th>
                  <th style={S.th}>Defect Ratio</th>
                  <th style={S.th}>Overall Score</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id}>
                    <td style={S.td}><strong>{v.name}</strong></td>
                    <td style={S.td}>96.4%</td>
                    <td style={S.td}>4.5 Days</td>
                    <td style={{ ...S.td, color: '#12b76a' }}>0.5%</td>
                    <td style={S.td}>
                      <span style={S.badge('#e3fcef', '#12b76a')}>{v.score} (Excellent)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Purchase History':
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Vendor Invoice &amp; PO History Logs</strong>
            </div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>PO Reference</th>
                  <th style={S.th}>Vendor</th>
                  <th style={S.th}>Order Date</th>
                  <th style={S.th}>Total Amount</th>
                  <th style={S.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { po: 'PO-2026-1005', vendor: 'Wildcraft India', date: '08 Jul 2026', amt: '₹1,25,000', status: 'Sent' },
                  { po: 'PO-2026-1004', vendor: 'Decathlon Sports', date: '01 Jul 2026', amt: '₹3,40,000', status: 'Received (Partial)' },
                  { po: 'PO-2026-1003', vendor: 'Coleman Gear', date: '20 Jun 2026', amt: '₹45,500', status: 'Completed' }
                ].map((h, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{h.po}</td>
                    <td style={S.td}>{h.vendor}</td>
                    <td style={{ ...S.td, color: '#667085' }}>{h.date}</td>
                    <td style={{ ...S.td, fontWeight: '600' }}>{h.amt}</td>
                    <td style={S.td}><span style={S.badge('#eff8ff', '#175cd3')}>{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Vendor Analytics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { label: 'Total B2B Outflow (Month)', val: '₹5.1L', sub: 'Across 3 vendors' },
                { label: 'Pending B2B Payables', val: '₹57,400', sub: 'Awaiting balance terms' },
                { label: 'Avg lead fulfillment', val: '5.2 Days', sub: 'Order dispatch to GRN' }
              ].map((k, i) => (
                <div key={i} style={S.card}>
                  <span style={{ fontSize: '13px', color: '#667085' }}>{k.label}</span>
                  <h2 style={{ margin: '6px 0 4px', fontSize: '24px', fontWeight: '700', color: '#ff6600' }}>{k.val}</h2>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{k.sub}</span>
                </div>
              ))}
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
            <p>Manage raw material suppliers, catalog price agreements, and ledger payables</p>
          </div>
          {activeSub === 'All Vendors' && (
            <button onClick={() => setShowModal(true)} className="admin-primary-button" style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Add Vendor
            </button>
          )}
        </section>

        {renderSubContent()}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', width: '450px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>Add New Vendor</h2>
            <p style={{ color: '#667085', fontSize: '14px', marginBottom: '24px' }}>Enter B2B supplier details</p>
            
            <form onSubmit={handleAddVendor}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>Vendor Name</label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Nike India" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>GST Number</label>
                  <input type="text" value={newGst} onChange={e => setNewGst(e.target.value)} placeholder="e.g. 27AAAAA0000A1Z5" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>Primary Email</label>
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="sales@nike.in" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>Phone Number</label>
                  <input type="text" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+91 999-999-9999" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                </div>
                <button type="submit" style={{ padding: '12px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>Save Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminVendors;
