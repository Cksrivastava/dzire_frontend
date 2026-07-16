import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { Search, Filter, Eye, CheckCircle, XCircle, RefreshCcw, Landmark, DollarSign, Wallet, Award, Activity, BarChart2 } from 'lucide-react';

const returnRequests = [
  { id: 'RET-1002', orderId: 'ORD-24082', date: 'Oct 28, 2026', cust: 'John Doe', items: '1', amount: '₹4,999', type: 'Defective', status: 'Pending Approval' },
  { id: 'RET-1001', orderId: 'ORD-24071', date: 'Oct 25, 2026', cust: 'Alice Smith', items: '2', amount: '₹1,500', type: 'Size Issue', status: 'Refunded (Wallet)' }
];

const statusOptions = ['All Statuses', ...new Set(returnRequests.map((item) => item.status))];
const typeOptions = ['All Types', ...new Set(returnRequests.map((item) => item.type))];

const AdminReturns = () => {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const activeSub = searchParams.get("sub") || "Return Requests";

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return returnRequests.filter((item) => {
      const matchesSearch = !query || [item.id, item.orderId].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
      const matchesType = typeFilter === 'All Types' || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Statuses');
    setTypeFilter('All Types');
  };

  const renderReturnsSubContent = () => {
    switch (activeSub) {
      case "Refund Options":
        return (
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
        );

      case "Return History":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Archived & Closed Return Cases</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Return ID</th>
                  <th style={{ padding: '12px 16px' }}>Customer</th>
                  <th style={{ padding: '12px 16px' }}>Original Order</th>
                  <th style={{ padding: '12px 16px' }}>Value</th>
                  <th style={{ padding: '12px 16px' }}>Resolution</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                  <td style={{ padding: '16px 16px' }}><strong>#RET-0988</strong></td>
                  <td style={{ padding: '16px 16px' }}>Amit Sharma</td>
                  <td style={{ padding: '16px 16px', color: '#667085' }}>#DZR-8120</td>
                  <td style={{ padding: '16px 16px', fontWeight: '600' }}>₹2,499</td>
                  <td style={{ padding: '16px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#f3f4f6', color: '#374151' }}>Refunded (Original Source)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "Return Analytics":
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Average Return Rate</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#f04438' }}>2.8%</h3>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Top Return Reason</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#111' }}>Size/Fit Issues (64%)</h3>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Avg Resolution Time</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#12b76a' }}>1.2 Days</h3>
              </div>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Weekly Return Analytics</h3>
              <div style={{ height: '200px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667085' }}>
                <BarChart2 style={{ marginRight: '8px', color: '#ff6600' }} /> Return Intake Trend Line
              </div>
            </div>
          </div>
        );

      case "Credit Reversal":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Loyalty Points Credit Reversal Logs</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Activity ID</th>
                  <th style={{ padding: '12px 16px' }}>Customer</th>
                  <th style={{ padding: '12px 16px' }}>Returned Order Ref</th>
                  <th style={{ padding: '12px 16px' }}>Reversed Points</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                  <td style={{ padding: '16px 16px' }}><strong>#REV-9082</strong></td>
                  <td style={{ padding: '16px 16px' }}>Vikram Singh</td>
                  <td style={{ padding: '16px 16px', color: '#667085' }}>#DZR-8290</td>
                  <td style={{ padding: '16px 16px', fontWeight: '600', color: '#f04438' }}>-150 Credits</td>
                  <td style={{ padding: '16px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#fef2f2', color: '#ef4444' }}>Reversed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "Return Requests":
      case "Approve / Reject Returns":
      case "Normal Returns":
      case "Defective Returns":
      case "Partial Returns":
      default:
        return (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#667085' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search Request ID or Order..."
                  style={{ padding: '8px 12px 8px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '300px' }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                style={{ padding: '8px 12px', background: showFilters ? '#fff4ed' : 'white', border: `1px solid ${showFilters ? '#ff6600' : '#d1d5db'}`, borderRadius: '6px', cursor: 'pointer' }}
                aria-label="Toggle return filters"
              >
                <Filter size={16} color="#667085" />
              </button>
            </div>

            {showFilters && (
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f9fafb' }}>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
                >
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                  style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#ff6600', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Request ID</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Order ID</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Customer</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Items</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Amount</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Type</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#344054' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.id}</td>
                      <td style={{ padding: '16px 20px' }}>{item.orderId}</td>
                      <td style={{ padding: '16px 20px', color: '#667085' }}>{item.date}</td>
                      <td style={{ padding: '16px 20px', fontWeight: '500', color: '#111' }}>{item.cust}</td>
                      <td style={{ padding: '16px 20px' }}>{item.items}</td>
                      <td style={{ padding: '16px 20px', fontWeight: '600', color: '#111' }}>{item.amount}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', background: item.type === 'Defective' ? '#fef2f2' : '#eff8ff', color: item.type === 'Defective' ? '#ef4444' : '#175cd3' }}>
                          {item.type}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: '500',
                          background: item.status === 'Pending Approval' ? '#fff4ed' : '#f0fdf4',
                          color: item.status === 'Pending Approval' ? '#ff6600' : '#15803d'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => alert('Viewing detail...')} style={{ padding: '6px', background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }} aria-label="View request"><Eye size={14} color="#667085" /></button>
                          {item.status === 'Pending Approval' && (
                            <>
                              <button onClick={() => alert('Approved')} style={{ padding: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', cursor: 'pointer' }} aria-label="Approve request"><CheckCircle size={14} color="#15803d" /></button>
                              <button onClick={() => alert('Rejected')} style={{ padding: '6px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }} aria-label="Reject request"><XCircle size={14} color="#b91c1c" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>{activeSub}</h1>
            <p>Manage customer returns and refunds configuration</p>
          </div>
          {activeSub === "Return Requests" && (
            <button
              className="admin-primary-button"
              type="button"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw size={18} />
              Refresh Data
            </button>
          )}
        </section>

        {renderReturnsSubContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminReturns;
