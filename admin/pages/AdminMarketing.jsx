import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useSearchParams } from "react-router-dom";
import { TicketPercent, Tag, Send, Plus, Calendar, Settings, ArrowRight, Download, Mail, MessageSquare, BarChart3 } from "lucide-react";
import { Button, Input, Textarea } from "../AdminShims";
import { AdminPanel } from "../components/AdminUi";

const initialCoupons = [
  { id: 1, code: "WELCOME50", type: "Flat Discount", value: "50 Rs", rules: "Min Spend 500 Rs, First Order", expiry: "2026-12-31" },
  { id: 2, code: "MONSOON20", type: "Percentage", value: "20% OFF", rules: "Min Spend 2000 Rs, Footwear only", expiry: "2026-08-31" },
  { id: 3, code: "FREESHIP", type: "Free Shipping", value: "100% Shipping Off", rules: "Min Spend 3000 Rs, Prepaid only", expiry: "2026-09-30" }
];

const initialCampaigns = [
  { id: 1, name: "Monsoon Launch Promotion", channel: "WhatsApp API", target: "VIP Segments", status: "Sent (2,450 users)", date: "2026-06-12" },
  { id: 2, name: "June Weekly Newsletter", channel: "Email Broadcast", target: "All Customers", status: "Draft", date: "2026-06-18" }
];

