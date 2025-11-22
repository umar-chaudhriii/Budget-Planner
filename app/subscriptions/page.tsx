"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Trash2, Calendar, RefreshCw } from "lucide-react";

export default function SubscriptionsPage() {
    const { data: session } = useSession();
    const currency = session?.user?.currency || "USD";
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [frequency, setFrequency] = useState("MONTHLY");
    const [nextDate, setNextDate] = useState("");

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    async function fetchSubscriptions() {
        try {
            const res = await fetch("/api/subscriptions");
            if (res.ok) {
                const data = await res.json();
                setSubscriptions(data);
            }
        } catch (error) {
            console.error("Failed to fetch subscriptions");
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/subscriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    amount,
                    frequency,
                    nextPaymentDate: nextDate
                }),
            });

            if (res.ok) {
                setIsAdding(false);
                setName("");
                setAmount("");
                setNextDate("");
                fetchSubscriptions();
            }
        } catch (error) {
            console.error("Failed to add subscription");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Stop tracking this subscription?")) return;
        try {
            const res = await fetch(`/api/subscriptions?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchSubscriptions();
        } catch (error) {
            console.error("Failed to delete");
        }
    }

    const totalMonthly = subscriptions.reduce((acc, sub) => {
        let monthlyAmount = sub.amount;
        if (sub.frequency === 'YEARLY') monthlyAmount = sub.amount / 12;
        if (sub.frequency === 'WEEKLY') monthlyAmount = sub.amount * 4;
        return acc + monthlyAmount;
    }, 0);

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Subscriptions</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="ios-button flex items-center gap-2"
                >
                    <Plus size={20} /> Add Subscription
                </button>
            </div>

            {/* Summary Card */}
            <div className="ios-card p-6 mb-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                <div className="flex items-center gap-3 mb-2 opacity-90">
                    <RefreshCw size={20} />
                    <span className="font-medium">Monthly Recurring Cost</span>
                </div>
                <div className="text-4xl font-bold">
                    {formatCurrency(totalMonthly, currency)}
                </div>
                <p className="text-sm opacity-75 mt-2">Estimated based on your active subscriptions</p>
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="ios-card p-6 mb-8 animate-in slide-in-from-top-5">
                    <h2 className="text-xl font-semibold mb-4">New Subscription</h2>
                    <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="ios-input w-full"
                                placeholder="Netflix, Spotify..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="ios-input w-full"
                                placeholder="0.00"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Billing Cycle</label>
                            <select
                                value={frequency}
                                onChange={e => setFrequency(e.target.value)}
                                className="ios-input w-full"
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="YEARLY">Yearly</option>
                                <option value="WEEKLY">Weekly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Next Payment</label>
                            <input
                                type="date"
                                value={nextDate}
                                onChange={e => setNextDate(e.target.value)}
                                className="ios-input w-full"
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-2 justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="ios-button">
                                Save Subscription
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                {subscriptions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed">
                        <RefreshCw size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No subscriptions tracked yet.</p>
                    </div>
                ) : (
                    subscriptions.map((sub) => (
                        <div key={sub.id} className="ios-card p-5 flex items-center justify-between group hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {sub.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{sub.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                                            {sub.frequency}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            Next: {formatDate(sub.nextPaymentDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="font-bold text-lg">{formatCurrency(sub.amount, currency)}</div>
                                </div>
                                <button
                                    onClick={() => handleDelete(sub.id)}
                                    className="p-2 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
