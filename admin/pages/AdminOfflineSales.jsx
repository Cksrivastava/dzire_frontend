import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, RefreshCcw } from 'lucide-react';
import ExportDropdown from '../components/ExportDropdown';

const offlineSales = [
  { bill: 'POS-1002', time: '10:45 AM', cust: 'Walk-in', items: 2, amount: '₹2,949', mode: 'UPI' },
  { bill: 'POS-1001', time: '09:30 AM', cust: 'Walk-in', items: 1, amount: '₹1,299', mode: 'Cash' }
];

const paymentModeOptions = ['All Payment Modes', ...new Set(offlineSales.map((item) => item.mode))];

const AdminOfflineSales = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [paymentModeFilter, setPaymentModeFilter] = useState('All Payment Modes');

  const filteredOfflineSales = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return offlineSales.filter((item) => {
      const matchesSearch = !query || [item.bill, item.cust, item.mode, item.amount].some((value) => String(value).toLowerCase().includes(query));
      const matchesPaymentMode = paymentModeFilter === 'All Payment Modes' || item.mode === paymentModeFilter;

      return matchesSearch && matchesPaymentMode;
    });
  }, [searchQuery, paymentModeFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setPaymentModeFilter('All Payment Modes');
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Offline Sales</h1>
            <p>Track sales generated through the POS terminal</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <ExportDropdown
              fileName="Offline_Sales_Report"
              title="POS Offline Sales Register"
              headers={['Bill No', 'Time', 'Customer', 'Items Count', 'Payment Mode', 'Total Amount']}
              rows={filteredOfflineSales.map((sale) => [
                sale.bill,
                sale.time,
                sale.cust,
                String(sale.items),
                sale.mode,
                sale.amount
              ])}
            />
            <button
              className="admin-primary-button"
              type="button"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw size={18} />
              Refresh Data
            </button>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Today's Offline Sales</p>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#111' }}>₹12,450</h2>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Bills Generated</p>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#111' }}>18</h2>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Cash Received</p>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#12b76a' }}>₹4,200</h2>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>UPI/Card Received</p>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#ff6600' }}>₹8,250</h2>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#667085' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search Bill No..."
                style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '250px' }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              style={{ padding: '8px 12px', background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}`, borderRadius: '6px', cursor: 'pointer' }}
              aria-label="Toggle offline sales filters"
            >
              <Filter size={16} color="#667085" />
            </button>
          </div>

          {showFilters && (
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f9fafb' }}>
              <select
                value={paymentModeFilter}
                onChange={(event) => setPaymentModeFilter(event.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
              >
                {paymentModeOptions.map((mode) => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                style={{ padding: '8px 12px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#344054' }}
              >
                Clear
              </button>
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Bill No & Time</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Items</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Total Amount</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {filteredOfflineSales.map((item) => (
                <tr key={item.bill} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.bill}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>Today, {item.time}</p>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111' }}>{item.cust}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#667085' }}>{Array.isArray(item.items) ? `${item.items.length} items` : (item.items || '1 item')}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600' }}>{item.amount}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: item.mode === 'Cash' ? '#f3f4f6' : '#eff8ff',
                      color: item.mode === 'Cash' ? '#374151' : '#175cd3'
                    }}>
                      {item.mode}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredOfflineSales.length === 0 && (
                <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td colSpan="5" style={{ padding: '28px 20px', textAlign: 'center', fontSize: '14px', color: '#667085' }}>
                    No offline sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOfflineSales;
