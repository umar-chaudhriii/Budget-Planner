"use client";

import { formatDate } from "@/lib/utils";

export default function TransactionActions({ transactions }: { transactions: any[] }) {
    const downloadCSV = () => {
        const headers = ["Date", "Description", "Category", "Type", "Amount"];
        const csvContent = [
            headers.join(","),
            ...transactions.map(t => [
                formatDate(t.date),
                `"${t.description}"`,
                t.category?.name || "Uncategorized",
                t.type,
                t.amount
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "transactions.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-x-2 inline-block">
            <button onClick={downloadCSV} className="ios-button bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                Export CSV
            </button>
        </div>
    );
}
