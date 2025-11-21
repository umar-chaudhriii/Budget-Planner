"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Trash2, Target, TrendingUp } from "lucide-react";

export default function GoalsPage() {
    const { data: session } = useSession();
    const currency = session?.user?.currency || "USD";
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [currentAmount, setCurrentAmount] = useState("");
    const [deadline, setDeadline] = useState("");

    // Add Funds Modal State
    const [isAddingFunds, setIsAddingFunds] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [fundsAmount, setFundsAmount] = useState("");

    useEffect(() => {
        fetchGoals();
    }, []);

    async function fetchGoals() {
        try {
            const res = await fetch("/api/goals");
            if (res.ok) {
                const data = await res.json();
                setGoals(data);
            }
        } catch (error) {
            console.error("Failed to fetch goals");
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/goals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    targetAmount,
                    currentAmount,
                    deadline
                }),
            });

            if (res.ok) {
                setIsAdding(false);
                setName("");
                setTargetAmount("");
                setCurrentAmount("");
                setDeadline("");
                fetchGoals();
            }
        } catch (error) {
            console.error("Failed to add goal");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this goal?")) return;
        try {
            const res = await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchGoals();
        } catch (error) {
            console.error("Failed to delete");
        }
    }

    async function updateProgress(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedGoalId || !fundsAmount) return;

        const goal = goals.find(g => g.id === selectedGoalId);
        if (!goal) return;

        const newAmount = goal.currentAmount + parseFloat(fundsAmount);

        try {
            const res = await fetch("/api/goals", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedGoalId, currentAmount: newAmount }),
            });
            if (res.ok) {
                fetchGoals();
                setIsAddingFunds(false);
                setFundsAmount("");
                setSelectedGoalId(null);
            }
        } catch (error) {
            console.error("Failed to update progress");
        }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Savings Goals</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="ios-button flex items-center gap-2"
                >
                    <Plus size={20} /> New Goal
                </button>
            </div>

            {/* Add Funds Modal */}
            {isAddingFunds && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md m-4 animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold mb-4">Add Funds</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Adding savings to: <span className="font-semibold text-primary">{goals.find(g => g.id === selectedGoalId)?.name}</span>
                        </p>
                        <form onSubmit={updateProgress}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Amount to Add</label>
                                <input
                                    type="number"
                                    value={fundsAmount}
                                    onChange={e => setFundsAmount(e.target.value)}
                                    className="ios-input w-full text-lg"
                                    placeholder="0.00"
                                    step="0.01"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingFunds(false)}
                                    className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="ios-button">
                                    Add Funds
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Form */}
            {isAdding && (
                <div className="ios-card p-6 mb-8 animate-in slide-in-from-top-5">
                    <h2 className="text-xl font-semibold mb-4">Create Savings Goal</h2>
                    <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Goal Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="ios-input w-full"
                                placeholder="New Car, Vacation..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Target Amount</label>
                            <input
                                type="number"
                                value={targetAmount}
                                onChange={e => setTargetAmount(e.target.value)}
                                className="ios-input w-full"
                                placeholder="0.00"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Current Savings</label>
                            <input
                                type="number"
                                value={currentAmount}
                                onChange={e => setCurrentAmount(e.target.value)}
                                className="ios-input w-full"
                                placeholder="0.00"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Target Date (Optional)</label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={e => setDeadline(e.target.value)}
                                className="ios-input w-full"
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
                                Save Goal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Goals List */}
            <div className="grid gap-6 md:grid-cols-2">
                {goals.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-muted-foreground bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed">
                        <Target size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No savings goals yet. Start saving today!</p>
                    </div>
                ) : (
                    goals.map((goal) => {
                        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                        return (
                            <div key={goal.id} className="ios-card p-6 flex flex-col justify-between group hover:border-primary/50 transition-colors">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                                                <Target size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{goal.name}</h3>
                                                {goal.deadline && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Target: {formatDate(goal.deadline)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            className="text-muted-foreground hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">{formatCurrency(goal.currentAmount, currency)}</span>
                                            <span className="text-muted-foreground">of {formatCurrency(goal.targetAmount, currency)}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => {
                                            setSelectedGoalId(goal.id);
                                            setIsAddingFunds(true);
                                        }}
                                        className="flex-1 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Plus size={14} /> Add Funds
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
