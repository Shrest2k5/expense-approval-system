import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client instance
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed script...');

  // Prisma Query: deleteMany clears out any existing records so seeding is idempotent.
  await prisma.expense.deleteMany({});
  console.log('🧹 Cleared existing expenses.');

  // Sample data with mixed statuses (PENDING, APPROVED, REJECTED)
  const sampleExpenses = [
    {
      employeeName: 'Sarah Jenkins',
      amount: 145.50,
      description: 'Client Lunch at Bistro Verdi (Q3 Strategy Meeting)',
      date: new Date('2026-10-01T12:30:00Z'),
      status: 'APPROVED',
    },
    {
      employeeName: 'Alex Rivera',
      amount: 890.00,
      description: 'Flight ticket to Tech Conference 2026 (San Francisco)',
      date: new Date('2026-10-03T09:15:00Z'),
      status: 'PENDING',
    },
    {
      employeeName: 'Maria Chen',
      amount: 45.00,
      description: 'Monthly Cloud IDE Pro Subscription',
      date: new Date('2026-10-05T14:00:00Z'),
      status: 'APPROVED',
    },
    {
      employeeName: 'David Kim',
      amount: 320.75,
      description: 'Personal Ergonomic Gaming Keyboard & Mouse Set',
      date: new Date('2026-10-06T16:45:00Z'),
      status: 'REJECTED',
    },
  ];

  // Prisma Query: create() inserts a single database record.
  // We use a loop or Promise.all to insert sample records.
  for (const data of sampleExpenses) {
    const created = await prisma.expense.create({
      data,
    });
    console.log(`✅ Seeded Expense [${created.status}]: ${created.employeeName} - $${created.amount}`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect Prisma client when seeding finishes
    await prisma.$disconnect();
  });
