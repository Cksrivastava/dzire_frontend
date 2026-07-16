import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, Package, AlertOctagon, Plus } from 'lucide-react';

const outOfStockItems = [
  { id: 'PROD-010', name: 'Polarized Aviator Sunglasses (Black)', sku: 'ACC-AVT-POL-BK', backOrders: '12 orders backlogged', loc: 'Bin B-02', supplier: 'Ray-Vision Inc' },
  { id: 'PROD-033', name: 'Microfiber Quick-Dry Towel (Large)', sku: 'TOW-MF-LG-BL', backOrders: '—', loc: 'Shelf D-12', supplier: 'Textile-Pro Ltd' },
];

const AdminOutOfStockAlerts = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertOctagon color="#ef4444" />
              Out of Stock Alerts
            </h1>
            <p>List of catalog products with exactly zero stock remaining. Backorders and notify-me counters are highlighted.</p>
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

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Out of Stock Stockouts</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Product Name</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>SKU</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Warehouse Coordinate</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Supplier</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Backorder Backlog</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {outOfStockItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.name}</td>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace' }}>{item.sku}</td>
                    <td style={{ padding: '16px 20px' }}>{item.loc}</td>
                    <td style={{ padding: '16px 20px' }}>{item.supplier}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#fef2f2', color: '#b91c1c', fontWeight: '600' }}>
                        {item.backOrders}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button onClick={() => alert('Creating supplier PO for stock replenishment...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ff6600', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: 'white', fontWeight: '600' }}>
                        <Plus size={14} /> Reorder SKU
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOutOfStockAlerts;
