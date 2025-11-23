import { prisma } from "@/lib/prisma";
import Dashboard from "@/app/components/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Greeting from "@/app/components/Greeting";

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

        const categoryStats = await prisma.transaction.groupBy({
            by: ['categoryId'],
            where: { userId: session.user.id, type: 'EXPENSE' },
            _sum: { amount: true },
        });

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

        const totalIncome = income._sum.amount || 0;
        const totalExpenses = expenses._sum.amount || 0;
        const availableBalance = totalIncome - totalExpenses;

        if (availableBalance > 0) {
            categoryData.push({
                name: 'Available Balance',
                value: availableBalance
            });
        }

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

        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            monthlyDataMap.set(monthKey, { name: monthKey, income: 0, expense: 0 });
        }

        recentTransactionsForChart.forEach(t => {
            const monthKey = new Date(t.date).toLocaleString('default', { month: 'short' });
            const existing = monthlyDataMap.get(monthKey);
            if (existing) {
                if (t.type === 'INCOME') {
                    existing.income += t.amount;
                } else {
                    existing.expense += t.amount;
                }
            }
        });

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

    const displayData = data || {
        recentTransactions: [],
        totalBalance: 0,
        income: 0,
        expenses: 0,
        categoryData: [],
        monthlyData: []
    };



    const firstName = session.user?.name?.split(' ')[0] || 'User';
    const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8 ios-card p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none overflow-hidden relative">
                    <div className="absolute top-0 right-0 opacity-10">
                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" />
                            <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="2" />
                            <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <Greeting name={capitalizedName} />
                        <p className="text-blue-100 text-lg">
                            Here's your financial overview for today
                        </p>
                    </div>
                </div>

                <Dashboard initialData={displayData} />
            </div>
        </main>
    );
}
