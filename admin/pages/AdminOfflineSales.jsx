import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { Search, Filter, RefreshCcw, DollarSign, ShoppingBag, CreditCard, ArrowRightLeft, FileText, CheckCircle2 } from 'lucide-react';

const offlineSales = [
  { bill: 'POS-1002', time: '10:45 AM', cust: 'Walk-in', items: 2, amount: '₹2,949', mode: 'UPI' },
  { bill: 'POS-1001', time: '09:30 AM', cust: 'Walk-in', items: 1, amount: '₹1,299', mode: 'Cash' }
];

const onlineSales = [
  { bill: '#ONL-5002', time: '10:15 AM', cust: 'Amit Sharma', items: 2, amount: '₹2,499', status: 'Paid', gateway: 'Razorpay (UPI)' },
  { bill: '#ONL-5001', time: '08:45 AM', cust: 'Priya Patel', items: 1, amount: '₹1,899', status: 'Paid', gateway: 'Razorpay (Card)' }
];

const storePickups = [
  { bill: '#PKP-2002', time: '11:00 AM', cust: 'Rahul Verma', items: 2, amount: '₹3,150', status: 'Picked Up' },
  { bill: '#PKP-2001', time: '09:15 AM', cust: 'Sneha Reddy', items: 1, amount: '₹1,299', status: 'Ready for Pickup' }
];

const creditNotes = [
  { noteId: 'CN-9002', date: 'Yesterday', cust: 'Vikram Singh', refInvoice: '#ONL-4920', value: '₹1,499', status: 'Active' },
  { noteId: 'CN-9001', date: '3 days ago', cust: 'Ritu Sharma', refInvoice: '#ONL-4811', value: '₹599', status: 'Redeemed' }
];

const debitNotes = [
  { noteId: 'DN-8002', date: 'Yesterday', supplier: 'Apex Sports Distributors', refInvoice: 'PO-504', value: '₹4,200', status: 'Active' },
  { noteId: 'DN-8001', date: '5 days ago', supplier: 'FitLife Equipment Corp', refInvoice: 'PO-490', value: '₹1,100', status: 'Adjusted' }
];

const paymentTransactions = [
  { txnId: 'pay_Ojh32nd', time: '10:45 AM', gateway: 'Razorpay (UPI)', amount: '₹2,949', status: 'Success' },
  { txnId: 'pay_Ojh12nd', time: '09:30 AM', gateway: 'POS Cash', amount: '₹1,299', status: 'Success' },
  { txnId: 'pay_Ojh02nd', time: '08:15 AM', gateway: 'Razorpay (Card)', amount: '₹1,899', status: 'Failed' }
];

const salesReturns = [
  { returnId: 'RET-3002', date: 'Today', cust: 'Amit Sharma', refOrder: '#ONL-4920', amount: '₹1,499', status: 'Refunded' },
  { returnId: 'RET-3001', date: 'Yesterday', cust: 'Rahul Verma', refOrder: '#ONL-4850', amount: '₹2,499', status: 'Initiated' }
];

