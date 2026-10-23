import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Gift, ArrowRightLeft, DollarSign, Download, Upload, Plus, AlertCircle, RefreshCw } from "lucide-react";
import { Button, Input } from "../AdminShims";
import { AdminPanel, AdminSectionHeading, AdminMetricCard, AdminStatusBadge } from "../components/AdminUi";
import ExportDropdown from "../components/ExportDropdown";

const initialWallets = [];

const mockLogs = [];

const AdminLoyalty = () => {
  const [spendRule, setSpendRule] = useState(1000);
  const [pointsRule, setPointsRule] = useState(50);
  const [maxRedemptionPercent, setMaxRedemptionPercent] = useState(10);

  const [wallets, setWallets] = useState(initialWallets);
  const [logs, setLogs] = useState(mockLogs);
  const [activeTab, setActiveTab] = useState("rules"); // "rules", "wallets", "transactions", "promotions"

  // Award credits form
  const [awardEmail, setAwardEmail] = useState("");
  const [awardAmount, setAwardAmount] = useState("");
  const [awardReason, setAwardReason] = useState("Loyalty Bonus");

  // Excel/CSV import mockup
  const [importFile, setImportFile] = useState(null);

  const handleUpdateRules = (e) => {
    e.preventDefault();
    alert("Loyalty rules updated successfully:\nSpend Rule: " + spendRule + " Rs = " + pointsRule + " Points\nMax Redemption: " + maxRedemptionPercent + "%");
  };

  const handleAwardPoints = (e) => {
    e.preventDefault();
    if (!awardEmail || !awardAmount) {
      alert("Please enter email and points amount.");
      return;
    }
    const match = wallets.find(w => w.email.toLowerCase() === awardEmail.toLowerCase());
    const amount = parseInt(awardAmount);

    if (match) {
      setWallets(wallets.map(w => w.id === match.id ? {
        ...w,
        earned: w.earned + amount,
        available: w.available + amount
      } : w));
    } else {
      setWallets([...wallets, {
        id: wallets.length + 1,
        name: awardEmail.split("@")[0],
        email: awardEmail,
        earned: amount,
        redeemed: 0,
        reversed: 0,
        available: amount
      }]);
    }

    setLogs([{
      id: Date.now(),
      name: match ? match.name : awardEmail.split("@")[0],
      type: "Earned",
      amount,
      reason: awardReason,
      date: new Date().toISOString().split("T")[0]
    }, ...logs]);

    alert("Awarded " + amount + " Credits to " + awardEmail);
    setAwardEmail("");
    setAwardAmount("");
  };

  const handleExport = () => {
    alert("Exporting Loyalty Wallets as CSV...\nDownloaded successfully!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <span className="admin-eyebrow">Commerce / Loyalty</span>
            <h1>Dzire Credits & Loyalty</h1>
            <p>Configure points rules, manage customer wallets, award bonus credits, and track points redemption logs.</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportDropdown
              fileName="Loyalty_Wallets_Report"
              title="Dzire Credits & Loyalty Wallets Register"
              headers={['Customer Name', 'Email', 'Total Earned', 'Total Redeemed', 'Reversed', 'Available Balance']}
              rows={wallets.map((w) => [
                w.name,
                w.email,
                `${w.earned} Pts`,
                `${w.redeemed} Pts`,
                `${w.reversed} Pts`,
                `${w.available} Pts`
              ])}
            />
          </div>
        </section>

        {/* Metric Overview cards */}
        <section className="grid gap-4 xl:grid-cols-4">
          <div className="rounded-[26px] border border-[#ffe0cc] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Total Credits Issued</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">2,850 Pts</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Gift size={22} />
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">Value: 2,850 Rs (1 Credit = 1 Rs)</p>
          </div>

          <div className="rounded-[26px] border border-[#ffe0cc] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Total Redeemed</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">650 Pts</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ArrowRightLeft size={22} />
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">Applied on purchases</p>
          </div>

          <div className="rounded-[26px] border border-[#ffe0cc] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Active Wallets</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{wallets.length}</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Gift size={22} />
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">With active credit balances</p>
          </div>

          <div className="rounded-[26px] border border-[#ffe0cc] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Avg wallet balance</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">525 Pts</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <DollarSign size={22} />
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">Points ready to use</p>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          {[
            { id: "rules", label: "Loyalty & Redemption Rules" },
            { id: "wallets", label: "Customer Wallets" },
            { id: "transactions", label: "Credit History Logs" },
            { id: "promotions", label: "Promotions & Multipliers" },
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

        {/* Tab 1: Rules */}
        {activeTab === "rules" && (
          <div className="grid gap-6 xl:grid-cols-2">
            <AdminPanel className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Configure Base Earning Rules</h2>
              <p className="text-sm text-slate-500 mb-6">Define points earning values for every online payment or offline POS created bill.</p>

              <form onSubmit={handleUpdateRules} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 mb-1">Earning Spend Requirement (Rs)</label>
                  <Input type="number" value={spendRule} onChange={e => setSpendRule(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 mb-1">Credits Awarded (Points)</label>
                  <Input type="number" value={pointsRule} onChange={e => setPointsRule(e.target.value)} />
                  <span className="text-xs text-slate-400 mt-1 block">Current rate: Spend Rs {spendRule} = Earn {pointsRule} Credits (1 point = 1 Rs)</span>
                </div>
                <div style={{ padding: '10px 0' }}>
                  <Button type="submit" className="h-11 rounded-xl bg-[#ff6600] text-white">Save Earning Rules</Button>
                </div>
              </form>
            </AdminPanel>

            <AdminPanel className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Redemption & Safety Thresholds</h2>
              <p className="text-sm text-slate-500 mb-6">Control how customers apply credits to their checkout carts on their next purchase.</p>

              <form onSubmit={handleUpdateRules} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 mb-1">Max Cart Value Redemption Limit (%)</label>
                  <Input type="number" value={maxRedemptionPercent} onChange={e => setMaxRedemptionPercent(e.target.value)} max="100" min="0" />
                </div>
                <div className="bg-[#fff8eb] border border-[#ffe0cc] rounded-xl p-4 flex gap-3 text-amber-800">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div className="text-xs leading-5">
                    <strong>Rule active:</strong> Customers can redeem their points up to a maximum of <strong>{maxRedemptionPercent}%</strong> of their cart total value. Shipping charges are strictly excluded from the points deduction calculation.
                  </div>
                </div>
                <div style={{ padding: '10px 0' }}>
                  <Button type="submit" className="h-11 rounded-xl bg-[#ff6600] text-white">Save Redemption Settings</Button>
                </div>
              </form>
            </AdminPanel>
          </div>
        )}

        {/* Tab 2: Wallets */}
        {activeTab === "wallets" && (
          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              {/* Wallets Table */}
              <AdminPanel className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Active Customer Wallets</h3>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">Rule: 1 Point = 1 Rs</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                        <th className="py-3 px-2">Customer</th>
                        <th className="py-3 px-2">Points Earned</th>
                        <th className="py-3 px-2">Redeemed</th>
                        <th className="py-3 px-2">Reversed</th>
                        <th className="py-3 px-2">Available Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallets.map(w => (
                        <tr key={w.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-2">
                            <p className="font-semibold text-slate-900">{w.name}</p>
                            <span className="text-xs text-slate-500">{w.email}</span>
                          </td>
                          <td className="py-4 px-2 font-medium text-slate-700">{w.earned} Pts</td>
                          <td className="py-4 px-2 text-slate-500">{w.redeemed} Pts</td>
                          <td className="py-4 px-2 text-rose-600">{w.reversed} Pts</td>
                          <td className="py-4 px-2"><strong className="text-[#ff6600]">{w.available} Pts</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AdminPanel>

              {/* Adjust Credits Side Panel */}
              <div className="space-y-4">
                <AdminPanel className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Award Bonus Points</h3>
                  <p className="text-sm text-slate-500 mb-4">Directly award loyalty points to a customer's email.</p>

                  <form onSubmit={handleAwardPoints} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Email</label>
                      <Input type="email" placeholder="customer@example.com" value={awardEmail} onChange={e => setAwardEmail(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Credits (Points)</label>
                      <Input type="number" placeholder="e.g. 100" value={awardAmount} onChange={e => setAwardAmount(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Earning Reason</label>
                      <Input type="text" placeholder="e.g. Campaign Promotion" value={awardReason} onChange={e => setAwardReason(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full h-11 bg-[#ff6600] text-white rounded-xl">
                      <Plus size={16} /> Award Credits
                    </Button>
                  </form>
                </AdminPanel>

                <AdminPanel className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Bulk Adjust Credits</h3>
                  <p className="text-sm text-slate-500 mb-4">Import bulk credit points adjustments or bonus awards via Excel/CSV.</p>

                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#ff6600] transition">
                    <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700 block">Click to upload .xlsx or .csv</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Format: Email, Points, Reason, Action (Award/Reverse)</span>
                  </div>
                </AdminPanel>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Transactions */}
        {activeTab === "transactions" && (
          <AdminPanel className="p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Credit Earning & Reversal Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Activity Type</th>
                    <th className="py-3 px-2">Points Amount</th>
                    <th className="py-3 px-2">Earning/Reversal Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-2 text-slate-500 font-medium">{log.date}</td>
                      <td className="py-4 px-2 font-semibold text-slate-900">{log.name}</td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${log.type === "Earned" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          log.type === "Redeemed" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                            "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-700">
                        {log.type === "Earned" ? "+" : "-"}{log.amount} Pts
                      </td>
                      <td className="py-4 px-2 text-slate-600 font-medium">{log.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminPanel>
        )}

        {/* Tab 4: Promotions */}
        {activeTab === "promotions" && (
          <div className="grid gap-6 xl:grid-cols-2">
            <AdminPanel className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Double Earning Campaigns</h3>
              <p className="text-sm text-slate-500 mb-4">Set point multipliers for dynamic marketing campaigns.</p>

              <div className="bg-gradient-to-r from-[#ffe8d6] to-[#fff5ee] border border-[#ffe0cc] rounded-2xl p-6 mb-6">
                <span className="bg-[#ff6600] text-white text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full">Active Campaign</span>
                <h4 className="text-xl font-bold text-[#ff6600] mt-3">Monsoon Double Credits</h4>
                <p className="text-xs text-amber-800 mt-2 font-medium">Awarding 2x Points multiplier (Spend Rs 1,000 = Earn 100 Credits) on all Foot-wear category products purchased.</p>
                <div className="mt-4 flex gap-2">
                  <button className="h-9 px-3 rounded-lg text-xs font-bold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 transition">Disable Promo</button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Create New Multiplier Rule</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Category/Product</label>
                    <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
                      <option>All Products</option>
                      <option>Foot-wear Category</option>
                      <option>Rucksack Bags</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Credit Multiplier</label>
                    <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
                      <option>1.5x Credits</option>
                      <option>2.0x (Double Credits)</option>
                      <option>3.0x (Triple Credits)</option>
                    </select>
                  </div>
                </div>
                <Button className="h-10 bg-[#ff6600] text-white rounded-lg">Create Campaign</Button>
              </div>
            </AdminPanel>

            <AdminPanel className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bonus Credits & Milestones</h3>
              <p className="text-sm text-slate-500 mb-4">Automatically award bonus points to repeat VIP customers.</p>

              <div className="space-y-4">
                <div className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">New Registration Welcome Bonus</h4>
                    <p className="text-xs text-slate-500 mt-1">Award 50 welcome credits upon email verification</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Active</span>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">VIP Order Count Milestone</h4>
                    <p className="text-xs text-slate-500 mt-1">Award 500 bonus credits on completing 5 orders</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Active</span>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Birthday Month Bonus</h4>
                    <p className="text-xs text-slate-500 mt-1">Award 100 credits during birthday month</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Inactive</span>
                  </div>
                </div>
              </div>
            </AdminPanel>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLoyalty;
