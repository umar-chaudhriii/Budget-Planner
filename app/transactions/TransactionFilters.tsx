"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";

export default function TransactionFilters({ categories }: { categories: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        type: searchParams.get("type") || "",
        categoryId: searchParams.get("categoryId") || "",
        minAmount: searchParams.get("minAmount") || "",
        maxAmount: searchParams.get("maxAmount") || "",
        dateFrom: searchParams.get("dateFrom") || "",
        dateTo: searchParams.get("dateTo") || "",
    });

    const handleChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        router.push(`/transactions?${params.toString()}`);
        setIsOpen(false);
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            type: "",
            categoryId: "",
            minAmount: "",
            maxAmount: "",
            dateFrom: "",
            dateTo: "",
        });
        router.push("/transactions");
        setIsOpen(false);
    };

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`ios-button flex items-center gap-2 ${activeFiltersCount > 0 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'}`}
            >
                <Filter size={18} />
                Filters
                {activeFiltersCount > 0 && (
                    <span className="bg-white text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {activeFiltersCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Filter Transactions</h3>
                        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-gray-900">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Search</label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleChange("search", e.target.value)}
                                className="ios-input w-full py-1 text-sm"
                                placeholder="Description..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Type</label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleChange("type", e.target.value)}
                                    className="ios-input w-full py-1 text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="INCOME">Income</option>
                                    <option value="EXPENSE">Expense</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Category</label>
                                <select
                                    value={filters.categoryId}
                                    onChange={(e) => handleChange("categoryId", e.target.value)}
                                    className="ios-input w-full py-1 text-sm"
                                >
                                    <option value="">All</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Min Amount</label>
                                <input
                                    type="number"
                                    value={filters.minAmount}
                                    onChange={(e) => handleChange("minAmount", e.target.value)}
                                    className="ios-input w-full py-1 text-sm"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Max Amount</label>
                                <input
                                    type="number"
                                    value={filters.maxAmount}
                                    onChange={(e) => handleChange("maxAmount", e.target.value)}
                                    className="ios-input w-full py-1 text-sm"
                                    placeholder="∞"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex gap-2">
                            <button onClick={clearFilters} className="flex-1 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                Clear
                            </button>
                            <button onClick={applyFilters} className="flex-1 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90">
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