const AdminOfflineSales = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeSub = searchParams.get("sub") || "Offline Sales (POS)";

  const [searchQuery, setSearchQuery] = useState('');

  const renderSalesSubContent = () => {
    switch (activeSub) {
      case "Online Sales":
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Online Revenue (Month)</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600' }}>₹8,20,000</h3>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Online Orders</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600' }}>820 Orders</h3>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Avg Order Value</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600' }}>₹1,000</h3>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 20px' }}>Order ID & Time</th>
                    <th style={{ padding: '12px 20px' }}>Customer</th>
                    <th style={{ padding: '12px 20px' }}>Items</th>
                    <th style={{ padding: '12px 20px' }}>Amount</th>
                    <th style={{ padding: '12px 20px' }}>Gateway</th>
                    <th style={{ padding: '12px 20px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {onlineSales.map((item) => (
                    <tr key={item.bill} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <strong>{item.bill}</strong>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#667085' }}>{item.time}</p>
                      </td>
                      <td style={{ padding: '16px 20px' }}>{item.cust}</td>
                      <td style={{ padding: '16px 20px', color: '#667085' }}>{item.items} items</td>
                      <td style={{ padding: '16px 20px', fontWeight: '600' }}>{item.amount}</td>
                      <td style={{ padding: '16px 20px', color: '#667085' }}>{item.gateway}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#f0fdf4', color: '#15803d' }}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Store Pickup Sales":
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Pickup Revenue</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600' }}>₹64,200</h3>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Picked Up</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600' }}>58 Orders</h3>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#667085' }}>Pending Pickups</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#ff6600' }}>4 Orders</h3>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 20px' }}>Order Ref</th>
                    <th style={{ padding: '12px 20px' }}>Customer</th>
                    <th style={{ padding: '12px 20px' }}>Items</th>
                    <th style={{ padding: '12px 20px' }}>Amount</th>
                    <th style={{ padding: '12px 20px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {storePickups.map((item) => (
                    <tr key={item.bill} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <strong>{item.bill}</strong>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#667085' }}>{item.time}</p>
                      </td>
                      <td style={{ padding: '16px 20px' }}>{item.cust}</td>
                      <td style={{ padding: '16px 20px', color: '#667085' }}>{item.items} items</td>
                      <td style={{ padding: '16px 20px', fontWeight: '600' }}>{item.amount}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ 
                          padding: '3px 8px', 
                          borderRadius: '4px', 
                          fontSize: '11px', 
                          fontWeight: '600', 
                          background: item.status === 'Picked Up' ? '#f0fdf4' : '#fff4ed', 
                          color: item.status === 'Picked Up' ? '#15803d' : '#ff6600' 
                        }}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Credit Notes":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Issued Credit Notes</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Note ID</th>
                  <th style={{ padding: '12px 16px' }}>Customer</th>
                  <th style={{ padding: '12px 16px' }}>Ref Invoice</th>
                  <th style={{ padding: '12px 16px' }}>Value</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {creditNotes.map((note) => (
                  <tr key={note.noteId} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                    <td style={{ padding: '16px 16px' }}>
                      <strong>{note.noteId}</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#667085' }}>{note.date}</p>
                    </td>
                    <td style={{ padding: '16px 16px' }}>{note.cust}</td>
                    <td style={{ padding: '16px 16px', color: '#667085' }}>{note.refInvoice}</td>
                    <td style={{ padding: '16px 16px', fontWeight: '600', color: '#f04438' }}>{note.value}</td>
                    <td style={{ padding: '16px 16px' }}>
                      <span style={{ 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        background: note.status === 'Active' ? '#fff4ed' : '#f3f4f6', 
                        color: note.status === 'Active' ? '#ff6600' : '#374151' 
                      }}>{note.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "Debit Notes":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Supplier Debit Notes</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Note ID</th>
                  <th style={{ padding: '12px 16px' }}>Supplier / Vendor</th>
                  <th style={{ padding: '12px 16px' }}>Ref Invoice</th>
                  <th style={{ padding: '12px 16px' }}>Value</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {debitNotes.map((note) => (
                  <tr key={note.noteId} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                    <td style={{ padding: '16px 16px' }}>
                      <strong>{note.noteId}</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#667085' }}>{note.date}</p>
                    </td>
                    <td style={{ padding: '16px 16px' }}>{note.supplier}</td>
                    <td style={{ padding: '16px 16px', color: '#667085' }}>{note.refInvoice}</td>
                    <td style={{ padding: '16px 16px', fontWeight: '600', color: '#12b76a' }}>{note.value}</td>
                    <td style={{ padding: '16px 16px' }}>
                      <span style={{ 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        background: note.status === 'Active' ? '#f0fdf4' : '#f3f4f6', 
                        color: note.status === 'Active' ? '#15803d' : '#374151' 
                      }}>{note.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "Payment Transactions":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Recent Payment Gateway Logs</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Transaction ID</th>
                  <th style={{ padding: '12px 16px' }}>Method</th>
                  <th style={{ padding: '12px 16px' }}>Amount</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentTransactions.map((txn) => (
                  <tr key={txn.txnId} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                    <td style={{ padding: '16px 16px' }}>
                      <strong>{txn.txnId}</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#667085' }}>Today, {txn.time}</p>
                    </td>
                    <td style={{ padding: '16px 16px', color: '#667085' }}>{txn.gateway}</td>
                    <td style={{ padding: '16px 16px', fontWeight: '600' }}>{txn.amount}</td>
                    <td style={{ padding: '16px 16px' }}>
                      <span style={{ 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        background: txn.status === 'Success' ? '#f0fdf4' : '#fef2f2', 
                        color: txn.status === 'Success' ? '#15803d' : '#ef4444' 
                      }}>{txn.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "Sales Returns":
        return (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Customer Return Log</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Return ID</th>
                  <th style={{ padding: '12px 16px' }}>Customer</th>
                  <th style={{ padding: '12px 16px' }}>Ref Order</th>
                  <th style={{ padding: '12px 16px' }}>Refund Value</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {salesReturns.map((ret) => (
                  <tr key={ret.returnId} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                    <td style={{ padding: '16px 16px' }}>
                      <strong>{ret.returnId}</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#667085' }}>{ret.date}</p>
                    </td>
                    <td style={{ padding: '16px 16px' }}>{ret.cust}</td>
                    <td style={{ padding: '16px 16px', color: '#667085' }}>{ret.refOrder}</td>
                    <td style={{ padding: '16px 16px', fontWeight: '600' }}>{ret.amount}</td>
                    <td style={{ padding: '16px 16px' }}>
                      <span style={{ 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        background: ret.status === 'Refunded' ? '#f3f4f6' : '#fff4ed', 
                        color: ret.status === 'Refunded' ? '#374151' : '#ff6600' 
                      }}>{ret.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "Offline Sales (POS)":
      default:
        // Default POS transaction view
        return (
          <div>
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
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              </div>
              
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
                  {offlineSales.map((item) => (
                    <tr key={item.bill} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.bill}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>Today, {item.time}</p>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111' }}>{item.cust}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#667085' }}>{item.items}</td>
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
            <p>Manage and audit omnichannel store sales configurations</p>
          </div>
          <button
            className="admin-primary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw size={18} />
            Refresh Data
          </button>
        </section>

        {renderSalesSubContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminOfflineSales;
