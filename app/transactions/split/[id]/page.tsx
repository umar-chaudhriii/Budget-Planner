"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useUserCurrency } from "@/hooks/useUserCurrency";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

export default function SplitTransactionPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const currency = useUserCurrency();
    const [original, setOriginal] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [splits, setSplits] = useState<any[]>([
        { description: "", amount: 0, categoryId: "" },
        { description: "", amount: 0, categoryId: "" }
    ]);
    const [categories, setCategories] = useState<any[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch transaction and categories
        Promise.all([
            fetch(`/api/transactions/${params.id}`).then(res => res.json()),
            fetch('/api/categories').then(res => res.json())
        ]).then(([transData, catData]) => {
            if (transData.error) {
                setError(transData.error);
            } else {
                setOriginal(transData);
                // Initialize first split with original data
                setSplits([
                    { description: transData.description, amount: transData.amount, categoryId: transData.categoryId || "" },
                    { description: "", amount: 0, categoryId: "" }
                ]);
            }
            setCategories(catData);
            setLoading(false);
        });
    }, [params.id]);

    const totalSplitAmount = splits.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    const remaining = original ? original.amount - totalSplitAmount : 0;

    const handleSplitChange = (index: number, field: string, value: any) => {
        const newSplits = [...splits];
        newSplits[index] = { ...newSplits[index], [field]: value };
        setSplits(newSplits);
    };

    const addSplit = () => {
        setSplits([...splits, { description: "", amount: 0, categoryId: "" }]);
    };

    const removeSplit = (index: number) => {
        if (splits.length > 2) {
            const newSplits = splits.filter((_, i) => i !== index);
            setSplits(newSplits);
        }
    };

    const handleSave = async () => {
        if (Math.abs(remaining) > 0.01) {
            setError("Total split amount must match the original transaction amount.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/transactions/split`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    originalId: original.id,
                    splits: splits
                })
            });

            if (res.ok) {
                router.push("/transactions");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to split transaction");
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container mx-auto py-10 text-center">Loading...</div>;
    if (!original) return <div className="container mx-auto py-10 text-center">Transaction not found</div>;

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <button onClick={() => router.back()} className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft size={16} className="mr-1" /> Back
            </button>

            <h1 className="text-3xl font-bold mb-2">Split Transaction</h1>
            <p className="text-muted-foreground mb-8">Divide this transaction into multiple categories.</p>

            <div className="ios-card p-6 mb-8 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Original Transaction</span>
                    <span className="font-bold text-lg">{formatCurrency(original.amount, original.currency || currency)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{original.description} • {formatDate(original.date)}</p>
            </div>

            <div className="space-y-4 mb-8">
                {splits.map((split, index) => (
                    <div key={index} className="ios-card p-4 flex gap-4 items-start animate-in slide-in-from-bottom-2">
                        <div className="flex-1 space-y-3">
                            <input
                                type="text"
                                placeholder="Description"
                                value={split.description}
                                onChange={(e) => handleSplitChange(index, "description", e.target.value)}
                                className="ios-input w-full"
                            />
                            <div className="flex gap-3">
                                <select
                                    value={split.categoryId}
                                    onChange={(e) => handleSplitChange(index, "categoryId", e.target.value)}
                                    className="ios-input flex-1"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={split.amount}
                                    onChange={(e) => handleSplitChange(index, "amount", parseFloat(e.target.value))}
                                    className="ios-input w-32 text-right"
                                />
                            </div>
                        </div>
                        {splits.length > 2 && (
                            <button onClick={() => removeSplit(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg mt-1">
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mb-8">
                <button onClick={addSplit} className="flex items-center gap-2 text-primary font-medium hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors">
                    <Plus size={20} /> Add Split
                </button>
                <div className={`text-right ${Math.abs(remaining) > 0.01 ? "text-red-500" : "text-green-500"}`}>
                    <p className="text-xs font-medium uppercase tracking-wider">Remaining</p>
                    <p className="text-xl font-bold">{formatCurrency(remaining, currency)}</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl mb-6 text-center">
                    {error}
                </div>
            )}

            <button
                onClick={handleSave}
                disabled={Math.abs(remaining) > 0.01 || loading}
                className="ios-button w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Saving..." : "Save Splits"}
            </button>
        </div>
    );
}
