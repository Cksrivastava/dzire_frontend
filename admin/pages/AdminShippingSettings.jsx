import React from 'react';
import AdminLayout from './AdminLayout';
import { Truck, Settings, RefreshCcw } from 'lucide-react';

const AdminShippingSettings = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
      <section className="admin-hero" style={{ marginBottom: '24px' }}>
        <div>
          <h1>Shipping Settings</h1>
          <p>Manage delivery partners and shipping rates</p>
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

      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ width: '40px', height: '40px', background: '#eff8ff', color: '#175cd3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Shiprocket Integration</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#667085' }}>Connect your Shiprocket account for automated fulfillment</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>API Key</label>
            <input type="password" value="************************" readOnly style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: '#f9fafb' }} />
          </div>
          <button style={{ padding: '10px 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Update Credentials</button>
        </div>

        <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ width: '40px', height: '40px', background: '#f9fafb', color: '#667085', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Shipping Rates</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#667085' }}>Configure flat rates or dynamic calculations</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500' }}>Standard Delivery</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#667085' }}>Flat ₹50 on all orders</p>
              </div>
              <label className="toggle" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ff6600', borderRadius: '34px', transition: '.4s' }}></span>
              </label>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500' }}>Free Shipping Threshold</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#667085' }}>Orders above ₹999</p>
              </div>
              <label className="toggle" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ff6600', borderRadius: '34px', transition: '.4s' }}></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminShippingSettings;
