"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useUserCurrency } from "@/hooks/useUserCurrency";

export default function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const currency = useUserCurrency();

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    useEffect(() => {
        fetchTransactions();
    }, [date]);

    async function fetchTransactions() {
        setLoading(true);
        try {
            const res = await fetch(`/api/transactions?month=${date.getMonth()}&year=${date.getFullYear()}`);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data);
            }
        } catch (error) {
            console.error("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    }

    function changeMonth(offset: number) {
        setDate(new Date(date.getFullYear(), date.getMonth() + offset, 1));
        setSelectedDate(null);
    }

    const getDayTransactions = (day: number) => {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getDate() === day &&
                tDate.getMonth() === date.getMonth() &&
                tDate.getFullYear() === date.getFullYear();
        });
    };

    const selectedTransactions = selectedDate ? getDayTransactions(selectedDate.getDate()) : [];

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Cash Flow</h1>
                <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-1 rounded-xl border shadow-sm">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-semibold min-w-[140px] text-center">
                        {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 ios-card p-6">
                    <div className="grid grid-cols-7 gap-2 mb-4 text-center text-sm font-medium text-muted-foreground">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day}>{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayTrans = getDayTransactions(day);
                            const income = dayTrans.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
                            const expense = dayTrans.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
                            const isToday = new Date().getDate() === day && new Date().getMonth() === date.getMonth() && new Date().getFullYear() === date.getFullYear();
                            const isSelected = selectedDate?.getDate() === day;

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day))}
                                    className={`aspect-square rounded-xl border p-1 relative transition-all hover:border-primary/50 flex flex-col items-center justify-between
                                        ${isSelected ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30'}
                                        ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 font-bold text-blue-600' : ''}
                                    `}
                                >
                                    <span className="text-sm">{day}</span>
                                    <div className="flex gap-1 w-full justify-center px-1">
                                        {income > 0 && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                                        {expense > 0 && <div className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                                    </div>
                                    <div className="text-[10px] font-medium w-full text-center truncate opacity-70">
                                        {income - expense !== 0 && formatCurrency(Math.abs(income - expense), currency)}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Details Panel */}
                <div className="ios-card p-6 h-fit">
                    <h2 className="text-xl font-semibold mb-4">
                        {selectedDate ? selectedDate.toLocaleDateString(undefined, { dateStyle: 'full' }) : 'Select a date'}
                    </h2>

                    <div className="space-y-4">
                        {selectedDate ? (
                            selectedTransactions.length > 0 ? (
                                selectedTransactions.map(t => (
                                    <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${t.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {t.type === 'INCOME' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{t.description}</p>
                                                <p className="text-xs text-muted-foreground">{t.category?.name || 'Uncategorized'}</p>
                                            </div>
                                        </div>
                                        <span className={`font-bold text-sm ${t.type === 'INCOME' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                            {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount, t.currency || currency)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No transactions on this day.</p>
                            )
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <p>Click on a day to view details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
