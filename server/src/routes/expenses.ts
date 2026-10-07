import express, { type Request, type Response } from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

/**
 * -----------------------------------------------------------------------
 * 1. GET /api/expenses
 * -----------------------------------------------------------------------
 * Description: Retrieves all expenses sorted by newest first, alongside
 * the aggregated total amount of all APPROVED expenses.
 *
 * PRISMA TUTORIAL & EXPLANATION:
 * - `prisma.expense.findMany()`: Queries the database table for multiple rows.
 *   - `orderBy: { createdAt: 'desc' }`: Sorts results descending (newest first).
 * - `prisma.expense.aggregate()`: Performs SQL aggregate functions like SUM, AVG, COUNT, MIN, MAX.
 *   - `where: { status: 'APPROVED' }`: Filters only rows where status is APPROVED.
 *   - `_sum: { amount: true }`: Calculates the sum total of the `amount` column.
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    // Query 1: Fetch all expense items sorted by newest creation date first
    const expenses = await prisma.expense.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Query 2: Aggregate the total approved expense amount
    const approvedAggregate = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'APPROVED',
      },
    });

    // Extract sum (default to 0 if null/no approved expenses exist)
    const totalApprovedAmount = approvedAggregate._sum.amount || 0;

    res.json({
      success: true,
      totalApprovedAmount,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses from database.',
    });
  }
});

/**
 * -----------------------------------------------------------------------
 * 2. POST /api/expenses
 * -----------------------------------------------------------------------
 * Description: Creates a new expense claim submission after input validation.
 *
 * PRISMA TUTORIAL & EXPLANATION:
 * - `prisma.expense.create({ data: { ... } })`:
 *   Inserts a new row into the Expense table.
 *   Prisma automatically validates schema types, generates a UUID for `id`,
 *   applies default values (`status: "PENDING"`, `createdAt: now()`), and returns
 *   the inserted object.
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeName, amount, description, date } = req.body;

    // Server-side Validation
    if (!employeeName || typeof employeeName !== 'string' || employeeName.trim() === '') {
      res.status(400).json({ success: false, message: 'Employee name is required.' });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
      return;
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      res.status(400).json({ success: false, message: 'Description is required.' });
      return;
    }

    const expenseDate = date ? new Date(date) : new Date();
    if (isNaN(expenseDate.getTime())) {
      res.status(400).json({ success: false, message: 'Invalid expense date provided.' });
      return;
    }

    // Prisma Query: Create new expense record
    const newExpense = await prisma.expense.create({
      data: {
        employeeName: employeeName.trim(),
        amount: parsedAmount,
        description: description.trim(),
        date: expenseDate,
        status: 'PENDING', // Default explicitly or via schema
      },
    });

    res.status(201).json({
      success: true,
      message: 'Expense submitted successfully!',
      data: newExpense,
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create expense submission.',
    });
  }
});

/**
 * -----------------------------------------------------------------------
 * 3. PATCH /api/expenses/:id/status
 * -----------------------------------------------------------------------
 * Description: Updates the approval status of an expense (APPROVED or REJECTED).
 *
 * PRISMA TUTORIAL & EXPLANATION:
 * - `prisma.expense.findUnique({ where: { id } })`:
 *   Finds a single row matching a primary key or unique field.
 * - `prisma.expense.update({ where: { id }, data: { status } })`:
 *   Updates columns in the database for the record matching `where`.
 *   Returns the updated record immediately.
 */
router.patch('/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    // Validate status parameter
    const validStatuses = ['APPROVED', 'REJECTED', 'PENDING'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: APPROVED, REJECTED, PENDING.',
      });
      return;
    }

    // Check if expense exists in database using findUnique
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      res.status(404).json({
        success: false,
        message: `Expense with ID ${id} not found.`,
      });
      return;
    }

    // Prisma Query: Update record status
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
      },
    });

    res.json({
      success: true,
      message: `Expense status updated to ${updatedExpense.status}`,
      data: updatedExpense,
    });
  } catch (error) {
    console.error('Error updating expense status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update expense status.',
    });
  }
});

export default router;
