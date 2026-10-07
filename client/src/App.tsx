import { useState, useEffect, useCallback } from 'react';
import { Expense, PortalMode, ExpenseStatus } from './types';
import { fetchExpenses, createExpense, updateExpenseStatus } from './api';
import { Header } from './components/Header';
import { SummaryCard } from './components/SummaryCard';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ManagerDashboard } from './components/ManagerDashboard';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function App() {
  const [portalMode, setPortalMode] = useState<PortalMode>('employee');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalApprovedAmount, setTotalApprovedAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Load expenses from backend API
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchExpenses();
      setExpenses(res.data || []);
      setTotalApprovedAmount(res.totalApprovedAmount || 0);
    } catch (err: any) {
      console.error('Failed to load expenses:', err);
      showToast('error', 'Could not connect to backend server. Make sure the server is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toast notification helper
  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Handle new expense submission
  const handleCreateExpense = async (payload: {
    employeeName: string;
    amount: number;
    description: string;
    date: string;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await createExpense(payload);
      showToast('success', res.message || 'Expense claim submitted successfully!');
      await loadData(); // Refresh list & total sum
    } catch (err: any) {
      showToast('error', err.message || 'Failed to submit expense claim');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle manager status update (APPROVE / REJECT)
  const handleUpdateStatus = async (id: string, newStatus: ExpenseStatus) => {
    try {
      const res = await updateExpenseStatus(id, newStatus);
      showToast('success', res.message || `Expense updated to ${newStatus}`);
      await loadData(); // Refresh list & total sum instantly
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update expense status');
    }
  };

  const pendingCount = expenses.filter((e) => e.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 selection:bg-cyan-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold backdrop-blur-md border ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-emerald-900/50'
                : 'bg-rose-950/90 text-rose-300 border-rose-500/40 shadow-rose-900/50'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <Header
        currentMode={portalMode}
        onModeChange={setPortalMode}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Summary Card (Always Visible) */}
        <SummaryCard
          totalApprovedAmount={totalApprovedAmount}
          expenses={expenses}
        />

        {/* Dynamic View based on Portal Mode */}
        {portalMode === 'employee' ? (
          <div>
            <ExpenseForm
              onSubmit={handleCreateExpense}
              isSubmitting={isSubmitting}
            />
            <ExpenseList expenses={expenses} isLoading={isLoading} />
          </div>
        ) : (
          <div>
            <ManagerDashboard
              expenses={expenses}
              onUpdateStatus={handleUpdateStatus}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-8 mt-16 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900 pt-6">
        <p>© 2026 ExpenseFlow System. All rights reserved.</p>
        <button
          onClick={loadData}
          className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Sync Data
        </button>
      </footer>
    </div>
  );
}

export default App;
