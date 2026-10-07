import React, { useState } from 'react';
import { PlusCircle, Loader2, DollarSign, Calendar, User, FileText } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (data: {
    employeeName: string;
    amount: number;
    description: string;
    date: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [employeeName, setEmployeeName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!employeeName.trim()) {
      setErrorMsg('Please enter employee name.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Please enter a valid positive expense amount.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please enter a description for the expense.');
      return;
    }

    try {
      await onSubmit({
        employeeName: employeeName.trim(),
        amount: numericAmount,
        description: description.trim(),
        date,
      });

      // Reset form
      setEmployeeName('');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting expense');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl mb-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Submit New Expense Claim</h3>
          <p className="text-xs text-slate-400">Fill in details below to request reimbursement</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employee Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" /> Employee Name
          </label>
          <input
            type="text"
            required
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="e.g. Sarah Jenkins"
            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200"
          />
        </div>

        {/* Expense Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full glass-input pl-8 pr-3.5 py-2.5 rounded-xl text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Expense Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 text-slate-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" /> Description / Purpose
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Client Dinner at Bistro"
            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Submit Expense Claim
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
