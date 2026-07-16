import React from 'react';
import AdminLayout from './AdminLayout';
import { Landmark, Wallet, CheckCircle, RefreshCcw } from 'lucide-react';

const AdminRefundOptions = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Refund Options</h1>
            <p>Configure refund processing gateways and store loyalty credits adjustments.</p>
          </div>
          <button
            className="admin-primary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw size={18} />
            Refresh Data
          </button>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Active Refund Destination Paths</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                <Landmark color="#ff6600" size={24} />
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>Original Payment Gateway Source</strong>
                  <span style={{ fontSize: '13px', color: '#667085' }}>Refund directly to Razorpay (Card, UPI, Netbanking). Processing time: 3-5 days.</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                <Wallet color="#ff6600" size={24} />
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>Dzire Loyalty Store Credits Wallet</strong>
                  <span style={{ fontSize: '13px', color: '#667085' }}>Instantly credit the refund value into user's loyalty account. Processing time: Immediate.</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CheckCircle color="#12b76a" size={32} style={{ marginBottom: '8px' }} />
            <strong style={{ fontSize: '15px' }}>Instant Wallet Refunds Enabled</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#667085', textAlign: 'center' }}>90% of return cases utilize loyalty wallet credits for quick resolution.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRefundOptions;
