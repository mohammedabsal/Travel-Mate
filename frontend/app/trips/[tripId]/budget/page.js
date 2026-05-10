import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { BudgetDashboard } from '@/features/budget/budget-dashboard';

export const metadata = { title: 'Budget Dashboard' };

export default async function BudgetPage({ params }) {
  const session = await auth();

  if (!session?.user) redirect('/login');

  const budget = await prisma.budget.findUnique({
    where: { tripId: params.tripId },
    include: { expenses: true }
  });

  const aggregated = Object.values(
    (budget?.expenses ?? []).reduce((accumulator, expense) => {
      const key = expense.category;
      if (!accumulator[key]) {
        accumulator[key] = { name: key, value: 0 };
      }

      accumulator[key].value += Number(expense.amount);
      return accumulator;
    }, {})
  );

  return (
    <AppShell>
      <BudgetDashboard data={aggregated} />
    </AppShell>
  );
}