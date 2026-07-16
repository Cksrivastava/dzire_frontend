import React, { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useSearchParams } from "react-router-dom";
import { Gift, ArrowRightLeft, DollarSign, Download, Upload, Plus, AlertCircle, RefreshCw, Calendar, Users, BarChart3, Settings } from "lucide-react";
import { Button, Input } from "../AdminShims";
import { AdminPanel, AdminSectionHeading, AdminMetricCard, AdminStatusBadge } from "../components/AdminUi";

const initialWallets = [
  { id: 1, name: "Aarav Mehta", email: "aarav@example.com", earned: 550, redeemed: 150, reversed: 0, available: 400 },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", earned: 1200, redeemed: 450, reversed: 100, available: 650 },
  { id: 3, name: "Rahul Verma", email: "rahul@example.com", earned: 250, redeemed: 50, reversed: 0, available: 200 },
  { id: 4, name: "Neha Patel", email: "neha@example.com", earned: 900, redeemed: 0, reversed: 50, available: 850 },
];

const mockLogs = [
  { id: 101, name: "Aarav Mehta", email: "aarav@example.com", type: "Earned", amount: 250, reason: "Order #DZ-1001 Payment Success", date: "2026-06-14" },
  { id: 102, name: "Priya Sharma", email: "priya@example.com", type: "Redeemed", amount: 150, reason: "Order #DZ-9984 Applied Credits", date: "2026-06-13" },
  { id: 103, name: "Neha Patel", email: "neha@example.com", type: "Reversed", amount: 50, reason: "Return Order #DZ-9921 Refund Reversal", date: "2026-06-12" },
  { id: 104, name: "Priya Sharma", email: "priya@example.com", type: "Earned", amount: 500, reason: "Double Credits Promotion Campaign", date: "2026-06-10" },
];

