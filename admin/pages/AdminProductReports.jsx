import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, Package, TrendingUp, AlertTriangle, ArrowUpDown, Filter, ShoppingBag } from 'lucide-react';
import './AdminDashboard.css';
import './AdminReports.css';

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
      <div className="dashboard-wrapper reports-page-wrapper">
        {/* 4 Stat Cards */}
        <div className="reports-kpi-grid">
          <div className="reports-kpi-card">
            <div className="reports-kpi-card-header">
              <span className="reports-kpi-label">Total Product Sales</span>
              <div className="reports-kpi-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="reports-kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="reports-kpi-meta" style={{ color: '#10b981' }}>Across all catalog SKUs</div>
          </div>

          <div className="reports-kpi-card">
            <div className="reports-kpi-card-header">
              <span className="reports-kpi-label">Units Dispatched</span>
              <div className="reports-kpi-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="reports-kpi-value">{totalUnits.toLocaleString('en-IN')}</div>
            <div className="reports-kpi-meta" style={{ color: '#3b82f6' }}>Total volume sold</div>
          </div>

          <div className="reports-kpi-card">
            <div className="reports-kpi-card-header">
              <span className="reports-kpi-label">Active Catalog Items</span>
              <div className="reports-kpi-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                <Package size={20} />
              </div>
            </div>
            <div className="reports-kpi-value">{productsData.length} SKUs</div>
            <div className="reports-kpi-meta" style={{ color: '#8b5cf6' }}>Covering 5 categories</div>
          </div>

          <div className="reports-kpi-card">
            <div className="reports-kpi-card-header">
              <span className="reports-kpi-label">Inventory Attention</span>
              <div className="reports-kpi-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="reports-kpi-value">{lowStockCount} SKUs</div>
            <div className="reports-kpi-meta" style={{ color: '#f59e0b' }}>Low or out of stock</div>
          </div>
        </div>

        {/* Data Container */}
        <div className="reports-table-card">
          <div className="reports-filter-bar">
            <div className="reports-filter-left">
              <div className="reports-search-box">
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search by product name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="reports-select"
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
                className="reports-select"
              >
                <option value="All">All Stock Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="reports-select"
              >
                <option value="revenue">Sort by Revenue</option>
                <option value="units">Sort by Units Sold</option>
                <option value="stock">Sort by Available Stock</option>
              </select>
            </div>

            <div className="reports-filter-right">
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

          <div className="reports-table-scroll">
            <table className="reports-table">
              <thead>
                <tr style={{ background: '#ff6600', color: '#ffffff' }}>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Product Details</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Category</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Price</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Units Sold</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Total Revenue</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Gross Margin</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Return %</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Stock Status</th>
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
