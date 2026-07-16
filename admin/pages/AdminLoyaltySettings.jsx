import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, Gift } from 'lucide-react';
import { Button, Input } from '../AdminShims';
import { AdminPanel } from '../components/AdminUi';

const AdminLoyaltySettings = () => {
  const [conversionRate, setConversionRate] = useState(50); // points per 1000 spend
  const [pointsValue, setPointsValue] = useState(1); // 1 point = 1 Rs
  const [redemptionLimit, setRedemptionLimit] = useState(10); // 10% limit

  const handleSave = (e) => {
    e.preventDefault();
    alert("Loyalty Credit Rules updated successfully!");
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Dzire Credits Rules</h1>
            <p>Configure spend-to-points conversions, credit cash valuations, and maximum redemption limits per checkout</p>
          </div>
          <button onClick={handleSave} className="admin-primary-button" style={{ background: '#ff6600' }}>
            <Save size={18} /> Save Loyalty Rules
          </button>
        </section>

        <AdminPanel className="p-6 max-w-[640px] space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <Gift size={20} style={{ color: '#ff6600' }} />
            <strong>Loyalty Point Valuation Scheme</strong>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Credits per Rs 1,000 spend</label>
              <Input type="number" value={conversionRate} onChange={e => setConversionRate(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Points cash value (1 Pt = X Rs)</label>
              <Input type="number" value={pointsValue} onChange={e => setPointsValue(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Max cart redemption limit (%)</label>
              <Input type="number" value={redemptionLimit} onChange={e => setRedemptionLimit(Number(e.target.value))} />
            </div>
          </div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminLoyaltySettings;
