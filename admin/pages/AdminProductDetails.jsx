import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Printer, Box, Edit, Trash2, FileOutput } from 'lucide-react';
import './AdminDashboard.css';

const AdminProductDetails = () => {
  const [activeTab, setActiveTab] = useState('item');

  return (
    <AdminLayout>
      <div className="dashboard-wrapper">
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowLeft size={20} color="#1e293b" />
              </button>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>A101 Travel Cap - Techno...</h2>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>In Stock</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Printer size={14} /> Print Barcode
              </button>
              <button style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Box size={14} /> Adjust Stock
              </button>
              <button style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit size={14} /> Edit
              </button>
              <button style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '6px 10px', borderRadius: '6px', color: '#dc2626', cursor: 'pointer' }}>
                <Trash2 size={16} />
              </button>
              <button style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', color: '#64748b', cursor: 'pointer' }}>
                <FileOutput size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '24px', padding: '0 24px', borderBottom: '1px solid #eef2f6' }}>
            <button
              onClick={() => setActiveTab('item')}
              style={{ background: 'none', border: 'none', padding: '16px 0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: activeTab === 'item' ? '#6d28d9' : '#000000', borderBottom: activeTab === 'item' ? '2px solid #6d28d9' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileText size={16} /> Item Details
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              style={{ background: 'none', border: 'none', padding: '16px 0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: activeTab === 'stock' ? '#6d28d9' : '#000000', borderBottom: activeTab === 'stock' ? '2px solid #6d28d9' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Boxes size={16} /> Stock Details
            </button>
            <button
              onClick={() => setActiveTab('party')}
              style={{ background: 'none', border: 'none', padding: '16px 0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: activeTab === 'party' ? '#6d28d9' : '#000000', borderBottom: activeTab === 'party' ? '2px solid #6d28d9' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <List size={16} /> Party Wise Report
            </button>
          </div>

          {/* Content Area */}
          <div style={{ padding: '24px', background: '#fafafa', minHeight: '400px' }}>
            {activeTab === 'item' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* General Details */}
                <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #eef2f6', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                    <FileText size={16} /> General Details
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Item Name</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>A101 Travel Cap - TechnoSport</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Item Code</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>356469305139</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Category</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>Head-Wear</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Current Stock</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>11 PCS</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Stock Value</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>₹2,200</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Low Stock Quantity</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>3 PCS</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Low Stock Warning</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#16a34a', fontWeight: '500' }}>Enabled</p>
                      </div>
                    </div>

                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Item Description</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>-</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Pricing Details */}
                  <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #eef2f6', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                      <Tag size={16} /> Pricing Details
                    </div>
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Sales Price</p>
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>₹200 <span style={{ fontSize: '11px', color: '#94a3b8' }}>With Tax</span></p>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Purchase Price</p>
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>₹120 <span style={{ fontSize: '11px', color: '#94a3b8' }}>Without Tax</span></p>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>MRP</p>
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>₹ 299</p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Disc. on MRP</p>
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>-</p>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>GST Tax Rate</p>
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>5%</p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>HSN Code</p>
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>65010090</p>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Secondary Unit</p>
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>-</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock Details */}
                  <div style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #eef2f6', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                      <Boxes size={16} /> Stock Details
                    </div>
                    <div style={{ padding: '20px' }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>Batching</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>Disabled <a href="#" style={{ color: '#2563eb', textDecoration: 'none', marginLeft: '4px' }}>Enable &rarr;</a></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

// Simple icon mocks
const FileText = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>;
const Boxes = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const Tag = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const List = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;

export default AdminProductDetails;
