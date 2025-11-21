import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await request.json();
        const { transactions } = json;

        if (!Array.isArray(transactions)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Get existing categories to map names to IDs
        const existingCategories = await prisma.category.findMany({
            where: { userId: session.user.id }
        });

        const categoryMap = new Map(existingCategories.map(c => [c.name.toLowerCase(), c.id]));

        let createdCount = 0;

        // Process transactions in a transaction to ensure integrity
        await prisma.$transaction(async (tx) => {
            for (const t of transactions) {
                let categoryId = null;

                if (t.categoryName) {
                    const normalizedName = t.categoryName.toLowerCase();
                    if (categoryMap.has(normalizedName)) {
                        categoryId = categoryMap.get(normalizedName);
                    } else {
                        // Create new category if it doesn't exist
                        const newCategory = await tx.category.create({
                            data: {
                                name: t.categoryName,
                                type: t.type,
                                userId: session.user.id
                            }
                        });
                        categoryId = newCategory.id;
                        categoryMap.set(normalizedName, newCategory.id);
                    }
                }

                await tx.transaction.create({
                    data: {
                        description: t.description,
                        amount: parseFloat(t.amount),
                        type: t.type,
                        date: new Date(t.date),
                        userId: session.user.id,
                        categoryId: categoryId,
                        currency: session.user.currency || "USD" // Default to user currency for imported
                    }
                });
                createdCount++;
            }
        });

        return NextResponse.json({ success: true, count: createdCount });
    } catch (error) {
        console.error("Import error:", error);
        return NextResponse.json({ error: 'Error importing transactions' }, { status: 500 });
    }
}
