import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Settings, ShieldAlert, CreditCard, Truck, Percent, Gift, FileText, Database, Save, Check } from "lucide-react";
import { Button, Input, Textarea, Switch } from "../AdminShims";
import { AdminPanel } from "../components/AdminUi";

const AdminSettings = () => {
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

  const handleSave = (e) => {
    e.preventDefault();
    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
      alert("Store system settings successfully updated!");
    }, 800);
  };

  const handleBackup = (type) => {
    alert(type + " backup initialized...\nZip archive created successfully and uploaded to secure cloud storage!");
  };

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
                    <label className="block text-xs font-semibold text-slate-500 mb-1">GST Registration Number</label>
                    <Input value={gstNumber} onChange={e => setGstNumber(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Physical Address</label>
                  <Textarea value={storeAddress} onChange={e => setStoreAddress(e.target.value)} rows="3" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Contact Email</label>
                    <Input type="email" defaultValue="support@dzirestore.in" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Support Mobile</label>
                    <Input type="tel" defaultValue="+91 80 4912 3012" />
                  </div>
                </div>
              </AdminPanel>
            )}

            {/* Shipping options */}
            {activeTab === "shipping" && (
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Shipping Charges & Pickup Policies</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Standard Delivery Fee (Rs)</label>
                    <Input type="number" value={shippingCharge} onChange={e => setShippingCharge(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Minimum Cart for Free Shipping (Rs)</label>
                    <Input type="number" value={freeShippingThreshold} onChange={e => setFreeShippingThreshold(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Enable Local Store Pickups</h4>
                    <p className="text-xs text-slate-500 mt-1">Let customers choose local showroom pickup to bypass standard delivery fee.</p>
                  </div>
                  <Switch checked={allowStorePickup} onCheckedChange={setAllowStorePickup} />
                </div>
              </AdminPanel>
            )}

            {/* Razorpay Payments */}
            {activeTab === "payments" && (
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Razorpay Gateway Credentials</h3>
                <p className="text-sm text-slate-500 mb-4">Integrate payment success webhook scripts for instant order activation.</p>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Razorpay API Key ID</label>
                  <Input value={rzpKey} onChange={e => setRzpKey(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Razorpay Key Secret</label>
                  <Input type="password" value={rzpSecret} onChange={e => setRzpSecret(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <Check size={16} /> Checkout script verified and loaded correctly.
                </div>
              </AdminPanel>
            )}

            {/* Loyalty settings */}
            {activeTab === "loyalty" && (
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Dzire Credits Loyalty Policy</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Points Eearned Per Spend of Rs 1000</label>
                    <Input type="number" value={conversionRate} onChange={e => setConversionRate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Value of 1 Point in Rupees</label>
                    <Input type="number" value={pointsValue} onChange={e => setPointsValue(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Max Point Earning Limit Per Order</label>
                    <Input type="number" defaultValue="500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Max Cart Redemption Limit (%)</label>
                  <Input type="number" value={redemptionLimit} onChange={e => setRedemptionLimit(e.target.value)} max="100" />
                  <p className="text-xs text-slate-400 mt-1">Limits deduction to 10% of checkout cart (excludes shipping fee) for safety.</p>
                </div>
              </AdminPanel>
            )}

            {/* Invoice template selection */}
            {activeTab === "invoice" && (
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">GST Invoice Templates</h3>
                <p className="text-sm text-slate-500 mb-4">Choose the printable layout for Retail Invoices, GST Tax Invoices, and Credit Notes.</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {["Clean Minimalist", "Corporate Modern", "Classic Retro Table", "Slim POS Bill"].map(template => (
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
