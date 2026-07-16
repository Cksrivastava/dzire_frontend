import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useSearchParams } from "react-router-dom";
import { Bell, AlertTriangle, Mail, Send, Radio, History, CheckCircle2, ShieldAlert, Smartphone, MessageSquare, Settings, Eye } from "lucide-react";
import { Button, Input, Textarea, Switch } from "../AdminShims";
import { AdminPanel } from "../components/AdminUi";

const initialAlerts = [
  { id: 1, type: "Low Stock Alert", title: "Verge 45L Backpack - Only 2 units left", time: "10 mins ago", severity: "high" },
  { id: 2, type: "Failed Payment", title: "Razorpay Checkout attempt failed for customer Rahul Verma (Rs 4500)", time: "1 hour ago", severity: "medium" },
  { id: 3, type: "Pending Return", title: "Return request DZ-1002-R1 awaiting inspection approval", time: "3 hours ago", severity: "medium" },
  { id: 4, type: "Expiring Coupon", title: "Discount coupon MONSOON500 is expiring in 48 hours", time: "1 day ago", severity: "low" },
  { id: 5, type: "Expiring Credits", title: "Loyalty points for customer Aarav Mehta will expire on 2026-06-30", time: "2 days ago", severity: "low" }
];

const initialActivity = [
  { id: 101, user: "Admin User", action: "Updated price of CTR OD4 High-Ankle Shoes from 1399 Rs to 1499 Rs", time: "2026-06-15 11:20:14" },
  { id: 102, user: "Inventory Mgr", action: "Adjusted Verge 45L Backpack stock count (+5 units)", time: "2026-06-15 10:45:00" },
  { id: 103, user: "Aarav Mehta", action: "Placed online order #DZ-1001 via Razorpay (Paid 4,500 Rs)", time: "2026-06-15 10:12:30" },
  { id: 104, user: "System Scheduler", action: "Auto-awarded welcome bonus points to Priya Sharma", time: "2026-06-15 09:00:00" },
  { id: 105, user: "Store POS Cashier", action: "Initiated return refund for POS Bill #POS-8890", time: "2026-06-14 17:10:02" },
  { id: 106, user: "Vendor Tripole", action: "Received Purchase Order PO-2026-012 with 50 bags", time: "2026-06-14 11:45:50" }
];

