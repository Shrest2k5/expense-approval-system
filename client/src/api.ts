import { ExpensesResponse, ExpenseMutationResponse, ExpenseStatus } from './types';

// API base URL configuration (uses Vite proxy or fallback)
const API_BASE = '/api/expenses';

/**
 * Fetch all expenses from backend API
 */
export async function fetchExpenses(): Promise<ExpensesResponse> {
  const res = await fetch(API_BASE);
  if (!res.ok) {
    throw new Error(`Failed to fetch expenses: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Submit a new expense record
 */
export async function createExpense(payload: {
  employeeName: string;
  amount: number;
  description: string;
  date: string;
}): Promise<ExpenseMutationResponse> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit expense');
  }
  return data;
}

/**
 * Update an expense approval status (APPROVED or REJECTED)
 */
export async function updateExpenseStatus(
  id: string,
  status: ExpenseStatus
): Promise<ExpenseMutationResponse> {
  const res = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update status');
  }
  return data;
}
