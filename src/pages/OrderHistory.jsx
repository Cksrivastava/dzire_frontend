import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShopContext } from '../context/ShopContext';
import { ChevronRight } from 'lucide-react';
import AccountSidebar from '../components/AccountSidebar';
import AccountHeader from '../components/AccountHeader';

import {
  SAMPLE_ORDERS,
  STATUS_FILTER_OPTIONS,
} from '../data/orderHistoryData';
import OrderHistoryFilterBar from '../components/order-history/OrderHistoryFilterBar';
import OrderHistoryCard from '../components/order-history/OrderHistoryCard';
import OrderHistoryEmpty from '../components/order-history/OrderHistoryEmpty';

import './CustomerAccount.css'; // Reuse sidebar styles
import './OrderHistory.css';

import { orderAPI } from '../services/api';

export { SAMPLE_ORDERS, STATUS_FILTER_OPTIONS };

const OrderHistory = () => {
  const { user } = useContext(ShopContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  useEffect(() => {
    if (!user) {
      navigate('/login?redirectTo=/account/orders');
    }
  }, [user, navigate]);

  useEffect(() => {
    let isMounted = true;
    orderAPI.getAll()
      .then((res) => {
        if (isMounted && res.orders) {
          const mapped = res.orders.map((o) => ({
            id: o.orderId || o.id || "DZ-10045",
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : (o.date || "Today"),
            total: Number(o.total) || 0,
            status: o.status || "Confirmed",
            statusColor: o.statusColor || "#0369a1",
            statusBg: o.statusBg || "#e0f2fe",
            badgeClass: o.badgeClass || "badge-confirmed",
            deliveryInfo: o.deliveryInfo || "Order Confirmed by Seller",
            product: o.items?.[0]?.name || o.product || "Dzire Item",
            desc: o.items?.[0] ? `${o.items[0].selectedColor || "Default"} | Qty: ${o.items[0].quantity || 1}` : (o.desc || "Qty: 1"),
            price: o.items?.[0]?.price || o.price || o.total || 0,
            img: o.items?.[0]?.img || o.img || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
            allowReturn: o.allowReturn !== undefined ? o.allowReturn : true,
            userName: o.userName || o.shippingAddress?.fullName || user?.name || "Customer",
          }));
          setOrders(mapped);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch remote orders:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === "ALL" ||
      order.status.toLowerCase() === selectedStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        {/* Top Breadcrumb Bar */}
        <div className="profile-top-breadcrumb-bar">
          <div className="profile-top-breadcrumb">
            <Link to="/" className="breadcrumb-home">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-active">Order History</span>
          </div>
        </div>

        <div className="profile-page-container">
          {/* Reusable Left Sidebar Navigation */}
          <AccountSidebar />

          {/* Main Content Area */}
          <main className="profile-main-content">
            <AccountHeader
              title="Order History"
              subtitle="View and track all your previous orders across delivery & payment statuses."
            />

            {/* STATUS FILTER PILLS & SEARCH */}
            <OrderHistoryFilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedStatusFilter={selectedStatusFilter}
              setSelectedStatusFilter={setSelectedStatusFilter}
              statusOptions={STATUS_FILTER_OPTIONS}
            />

            {/* ORDER LIST */}
            <div className="order-history-list">
              {filteredOrders.length === 0 ? (
                <OrderHistoryEmpty selectedStatusFilter={selectedStatusFilter} />
              ) : (
                filteredOrders.map((order) => (
                  <OrderHistoryCard key={order.id} order={order} />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
