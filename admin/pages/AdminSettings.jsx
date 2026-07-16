import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useSearchParams } from "react-router-dom";
import { Settings, ShieldAlert, CreditCard, Truck, Percent, Gift, FileText, Database, Save, Check, Globe, Code, ArrowLeftRight, CheckCircle, RefreshCw } from "lucide-react";
import { Button, Input, Textarea, Switch } from "../AdminShims";
import { AdminPanel } from "../components/AdminUi";

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

const AdminSettings = () => {
  const [searchParams] = useSearchParams();
  const activeMenu = searchParams.get("menu") || "Settings";
  const activeSub = searchParams.get("sub") || "SEO Settings";

  const [activeTab, setActiveTab] = useState("store"); // "store", "shipping", "payments", "loyalty", "invoice", "backup"
  const [saveStatus, setSaveStatus] = useState(false);

  // Store settings
  const [storeName, setStoreName] = useState("Dzire Store");
  const [gstNumber, setGstNumber] = useState("29ABCDE1234F1Z5");
  const [storeAddress, setStoreAddress] = useState("123, MG Road, Outer Ring Road, Bangalore - 560001");

  // Shipping settings
  const [shippingCharge, setShippingCharge] = useState(100);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(3000);
  const [allowStorePickup, setAllowStorePickup] = useState(true);

  // Razorpay
  const [rzpKey, setRzpKey] = useState("rzp_live_892347kjasd");
  const [rzpSecret, setRzpSecret] = useState("••••••••••••••••••••••••");

  // Loyalty Settings
  const [conversionRate, setConversionRate] = useState(50); // 50 points per 1000 spend
  const [pointsValue, setPointsValue] = useState(1); // 1 point = 1 Rs
  const [redemptionLimit, setRedemptionLimit] = useState(10); // 10% limit

  // Invoice Template Select
  const [selectedInvoiceTemplate, setSelectedInvoiceTemplate] = useState("Clean Minimalist");

  // SEO specific states
  const [robotsTxt, setRobotsTxt] = useState("User-agent: *\nDisallow: /admin/\nDisallow: /checkout/\nSitemap: https://dzirestore.com/sitemap.xml");

  const handleSave = (e) => {
    e.preventDefault();
    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
      alert("Settings successfully updated!");
    }, 800);
  };

  const handleBackup = (type) => {
    alert(type + " backup initialized...\nZip archive created successfully!");
  };

  /* ── SEO Section renderer ────────────────────────────────── */
  const renderSeoContent = () => {
    switch (activeSub) {
      case "SEO Settings":
      default:
        return (
          <div style={{ ...S.card, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>General SEO Indexing Preferences</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked /> Enable Google Indexing (Add follow, index meta tags)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked /> Append trailing slashes to route paths
              </label>
              <div>
                <label style={S.label}>Default Brand Suffix</label>
                <input type="text" defaultValue=" | Dzire Premium Store" style={S.inp} />
              </div>
              <button onClick={() => alert('Global SEO settings saved')} style={S.saveBtn}>Save SEO Preferences</button>
            </div>
          </div>
        );

      case "Meta Tags":
        return (
          <div style={{ ...S.card, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>Default Meta &amp; Social OG Tags</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={S.label}>Store Default Title Tag</label>
                <input type="text" defaultValue="Dzire Store | Premium Outdoor Clothing and Adventure Gears" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>Store Default Description Tag</label>
                <textarea defaultValue="Explore premium outdoor tents, hiking boots, trekking backpacks, and hydration packs at Dzire store with flat discounts." style={{ ...S.inp, minHeight: '80px' }} />
              </div>
              <div>
                <label style={S.label}>Open Graph (OG) Share Image URL</label>
                <input type="text" defaultValue="https://dzirestore.com/assets/logo.png" style={S.inp} />
              </div>
              <button onClick={() => alert('Meta Tags saved')} style={S.saveBtn}>Save Meta Preferences</button>
            </div>
          </div>
        );

      case "Sitemap Generator":
        return (
          <div style={{ ...S.card, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>XML Sitemap Automatic Builder</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ padding: "14px", background: "#fcf6f2", border: "1px solid #ffe0cc", borderRadius: "10px" }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>🛰️ <strong>Sitemap status:</strong> Active</p>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#667085" }}>Indexed links: <strong>214 pages</strong> (Products, Categories, Collections)</p>
                <span style={{ fontSize: "11px", color: "#9ca3af" }}>Last auto build date: 09 Jul 2026, 02:00 AM</span>
              </div>
              <button onClick={() => alert('Rebuilding sitemap index...')} style={{ ...S.saveBtn, marginTop: 0 }}>Rebuild Sitemap Index</button>
            </div>
          </div>
        );

      case "Robots.txt":
        return (
          <div style={{ ...S.card, maxWidth: "600px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>Configure Robots Crawler Directives</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <textarea value={robotsTxt} onChange={e => setRobotsTxt(e.target.value)} style={{ ...S.inp, minHeight: '180px', fontFamily: 'monospace', fontSize: '13px' }} />
              <button onClick={() => alert('Robots.txt file successfully updated!')} style={S.saveBtn}>Save Robots.txt</button>
            </div>
          </div>
        );

      case "URL Redirects":
        return (
          <div style={S.panel}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
              <strong>301 / 302 URL Redirect Matrix</strong>
              <button onClick={() => alert('New redirect rule')} style={{ padding: "8px 16px", background: "#ff6600", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>+ Add Redirect</button>
            </div>
            <table style={S.table}>
              <thead>
                <tr>{['Source Route', 'Target Destination', 'Type', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[
                  { from: '/old-backpacks', to: '/shop?category=bags', type: '301 (Permanent)' },
                  { from: '/sale-items', to: '/offers', type: '302 (Temporary)' }
                ].map((r, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, fontFamily: 'monospace' }}>{r.from}</td>
                    <td style={{ ...S.td, fontFamily: 'monospace' }}>{r.to}</td>
                    <td style={S.td}><span style={S.badge('#e3fcef', '#12b76a')}>{r.type}</span></td>
                    <td style={S.td}><button onClick={() => alert('Deleted')} style={{ background: 'none', border: 'none', color: '#f04438', cursor: 'pointer' }}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "Canonical Tags":
        return (
          <div style={{ ...S.card, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>Canonical Domain Formatting</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={S.label}>Preferred Storefront Domain Name</label>
                <input type="text" defaultValue="https://www.dzirestore.com" style={S.inp} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked /> Strip search tracking parameters to avoid duplicate content tags
              </label>
              <button onClick={() => alert('Canonical config updated')} style={S.saveBtn}>Save Canonical Settings</button>
            </div>
          </div>
        );

      case "Schema Markup":
        return (
          <div style={{ ...S.card, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>Rich Snippets Schema Injection</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked /> Enable JSON-LD product micro-data schemas
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked /> Include stock units status inside schemas
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked /> Include reviews rating metrics inside search results
              </label>
              <button onClick={() => alert('Schema markup preferences saved')} style={S.saveBtn}>Save Schema Preferences</button>
            </div>
          </div>
        );

      case "Search Console Integration":
        return (
          <div style={{ ...S.card, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>Google Console Verification Webmaster Tools</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={S.label}>Google Site Verification Tag ID</label>
                <input type="text" defaultValue="googlesiteverificationid892347918" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>Bing Webmaster Verification Code</label>
                <input type="text" defaultValue="bingverificationid89234" style={S.inp} />
              </div>
              <button onClick={() => alert('Verification tags saved')} style={S.saveBtn}>Verify Integration</button>
            </div>
          </div>
        );
    }
  };

  /* ── Check if SEO menu context needs to render ────────────── */
  if (activeMenu === "SEO") {
    return (
      <AdminLayout>
        <div className="admin-page-container">
          <section className="admin-hero" style={{ marginBottom: "24px" }}>
            <div>
              <h1>{activeSub}</h1>
              <p>Configure search keywords sitemaps robots and URL canonical redirect parameters</p>
            </div>
          </section>

          {renderSeoContent()}
        </div>
      </AdminLayout>
    );
  }

  /* ── Otherwise fall back to the standard Settings view ──── */
  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <span className="admin-eyebrow">System / Preferences</span>
            <h1>Global Settings</h1>
            <p>Configure tax information, shipping rate calculators, Razorpay checkout integrations, points rules, invoice styles, and backup storage.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="admin-primary-button" style={{ background: '#ff6600' }}>
              {saveStatus ? <Check size={18} /> : <Save size={18} />} Save All Changes
            </button>
          </div>
        </section>

        {/* Settings Layout Grid */}
        <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
          {/* Side Menu */}
          <div className="space-y-2">
            {[
              { id: "store", label: "Store Information", icon: Settings },
              { id: "shipping", label: "Shipping Options", icon: Truck },
              { id: "payments", label: "Payment Gateway", icon: CreditCard },
              { id: "loyalty", label: "Credits & Loyalty", icon: Gift },
              { id: "invoice", label: "Invoice Templates", icon: FileText },
              { id: "backup", label: "Data Backups", icon: Database },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full text-left p-3 text-sm font-semibold rounded-lg flex items-center gap-3 hover:bg-slate-50 transition"
                  style={{ color: activeTab === tab.id ? "#ff6600" : "#555555", background: activeTab === tab.id ? "#fff7f1" : "transparent" }}
                >
                  <Icon size={17} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Area */}
          <div className="space-y-6">
            {/* Store Information */}
            {activeTab === "store" && (
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Store Profile & GST Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Company / Store Name</label>
                    <Input value={storeName} onChange={e => setStoreName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">GST Identification Number</label>
                    <Input value={gstNumber} onChange={e => setGstNumber(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Registered Billing Address</label>
                    <Textarea value={storeAddress} onChange={e => setStoreAddress(e.target.value)} style={{ minHeight: '80px' }} />
                  </div>
                </div>
              </AdminPanel>
            )}

            {/* Shipping */}
            {activeTab === "shipping" && (
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Configure Shipping Tariffs</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Default Shipping Cost (Rs)</label>
                    <Input type="number" value={shippingCharge} onChange={e => setShippingCharge(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Free Shipping Cart Minimum (Rs)</label>
                    <Input type="number" value={freeShippingThreshold} onChange={e => setFreeShippingThreshold(Number(e.target.value))} />
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Storefront Self-Pickup Option</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Let users choose local warehouse pickup at checkout</p>
                    </div>
                    <Switch checked={allowStorePickup} onChange={setAllowStorePickup} />
                  </div>
                </div>
              </AdminPanel>
            )}

            {/* Payment Gateway */}
            {activeTab === "payments" && (
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Razorpay Gateway Integration</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Razorpay Live Key ID</label>
                    <Input value={rzpKey} onChange={e => setRzpKey(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Razorpay Secret Password</label>
                    <Input type="password" value={rzpSecret} onChange={e => setRzpSecret(e.target.value)} />
                  </div>
                </div>
              </AdminPanel>
            )}

            {/* Loyalty */}
            {activeTab === "loyalty" && (
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Dzire Credits Wallet Settings</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Credits per Rs 1,000 spend</label>
                    <Input type="number" value={conversionRate} onChange={e => setConversionRate(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Points value in cash (1 Pt = X Rs)</label>
                    <Input type="number" value={pointsValue} onChange={e => setPointsValue(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Max cart redemption limit (%)</label>
                    <Input type="number" value={redemptionLimit} onChange={e => setRedemptionLimit(Number(e.target.value))} />
                  </div>
                </div>
              </AdminPanel>
            )}

            {/* Invoice Templates */}
            {activeTab === "invoice" && (
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">PDF Invoice Layout templates</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {["Clean Minimalist", "Professional Invoice Structure", "Compact Thermal POS"].map(template => (
                    <div
                      key={template}
                      onClick={() => setSelectedInvoiceTemplate(template)}
                      className="border rounded-xl p-4 cursor-pointer hover:border-[#ff6600] transition flex flex-col justify-between"
                      style={{
                        borderColor: selectedInvoiceTemplate === template ? "#ff6600" : "#e2e8f0",
                        background: selectedInvoiceTemplate === template ? "#fff8f3" : "transparent"
                      }}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{template}</h4>
                        <p className="text-xs text-slate-500 mt-1">Contains complete item lists, HSN summaries, CGST/SGST tax breakout tables.</p>
                      </div>
                      <span className="text-xs font-bold text-[#ff6600] mt-4 block">
                        {selectedInvoiceTemplate === template ? "✓ Selected Layout" : "Select Layout"}
                      </span>
                    </div>
                  ))}
                </div>
              </AdminPanel>
            )}

            {/* Backups */}
            {activeTab === "backup" && (
              <AdminPanel className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Data Backup & Restore Vault</h3>
                  <p className="text-sm text-slate-500">Download complete archives of database records, media directories, or audit log tables.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-slate-100 bg-slate-50 rounded-xl p-4 flex flex-col justify-between min-h-[140px]">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Download Full Database</h4>
                      <p className="text-xs text-slate-500 mt-1">Export all Products, Orders, Customers, and settings as a consolidated `.sql` file.</p>
                    </div>
                    <Button onClick={() => handleBackup("Database")} className="h-9 mt-4 rounded-lg bg-[#ff6600] text-white self-start">Trigger DB Backup</Button>
                  </div>

                  <div className="border border-slate-100 bg-slate-50 rounded-xl p-4 flex flex-col justify-between min-h-[140px]">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Download Media Assets</h4>
                      <p className="text-xs text-slate-500 mt-1">Export a compressed `.zip` containing all catalog product photos, brand logos, banner slider images.</p>
                    </div>
                    <Button onClick={() => handleBackup("Media ZIP")} className="h-9 mt-4 rounded-lg bg-slate-800 text-white self-start">Trigger Media Backup</Button>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#fff8eb] border border-[#ffe0cc] rounded-xl text-xs text-amber-800 leading-5">
                  <ShieldAlert size={22} className="shrink-0 mt-0.5" />
                  <div>
                    <strong>Scheduled backups active:</strong> Daily database SQL schema dumping is scheduled to execute automatically at 02:00 AM. Archives are encrypted and transferred to secure Google Cloud storage.
                  </div>
                </div>
              </AdminPanel>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
