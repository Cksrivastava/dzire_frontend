import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Package, TrendingUp, AlertTriangle, ArrowUpDown, Filter, ShoppingBag } from 'lucide-react';
import './AdminDashboard.css';

const AdminProductReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('revenue');

  const productsData = [
    {
      id: 1,
      name: 'Tripole Walker 55L Backpack',
      sku: 'TRP-BLK-55L',
      category: 'Backpacks',
      stock: 42,
      unitsSold: 318,
      price: 4200,
      revenue: 1335600,
      margin: '38%',
      returnRate: '1.2%',
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'Sierra Waterproof Hiking Boots',
      sku: 'SB-8-10',
      category: 'Footwear',
      stock: 15,
      unitsSold: 245,
      price: 3899,
      revenue: 955255,
      margin: '42%',
      returnRate: '2.8%',
      status: 'Low Stock'
    },
    {
      id: 3,
      name: 'Carbon Fiber Trekking Pole (Pair)',
      sku: 'ATP-CF-01',
      category: 'Accessories',
      stock: 0,
      unitsSold: 412,
      price: 1850,
      revenue: 762200,
      margin: '45%',
      returnRate: '0.8%',
      status: 'Out of Stock'
    },
    {
      id: 4,
      name: 'All-Weather Thermal Camp Jacket',
      sku: 'AW-JCKT-M',
      category: 'Apparel',
      stock: 58,
      unitsSold: 189,
      price: 3499,
      revenue: 661311,
      margin: '36%',
      returnRate: '3.1%',
      status: 'In Stock'
    },
    {
      id: 5,
      name: 'CampMaster 4-Person Dome Tent',
      sku: 'CM-TENT-4P',
      category: 'Equipment',
      stock: 22,
      unitsSold: 98,
      price: 6499,
      revenue: 636902,
      margin: '34%',
      returnRate: '1.5%',
      status: 'In Stock'
    },
    {
      id: 6,
      name: 'PolarShield 0°C Sleeping Bag',
      sku: 'PS-SB-0C',
      category: 'Equipment',
      stock: 8,
      unitsSold: 142,
      price: 2899,
      revenue: 411658,
      margin: '40%',
      returnRate: '1.9%',
      status: 'Low Stock'
    },
    {
      id: 7,
      name: 'UltraGrip Trail Running Shoes',
      sku: 'UG-TRS-09',
      category: 'Footwear',
      stock: 64,
      unitsSold: 165,
      price: 2499,
      revenue: 412335,
      margin: '35%',
      returnRate: '4.2%',
      status: 'In Stock'
    }
  ];

  const filteredProducts = productsData
    .filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'revenue') return b.revenue - a.revenue;
      if (sortBy === 'units') return b.unitsSold - a.unitsSold;
      if (sortBy === 'stock') return b.stock - a.stock;
      return 0;
    });

  const totalRevenue = productsData.reduce((acc, p) => acc + p.revenue, 0);
  const totalUnits = productsData.reduce((acc, p) => acc + p.unitsSold, 0);
  const lowStockCount = productsData.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock').length;

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Product Sales</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: '500' }}>Across all catalog SKUs</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Units Dispatched</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{totalUnits.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px', fontWeight: '500' }}>Total volume sold</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Active Catalog Items</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{productsData.length} SKUs</div>
            <div style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '4px', fontWeight: '500' }}>Covering 5 categories</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Inventory Attention</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{lowStockCount} SKUs</div>
            <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px', fontWeight: '500' }}>Low or out of stock</div>
          </div>
        </div>

        {/* Data Container */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #eef2f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '280px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search by product name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
              >
                <option value="All">All Categories</option>
                <option value="Backpacks">Backpacks</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Apparel">Apparel</option>
                <option value="Equipment">Equipment</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
              >
                <option value="All">All Stock Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
              >
                <option value="revenue">Sort by Revenue</option>
                <option value="units">Sort by Units Sold</option>
                <option value="stock">Sort by Available Stock</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ExportDropdown
                fileName="Product_Performance_Report"
                title="Product Sales Velocity & Catalog Performance Report"
                headers={['Product Name', 'SKU', 'Category', 'Unit Price', 'Units Sold', 'Total Revenue', 'Margin', 'Return Rate', 'Stock Status']}
                rows={filteredProducts.map((p) => [
                  p.name,
                  p.sku,
                  p.category,
                  `₹${p.price.toLocaleString('en-IN')}`,
                  p.unitsSold,
                  `₹${p.revenue.toLocaleString('en-IN')}`,
                  p.margin,
                  p.returnRate,
                  p.status
                ])}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6', color: '#64748b' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Product Details</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Category</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Price</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Units Sold</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Total Revenue</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Gross Margin</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Return %</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Stock Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>SKU: {p.sku}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>{p.category}</td>
                    <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: '500' }}>₹{p.price.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: '600' }}>{p.unitsSold} pcs</td>
                    <td style={{ padding: '14px 16px', color: '#ff6600', fontWeight: '700' }}>₹{p.revenue.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: '600' }}>{p.margin}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{p.returnRate}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background:
                            p.status === 'In Stock'
                              ? '#dcfce7'
                              : p.status === 'Low Stock'
                              ? '#fef3c7'
                              : '#fee2e2',
                          color:
                            p.status === 'In Stock'
                              ? '#15803d'
                              : p.status === 'Low Stock'
                              ? '#b45309'
                              : '#b91c1c'
                        }}
                      >
                        {p.status} ({p.stock})
                      </span>
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

export default AdminProductReports;
