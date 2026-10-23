import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Bell, AlertTriangle, Mail, Send, Radio, History, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button, Input, Textarea, Switch } from "../AdminShims";
import { AdminPanel } from "../components/AdminUi";

const initialAlerts = [];

const initialActivity = [];

const AdminNotifications = () => {
  const [activeTab, setActiveTab] = useState("alerts"); // "alerts", "templates", "activity"
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activities, setActivities] = useState(initialActivity);

  // Notifications toggles
  const [sendOrderEmail, setSendOrderEmail] = useState(true);
  const [sendOrderWhatsapp, setSendOrderWhatsapp] = useState(true);
  const [sendRestockAlert, setSendRestockAlert] = useState(true);

  // Template editor
  const [emailSubject, setEmailSubject] = useState("Your Dzire Store Order #{{order_number}} is confirmed!");
  const [emailBody, setEmailBody] = useState("Hello {{customer_name}},\n\nThank you for shopping at Dzire! Your order of Rs {{total_price}} has been successfully paid and packed.\n\nTracking link: {{tracking_url}}");

  const handleSaveTemplates = () => {
    alert("Customer notification templates successfully updated!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <span className="admin-eyebrow">System / Alerts</span>
            <h1>Notifications & Activity Feed</h1>
            <p>Track critical inventory warnings, monitor failed payments, write automated email/WhatsApp message templates, and view the global activity stream.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => alert("Activity feed synced with server alerts.")} className="admin-primary-button" style={{ background: '#ff6600' }}>
              <Radio size={18} /> Sync Alert Hub
            </button>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          {[
            { id: "alerts", label: "Critical Alerts & Warnings" },
            { id: "templates", label: "Customer Message Templates" },
            { id: "activity", label: "Global Activity Feed" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                paddingBottom: '12px',
                fontSize: '15px',
                fontWeight: '600',
                color: activeTab === tab.id ? '#ff6600' : '#000000',
                borderBottom: activeTab === tab.id ? '2.5px solid #ff6600' : 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Alerts */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-bold text-slate-900">System Warning Alerts</h3>
              <button onClick={() => setAlerts([])} className="text-xs font-bold text-[#ff6600] border-none bg-none cursor-pointer">Clear All Alerts</button>
            </div>

            <div className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className="rounded-2xl border p-4 flex gap-4 bg-white shadow-sm items-start"
                  style={{
                    borderColor: alert.severity === "high" ? "#ffd8d8" : alert.severity === "medium" ? "#ffe0cc" : "#e2e8f5"
                  }}
                >
                  <span className={`inline-flex h-9 w-9 rounded-xl items-center justify-center shrink-0 ${alert.severity === "high" ? "bg-rose-50 text-rose-600" :
                    alert.severity === "medium" ? "bg-amber-50 text-amber-600" :
                      "bg-blue-50 text-blue-600"
                    }`}>
                    <AlertTriangle size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{alert.type}</span>
                      <span className="text-xs text-slate-400 font-medium">{alert.time}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{alert.title}</h4>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
                  <h4 className="text-base font-bold text-slate-900">All Systems Normal</h4>
                  <p className="text-xs text-slate-500 mt-1">No pending warnings or stock alerts to address.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Templates */}
        {activeTab === "templates" && (
          <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
            <AdminPanel className="p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trigger Events</h4>
              <div className="space-y-2">
                {[
                  { label: "Order Confirmed", active: true },
                  { label: "Order Shipped", active: false },
                  { label: "Order Delivered", active: false },
                  { label: "Return Request Received", active: false },
                  { label: "Return Refund Approved", active: false },
                  { label: "Back in Stock Alert", active: false }
                ].map(item => (
                  <button
                    key={item.label}
                    className="w-full text-left p-3 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
                    style={{ color: item.active ? "#ff6600" : "#555555", background: item.active ? "#fff7f1" : "transparent" }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </AdminPanel>

            <div className="space-y-6">
              {/* Message Channels */}
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Communication Channels</h3>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Send Email Notification</h4>
                    <p className="text-xs text-slate-500 mt-1">Auto-send confirmation emails via Mailgun when payments succeed.</p>
                  </div>
                  <Switch checked={sendOrderEmail} onCheckedChange={setSendOrderEmail} />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Send WhatsApp Notification</h4>
                    <p className="text-xs text-slate-500 mt-1">Auto-send updates to customer's mobile via WhatsApp API.</p>
                  </div>
                  <Switch checked={sendOrderWhatsapp} onCheckedChange={setSendOrderWhatsapp} />
                </div>
              </AdminPanel>

              {/* Template Text Editor */}
              <AdminPanel className="p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Email Confirmation Template</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Line</label>
                  <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Body HTML / Plain Text</label>
                  <Textarea rows="6" value={emailBody} onChange={e => setEmailBody(e.target.value)} className="font-mono text-xs leading-5" />
                </div>
                <Button onClick={handleSaveTemplates} className="h-11 bg-[#ff6600] text-white rounded-xl">Save Templates</Button>
              </AdminPanel>
            </div>
          </div>
        )}

        {/* Tab 3: Global Activity Feed */}
        {activeTab === "activity" && (
          <AdminPanel className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <History className="h-5 w-5 text-[#ff6600]" /> Chronological Activity Feed
              </h3>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">Real-time Stream</span>
            </div>

            <div className="relative border-l border-slate-100 ml-4 pl-6 space-y-6">
              {activities.map(act => (
                <div key={act.id} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[30px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#ff6600] shadow-sm" />

                  <div>
                    <span className="text-xs font-mono text-slate-400 block mb-1">{act.time}</span>
                    <p className="text-sm font-semibold text-slate-900">
                      {act.user}: <span className="font-normal text-slate-600">{act.action}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AdminPanel>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
