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
        const { originalId, splits } = json;

        if (!originalId || !Array.isArray(splits) || splits.length < 2) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // Verify ownership of original transaction
        const originalTransaction = await prisma.transaction.findUnique({
            where: { id: originalId },
        });

        if (!originalTransaction || originalTransaction.userId !== session.user.id) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // Validate total amount
        const totalSplitAmount = splits.reduce((sum: number, s: any) => sum + (parseFloat(s.amount) || 0), 0);
        if (Math.abs(totalSplitAmount - originalTransaction.amount) > 0.01) {
            return NextResponse.json({ error: 'Split amounts do not match original total' }, { status: 400 });
        }

        // Perform split in a transaction
        await prisma.$transaction(async (tx) => {
            // Delete original
            await tx.transaction.delete({
                where: { id: originalId }
            });

            // Create new transactions
            for (const split of splits) {
                await tx.transaction.create({
                    data: {
                        description: split.description || originalTransaction.description,
                        amount: parseFloat(split.amount),
                        type: originalTransaction.type,
                        date: originalTransaction.date,
                        userId: session.user.id,
                        categoryId: split.categoryId || null,
                        currency: originalTransaction.currency,
                        tags: originalTransaction.tags, // Inherit tags? Or maybe split tags too? For now inherit.
                        isRecurring: originalTransaction.isRecurring
                    }
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Split error:", error);
        return NextResponse.json({ error: 'Error splitting transaction' }, { status: 500 });
    }
}
