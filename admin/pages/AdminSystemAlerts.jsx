import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { RefreshCcw, Bell, AlertTriangle, Info, Terminal } from 'lucide-react';

const initialAlerts = [
  { id: 1, type: "System Alert", title: "API Gateway response delay exceeded 500ms limit", time: "10 mins ago", severity: "high" },
  { id: 2, type: "Database Alert", title: "Unoptimized query detected on products listing page", time: "1 hour ago", severity: "medium" },
  { id: 3, type: "Security Warning", title: "Multiple failed login attempts detected on cashier terminal 3", time: "3 hours ago", severity: "high" },
  { id: 4, type: "Disk Space Alert", title: "Backup storage volume utilization reached 85% capacity", time: "1 day ago", severity: "low" },
];

const AdminSystemAlerts = () => {
  const [alerts, setAlerts] = useState(initialAlerts);

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell color="#ff6600" />
              System Alerts
            </h1>
            <p>Active server warnings, security alerts, database bottlenecks and API latencies monitoring logs.</p>
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Active System Warnings</h3>
          {alerts.length > 0 && (
            <button onClick={() => setAlerts([])} style={{ background: "none", border: "none", color: "#ff6600", fontWeight: "600", cursor: "pointer", fontSize: '14px' }}>Clear All Alerts</button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {alerts.map(a => {
            const isHigh = a.severity === "high";
            const isMed = a.severity === "medium";
            const borderCol = isHigh ? "#fecaca" : isMed ? "#fed7aa" : "#e5e7eb";
            const bgCol = isHigh ? "#fef2f2" : isMed ? "#fff7ed" : "white";

            return (
              <div key={a.id} style={{ background: bgCol, border: `1px solid ${borderCol}`, padding: '20px', borderRadius: '12px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: "20px" }}>{isHigh ? "🚨" : isMed ? "⚠️" : "ℹ️"}</span>
                <div>
                  <strong style={{ display: "block", fontSize: "14px", color: '#111' }}>{a.type}</strong>
                  <p style={{ margin: "4px 0", fontSize: "13px", color: "#374151" }}>{a.title}</p>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>{a.time}</span>
                </div>
              </div>
            );
          })}
          {alerts.length === 0 && (
            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center', color: '#9ca3af' }}>
              No active system alerts. All nodes running healthy.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSystemAlerts;