const S = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panel: { background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  th: { padding: '12px 20px', fontWeight: '600', textAlign: 'left', background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' },
  td: { padding: '16px 20px', fontSize: '14px', borderTop: '1px solid #e5e7eb' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' },
  inp: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  saveBtn: { padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' },
  badge: (bg, col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: bg, color: col, display: 'inline-block' }),
};

const AdminLoyalty = () => {
  const [searchParams] = useSearchParams();
  const activeSub = searchParams.get("sub") || "Credits Overview";

  const [spendRule, setSpendRule] = useState(1000);
  const [pointsRule, setPointsRule] = useState(50);
  const [maxRedemptionPercent, setMaxRedemptionPercent] = useState(10);

  const [wallets, setWallets] = useState(initialWallets);
  const [logs, setLogs] = useState(mockLogs);

  // Award credits form
  const [awardEmail, setAwardEmail] = useState("");
  const [awardAmount, setAwardAmount] = useState("");
  const [awardReason, setAwardReason] = useState("Loyalty Bonus");

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
      email: awardEmail,
      type: "Earned",
      amount,
      reason: awardReason,
      date: new Date().toISOString().split("T")[0]
    }, ...logs]);

    alert("Awarded " + amount + " Credits to " + awardEmail);
    setAwardEmail("");
    setAwardAmount("");
  };

  const renderSubContent = () => {
    switch (activeSub) {
      case "Credits Overview":
      default:
        return (
          <div className="space-y-6">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              <div style={S.card}>
                <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#667085" }}>Total Wallets</p>
                <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>{wallets.length}</h2>
              </div>
              <div style={S.card}>
                <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#667085" }}>Total Earned Credits</p>
                <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#10b981" }}>2,900</h2>
              </div>
              <div style={S.card}>
                <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#667085" }}>Redeemed Credits</p>
                <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#6366f1" }}>650</h2>
              </div>
              <div style={S.card}>
                <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#667085" }}>Available Balance</p>
                <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#ff6600" }}>2,100</h2>
              </div>
            </div>

            <div style={S.panel}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>Customer Credit Wallets</strong>
                <button onClick={() => alert("Excel Exported")} style={{ padding: "8px 16px", background: "white", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>
                  Export CSV
                </button>
              </div>
              <table style={S.table}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th style={S.th}>Customer</th>
                    <th style={S.th}>Earned</th>
                    <th style={S.th}>Redeemed</th>
                    <th style={S.th}>Reversed</th>
                    <th style={S.th}>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map(w => (
                    <tr key={w.id}>
                      <td style={S.td}>
                        <strong>{w.name}</strong>
                        <p style={{ margin: 0, fontSize: "12px", color: "#667085" }}>{w.email}</p>
                      </td>
                      <td style={{ ...S.td, color: "#10b981", fontWeight: "600" }}>{w.earned} pts</td>
                      <td style={{ ...S.td, color: "#6366f1" }}>{w.redeemed} pts</td>
                      <td style={{ ...S.td, color: "#f04438" }}>{w.reversed} pts</td>
                      <td style={{ ...S.td, fontWeight: "700", color: "#ff6600" }}>{w.available} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Credit Ledger":
      case "Earned Credits":
      case "Redeemed Credits":
      case "Reversed Credits": {
        const typeFilter = activeSub === "Earned Credits" ? "Earned"
          : activeSub === "Redeemed Credits" ? "Redeemed"
          : activeSub === "Reversed Credits" ? "Reversed"
          : null;

        const filteredLogs = typeFilter ? logs.filter(l => l.type === typeFilter) : logs;

        return (
          <div style={S.panel}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
              <strong>{activeSub} Transaction Logs</strong>
            </div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Date</th>
                  <th style={S.th}>Customer</th>
                  <th style={S.th}>Type</th>
                  <th style={S.th}>Amount</th>
                  <th style={S.th}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(l => {
                  const isEarned = l.type === "Earned";
                  const isRedeemed = l.type === "Redeemed";
                  const badgeBg = isEarned ? "#e3fcef" : isRedeemed ? "#eff8ff" : "#fef3f2";
                  const badgeCol = isEarned ? "#12b76a" : isRedeemed ? "#175cd3" : "#f04438";

                  return (
                    <tr key={l.id}>
                      <td style={{ ...S.td, color: "#667085" }}>{l.date}</td>
                      <td style={S.td}>
                        <strong>{l.name}</strong>
                        <p style={{ margin: 0, fontSize: "12px", color: "#667085" }}>{l.email}</p>
                      </td>
                      <td style={S.td}>
                        <span style={S.badge(badgeBg, badgeCol)}>{l.type}</span>
                      </td>
                      <td style={{ ...S.td, fontWeight: "700", color: isEarned ? "#10b981" : "#f04438" }}>
                        {isEarned ? "+" : "-"}{l.amount} Pts
                      </td>
                      <td style={{ ...S.td, color: "#374151" }}>{l.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }

      case "Manual Credit Adjustment":
        return (
          <div style={{ ...S.formCard, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "600" }}>Award / Deduct Loyalty Credits</h3>
            <form onSubmit={handleAwardPoints}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={S.label}>Customer Email</label>
                  <input type="email" value={awardEmail} onChange={e => setAwardEmail(e.target.value)} placeholder="customer@example.com" style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Points Amount</label>
                  <input type="number" value={awardAmount} onChange={e => setAwardAmount(e.target.value)} placeholder="e.g. 100 or -50 for deduction" style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Adjustment Reason</label>
                  <input type="text" value={awardReason} onChange={e => setAwardReason(e.target.value)} placeholder="e.g. Birthday Bonus / Return Correction" style={S.inp} required />
                </div>
                <button type="submit" style={S.saveBtn}>Apply Adjustment</button>
              </div>
            </form>
          </div>
        );

      case "Credit Rules":
        return (
          <div style={{ ...S.formCard, maxWidth: "560px" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "600" }}>Configure Loyalty Calculations</h3>
            <form onSubmit={handleUpdateRules}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={S.label}>Spend Milestone (Rs)</label>
                  <input type="number" value={spendRule} onChange={e => setSpendRule(Number(e.target.value))} style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Credits Earned Per Milestone</label>
                  <input type="number" value={pointsRule} onChange={e => setPointsRule(Number(e.target.value))} style={S.inp} required />
                </div>
                <div>
                  <label style={S.label}>Maximum Cart Redemption (%)</label>
                  <input type="number" value={maxRedemptionPercent} onChange={e => setMaxRedemptionPercent(Number(e.target.value))} style={S.inp} required />
                </div>
                <button type="submit" style={S.saveBtn}>Save Calculations</button>
              </div>
            </form>
          </div>
        );

      case "Credit Promotions":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={S.card}>
              <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "600" }}>Multiplier Promotions</h3>
              <div style={{ background: "#fff7f1", border: "1px solid #ffe0cc", p: "16px", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                <span style={S.badge("#ff6600", "white")}>Active Campaign</span>
                <h4 style={{ margin: "10px 0 4px", fontSize: "16px" }}>Monsoon Double Credits</h4>
                <p style={{ margin: 0, fontSize: "12px", color: "#667085" }}>2.0x credits rewards multiplier on Footwear category purchase.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={S.label}>Target Category</label>
                  <select style={S.inp}><option>Footwear</option><option>Bags</option><option>All Products</option></select>
                </div>
                <div>
                  <label style={S.label}>Multiplier Factor</label>
                  <select style={S.inp}><option>2.0x (Double)</option><option>3.0x (Triple)</option><option>1.5x</option></select>
                </div>
                <button onClick={() => alert("Promo added")} style={S.saveBtn}>Create Promotion</button>
              </div>
            </div>
            <div style={S.card}>
              <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "600" }}>Milestone Bonus Rules</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { name: "New User Welcome Bonus", desc: "Award 50 points on sign up", active: true },
                  { name: "VIP Order Milestone", desc: "Award 500 points on completing 5 orders", active: true },
                  { name: "Birthday Month Special", desc: "Award 100 points during birthday month", active: false }
                ].map((rule, idx) => (
                  <div key={idx} style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: "13px" }}>{rule.name}</strong>
                      <p style={{ margin: 0, fontSize: "12px", color: "#667085" }}>{rule.desc}</p>
                    </div>
                    <span style={S.badge(rule.active ? "#e3fcef" : "#f3f4f6", rule.active ? "#12b76a" : "#667085")}>{rule.active ? "Active" : "Disabled"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Credit Reports":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {[
                { label: "Points Liability", val: "₹1,05,000", sub: "Based on available credits balance" },
                { label: "Redemption Conversion Rate", val: "18.4%", sub: "Percentage of checkout transactions applying points" },
                { label: "Average Value Applied", val: "₹210", sub: "Per checkout transaction" },
              ].map((k, i) => (
                <div key={i} style={S.card}>
                  <span style={{ fontSize: "13px", color: "#667085" }}>{k.label}</span>
                  <h2 style={{ margin: "6px 0 4px", fontSize: "24px", fontWeight: "700" }}>{k.val}</h2>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{k.sub}</span>
                </div>
              ))}
            </div>
            <div style={S.panel}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
                <strong>Loyalty Valuation Report List</strong>
                <button onClick={() => alert("Generating full loyalty report...")} style={{ padding: "8px 16px", background: "#ff6600", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
                  Generate Custom PDF
                </button>
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Q2 Loyalty Redemption Summary.csv", "FY26 Available Liability Valuation.xlsx", "Weekly Point Earn Report.csv"].map((r, i) => (
                  <div key={i} style={{ padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "14px" }}>{r}</span>
                    <button style={{ color: "#ff6600", background: "none", border: "none", fontWeight: "600", cursor: "pointer" }}>Download</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Credit Expiry Management":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={S.card}>
              <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "600" }}>Loyalty Points Validity Terms</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={S.label}>Points Validity Period</label>
                  <select style={S.inp}><option>12 Months from Earning Date</option><option>6 Months</option><option>No Expiry (Lifetime)</option></select>
                </div>
                <div>
                  <label style={S.label}>Alert Customers Before Expiry</label>
                  <select style={S.inp}><option>30 Days Before Expiry</option><option>15 Days Before Expiry</option><option>Do Not Alert</option></select>
                </div>
                <button onClick={() => alert("Expiry rules updated")} style={S.saveBtn}>Save validity rules</button>
              </div>
            </div>

            <div style={S.panel}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
                <strong>Points Expiring Soon (Next 30 Days)</strong>
              </div>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Customer</th>
                    <th style={S.th}>Points Expiring</th>
                    <th style={S.th}>Expiry Date</th>
                    <th style={S.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Aarav Mehta", points: 120, date: "15 Jul 2026" },
                    { name: "Rahul Verma", points: 80, date: "24 Jul 2026" }
                  ].map((p, idx) => (
                    <tr key={idx}>
                      <td style={S.td}><strong>{p.name}</strong></td>
                      <td style={{ ...S.td, color: "#f04438", fontWeight: "600" }}>{p.points} Pts</td>
                      <td style={{ ...S.td, color: "#667085" }}>{p.date}</td>
                      <td style={S.td}>
                        <button onClick={() => alert("Notification reminder sent")} style={{ padding: "6px 12px", border: "1px solid #ffe0cc", color: "#ff6600", borderRadius: "6px", background: "none", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Notify Customer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="admin-hero" style={{ marginBottom: "24px" }}>
          <div>
            <h1>{activeSub}</h1>
            <p>Track and manage Dzire credits customer wallets and calculation rules</p>
          </div>
        </section>

        {renderSubContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminLoyalty;
