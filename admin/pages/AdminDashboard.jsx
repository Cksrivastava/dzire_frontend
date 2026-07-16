import React from "react";
import { Link, useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  AlertCircle,
  AlertTriangle,
  Gift,
  Activity,
  Zap,
  Plus,
  Printer,
  Download,
  Truck,
  FileText,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  DollarSign
} from "lucide-react";

const AdminDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeSub = searchParams.get("sub") || "Business KPI Overview";

  // Render different layouts based on activeSub query param
  const renderContent = () => {
    switch (activeSub) {
      case "Business KPI Overview":
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Total Revenue</p>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#111' }}>₹12,45,000</h2>
                <span style={{ fontSize: '12px', color: '#12b76a', fontWeight: '500' }}>+15.2% vs last month</span>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Total Orders</p>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#111' }}>1,240</h2>
                <span style={{ fontSize: '12px', color: '#12b76a', fontWeight: '500' }}>+8.4% vs last month</span>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Average Order Value</p>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#111' }}>₹1,004</h2>
                <span style={{ fontSize: '12px', color: '#f04438', fontWeight: '500' }}>-2.1% vs last month</span>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#667085', fontWeight: '500' }}>Conversion Rate</p>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#111' }}>3.2%</h2>
                <span style={{ fontSize: '12px', color: '#12b76a', fontWeight: '500' }}>+0.5% vs last month</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Recent Performance Chart</h3>
                <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderRadius: '8px', color: '#667085' }}>
                  <TrendingUp size={24} style={{ marginRight: '8px', color: '#ff6600' }} />
                  <span>Real-time business performance analytics</span>
                </div>
              </div>

              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Fulfillment Health</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span>On-Time Shipping</span>
                      <strong>95%</strong>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '95%', height: '100%', background: '#12b76a' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span>Order Defect Rate</span>
                      <strong>1.2%</strong>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '12%', height: '100%', background: '#ff6600' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Sales Overview":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Sales Target & Split</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <div style={{ border: '1px solid #f2f4f7', padding: '16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Monthly Target</span>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '20px', color: '#111' }}>₹15,00,000</h4>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#ff6600' }}>83% Achieved</div>
              </div>
              <div style={{ border: '1px solid #f2f4f7', padding: '16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Online Split</span>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '20px', color: '#ff6600' }}>₹8,20,000</h4>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#667085' }}>66% of total sales</div>
              </div>
              <div style={{ border: '1px solid #f2f4f7', padding: '16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Offline Split (POS)</span>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '20px', color: '#175cd3' }}>₹4,25,000</h4>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#667085' }}>34% of total sales</div>
              </div>
            </div>
            <div style={{ height: '240px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667085' }}>
              Sales Channel Performance Visualizer
            </div>
          </div>
        );

      case "Orders Overview":
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Order Processing Metrics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#667085' }}>Pending Fulfillment</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#ff6600' }}>45 Orders</h4>
                </div>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#667085' }}>Shipped / Completed</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#12b76a' }}>1,150 Orders</h4>
                </div>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#667085' }}>Return Requests</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#175cd3' }}>12 Claims</h4>
                </div>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#667085' }}>Cancelled Orders</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#f04438' }}>33 Orders</h4>
                </div>
              </div>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CheckCircle size={32} color="#12b76a" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>Fulfillment Queue is Clear</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#667085', textAlign: 'center' }}>All express orders have been dispatched successfully.</p>
            </div>
          </div>
        );

      case "Inventory Alerts":
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Recent Inventory Status Alerts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#fff4ed', border: '1px solid #ffe0cc', borderRadius: '8px' }}>
                  <AlertTriangle color="#ff6600" size={20} style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600', color: '#b23b00' }}>Low Stock: Attar Oudh Al-Haram</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>Remaining stock is 3 units. Reorder threshold is 10 units.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px' }}>
                  <AlertCircle color="#f04438" size={20} style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600', color: '#b91c1c' }}>Out of Stock: Air Zoom Shoes</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>Remaining stock is 0. 5 customers have active notify-me requests.</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Stock Value Metrics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f2f4f7', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#667085' }}>Active SKUs</span>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>1,424</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f2f4f7', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#667085' }}>Total Inventory Value</span>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>₹24,80,500</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#667085' }}>Replenishment Cost Estimate</span>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>₹4,50,000</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "Low Stock Alerts":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Critical Low Stock Register</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Product</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Category</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Remaining</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Threshold</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>Cycling Helmet Pro</td>
                  <td style={{ padding: '12px 16px', color: '#667085' }}>Cycling</td>
                  <td style={{ padding: '12px 16px', color: '#f04438', fontWeight: '600' }}>8 units</td>
                  <td style={{ padding: '12px 16px', color: '#667085' }}>20 units</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ padding: '4px 8px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>PO</button>
                  </td>
                </tr>
                <tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>Oudh Concentrated Attar</td>
                  <td style={{ padding: '12px 16px', color: '#667085' }}>Perfumes</td>
                  <td style={{ padding: '12px 16px', color: '#f04438', fontWeight: '600' }}>3 units</td>
                  <td style={{ padding: '12px 16px', color: '#667085' }}>10 units</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ padding: '4px 8px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>PO</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "Top Selling Products":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Top 5 Selling Items This Month</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Item Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Category</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Units Sold</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                  <td style={{ padding: '16px 16px', fontWeight: '500' }}>Air Zoom Running Shoes</td>
                  <td style={{ padding: '16px 16px', color: '#667085' }}>Running</td>
                  <td style={{ padding: '16px 16px', fontWeight: '600' }}>420 units</td>
                  <td style={{ padding: '16px 16px', fontWeight: '600', color: '#12b76a' }}>₹10,49,580</td>
                </tr>
                <tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                  <td style={{ padding: '16px 16px', fontWeight: '500' }}>Thermal Training Jacket</td>
                  <td style={{ padding: '16px 16px', color: '#667085' }}>Running</td>
                  <td style={{ padding: '16px 16px', fontWeight: '600' }}>280 units</td>
                  <td style={{ padding: '16px 16px', fontWeight: '600', color: '#12b76a' }}>₹5,31,720</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "Dzire Credits Summary":
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Loyalty Credits Flow</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#667085' }}>Total Awarded</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '18px', color: '#12b76a' }}>45K Cr</h4>
                </div>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#667085' }}>Redeemed</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '18px', color: '#ff6600' }}>20K Cr</h4>
                </div>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#667085' }}>Active Wallets</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '18px', color: '#175cd3' }}>1,200</h4>
                </div>
              </div>
              <div style={{ border: '1px solid #f2f4f7', padding: '12px', borderRadius: '8px', fontSize: '13px', background: '#fcfcfd' }}>
                <strong>Current Rule:</strong> Rs 1,000 spend = 50 credits (Max redemption cap at 10% of cart).
              </div>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Gift size={32} color="#ff6600" style={{ marginBottom: '8px' }} />
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>Credits Campaign is Active</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#667085', textAlign: 'center' }}>Weekend double credits is driving high retention metrics.</p>
            </div>
          </div>
        );

      case "Recent Orders":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Latest Orders Log</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Order ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Customer</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Date</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', color: 'white' }}>Payment</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>#DZR-8290</td>
                  <td style={{ padding: '12px 16px' }}>Amit Sharma</td>
                  <td style={{ padding: '12px 16px', color: '#667085' }}>Today, 10:45 AM</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>₹2,949</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#f0fdf4', color: '#15803d' }}>Paid</span>
                  </td>
                </tr>
                <tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>#DZR-8289</td>
                  <td style={{ padding: '12px 16px' }}>Priya Patel</td>
                  <td style={{ padding: '12px 16px', color: '#667085' }}>Today, 09:30 AM</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>₹1,299</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#fef2f2', color: '#ef4444' }}>Failed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "Today's Summary":
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '12px', color: '#667085' }}>Today's Sales</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#ff6600' }}>₹45,200</h3>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '12px', color: '#667085' }}>Today's Visitors</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#111' }}>1,200</h3>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '12px', color: '#667085' }}>Today's Bills</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#12b76a' }}>42 bills</h3>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '12px', color: '#667085' }}>Pending Dispatch</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#f04438' }}>12 orders</h3>
            </div>
          </div>
        );

      /* case "Quick Actions":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Quick Actions Console</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <Link to="/admin/products?menu=Products&sub=Add%20%2F%20Edit%20Product" style={{ textDecoration: 'none' }}>
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#111', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#ff6600'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                  <Plus size={18} color="#ff6600" />
                  <strong>Add New Product</strong>
                </div>
              </Link>
              <Link to="/admin/pos?menu=POS%20Billing" style={{ textDecoration: 'none' }}>
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#111', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#ff6600'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                  <Printer size={18} color="#ff6600" />
                  <strong>Create POS Bill</strong>
                </div>
              </Link>
              <Link to="/admin/reports/sales?menu=Reports&sub=Sales%20Reports" style={{ textDecoration: 'none' }}>
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#111', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#ff6600'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                  <Download size={18} color="#ff6600" />
                  <strong>Export Sales Report</strong>
                </div>
              </Link>
            </div>
          </div>
        ); */

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        {/* Dynamic Inner Subpage Header */}
        <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0', color: '#1e293b' }}>{activeSub}</h1>
            <p style={{ color: '#667085', margin: 0, fontSize: '14px' }}>Store console and dashboard overview metrics</p>
          </div>
        </div>

        {/* Dynamic Body Content */}
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
