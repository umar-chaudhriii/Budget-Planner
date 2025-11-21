"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CURRENCIES } from '@/lib/countries';

export default function EditTransactionPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [fetchingTransaction, setFetchingTransaction] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [transaction, setTransaction] = useState<any>(null);
    const [type, setType] = useState("EXPENSE");
    const [currency, setCurrency] = useState("USD");

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && params.id) {
            // Fetch the transaction to edit
            fetch(`/api/transactions/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setTransaction(data);
                    setType(data.type);
                    setCurrency(data.currency || session?.user?.currency || 'USD');
                    setFetchingTransaction(false);
                });

            // Fetch categories
            fetch('/api/categories')
                .then(res => res.json())
                .then(data => setCategories(data));
        }
    }, [status, router, session, params.id]);

    if (status === 'loading' || fetchingTransaction) {
        return <div className="container mx-auto py-10">Loading...</div>;
    }

    if (!transaction) {
        return <div className="container mx-auto py-10">Transaction not found</div>;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch(`/api/transactions/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: formData.get('description'),
                    amount: formData.get('amount'),
                    type: formData.get('type'),
                    categoryId: formData.get('categoryId'),
                    date: formData.get('date'),
                    currency: formData.get('currency'),
                    tags: formData.get('tags'),
                    isRecurring: formData.get('isRecurring') === 'on',
                }),
            });

            if (res.ok) {
                router.push('/transactions');
                router.refresh();
            } else {
                alert('Failed to update transaction');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    }

    const filteredCategories = categories.filter(c => c.type === type);
    const transactionDate = new Date(transaction.date).toISOString().split('T')[0];

    return (
        <div className="container mx-auto py-10 max-w-md">
            <h1 className="text-2xl font-bold mb-6">Edit Transaction</h1>
            <form onSubmit={handleSubmit} className="space-y-4 ios-card p-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                        name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="ios-input w-full"
                        required
                    >
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                        type="text"
                        name="description"
                        className="ios-input w-full"
                        required
                        placeholder="e.g. Groceries"
                        defaultValue={transaction.description}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        name="categoryId"
                        className="ios-input w-full"
                        required
                        defaultValue={transaction.categoryId}
                    >
                        <option value="">Select a category</option>
                        {filteredCategories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {filteredCategories.length === 0 && (
                        <p className="text-xs text-muted-foreground mt-1">No categories found. Go to Categories page to add some.</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            name="amount"
                            className="ios-input w-full"
                            required
                            placeholder="0.00"
                            defaultValue={transaction.amount}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Currency</label>
                        <select
                            name="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="ios-input w-full"
                        >
                            {CURRENCIES.map(c => (
                                <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tags (Optional)</label>
                    <input
                        type="text"
                        name="tags"
                        className="ios-input w-full"
                        placeholder="e.g. food, weekend, trip"
                        defaultValue={transaction.tags || ''}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Comma separated</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        className="ios-input w-full"
                        required
                        defaultValue={transactionDate}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isRecurring"
                        id="isRecurring"
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked={transaction.isRecurring}
                    />
                    <label htmlFor="isRecurring" className="text-sm font-medium">Recurring Transaction?</label>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="ios-button bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="ios-button flex-1"
                    >
                        {loading ? 'Saving...' : 'Update Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
}
