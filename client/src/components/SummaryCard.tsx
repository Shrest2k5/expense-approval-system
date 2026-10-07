import React from 'react';
import { DollarSign, Clock, FileCheck2, TrendingUp } from 'lucide-react';
import { Expense } from '../types';

interface SummaryCardProps {
  totalApprovedAmount: number;
  expenses: Expense[];
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  totalApprovedAmount,
  expenses,
}) => {
  const pendingExpenses = expenses.filter((e) => e.status === 'PENDING');
  const approvedExpenses = expenses.filter((e) => e.status === 'APPROVED');
  const rejectedExpenses = expenses.filter((e) => e.status === 'REJECTED');

  const pendingAmount = pendingExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Helper for formatting currency: $X.XX
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {/* Metric 1: Total Approved Amount ($) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/20 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Approved Amount
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {formatCurrency(totalApprovedAmount)}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-3">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{approvedExpenses.length} approved claim{approvedExpenses.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Metric 2: Pending Review Count */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-950/20 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pending Review
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {pendingExpenses.length}
          </h2>
          <span className="text-xs text-amber-400/90 font-semibold uppercase">
            Claim{pendingExpenses.length !== 1 ? 's' : ''} Awaiting Action
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400 mt-3">
          <span>Worth {formatCurrency(pendingAmount)} in requests</span>
        </div>
      </div>

      {/* Metric 3: Total Claims Count */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-950/20 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Claims Submitted
          </span>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {expenses.length}
          </h2>
          <span className="text-xs text-slate-400 font-medium">System Total</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-3">
          <span className="text-emerald-400 font-medium">
            ✓ {approvedExpenses.length} Approved
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-rose-400 font-medium">
            ✕ {rejectedExpenses.length} Rejected
          </span>
        </div>
      </div>
    </div>
  );
};
