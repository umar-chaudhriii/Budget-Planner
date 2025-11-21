"use client";

import React from 'react';
import { formatCurrency, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { useUserCurrency } from '@/hooks/useUserCurrency';

const COLORS = ['#007AFF', '#FF9500', '#FF2D55', '#AF52DE', '#5856D6', '#5AC8FA', '#FFCC00', '#FF3B30', '#4CD964', '#FF9500'];

export default function Dashboard({ initialData }: { initialData: any }) {
    const monthlyData = initialData?.monthlyData || [];
    const categoryData = initialData?.categoryData || [];
    const currency = useUserCurrency();

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="ios-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet size={100} />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Balance</h3>
                    <div className="text-4xl font-bold tracking-tight">{formatCurrency(initialData?.totalBalance || 0, currency)}</div>
                </div>

                <div className="ios-card p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Income</h3>
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">+{formatCurrency(initialData?.income || 0, currency)}</div>
                </div>

                <div className="ios-card p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Expenses</h3>
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">-{formatCurrency(initialData?.expenses || 0, currency)}</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="ios-card p-6">
                    <h3 className="text-lg font-semibold mb-6">Monthly Overview</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => formatCurrency(value, currency)}
                                />
                                <Bar dataKey="income" fill="#34C759" radius={[6, 6, 0, 0]} maxBarSize={50} />
                                <Bar dataKey="expense" fill="#FF3B30" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="ios-card p-6">
                    <h3 className="text-lg font-semibold mb-6">Financial Breakdown</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.name === 'Available Balance' ? '#34C759' : COLORS[index % COLORS.length]}
                                                stroke="none"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value, currency)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <p>No data yet.</p>
                                <p className="text-sm mt-2">Add transactions to see breakdown.</p>
                            </div>
                        )}
                    </div>
                    {/* Legend */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {categoryData.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center text-sm">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: entry.name === 'Available Balance' ? '#34C759' : COLORS[index % COLORS.length] }}
                                />
                                <span className="truncate">{entry.name}</span>
                                <span className="ml-auto text-muted-foreground text-xs">
                                    {((entry.value / (initialData.income || 1)) * 100).toFixed(0)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="ios-card p-6">
                <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
                <div className="space-y-4">
                    {initialData?.recentTransactions?.map((t: any) => (
                        <div key={t.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {t.type === 'INCOME' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{t.description}</p>
                                    <p className="text-sm text-muted-foreground">{t.category?.name || 'Uncategorized'} • {formatDate(t.date)}</p>
                                </div>
                            </div>
                            <div className={`font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount, t.currency || currency)}
                            </div>
                        </div>
                    ))}
                    {(!initialData?.recentTransactions || initialData.recentTransactions.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">No recent transactions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
