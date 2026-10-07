import React, { useState } from 'react';
import { Expense, ExpenseStatus } from '../types';
import { Clock, CheckCircle2, XCircle, Search, History, Inbox } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, isLoading }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Helper for status pill badges
  const renderStatusBadge = (status: ExpenseStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> PENDING
          </span>
        );
    }
  };

  // Helper for formatting currency: $X.XX
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Helper for formatting date
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

  // Filtering logic
  const filteredExpenses = expenses.filter((exp) => {
    const matchesStatus = filterStatus === 'ALL' || exp.status === filterStatus;
    const matchesSearch =
      exp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Expense Claims History</h3>
            <p className="text-xs text-slate-400">Track and monitor approval status of submitted claims</p>
          </div>
        </div>

        {/* Search & Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/50 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-200 focus:outline-none transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content List / Table */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-xs">Loading expense claims history...</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
          <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-200">No Claims Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            No submitted claims match your search or selected filter tab.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-3">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredExpenses.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-slate-800/40 hover:shadow-md transition-all duration-150 group"
                >
                  <td className="py-4 px-4 font-semibold text-slate-100">
                    {exp.employeeName}
                  </td>
                  <td className="py-4 px-4 text-slate-300 max-w-xs truncate">
                    {exp.description}
                  </td>
                  <td className="py-4 px-4 text-slate-400 text-xs font-medium">
                    {formatDate(exp.date)}
                  </td>
                  <td className="py-4 px-4 font-extrabold text-white">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {renderStatusBadge(exp.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
