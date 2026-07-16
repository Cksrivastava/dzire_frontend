import React from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, Package, AlertTriangle, ArrowRight } from 'lucide-react';

const lowStockItems = [
  { id: 'PROD-092', name: 'Verge 45L Trekking Backpack', sku: 'BG-VRG-45L-OR', stock: '2 units left', minQty: '5 units', loc: 'Bin A-14' },
  { id: 'PROD-112', name: 'CTR OD4 High-Ankle Hiking Shoes', sku: 'SH-CTR-HA-BLK', stock: '4 units left', minQty: '10 units', loc: 'Shelf C-3' },
  { id: 'PROD-085', name: 'Alumnium Camp Stove (Windproof)', sku: 'KIT-STV-WP-AL', stock: '3 units left', minQty: '8 units', loc: 'Bin E-2' },
];

const AdminLowStockAlerts = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle color="#ff6600" />
              Low Stock Alerts
            </h1>
            <p>List of catalog SKUs whose current available physical inventory is below the defined safety stock thresholds.</p>
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Replenishment Queue</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Product Name</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>SKU</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Warehouse Coordinate</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Alert safety qty</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Current Stock</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.name}</td>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace' }}>{item.sku}</td>
                    <td style={{ padding: '16px 20px' }}>{item.loc}</td>
                    <td style={{ padding: '16px 20px', color: '#667085' }}>{item.minQty}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#b45309' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#fffbeb', color: '#b45309' }}>
                        {item.stock}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button onClick={() => alert('Opening supplier procurement window...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#344054', fontWeight: '500' }}>
                        Procure <ArrowRight size={14} />
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

export default AdminLowStockAlerts;
