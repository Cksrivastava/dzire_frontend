import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Calendar, DollarSign, TrendingUp, ShoppingBag, Store, Globe, ArrowUpRight, Search } from 'lucide-react';
import ExportDropdown from '../components/ExportDropdown';
import './AdminDashboard.css';

const AdminSalesReports = () => {
  const [timeframe, setTimeframe] = useState('This Month');
  const [channelFilter, setChannelFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const salesSummaryData = [
    ['Total Gross Sales', '₹12,45,000', '+18.4% vs prev period'],
    ['Online Website Sales', '₹8,20,000', '65.8% of total revenue'],
    ['Store POS Counter Sales', '₹4,25,000', '34.2% of total revenue'],
    ['Average Order Value (AOV)', '₹2,680', '+5.2% growth']
  ];

  const monthlyTrend = [
    { month: 'May', online: 450000, pos: 280000, total: 730000 },
    { month: 'Jun', online: 520000, pos: 310000, total: 830000 },
    { month: 'Jul', online: 610000, pos: 340000, total: 950000 },
    { month: 'Aug', online: 730000, pos: 390000, total: 1120000 },
    { month: 'Sep', online: 780000, pos: 410000, total: 1190000 },
    { month: 'Oct', online: 820000, pos: 425000, total: 1245000 },
  ];

  const recentTransactions = [
    { id: 'ORD-89421', customer: 'Rahul Verma', channel: 'Online Store', items: 3, total: 8400, method: 'UPI', date: '2026-10-26 14:32', status: 'Delivered' },
    { id: 'POS-10492', customer: 'Walk-in Customer', channel: 'Store POS', items: 2, total: 3200, method: 'Cash', date: '2026-10-26 13:15', status: 'Completed' },
    { id: 'ORD-89419', customer: 'Pooja Sharma', channel: 'Online Store', items: 1, total: 4200, method: 'Credit Card', date: '2026-10-26 11:45', status: 'Shipped' },
    { id: 'POS-10491', customer: 'Amit Singhal', channel: 'Store POS', items: 4, total: 12850, method: 'UPI', date: '2026-10-26 10:20', status: 'Completed' },
    { id: 'ORD-89415', customer: 'Karan Mehra', channel: 'Online Store', items: 2, total: 6998, method: 'NetBanking', date: '2026-10-25 18:10', status: 'Delivered' },
    { id: 'POS-10488', customer: 'Rohan Gupta', channel: 'Store POS', items: 1, total: 1850, method: 'Card', date: '2026-10-25 16:50', status: 'Completed' },
  ];

  const filteredTransactions = recentTransactions.filter((tx) => {
    const matchSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchChannel = channelFilter === 'All' || tx.channel === channelFilter;
    return matchSearch && matchChannel;
  });

  const maxMonthTotal = Math.max(...monthlyTrend.map((m) => m.total));

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        {/* Top Header Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Sales & Revenue Analytics</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Omnichannel sales breakdown across Online Store and Offline POS counters</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff', fontWeight: '500', outline: 'none' }}
            >
              <option value="This Month">This Month (Oct 2026)</option>
              <option value="Last Month">Last Month (Sep 2026)</option>
              <option value="Q3 2026">Q3 (Jul - Sep 2026)</option>
              <option value="Year 2026">Financial Year 2026</option>
            </select>

            <ExportDropdown
              fileName="Sales_Performance_Report"
              title="Sales & Revenue Performance Report"
              headers={['Metric', 'Revenue Amount', 'Growth / Contribution']}
              rows={salesSummaryData}
            />
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Gross Revenue</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>₹12,45,000</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: '500' }}>+18.4% vs last period</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Online E-Commerce</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff7ed', color: '#ff6600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ff6600' }}>₹8,20,000</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>65.8% of total sales</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Store POS Counters</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>₹4,25,000</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>34.2% of total sales</div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Average Order Value</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={20} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>₹2,680</div>
            <div style={{ fontSize: '12px', color: '#7c3aed', marginTop: '4px', fontWeight: '500' }}>Across 465 transactions</div>
          </div>
        </div>

        {/* 6-Month Visual Sales Trend Bar Graphic */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #eef2f6', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Monthly Revenue Trajectory</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>Stacked view of Online Store vs In-Store POS sales growth</p>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: '600' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ff6600' }}></span> Online
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#2563eb' }}></span> POS Store
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '16px', padding: '0 16px' }}>
            {monthlyTrend.map((m) => {
              const heightPercent = (m.total / maxMonthTotal) * 100;
              const onlineShare = (m.online / m.total) * 100;
              const posShare = (m.pos / m.total) * 100;
              return (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>₹{(m.total / 100000).toFixed(1)}L</div>
                  <div style={{ width: '100%', maxWidth: '48px', height: `${heightPercent}%`, borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
                    <div style={{ height: `${posShare}%`, background: '#2563eb', transition: 'all 0.3s' }} title={`POS: ₹${m.pos.toLocaleString('en-IN')}`} />
                    <div style={{ height: `${onlineShare}%`, background: '#ff6600', transition: 'all 0.3s' }} title={`Online: ₹${m.online.toLocaleString('en-IN')}`} />
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{m.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #eef2f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '280px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search order # or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
              >
                <option value="All">All Channels</option>
                <option value="Online Store">Online Store</option>
                <option value="Store POS">Store POS</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ExportDropdown
                fileName="Sales_Transactions_Log"
                title="Sales Transactions Detail Log"
                headers={['Order ID', 'Customer Name', 'Sales Channel', 'Items Count', 'Payment Method', 'Order Amount', 'Status', 'Date']}
                rows={filteredTransactions.map((tx) => [
                  tx.id,
                  tx.customer,
                  tx.channel,
                  tx.items,
                  tx.method,
                  `₹${tx.total.toLocaleString('en-IN')}`,
                  tx.status,
                  tx.date
                ])}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f6', color: '#64748b' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Sales Channel</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Payment Mode</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Total Amount</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Date & Time</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: '600', color: '#0f172a' }}>{tx.id}</td>
                    <td style={{ padding: '14px 16px', color: '#334155', fontWeight: '500' }}>{tx.customer}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: tx.channel === 'Online Store' ? '#fff7ed' : '#eff6ff',
                          color: tx.channel === 'Online Store' ? '#ff6600' : '#2563eb'
                        }}
                      >
                        {tx.channel}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>{tx.method}</td>
                    <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: '700' }}>₹{tx.total.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{tx.date}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: tx.status === 'Delivered' || tx.status === 'Completed' ? '#dcfce7' : '#e0f2fe',
                          color: tx.status === 'Delivered' || tx.status === 'Completed' ? '#15803d' : '#0369a1'
                        }}
                      >
                        {tx.status}
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

export default AdminSalesReports;
