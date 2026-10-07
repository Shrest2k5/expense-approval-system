import React, { useState } from 'react';
import { Expense, ExpenseStatus } from '../types';
import { ShieldCheck, Check, X, Loader2, Clock, CheckCircle2, XCircle, Search, Inbox } from 'lucide-react';

interface ManagerDashboardProps {
  expenses: Expense[];
  onUpdateStatus: (id: string, newStatus: ExpenseStatus) => Promise<void>;
  isLoading: boolean;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  expenses,
  onUpdateStatus,
  isLoading,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAction = async (id: string, status: ExpenseStatus) => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  // Currency Formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Date Formatter
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Counts for tabs
  const countAll = expenses.length;
  const countPending = expenses.filter((e) => e.status === 'PENDING').length;
  const countApproved = expenses.filter((e) => e.status === 'APPROVED').length;
  const countRejected = expenses.filter((e) => e.status === 'REJECTED').length;

  // Filtering based on tab & search term
  const filtered = expenses.filter((e) => {
    const matchesTab = filterTab === 'ALL' || e.status === filterTab;
    const matchesSearch =
      e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Manager Approvals Dashboard</h3>
              {countPending > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {countPending} Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">Review employee claim requests and approve or reject reimbursement</p>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by name or claim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-52 bg-slate-950/80 border border-slate-800 focus:border-emerald-500/50 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-200 focus:outline-none transition-all"
            />
          </div>

          {/* Filter Tabs (All, Pending, Approved, Rejected) */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterTab('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterTab === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({countAll})
            </button>
            <button
              onClick={() => setFilterTab('PENDING')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterTab === 'PENDING'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({countPending})
            </button>
            <button
              onClick={() => setFilterTab('APPROVED')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterTab === 'APPROVED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Approved ({countApproved})
            </button>
            <button
              onClick={() => setFilterTab('REJECTED')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterTab === 'REJECTED'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rejected ({countRejected})
            </button>
          </div>
        </div>
      </div>

      {/* Cards List View */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading expenses for manager review...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
          <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-200">No Expenses Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            {filterTab === 'PENDING'
              ? 'Great news! All submitted expense claims have been processed by management.'
              : `No claims match the filter "${filterTab}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((item) => {
            const isProcessing = updatingId === item.id;
            return (
              <div
                key={item.id}
                className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Info Block */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-slate-100 text-base">{item.employeeName}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {formatDate(item.date)}
                    </span>

                    {/* Status Pill Badges */}
                    {item.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    )}
                    {item.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                    {item.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending Review
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Claim Amount</span>
                    <span className="text-lg font-extrabold text-white">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>

                  {/* Actions */}
                  {item.status === 'PENDING' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(item.id, 'APPROVED')}
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all duration-150 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Approve
                      </button>

                      <button
                        onClick={() => handleAction(item.id, 'REJECTED')}
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 active:scale-95 transition-all duration-150 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {item.status === 'APPROVED' ? (
                        <button
                          onClick={() => handleAction(item.id, 'REJECTED')}
                          disabled={isProcessing}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all disabled:opacity-50 flex items-center gap-1"
                        >
                          {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                          Change to Reject
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(item.id, 'APPROVED')}
                          disabled={isProcessing}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-1"
                        >
                          {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          Change to Approve
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
