'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Trash2, Download, ShieldCheck, Filter } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { auditLogs, clearAuditLogs, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      !searchQuery ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'All' || log.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleExportCSV = () => {
    if (auditLogs.length === 0) return;
    const keys = ['id', 'timestamp', 'user', 'role', 'action', 'entity', 'details'];
    const csvRows = [
      keys.join(','),
      ...auditLogs.map((row: any) =>
        keys.map((k) => `"${String(row[k] || '').replace(/"/g, '""')}"`).join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savera_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    addToast('Audit Logs Exported', 'CSV report downloaded.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">System Audit & Governance Logs</h1>
          <p className="text-xs text-slate-400">
            Real-time chronological security log of all price changes, stock additions, status overrides, and user transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-savera-saffron" />
            <span>Export CSV</span>
          </button>

          {auditLogs.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear historical audit logs?')) {
                  clearAuditLogs();
                }
              }}
              className="bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Logs</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search logs by keyword, entity, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-savera-saffron"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-savera-saffron font-bold"
        >
          <option value="All">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Inventory Manager">Inventory Manager</option>
          <option value="Production Manager">Production Manager</option>
          <option value="Delivery Manager">Delivery Manager</option>
          <option value="Customer Support">Customer Support</option>
        </select>
      </div>

      {/* Audit Log Entries List */}
      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-3 text-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p>No audit log entries match your filter.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            >
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-savera-saffron">{log.user}</span>
                  <span className="bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-full text-[10px]">
                    {log.role}
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    {log.action}
                  </span>
                </div>
                <p className="text-slate-300 font-medium">
                  <strong className="text-white">{log.entity}:</strong> {log.details}
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 shrink-0">{log.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
