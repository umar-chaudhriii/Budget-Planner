import { prisma } from "@/lib/prisma";
import Dashboard from "@/app/components/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getDashboardData() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/landing");
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: session.user.id },
            orderBy: { date: 'desc' },
            take: 10,
            include: { category: true }
        });

        const income = await prisma.transaction.aggregate({
            where: { userId: session.user.id, type: 'INCOME' },
            _sum: { amount: true }
        });

        const expenses = await prisma.transaction.aggregate({
            where: { userId: session.user.id, type: 'EXPENSE' },
            _sum: { amount: true }
        });

        // Calculate Category Data for Pie Chart
        const categoryStats = await prisma.transaction.groupBy({
            by: ['categoryId'],
            where: { userId: session.user.id, type: 'EXPENSE' },
            _sum: { amount: true },
        });

        // Fetch category names
        const categories = await prisma.category.findMany({
            where: { userId: session.user.id, id: { in: categoryStats.map(c => c.categoryId).filter(Boolean) as string[] } }
        });

        const categoryData = categoryStats.map(stat => {
            const cat = categories.find(c => c.id === stat.categoryId);
            return {
                name: cat?.name || 'Uncategorized',
                value: stat._sum.amount || 0
            };
        });

        // Add Available Balance to Pie Chart
        const totalIncome = income._sum.amount || 0;
        const totalExpenses = expenses._sum.amount || 0;
        const availableBalance = totalIncome - totalExpenses;

        if (availableBalance > 0) {
            categoryData.push({
                name: 'Available Balance',
                value: availableBalance
            });
        }

        // Calculate Monthly Data (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const recentTransactionsForChart = await prisma.transaction.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: sixMonthsAgo
                }
            }
        });

        const monthlyDataMap = new Map<string, { name: string; income: number; expense: number }>();

        // Initialize last 6 months
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            const name = d.toLocaleString('default', { month: 'short' });
            monthlyDataMap.set(key, { name, income: 0, expense: 0 });
        }

        recentTransactionsForChart.forEach(t => {
            const key = `${t.date.getFullYear()}-${t.date.getMonth()}`;
            if (monthlyDataMap.has(key)) {
                const entry = monthlyDataMap.get(key)!;
                if (t.type === 'INCOME') {
                    entry.income += t.amount;
                } else {
                    entry.expense += t.amount;
                }
            }
        });

        // Convert map to array and reverse to show oldest to newest
        const monthlyData = Array.from(monthlyDataMap.values()).reverse();

        return {
            recentTransactions: transactions,
            totalBalance: availableBalance,
            income: totalIncome,
            expenses: totalExpenses,
            categoryData,
            monthlyData
        };
    } catch (e) {
        console.error("Database error:", e);
        return null;
    }
}

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/landing");
    }

    const data = await getDashboardData();

    // Fallback data if DB is empty or failed
    const displayData = data || {
        recentTransactions: [],
        totalBalance: 0,
        income: 0,
        expenses: 0,
        categoryData: [],
        monthlyData: []
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-50 dark:bg-gray-900">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Welcome, {session.user?.name?.split(' ')[0] || 'User'}
                </h1>
            </div>

            <Dashboard initialData={displayData} />
        </main>
    );
}
