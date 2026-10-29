import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Plus, Search, UserCircle, Download, Building2 } from 'lucide-react';
import './AdminDashboard.css';
import './AdminVendors.css';

const AdminVendorsDataSheet = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const INITIAL_VENDORS = [];

  const STORAGE_KEY = 'dzire_admin_vendors';

  const [vendorsData, setVendorsData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return INITIAL_VENDORS;
  });

  // Fetch live vendors from backend API on mount
  useEffect(() => {
    let mounted = true;
    fetch('https://dzire-backend.onrender.com/api/admin/vendors')
      .then(res => res.json())
      .then(data => {
        if (mounted && data.success && Array.isArray(data.vendors)) {
          setVendorsData(data.vendors);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.vendors));
          } catch (e) {}
        }
      })
      .catch(() => {});

    const handleSync = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setVendorsData(e.detail);
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setVendorsData(JSON.parse(raw));
        } catch (err) {}
      }
    };

    window.addEventListener('dzire_vendors_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      mounted = false;
      window.removeEventListener('dzire_vendors_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const filteredVendors = vendorsData.filter(v => {
    const nameMatch = (v.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = (v.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const mobileMatch = (v.mobile || '').includes(searchTerm);
    const gstinMatch = (v.gstin || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || categoryMatch || mobileMatch || gstinMatch;

    const matchesCategory = categoryFilter === 'All' || v.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Dynamic calculations for Metric Summary Bar
  const totalPartiesCount = vendorsData.length;
  const totalToCollect = vendorsData.reduce((acc, curr) => {
    if (curr.balanceType === 'collect') {
      const val = Number(String(curr.openingBalance || curr.balance || 0).replace(/[^0-9.]/g, '')) || 0;
      return acc + val;
    }
    return acc;
  }, 0);

  const totalToPay = vendorsData.reduce((acc, curr) => {
    if (curr.balanceType === 'pay') {
      const val = Number(String(curr.openingBalance || curr.balance || 0).replace(/[^0-9.]/g, '')) || 0;
      return acc + val;
    }
    return acc;
  }, 0);

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        {/* Data Sheet Container */}
        <div className="vendors-card-container">

          {/* Header Bar */}
          <div className="vendors-header-bar">
            <div className="vendors-title-group">
              <div className="vendors-title-icon">
                <Building2 size={20} />
              </div>
              <div className="vendors-title-text">
                <h4>Vendor Data Records Sheet</h4>
                <p>View all vendor data records, balances, and profiles</p>
              </div>
            </div>

            {/* Action Buttons (Add Vendors + Export Sheet) */}
            <div className="vendors-action-buttons">
              <ExportDropdown
                fileName="Vendors_Data_Sheet"
                title="Vendor Data Records Sheet"
                buttonLabel="Export Sheet"
                headers={['Vendor Name', 'Category', 'Mobile', 'GSTIN', 'Type', 'Balance']}
                rows={filteredVendors.map(v => [
                  v.name,
                  v.category,
                  v.mobile,
                  v.gstin,
                  v.type,
                  v.balance
                ])}
              />

              <button
                onClick={() => navigate('/admin/vendors/manage')}
                className="vendors-btn-primary"
              >
                <Plus size={16} />
                <span>Add Vendors</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Bar */}
          <div className="vendors-metrics-grid">
            <div className="vendors-metric-card">
              <span className="vendors-metric-label">All Parties / Vendors</span>
              <h3 className="vendors-metric-value" style={{ color: '#111' }}>{totalPartiesCount}</h3>
            </div>
            <div className="vendors-metric-card">
              <span className="vendors-metric-label" style={{ color: '#16a34a' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span> To Collect
              </span>
              <h3 className="vendors-metric-value" style={{ color: '#16a34a' }}>₹ {totalToCollect.toLocaleString('en-IN')}</h3>
            </div>
            <div className="vendors-metric-card">
              <span className="vendors-metric-label" style={{ color: '#dc2626' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }}></span> To Pay
              </span>
              <h3 className="vendors-metric-value" style={{ color: '#dc2626' }}>₹ {totalToPay.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="vendors-filter-bar">
            <div className="vendors-search-group">
              <div className="vendors-search-wrap">
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search party or GSTIN..."
                  className="vendors-search-input"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="vendors-category-select"
              >
                <option value="All">All Categories</option>
                <option value="Bag & Accessories">Bag & Accessories</option>
                <option value="Footwear & Belts">Footwear & Belts</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Trekking Gear">Trekking Gear</option>
                <option value="Camping & Tents">Camping & Tents</option>
              </select>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
              Showing <strong style={{ color: '#0f172a' }}>{filteredVendors.length}</strong> of {vendorsData.length} vendors
            </div>
          </div>

          {/* Desktop Data Sheet Table (>= 768px) */}
          <div className="vendors-desktop-view">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Party Name</th>
                  <th>Category</th>
                  <th>Mobile Number</th>
                  <th>GSTIN</th>
                  <th>Party Type</th>
                  <th>Balance</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '13px' }}>
                      No vendor records found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{vendor.name}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px' }}>
                          {vendor.category}
                        </span>
                      </td>
                      <td style={{ color: '#475569', fontSize: '13px' }}>{vendor.mobile || '-'}</td>
                      <td style={{ color: '#475569', fontSize: '13px', fontFamily: 'monospace' }}>{vendor.gstin || '-'}</td>
                      <td>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: '#f1f5f9',
                          color: '#334155'
                        }}>
                          {vendor.type || 'Supplier'}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontWeight: '700',
                          color: vendor.balanceType === 'collect' ? '#16a34a' : vendor.balanceType === 'pay' ? '#dc2626' : '#64748b'
                        }}>
                          {vendor.balance || '₹ 0'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => navigate('/admin/vendors/profile', { state: { vendor } })}
                          style={{
                            background: '#eef2ff',
                            color: '#4f46e5',
                            border: '1px solid #c7d2fe',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#e0e7ff'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#eef2ff'}
                        >
                          <UserCircle size={14} /> Vendor Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVendorsDataSheet;
