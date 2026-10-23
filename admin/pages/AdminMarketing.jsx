import React, { useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { TicketPercent, Tag, Send, Plus, Calendar, Settings, ArrowRight } from "lucide-react";
import { Button, Input, Textarea } from "../AdminShims";
import { AdminPanel } from "../components/AdminUi";
import ExportDropdown from "../components/ExportDropdown";
import AdminCouponsView from "../components/AdminCouponsView";
import AdminOffersView from "../components/AdminOffersView";

const initialCoupons = [];

const initialCampaigns = [];

const AdminMarketing = () => {
  const [activeTab, setActiveTab] = useState("coupons"); // "coupons", "offers", "campaigns"
  const couponsRef = useRef(null);
  const offersRef = useRef(null);

  const [coupons, setCoupons] = useState(initialCoupons);
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  const handleCreateActionClick = () => {
    if (activeTab === "coupons") {
      couponsRef.current?.handleCreateCoupon();
    } else if (activeTab === "offers") {
      offersRef.current?.handleCreateOffer();
    } else {
      setActiveTab("coupons");
      setTimeout(() => {
        couponsRef.current?.handleCreateCoupon();
      }, 50);
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Coupons, Offers & Campaigns</h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ExportDropdown
                fileName="Marketing_Promotions_Report"
                title="Coupons, Offers & Marketing Campaigns"
                headers={['Code / Name', 'Type / Channel', 'Value / Reach', 'Rules / Target', 'Expiry / Date']}
                rows={[
                  ...coupons.map((c) => [c.code, c.type, c.value, c.rules, c.expiry]),
                  ...campaigns.map((camp) => [camp.name, camp.channel, camp.status, camp.target, camp.date])
                ]}
              />
              <button
                onClick={handleCreateActionClick}
                style={{
                  background: '#ff6600',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#e65c00'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#ff6600'}
              >
                <Plus size={17} strokeWidth={2.5} />
                <span>{activeTab === "offers" ? "Create Offer" : "Create Coupon"}</span>
              </button>
            </div>
          </div>

          <div style={{ padding: '24px', background: '#fafafa' }}>
            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-6">
              {[
                { id: "coupons", label: "Coupons & Discounts" },
                { id: "offers", label: "Product & Category Offers" },
                { id: "campaigns", label: "Marketing Campaigns" },
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

            {/* Tab 1: Coupons */}
            {activeTab === "coupons" && (
              <AdminCouponsView ref={couponsRef} hideHeaderActions={true} />
            )}

            {/* Tab 2: Offers */}
            {activeTab === "offers" && (
              <AdminOffersView ref={offersRef} hideHeaderActions={true} />
            )}

            {/* Tab 3: Campaigns */}
            {activeTab === "campaigns" && (
              <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <AdminPanel className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Send className="text-[#ff6600]" /> Marketing & Blast Campaigns
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-[#ff6600] text-white font-semibold">
                          <th className="py-3 px-2">Campaign Name</th>
                          <th className="py-3 px-2">Broadcast Channel</th>
                          <th className="py-3 px-2">Target Audience</th>
                          <th className="py-3 px-2">Fulfillment Status</th>
                          <th className="py-3 px-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map(cam => (
                          <tr key={cam.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-4 px-2 font-semibold text-slate-900">{cam.name}</td>
                            <td className="py-4 px-2 text-slate-700 font-medium">{cam.channel}</td>
                            <td className="py-4 px-2 text-slate-600 font-medium">{cam.target}</td>
                            <td className="py-4 px-2">
                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cam.status.includes("Sent") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}>{cam.status}</span>
                            </td>
                            <td className="py-4 px-2 text-slate-500 font-medium">{cam.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AdminPanel>

                <AdminPanel className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Launch Blast Campaign</h3>
                  <p className="text-sm text-slate-500 mb-4">Send marketing newsletters or notifications to segments.</p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Campaign Name</label>
                      <Input type="text" placeholder="e.g. End of Season Sale" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Target Channel</label>
                      <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
                        <option>WhatsApp API Broadcast</option>
                        <option>Email Broadcast (Mailgun)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Target Customer Segment</label>
                      <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
                        <option>All Customers</option>
                        <option>VIP Customers</option>
                        <option>Inactive Customers (Re-engagement)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Campaign Message Content</label>
                      <Textarea rows="3" placeholder="Write your message here... use {{customer_name}} as placeholder." />
                    </div>
                    <Button onClick={() => alert("Campaign broadcast queued successfully!")} className="w-full h-11 bg-[#ff6600] text-white rounded-xl">Launch Broadcast</Button>
                  </div>
                </AdminPanel>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMarketing;
