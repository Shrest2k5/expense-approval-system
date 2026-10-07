export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Expense {
  id: string;
  employeeName: string;
  amount: number;
  description: string;
  date: string;
  status: ExpenseStatus;
  createdAt: string;
}

export interface ExpensesResponse {
  success: boolean;
  totalApprovedAmount: number;
  count: number;
  data: Expense[];
  message?: string;
}

export interface ExpenseMutationResponse {
  success: boolean;
  message: string;
  data?: Expense;
}

export type PortalMode = 'employee' | 'manager';
