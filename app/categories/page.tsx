"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Edit2, Check, X, AlertTriangle } from "lucide-react";

export default function CategoriesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState("");
    const [newType, setNewType] = useState("EXPENSE");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchCategories();
        }
    }, [status, router]);

    async function fetchCategories() {
        try {
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddCategory(e: React.FormEvent) {
        e.preventDefault();
        if (!newCategory) return;

        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategory, type: newType }),
            });

            if (res.ok) {
                setNewCategory("");
                fetchCategories();
            }
        } catch (error) {
            console.error("Failed to create category");
        }
    }

    function handleDelete(id: string) {
        console.log("Delete clicked for category:", id);
        setDeleteConfirmId(id);
    }

    async function confirmDelete() {
        if (!deleteConfirmId) return;

        console.log("Confirming delete for:", deleteConfirmId);

        try {
            console.log("Sending DELETE request...");
            const res = await fetch(`/api/categories?id=${deleteConfirmId}`, {
                method: "DELETE",
            });

            console.log("Response status:", res.status);

            if (res.ok) {
                console.log("Delete successful, refreshing categories...");
                setDeleteConfirmId(null);
                fetchCategories();
            } else {
                const errorData = await res.json();
                console.error("Delete failed:", errorData);
                alert(`Failed to delete category: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Failed to delete category:", error);
            alert("An error occurred while deleting the category");
        }
    }

    function cancelDelete() {
        console.log("Delete cancelled");
        setDeleteConfirmId(null);
    }

    async function handleEdit(id: string, currentName: string) {
        console.log("Edit clicked for category:", id, currentName);
        setEditingId(id);
        setEditingName(currentName);
    }

    async function handleSaveEdit(id: string) {
        console.log("Save edit clicked for:", id, "New name:", editingName);

        if (!editingName.trim()) {
            alert("Category name cannot be empty");
            return;
        }

        try {
            console.log("Sending PUT request...");
            const res = await fetch(`/api/categories`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, name: editingName }),
            });

            console.log("Response status:", res.status);

            if (res.ok) {
                console.log("Edit successful, refreshing categories...");
                setEditingId(null);
                setEditingName("");
                fetchCategories();
            } else {
                const errorData = await res.json();
                console.error("Edit failed:", errorData);
                alert(`Failed to update category: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Failed to update category:", error);
            alert("An error occurred while updating the category");
        }
    }

    function handleCancelEdit() {
        console.log("Edit cancelled");
        setEditingId(null);
        setEditingName("");
    }

    const categoryToDelete = categories.find(c => c.id === deleteConfirmId);

    if (loading) return <div className="container mx-auto p-10 flex justify-center"><div className="animate-pulse">Loading...</div></div>;

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Categories</h1>

            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold">Delete Category?</h3>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-8 md:grid-cols-2">
                {/* Add Category Form */}
                <div className="ios-card p-6 h-fit">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                            <Plus size={20} />
                        </div>
                        Add New Category
                    </h2>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">Name</label>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="ios-input w-full"
                                placeholder="e.g. Gym, Netflix"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">Type</label>
                            <div className="relative">
                                <select
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                    className="ios-input w-full appearance-none"
                                >
                                    <option value="EXPENSE">Expense</option>
                                    <option value="INCOME">Income</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                    ▼
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="ios-button w-full mt-4"
                        >
                            Add Category
                        </button>
                    </form>
                </div>

                {/* Categories List */}
                <div className="space-y-6">
                    <div className="ios-card p-6">
                        <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400 flex items-center justify-between">
                            Expense Categories
                            <span className="text-sm font-normal text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                {categories.filter((c) => c.type === "EXPENSE").length}
                            </span>
                        </h2>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {categories
                                .filter((c) => c.type === "EXPENSE")
                                .map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {editingId === c.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="ios-input flex-1 mr-2"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveEdit(c.id)}
                                                        className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 p-2 rounded-full transition-all"
                                                        title="Save"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-all"
                                                        title="Cancel"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-medium">{c.name}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(c.id, c.name)}
                                                        className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-2 rounded-full transition-all opacity-60 hover:opacity-100"
                                                        title="Edit Category"
                                                        type="button"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(c.id)}
                                                        className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-full transition-all opacity-60 hover:opacity-100"
                                                        title="Delete Category"
                                                        type="button"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="ios-card p-6">
                        <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400 flex items-center justify-between">
                            Income Categories
                            <span className="text-sm font-normal text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                {categories.filter((c) => c.type === "INCOME").length}
                            </span>
                        </h2>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {categories
                                .filter((c) => c.type === "INCOME")
                                .map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {editingId === c.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="ios-input flex-1 mr-2"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveEdit(c.id)}
                                                        className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 p-2 rounded-full transition-all"
                                                        title="Save"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-all"
                                                        title="Cancel"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-medium">{c.name}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(c.id, c.name)}
                                                        className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-2 rounded-full transition-all opacity-60 hover:opacity-100"
                                                        title="Edit Category"
                                                        type="button"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(c.id)}
                                                        className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-full transition-all opacity-60 hover:opacity-100"
                                                        title="Delete Category"
                                                        type="button"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
