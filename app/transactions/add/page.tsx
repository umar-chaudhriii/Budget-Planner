"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CURRENCIES } from '@/lib/countries';

export default function AddTransactionPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [type, setType] = useState("EXPENSE");
    const [currency, setCurrency] = useState("USD");
    const [suggestedCategoryId, setSuggestedCategoryId] = useState<string | null>(null);

    // Debounce logic for description change could be added, but for simplicity we'll just check on blur or with a small timeout
    const handleDescriptionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const desc = e.target.value;
        if (desc.length > 2) {
            const res = await fetch(`/api/categories/suggest?description=${encodeURIComponent(desc)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.categoryId) {
                    setSuggestedCategoryId(data.categoryId);
                } else {
                    setSuggestedCategoryId(null);
                }
            }
        } else {
            setSuggestedCategoryId(null);
        }
    };

    const applySuggestion = useCallback(() => {
        if (suggestedCategoryId) {
            const category = categories.find(c => c.id === suggestedCategoryId);
            if (category) {
                // If category type doesn't match current type, switch type too
                if (category.type !== type) {
                    setType(category.type);
                }
                // We need to set the select value. Since we use uncontrolled form for submission but controlled for filteredCategories,
                // we might need to control the category select or just let the user manually pick.
                // To make it "Smart", let's force update the select by finding the element or switching to controlled.
                // Switching to controlled for categoryId:
                const select = document.querySelector('select[name="categoryId"]') as HTMLSelectElement;
                if (select) select.value = suggestedCategoryId;
            }
        }
    }, [suggestedCategoryId, categories, type]);


    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            // Set user's saved currency as default
            if (session?.user?.currency) {
                setCurrency(session.user.currency);
            }

            // Fetch categories to populate select
            fetch('/api/categories')
                .then(res => res.json())
                .then(data => setCategories(data));
        }
    }, [status, router, session]);

    if (status === 'loading') {
        return <div className="container mx-auto py-10">Loading...</div>;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
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
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const filteredCategories = categories.filter(c => c.type === type);
    const suggestedCategory = categories.find(c => c.id === suggestedCategoryId);

    return (
        <div className="container mx-auto py-10 max-w-md">
            <h1 className="text-2xl font-bold mb-6">Add Transaction</h1>
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
                        onChange={handleDescriptionChange}
                    />
                    {suggestedCategory && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                                Suggested: <strong>{suggestedCategory.name}</strong>
                            </span>
                            <button
                                type="button"
                                onClick={applySuggestion}
                                className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md font-medium hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select name="categoryId" className="ios-input w-full" required key={suggestedCategoryId || 'default'}>
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
                        <input type="number" step="0.01" name="amount" className="ios-input w-full" required placeholder="0.00" />
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
                    <input type="text" name="tags" className="ios-input w-full" placeholder="e.g. food, weekend, trip" />
                    <p className="text-xs text-muted-foreground mt-1">Comma separated</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" name="date" className="ios-input w-full" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" name="isRecurring" id="isRecurring" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <label htmlFor="isRecurring" className="text-sm font-medium">Recurring Transaction?</label>
                </div>

                <button type="submit" disabled={loading} className="ios-button w-full">
                    {loading ? 'Saving...' : 'Save Transaction'}
                </button>
            </form>
        </div>
    );
}
