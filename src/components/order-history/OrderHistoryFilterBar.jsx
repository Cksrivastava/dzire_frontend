import React from "react";
import { Search } from "lucide-react";

const OrderHistoryFilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedStatusFilter,
  setSelectedStatusFilter,
  statusOptions,
}) => {
  return (
    <div className="orders-filter-bar" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap' }}>
        <div className="orders-search" style={{ flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#667085" />
          <input
            type="text"
            placeholder="Search orders by ID or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="orders-filter-select"
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processed">Processed</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Payment Failed">Payment Failed</option>
          <option value="On Hold">On Hold</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* FILTER PILLS QUICK ROW */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
        {statusOptions.map((item) => (
          <button
            key={item.value}
            type="button"
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              borderRadius: '16px',
              border: '1px solid ' + (selectedStatusFilter === item.value ? '#ff6600' : '#d1d5db'),
              background: selectedStatusFilter === item.value ? '#fff3eb' : '#ffffff',
              color: selectedStatusFilter === item.value ? '#ff6600' : '#4b5563',
              fontWeight: selectedStatusFilter === item.value ? '700' : '500',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onClick={() => setSelectedStatusFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryFilterBar;
