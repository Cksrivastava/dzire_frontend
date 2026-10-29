import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import { Search, TrendingUp, Eye, Printer, DollarSign, ArrowUpRight, BarChart3 } from 'lucide-react';
import './AdminDashboard.css';
import './AdminReports.css';

const AdminProfitReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [marginFilter, setMarginFilter] = useState('All');

  const [summary, setSummary] = useState({
    grossRevenue: '₹ 0',
    cogs: '₹ 0',
    grossProfit: '₹ 0',
    overallMargin: '0.0%',
  });

  const [profitData, setProfitData] = useState([]);

  const fetchProfitData = async () => {
    try {
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/reports/profit');
      const json = await res.json();
      if (json.success) {
        if (Array.isArray(json.items)) {
          setProfitData(json.items);
        }
        if (json.summary) {
          setSummary(json.summary);
        }
      }
    } catch (err) {
      console.error('Failed to load profit reports from backend:', err);
    }
  };

  useEffect(() => {
    fetchProfitData();
  }, []);

  const filteredData = profitData.filter(item => {
    const matchesSearch =
      item.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChannel = channelFilter === 'All' || item.channel.includes(channelFilter);
    const matchesMargin =
      marginFilter === 'All' ||
      (marginFilter === 'High' && item.marginPercent >= 35) ||
      (marginFilter === 'Moderate' && item.marginPercent < 35);

    return matchesSearch && matchesChannel && matchesMargin;
  });

  return (
    <AdminLayout>
      <div className="dashboard-wrapper reports-page-wrapper">
        {/* Data Sheet Table Container */}
        <div className="reports-table-card">
          
          {/* Header Action Bar */}
          <div className="reports-header" style={{ padding: '18px 24px', borderBottom: '1px solid #eef2f6', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
              <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '8px', background: '#fff0e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6600', flexShrink: 0 }}>
                <TrendingUp size={20} />
              </div>
              <div className="reports-header-title">
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Profitability & Margins Data Sheet</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Channel-wise gross revenue, Cost of Goods Sold (COGS), and net profit analysis
                </p>
              </div>
            </div>

            <div className="reports-header-actions" style={{ flexShrink: 0 }}>
              <ExportDropdown
                fileName="Profitability_Analysis_Report"
                title="Profitability & Channel Margins Statement"
                buttonLabel="Export Profit Data"
                headers={['Channel', 'Department', 'Orders', 'Gross Revenue', 'COGS', 'Operating Cost', 'Gross Profit', 'Margin %', 'Status']}
                rows={filteredData.map(item => [
                  item.channel,
                  item.department,
                  item.orders,
                  item.grossRevenue,
                  item.cogs,
                  item.operatingCost,
                  item.grossProfit,
                  item.marginBadge,
                  item.status
                ])}
              />
              <button 
                onClick={() => window.print()}
                style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)', whiteSpace: 'nowrap' }}
              >
                <Printer size={16} /> Print Statement
              </button>
            </div>
          </div>

          {/* Metric Summary Cards Bar */}
          <div className="reports-summary-bar">
            <div className="reports-summary-item">
              <span className="reports-summary-label">Consolidated Gross Revenue</span>
              <h3 className="reports-summary-val">{summary.grossRevenue}</h3>
            </div>
            <div className="reports-summary-item">
              <span className="reports-summary-label">Cost of Goods Sold (COGS)</span>
              <h3 className="reports-summary-val" style={{ color: '#6366f1' }}>{summary.cogs}</h3>
            </div>
            <div className="reports-summary-item">
              <span className="reports-summary-label" style={{ color: '#16a34a' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div> Net Gross Profit
              </span>
              <h3 className="reports-summary-val" style={{ color: '#16a34a' }}>{summary.grossProfit}</h3>
            </div>
            <div className="reports-summary-item">
              <span className="reports-summary-label" style={{ color: '#2563eb' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></div> Overall Profit Margin
              </span>
              <h3 className="reports-summary-val" style={{ color: '#2563eb' }}>{summary.overallMargin}</h3>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="reports-filter-bar">
            <div className="reports-filter-left">
              <div className="reports-search-box">
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search sales channel, department..." 
                />
              </div>

              <select 
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="reports-select"
              >
                <option value="All">All Sales Channels</option>
                <option value="E-Commerce">E-Commerce Website</option>
                <option value="POS Store">POS Store (Offline)</option>
                <option value="Corporate">Corporate & B2B</option>
                <option value="Event">Outdoor Events</option>
                <option value="Rentals">Gear Rentals</option>
              </select>

              <select 
                value={marginFilter}
                onChange={(e) => setMarginFilter(e.target.value)}
                className="reports-select"
              >
                <option value="All">All Margin Ranges</option>
                <option value="High">High Margin (≥ 35%)</option>
                <option value="Moderate">Moderate Margin (&lt; 35%)</option>
              </select>
            </div>
          </div>

          {/* Table Sheet with horizontal scroll */}
          <div className="reports-table-scroll">
            <table className="reports-table dash-table" style={{ minWidth: '950px' }}>
              <thead>
                <tr style={{ background: '#ff6600', color: '#ffffff' }}>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Sales Channel</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Department</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Orders</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Gross Revenue</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>COGS (Cost)</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Operating Cost</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Gross Profit</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Margin %</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600' }}>Status</th>
                  <th style={{ color: '#ffffff', backgroundColor: '#ff6600', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '13px' }}>
                      No channel profitability records found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>{item.channel}</div>
                        <div style={{ color: '#2563eb', fontSize: '11px' }}>ID: {item.id}</div>
                      </td>
                      <td style={{ color: '#475569', fontSize: '12px' }}>{item.department}</td>
                      <td style={{ color: '#475569', fontWeight: '600' }}>{item.orders} Orders</td>
                      <td style={{ fontWeight: '700', color: '#111' }}>{item.grossRevenue}</td>
                      <td style={{ color: '#dc2626', fontWeight: '500' }}>{item.cogs}</td>
                      <td style={{ color: '#64748b' }}>{item.operatingCost}</td>
                      <td style={{ fontWeight: '700', color: '#16a34a' }}>{item.grossProfit}</td>
                      <td>
                        <span style={{ 
                          background: item.marginPercent >= 35 ? '#f0fdf4' : '#fff7ed',
                          color: item.marginPercent >= 35 ? '#16a34a' : '#ea580c',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          {item.marginBadge}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          background: item.status === 'Top Margin' ? '#f0fdf4' : item.status === 'High Margin' ? '#eff6ff' : '#f8fafc',
                          color: item.status === 'Top Margin' ? '#16a34a' : item.status === 'High Margin' ? '#2563eb' : '#475569',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => alert(`Channel Cost Breakdown:\n\nChannel: ${item.channel} (${item.id})\nDepartment: ${item.department}\nTotal Orders: ${item.orders}\nGross Revenue: ${item.grossRevenue}\nCOGS: ${item.cogs}\nOperating Cost: ${item.operatingCost}\nGross Profit: ${item.grossProfit}\nMargin: ${item.marginBadge} (${item.status})`)}
                            title="View Breakdown"
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={13} /> View
                          </button>
                          <button 
                            onClick={() => window.print()}
                            title="Print"
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Printer size={13} /> Print
                          </button>
                        </div>
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

export default AdminProfitReports;
