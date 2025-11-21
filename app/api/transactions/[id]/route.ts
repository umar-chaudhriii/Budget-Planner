import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: params.id },
            include: { category: true },
        });

        if (!transaction || transaction.userId !== session.user.id) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json(transaction);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching transaction" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { description, amount, type, categoryId, date, currency, tags, isRecurring } = body;

        // Verify the transaction belongs to the user
        const existingTransaction = await prisma.transaction.findUnique({
            where: { id: params.id },
        });

        if (!existingTransaction || existingTransaction.userId !== session.user.id) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Update the transaction
        const updatedTransaction = await prisma.transaction.update({
            where: { id: params.id },
            data: {
                description,
                amount: parseFloat(amount),
                type,
                categoryId,
                date: new Date(date),
                currency: currency || session.user.currency,
                tags: tags || null,
                isRecurring: isRecurring || false,
            },
            include: { category: true },
        });

        return NextResponse.json(updatedTransaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Verify the transaction belongs to the user
        const existingTransaction = await prisma.transaction.findUnique({
            where: { id: params.id },
        });

        if (!existingTransaction || existingTransaction.userId !== session.user.id) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Delete the transaction
        await prisma.transaction.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
}
