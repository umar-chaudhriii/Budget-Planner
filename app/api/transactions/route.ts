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

        const transaction = await prisma.transaction.create({
            data: {
                amount: parseFloat(json.amount),
                description: json.description,
                date: new Date(json.date),
                type: json.type,
                userId: session.user.id,
                categoryId: json.categoryId || null,
                currency: json.currency || "USD",
                tags: json.tags || null,
                isRecurring: json.isRecurring || false,
            },
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const type = searchParams.get("type");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");

    let whereClause: any = { userId: session.user.id };

    if (month && year) {
        const startDate = new Date(parseInt(year), parseInt(month), 1);
        const endDate = new Date(parseInt(year), parseInt(month) + 1, 0);
        whereClause.date = {
            gte: startDate,
            lte: endDate
        };
    }

    if (type) {
        whereClause.type = type;
    }

    if (categoryId) {
        whereClause.categoryId = categoryId;
    }

    if (search) {
        whereClause.description = {
            contains: search,
            // mode: 'insensitive' // SQLite doesn't support insensitive directly easily in Prisma without extra setup, but for Postgres it works. 
            // For now we'll assume case sensitive or handle it on frontend if needed, but 'contains' is good start.
        };
    }

    if (minAmount || maxAmount) {
        whereClause.amount = {};
        if (minAmount) whereClause.amount.gte = parseFloat(minAmount);
        if (maxAmount) whereClause.amount.lte = parseFloat(maxAmount);
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            include: { category: true }
        });
        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching transactions" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        // Verify ownership
        const transaction = await prisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction || transaction.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.transaction.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Error deleting transaction" },
            { status: 500 }
        );
    }
}
