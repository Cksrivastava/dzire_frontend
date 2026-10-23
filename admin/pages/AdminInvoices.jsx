import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Filter, Printer, Download, RefreshCcw } from 'lucide-react';
import ExportDropdown from '../components/ExportDropdown';

const invoices = [
  { inv: 'INV-26-00045', date: 'Oct 28, 2026', order: 'DZ-10045', cust: 'John Doe', base: '₹4,236', gst: '₹763', total: '₹4,999' },
  { inv: 'INV-26-00044', date: 'Oct 27, 2026', order: 'POS-1002', cust: 'Walk-in', base: '₹2,500', gst: '₹449', total: '₹2,949' }
];

const invoiceSourceOptions = ['All Sources', 'Online', 'POS'];

const AdminInvoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sourceFilter, setSourceFilter] = useState('All Sources');

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return invoices.filter((item) => {
      const source = item.order.startsWith('POS-') ? 'POS' : 'Online';
      const matchesSearch = !query || [item.inv, item.order, item.cust, item.total].some((value) => value.toLowerCase().includes(query));
      const matchesSource = sourceFilter === 'All Sources' || source === sourceFilter;

      return matchesSearch && matchesSource;
    });
  }, [searchQuery, sourceFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setSourceFilter('All Sources');
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Invoices</h1>
            <p>GST invoices generated for online and offline sales</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <ExportDropdown
              fileName="Invoices_Report"
              title="GST Invoices Register"
              headers={['Invoice No', 'Date', 'Order ID', 'Customer', 'Base Price', 'GST Amount', 'Total']}
              rows={filteredInvoices.map((inv) => [
                inv.inv,
                inv.date,
                inv.order,
                inv.cust,
                inv.base,
                inv.gst,
                inv.total
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

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#667085' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search Invoice No or Order ID..."
                style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '300px' }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              style={{ padding: '8px 12px', background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}`, borderRadius: '6px', cursor: 'pointer' }}
              aria-label="Toggle invoice filters"
            >
              <Filter size={16} color="#667085" />
            </button>
          </div>

          {showFilters && (
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f9fafb' }}>
              <select
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
              >
                {invoiceSourceOptions.map((source) => (
                  <option key={source} value={source}>{source}</option>
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
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Invoice No & Date</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Order ID</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Base + GST</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Total</th>
                <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((item) => (
                <tr key={item.inv} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.inv}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>{item.date}</p>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#175cd3' }}>{item.order}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111' }}>{item.cust}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#667085' }}>
                    {item.base} <br /> <span style={{ color: '#12b76a' }}>+ {item.gst} GST</span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600' }}>{item.total}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button style={{ color: '#667085', background: 'none', border: 'none', cursor: 'pointer' }}><Printer size={18} /></button>
                      <button style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer' }}><Download size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td colSpan="6" style={{ padding: '28px 20px', textAlign: 'center', fontSize: '14px', color: '#667085' }}>
                    No invoices found.
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

export default AdminInvoices;
