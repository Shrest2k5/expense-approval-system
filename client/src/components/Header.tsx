import React from 'react';
import { PortalMode } from '../types';
import { User, ShieldCheck, Receipt } from 'lucide-react';

interface HeaderProps {
  currentMode: PortalMode;
  onModeChange: (mode: PortalMode) => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 px-4 sm:px-8 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                ExpenseFlow
              </h1>
            </div>
            <p className="text-xs text-slate-400">Smart Expense Approval System</p>
          </div>
        </div>

        {/* Portal Mode Toggle Switch */}
        <div className="flex items-center bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onModeChange('employee')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
              currentMode === 'employee'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Employee Portal</span>
          </button>

          <button
            onClick={() => onModeChange('manager')}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
              currentMode === 'manager'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Manager Dashboard</span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-amber-500 rounded-full animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
