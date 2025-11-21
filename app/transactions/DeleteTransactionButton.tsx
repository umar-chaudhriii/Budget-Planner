"use client";

import { useRouter } from "next/navigation";

export default function DeleteTransactionButton({ id }: { id: string }) {
    const router = useRouter();

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this transaction?")) return;

        try {
            const res = await fetch(`/api/transactions?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to delete transaction");
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete Transaction"
        >
            Delete
        </button>
    );
}
