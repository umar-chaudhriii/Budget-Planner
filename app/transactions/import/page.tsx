"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";

export default function ImportPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseFile(selectedFile);
        }
    };

    const parseFile = (file: File) => {
        Papa.parse<any>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    setError("Error parsing CSV file");
                    return;
                }
                // Basic validation/mapping
                const mapped = results.data.map((row: any) => ({
                    date: row.Date || row.date,
                    description: row.Description || row.description,
                    amount: parseFloat(row.Amount || row.amount),
                    type: (row.Type || row.type || "EXPENSE").toUpperCase(),
                    categoryName: row.Category || row.category,
                })).filter((t: any) => t.date && t.description && !isNaN(t.amount));

                setPreview(mapped);
                setError("");
            },
            error: (err: Error) => {
                setError("Failed to read file");
            }
        });
    };

    const handleImport = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/transactions/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactions: preview }),
            });

            if (res.ok) {
                router.push("/transactions");
                router.refresh();
            } else {
                setError("Failed to import transactions");
            }
        } catch (err) {
            setError("An error occurred during import");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Import Transactions</h1>

            <div className="ios-card p-8 mb-8 text-center">
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-10 flex flex-col items-center justify-center transition-colors hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Upload size={32} />
                        </div>
                        <p className="text-lg font-semibold mb-2">Click to upload CSV</p>
                        <p className="text-sm text-muted-foreground">Format: Date, Description, Amount, Type, Category</p>
                    </label>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center gap-2 mb-6">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {preview.length > 0 && (
                <div className="space-y-6 animate-in slide-in-from-bottom-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FileText size={20} /> Preview ({preview.length} transactions)
                        </h2>
                        <button
                            onClick={handleImport}
                            disabled={loading}
                            className="ios-button flex items-center gap-2"
                        >
                            {loading ? "Importing..." : <><Check size={18} /> Confirm Import</>}
                        </button>
                    </div>

                    <div className="ios-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4 text-right">Amount</th>
                                        <th className="p-4">Category</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {preview.slice(0, 5).map((row, i) => (
                                        <tr key={i}>
                                            <td className="p-4">{row.date}</td>
                                            <td className="p-4">{row.description}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${row.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {row.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">{row.amount}</td>
                                            <td className="p-4">{row.categoryName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {preview.length > 5 && (
                            <div className="p-4 text-center text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800/30">
                                ...and {preview.length - 5} more
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
