import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Plus, Search, UserCircle, Download, Building2 } from 'lucide-react';
import './AdminDashboard.css';

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
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

          {/* Header Bar */}
          <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f6', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fff0e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6600' }}>
                <Building2 size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Vendor Data Records Sheet</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>View all vendor data records, balances, and profiles</p>
              </div>
            </div>

            {/* Action Buttons (Add Vendors + Export Sheet) */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                style={{
                  background: '#ff6600',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)',
                  transition: 'background 0.15s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#e65c00')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ff6600')}
              >
                <Plus size={16} /> Add Vendors
              </button>
            </div>
          </div>

          {/* Metric Summary Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#eef2f6', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ padding: '16px 24px', background: '#fff' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>All Parties / Vendors</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#111' }}>{totalPartiesCount}</h3>
            </div>
            <div style={{ padding: '16px 24px', background: '#fff' }}>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div> To Collect
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#16a34a' }}>₹ {totalToCollect.toLocaleString('en-IN')}</h3>
            </div>
            <div style={{ padding: '16px 24px', background: '#fff' }}>
              <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></div> To Pay
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#dc2626' }}>₹ {totalToPay.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search party or GSTIN..."
                  style={{ width: '100%', padding: '7px 12px 7px 32px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff' }}
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ padding: '7px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff', color: '#334155' }}
              >
                <option value="All">All Categories</option>
                <option value="Bag & Accessories">Bag & Accessories</option>
                <option value="Footwear & Belts">Footwear & Belts</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Trekking Gear">Trekking Gear</option>
                <option value="Camping & Tents">Camping & Tents</option>
              </select>
            </div>
          </div>

          {/* Data Sheet Table */}
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
    </AdminLayout>
  );
};

export default AdminVendorsDataSheet;
