import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { History, Search, RefreshCw, SlidersHorizontal, Shield, Calendar, UserCheck } from "lucide-react";
import { Button, Input } from "../AdminShims";
import { AdminPanel } from "../components/AdminUi";
import ExportDropdown from "../components/ExportDropdown";

const initialLogs = [];

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredLogs = logs.filter(log => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      log.user.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.target.toLowerCase().includes(query) ||
      log.details.toLowerCase().includes(query);

    const matchesAction = actionFilter === "all" || log.action.includes(actionFilter) || (actionFilter === "Inventory" && log.action.includes("Stock"));
    const matchesRole = roleFilter === "all" || log.role === roleFilter;

    return matchesSearch && matchesAction && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <span className="admin-eyebrow">Administration / Security</span>
            <h1>Audit Logs & Activity</h1>
            <p>Track all platform operations, catalog changes, price updates, manual stock adjustments, cash refunds, and admin activities.</p>
          </div>
          <div className="flex items-center gap-3">
            <ExportDropdown
              fileName="Audit_Logs_Report"
              title="System Audit & Security Activity Logs"
              headers={['Timestamp', 'User', 'Role', 'Action', 'Target Element', 'Details']}
              rows={filteredLogs.map((l) => [
                l.timestamp,
                l.user,
                l.role,
                l.action,
                l.target,
                l.details
              ])}
            />
            <button onClick={() => alert("Audit log data refreshed from security vault.")} className="admin-primary-button" style={{ background: '#ff6600' }}>
              <RefreshCw size={18} /> Refresh Log Vault
            </button>
          </div>
        </section>

        {/* Filters Panel */}
        <AdminPanel className="p-5">
          <div className="grid gap-3 xl:grid-cols-[1.5fr_220px_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search log logs by user, action, target item, or change details..."
                className="h-11 border-slate-200 bg-white pl-9 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
            >
              <option value="all">All Actions</option>
              <option value="Price">Price Changes</option>
              <option value="Inventory">Inventory Adjustments</option>
              <option value="Refund">Refunds</option>
              <option value="Credit">Credit Adjustments</option>
              <option value="Coupon">Coupons</option>
            </select>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Inventory Manager">Inventory Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="Marketing Manager">Marketing Manager</option>
              <option value="Content Manager">Content Manager</option>
              <option value="Accountant">Accountant</option>
            </select>
          </div>
        </AdminPanel>

        {/* Audit Log Table */}
        <AdminPanel className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="h-5 w-5 text-[#ff6600]" /> Real-time Activity Logs
            </h3>
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">Read-Only Vault</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: '1000px' }}>
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="py-3 px-2">Timestamp</th>
                  <th className="py-3 px-2">Operator / User</th>
                  <th className="py-3 px-2">User Role</th>
                  <th className="py-3 px-2">Action Categorization</th>
                  <th className="py-3 px-2">Target Item</th>
                  <th className="py-3 px-2">Operation Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-2 font-mono text-xs text-slate-500">{log.timestamp}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-700">
                          {log.user.split(" ").map(w => w[0]).join("")}
                        </div>
                        <span className="font-semibold text-slate-900">{log.user}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium">
                        <Shield className="h-3 w-3 text-slate-400" /> {log.role}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${log.action.includes("Price") ? "bg-[#fff7f1] text-[#ff6600]" :
                          log.action.includes("Stock") || log.action.includes("Inventory") ? "bg-amber-50 text-amber-700" :
                            log.action.includes("Refund") ? "bg-rose-50 text-rose-700" :
                              log.action.includes("Credit") ? "bg-emerald-50 text-emerald-700" :
                                "bg-slate-100 text-slate-700"
                        }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-medium text-slate-800">{log.target}</td>
                    <td className="py-4 px-2 text-slate-600 font-medium">{log.details}</td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400">No matching activities found in log registers.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminAuditLogs;
