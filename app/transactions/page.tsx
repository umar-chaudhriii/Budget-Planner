import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Split, Tag, Repeat, Edit2 } from "lucide-react";
import Link from "next/link";
import TransactionActions from "./TransactionActions";
import TransactionFilters from "./TransactionFilters";
import DeleteTransactionButton from "./DeleteTransactionButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TransactionsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    let transactions: any[] = [];
    let categories: any[] = [];

    try {
        if (session?.user?.id) {
            // Fetch categories for filter
            categories = await prisma.category.findMany({
                where: { userId: session.user.id },
                orderBy: { name: 'asc' }
            });

            // Build where clause from searchParams
            const whereClause: any = { userId: session.user.id };

            if (searchParams?.type) whereClause.type = searchParams.type;
            if (searchParams?.categoryId) whereClause.categoryId = searchParams.categoryId;
            if (searchParams?.search) {
                whereClause.description = { contains: searchParams.search as string };
            }
            if (searchParams?.minAmount || searchParams?.maxAmount) {
                whereClause.amount = {};
                if (searchParams.minAmount) whereClause.amount.gte = parseFloat(searchParams.minAmount as string);
                if (searchParams.maxAmount) whereClause.amount.lte = parseFloat(searchParams.maxAmount as string);
            }

            transactions = await prisma.transaction.findMany({
                where: whereClause,
                orderBy: { date: 'desc' },
                include: { category: true }
            });
        }
    } catch (e) {
        console.error("DB error", e);
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <TransactionFilters categories={categories} />
                    <TransactionActions transactions={transactions} />
                    <Link href="/transactions/import" className="ios-button bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 text-sm">
                        Import CSV
                    </Link>
                    <Link href="/transactions/add" className="ios-button text-sm">
                        + Add
                    </Link>
                </div>
            </div>
            </div>

            <div className="ios-card overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b">
                        <tr>
                            <th className="p-5 font-semibold text-muted-foreground">Date</th>
                            <th className="p-5 font-semibold text-muted-foreground">Description</th>
                            <th className="p-5 font-semibold text-muted-foreground">Category</th>
                            <th className="p-5 font-semibold text-muted-foreground text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {transactions.length > 0 ? transactions.map((t) => (
                            <tr key={t.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="p-5 font-medium">{formatDate(t.date)}</td>
                                <td className="p-5">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-gray-900 dark:text-white">{t.description}</span>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {t.isRecurring && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium">
                                                    <Repeat size={12} />
                                                    Recurring
                                                </span>
                                            )}
                                            {t.tags && t.tags.length > 0 && (
                                                <>
                                                    {t.tags.split(',').map((tag: string, idx: number) => (
                                                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                                                            <Tag size={12} />
                                                            {tag.trim()}
                                                        </span>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                                        {t.category?.name || 'Uncategorized'}
                                    </span>
                                </td>
                                <td className={`p-5 text-right font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                    <div className="flex items-center justify-end gap-2">
                                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount, t.currency || session.user.currency)}
                                        <Link href={`/transactions/edit/${t.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors" title="Edit Transaction">
                                            <Edit2 size={18} />
                                        </Link>
                                        <Link href={`/transactions/split/${t.id}`} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title="Split Transaction">
                                            <Split size={18} />
                                        </Link>
                                        <DeleteTransactionButton id={t.id} />
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