const mockLogs = [
  { id: 201, recipient: "amit.sharma@example.com", type: "Email", status: "Delivered", date: "09 Jul 12:45 PM", template: "Order Invoice Confirmed" },
  { id: 202, recipient: "+91 98765 43210", type: "SMS/WhatsApp", status: "Delivered", date: "09 Jul 12:45 PM", template: "Order Shipment Dispatch" },
  { id: 203, recipient: "priya.patel@example.com", type: "Email", status: "Failed", date: "09 Jul 11:30 AM", template: "Cart Abandonment Reminder" },
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

const AdminNotifications = () => {
  const [searchParams] = useSearchParams();
  const activeSub = searchParams.get("sub") || "System Alerts";

  const [alerts, setAlerts] = useState(initialAlerts);
  const [activities, setActivities] = useState(initialActivity);

  // Configuration toggles
  const [sendOrderEmail, setSendOrderEmail] = useState(true);
  const [sendOrderWhatsapp, setSendOrderWhatsapp] = useState(true);
  const [sendRestockAlert, setSendRestockAlert] = useState(true);

  // Templates
  const [emailSubject, setEmailSubject] = useState("Your Dzire Store Order #{{order_number}} is confirmed!");
  const [emailBody, setEmailBody] = useState("Hello {{customer_name}},\n\nThank you for shopping at Dzire! Your order of Rs {{total_price}} has been successfully paid and packed.\n\nTracking link: {{tracking_url}}");

  const renderSubContent = () => {
    switch (activeSub) {
      case "System Alerts":
      default:
        return (
          <div className="space-y-4">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="text-lg font-bold text-slate-900">Active System Warnings</h3>
              <button onClick={() => setAlerts([])} style={{ background: "none", border: "none", color: "#ff6600", fontWeight: "600", cursor: "pointer" }}>Clear All Alerts</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {alerts.map(a => {
                const isHigh = a.severity === "high";
                const isMed = a.severity === "medium";
                const borderCol = isHigh ? "#fecaca" : isMed ? "#fed7aa" : "#e5e7eb";
                const bgCol = isHigh ? "#fef2f2" : isMed ? "#fff7ed" : "white";

                return (
                  <div key={a.id} style={{ ...S.card, borderColor: borderCol, background: bgCol, display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: "20px" }}>{isHigh ? "🚨" : isMed ? "⚠️" : "ℹ️"}</span>
                    <div>
                      <strong style={{ display: "block", fontSize: "14px" }}>{a.type}</strong>
                      <p style={{ margin: "4px 0", fontSize: "13px", color: "#374151" }}>{a.title}</p>
                      <span style={{ fontSize: "11px", color: "#9ca3af" }}>{a.time}</span>
                    </div>
                  </div>
                );
              })}
              {alerts.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af" }}>No active alerts</p>}
            </div>
          </div>
        );

      case "Email Notifications":
        return (
          <div style={{ ...S.card, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>SMTP E-mail server Configuration</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={S.label}>Sender Email Name</label>
                <input type="text" defaultValue="Dzire Store Notifications" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>SMTP Host Server</label>
                <input type="text" defaultValue="smtp.sendgrid.net" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>SMTP Port</label>
                <input type="number" defaultValue={587} style={S.inp} />
              </div>
              <button onClick={() => alert("SMTP Saved")} style={S.saveBtn}>Save Email Settings</button>
            </div>
          </div>
        );

      case "SMS Notifications":
      case "Push Notifications": {
        const isSMS = activeSub.includes("SMS");
        return (
          <div style={{ ...S.card, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>{activeSub} Gateway</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={S.label}>{isSMS ? 'Twilio Auth SID' : 'OneSignal App ID'}</label>
                <input type="text" defaultValue="AC8902834091a1z5" style={S.inp} />
              </div>
              <div>
                <label style={S.label}>API Auth Token</label>
                <input type="password" defaultValue="••••••••••••••••" style={S.inp} />
              </div>
              <button onClick={() => alert("Gateway configuration updated successfully!")} style={S.saveBtn}>Save configuration</button>
            </div>
          </div>
        );
      }

      case "Customer Alerts":
        return (
          <div style={S.panel}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}><strong>Restock Notifications Requested</strong></div>
            <table style={S.table}>
              <thead>
                <tr>{['Product', 'SKU', 'Customer Email', 'Requested Date', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[
                  { prod: 'Premium Backpack (Orange)', sku: 'BAG-PREM-ORG', email: 'amit.sharma@example.com', date: '08 Jul 2026', status: 'Pending Restock' },
                  { prod: 'Trekking Shoes', sku: 'SHOE-TRK-001', email: 'priya@example.com', date: '02 Jul 2026', status: 'Sent Reminder' }
                ].map((c, i) => (
                  <tr key={i}>
                    <td style={S.td}><strong>{c.prod}</strong></td>
                    <td style={{ ...S.td, fontFamily: 'monospace' }}>{c.sku}</td>
                    <td style={S.td}>{c.email}</td>
                    <td style={S.td}>{c.date}</td>
                    <td style={S.td}>
                      <span style={S.badge(c.status.includes('Pending') ? '#fef0c7' : '#e3fcef', c.status.includes('Pending') ? '#b54708' : '#12b76a')}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "Notification Templates":
        return (
          <div style={{ ...S.card, maxWidth: "600px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>Automated Order Invoice Email template</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={S.label}>Email Subject Header</label>
                <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} style={S.inp} />
              </div>
              <div>
                <label style={S.label}>Body Template Markup</label>
                <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} style={{ ...S.inp, minHeight: '150px', resize: 'vertical' }} />
              </div>
              <button onClick={handleSaveTemplates} style={S.saveBtn}>Save Notification Template</button>
            </div>
          </div>
        );

      case "Notification Logs":
        return (
          <div style={S.panel}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}><strong>Communication Outbox logs</strong></div>
            <table style={S.table}>
              <thead>
                <tr>{['Recipient', 'Type', 'Template Name', 'Sent Time', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {mockLogs.map(l => (
                  <tr key={l.id}>
                    <td style={S.td}><strong>{l.recipient}</strong></td>
                    <td style={S.td}>{l.type}</td>
                    <td style={S.td}>{l.template}</td>
                    <td style={{ ...S.td, color: '#667085' }}>{l.date}</td>
                    <td style={S.td}>
                      <span style={S.badge(l.status === 'Delivered' ? '#e3fcef' : '#fef3f2', l.status === 'Delivered' ? '#12b76a' : '#f04438')}>{l.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "Notification Settings":
        return (
          <div style={{ ...S.card, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "600" }}>System Alerts preferences</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Send email receipt on checkout completed", val: sendOrderEmail, set: setSendOrderEmail },
                { label: "Send whatsapp shipment notification", val: sendOrderWhatsapp, set: setSendOrderWhatsapp },
                { label: "Notify manager when items fall below alert qty", val: sendRestockAlert, set: setSendRestockAlert }
              ].map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>{opt.label}</span>
                  <input type="checkbox" checked={opt.val} onChange={e => opt.set(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>
              ))}
              <button onClick={() => alert('Settings updated')} style={S.saveBtn}>Save Settings</button>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: "24px" }}>
          <div>
            <h1>{activeSub}</h1>
            <p>Write custom automated templates, toggle channels configurations, and check outgoing system warnings</p>
          </div>
        </section>

        {renderSubContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