const initialOffers = [
  { id: 1, name: "Monsoon Special Flat 10% Off", target: "All Products", discount: "10%", type: "Percentage", status: "Active" },
  { id: 2, name: "Buy Backpack Get Bottle Free", target: "Bags Segment", discount: "Free Item", type: "Gift Bundle", status: "Active" }
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

const AdminMarketing = () => {
  const [searchParams] = useSearchParams();
  const activeSub = searchParams.get("sub") || "Coupons";

  const [coupons, setCoupons] = useState(initialCoupons);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [offers, setOffers] = useState(initialOffers);

  // New Coupon Form
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState("Flat Discount");
  const [newValue, setNewValue] = useState("");
  const [newRules, setNewRules] = useState("");
  const [newExpiry, setNewExpiry] = useState("2026-07-31");

  // New Offer Form
  const [offerName, setOfferName] = useState("");
  const [offerType, setOfferType] = useState("Percentage");
  const [offerVal, setOfferVal] = useState("");
  const [offerTarget, setOfferTarget] = useState("All Products");

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCode || !newValue) return;
    setCoupons([...coupons, {
      id: Date.now(),
      code: newCode.toUpperCase(),
      type: newType,
      value: newValue,
      rules: newRules || "None",
      expiry: newExpiry
    }]);
    setNewCode("");
    setNewValue("");
    setNewRules("");
    alert("Coupon code " + newCode.toUpperCase() + " successfully created!");
  };

  const handleCreateOffer = (e) => {
    e.preventDefault();
    if (!offerName || !offerVal) return;
    setOffers([...offers, {
      id: Date.now(),
      name: offerName,
      target: offerTarget,
      discount: offerVal,
      type: offerType,
      status: "Active"
    }]);
    setOfferName("");
    setOfferVal("");
    alert("Discount Offer created successfully!");
  };

  const renderSubContent = () => {
    switch (activeSub) {
      case "Coupons":
      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Discount Coupons</h3>
              <p style={{ fontSize: '13px', color: '#667085', margin: '0 0 20px 0' }}>Flat/Percentage discount vouchers applied at cart checkout.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {coupons.map(c => (
                  <div key={c.id} style={{ padding: '16px', border: '1px solid #ffe0cc', borderRadius: '12px', background: '#fffcfb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '16px', color: '#ff6600' }}>{c.code}</strong>
                      <span style={S.badge('#eff8ff', '#175cd3')}>{c.type}</span>
                    </div>
                    <p style={{ margin: '8px 0 4px 0', fontSize: '14px', fontWeight: '600' }}>{c.value}</p>
                    <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#667085' }}>Rules: {c.rules}</p>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Expiry: {c.expiry}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Create Coupon</h3>
              <form onSubmit={handleAddCoupon}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={S.label}>Coupon Code</label>
                    <input type="text" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="e.g. WELCOME50" style={S.inp} required />
                  </div>
                  <div>
                    <label style={S.label}>Type</label>
                    <select value={newType} onChange={e => setNewType(e.target.value)} style={S.inp}>
                      <option>Flat Discount</option><option>Percentage</option><option>Free Shipping</option>
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Discount Value</label>
                    <input type="text" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="e.g. 50 Rs or 15%" style={S.inp} required />
                  </div>
                  <div>
                    <label style={S.label}>Min Spend &amp; Segment Rules</label>
                    <input type="text" value={newRules} onChange={e => setNewRules(e.target.value)} placeholder="Min Spend 500 Rs" style={S.inp} />
                  </div>
                  <button type="submit" style={S.saveBtn}>Generate Code</button>
                </div>
              </form>
            </div>
          </div>
        );

      case "Add Coupon":
        return (
          <div style={{ ...S.formCard, maxWidth: '560px' }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "600" }}>Create Discount Code</h3>
            <form onSubmit={handleAddCoupon}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={S.label}>Code</label>
                  <input type="text" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="e.g. MONSOON30" style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Discount Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} style={S.inp}>
                    <option>Flat Discount</option><option>Percentage</option><option>Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Discount Value</label>
                  <input type="text" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="e.g. 150 Rs / 20%" style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Voucher Rules</label>
                  <input type="text" value={newRules} onChange={e => setNewRules(e.target.value)} placeholder="Min Spend 1000 Rs, category Footwear" style={S.inp} />
                </div>
                <button type="submit" style={S.saveBtn}>Save Coupon</button>
              </div>
            </form>
          </div>
        );

      case "Coupon List":
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>All Discount Vouchers</strong>
            </div>
            <table style={S.table}>
              <thead>
                <tr>{['Code', 'Type', 'Value', 'Rules', 'Expiry', 'Action'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id}>
                    <td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{c.code}</td>
                    <td style={S.td}>{c.type}</td>
                    <td style={{ ...S.td, fontWeight: '600' }}>{c.value}</td>
                    <td style={{ ...S.td, color: '#667085' }}>{c.rules}</td>
                    <td style={S.td}>{c.expiry}</td>
                    <td style={S.td}>
                      <button onClick={() => alert('Disabled coupon')} style={{ color: '#f04438', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Disable</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "Offers":
      case "Offer List":
        return (
          <div style={S.panel}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Product Catalog Offers &amp; Discounts</strong>
              <button onClick={() => alert('Add Offer')} style={{ padding: '7px 14px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>+ New Offer</button>
            </div>
            <table style={S.table}>
              <thead>
                <tr>{['Offer Name', 'Target Segment', 'Discount', 'Offer Type', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {offers.map(o => (
                  <tr key={o.id}>
                    <td style={S.td}><strong>{o.name}</strong></td>
                    <td style={S.td}>{o.target}</td>
                    <td style={{ ...S.td, fontWeight: '600', color: '#ff6600' }}>{o.discount}</td>
                    <td style={S.td}>{o.type}</td>
                    <td style={S.td}><span style={S.badge('#e3fcef', '#12b76a')}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "Add Offer":
        return (
          <div style={{ ...S.formCard, maxWidth: '560px' }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "600" }}>Configure Catalog Offer</h3>
            <form onSubmit={handleCreateOffer}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={S.label}>Offer Campaign Name</label>
                  <input type="text" value={offerName} onChange={e => setOfferName(e.target.value)} placeholder="e.g. Monsoon Special Sale" style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Offer Target</label>
                  <select value={offerTarget} onChange={e => setOfferTarget(e.target.value)} style={S.inp}>
                    <option>All Products</option><option>Bags Category</option><option>Footwear Only</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Offer Discount Value</label>
                  <input type="text" value={offerVal} onChange={e => setOfferVal(e.target.value)} placeholder="e.g. 15% / Buy 1 Get 1" style={S.inp} required />
                </div>
                <button type="submit" style={S.saveBtn}>Apply Offer</button>
              </div>
            </form>
          </div>
        );

      case "Campaigns":
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div style={S.panel}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}><strong>Marketing Campaigns</strong></div>
              <table style={S.table}>
                <thead>
                  <tr>{['Campaign Name', 'Channel', 'Target', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.id}>
                      <td style={S.td}><strong>{c.name}</strong><br /><span style={{ fontSize: '11px', color: '#9ca3af' }}>{c.date}</span></td>
                      <td style={S.td}>{c.channel}</td>
                      <td style={S.td}>{c.target}</td>
                      <td style={S.td}><span style={S.badge('#e3fcef', '#12b76a')}>{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={S.card}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600' }}>Launch Broadcast Campaign</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={S.label}>Broadcast Target Cohort</label>
                  <select style={S.inp}><option>VIP Segments (24 users)</option><option>Regular Shoppers (142 users)</option><option>All Customers</option></select>
                </div>
                <div>
                  <label style={S.label}>Campaign Message Body</label>
                  <textarea placeholder="Write campaign copy text..." style={{ ...S.inp, minHeight: '80px', resize: 'vertical' }} />
                </div>
                <button onClick={() => alert('Broadcasting campaign...')} style={S.saveBtn}>Send Broadcast Now</button>
              </div>
            </div>
          </div>
        );

      case "Email Campaigns":
      case "WhatsApp Campaigns": {
        const isEmail = activeSub.includes("Email");
        return (
          <div style={{ ...S.formCard, maxWidth: '560px' }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "600" }}>{activeSub} Broadcast</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {isEmail && (
                <div>
                  <label style={S.label}>Email Subject</label>
                  <input type="text" placeholder="e.g. Free Shipping this Monsoon!" style={S.inp} />
                </div>
              )}
              <div>
                <label style={S.label}>Target Segment</label>
                <select style={S.inp}><option>All Customers</option><option>VIP Cohort</option></select>
              </div>
              <div>
                <label style={S.label}>Broadcast Message Body</label>
                <textarea placeholder={isEmail ? "HTML or rich text body copy..." : "WhatsApp text copy (supports markdown bold *text*)..."} style={{ ...S.inp, minHeight: '120px' }} />
              </div>
              <button onClick={() => alert('Broadcast initiated')} style={{ ...S.saveBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Send size={16} /> Send Campaign
              </button>
            </div>
          </div>
        );
      }

      case "Campaign Reports":
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { label: 'Total Messages Sent', val: '2,450', sub: 'WhatsApp + Email' },
                { label: 'Avg Delivery Rate', val: '98.2%', sub: '2,406 messages delivered' },
                { label: 'Conversion Order count', val: '142 orders', sub: '₹2.4L revenue attributed' }
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
      <div className="space-y-6">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>{activeSub}</h1>
            <p>Configure coupon discount codes, product offers, and broadcast Whatsapp/Email marketing campaigns</p>
          </div>
        </section>

        {renderSubContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminMarketing;
